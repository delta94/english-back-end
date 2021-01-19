import { verify, VerifyErrors } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';

import { config } from '../config';
import {
  AuthedRequest,
  AccessUserTokenPayload,
  RefreshTokenPayload,
  TokenPayloadBase,
  AuthInfo,
  AuthedContext,
  Scopes,
  Scope,
} from './AuthedContext';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { LoginCookies } from '../modules/user/resolvers/LoginCookies';
import { UserRepository } from '../modules/user/UserRepsitory';
import { MeWithTokens } from '../modules/user/entities/User';
export const authorizeRestScope = (scopes?: Scope[]): RequestHandler => {
  return (request, res, next) => {
    const req = request as AuthedRequest;

    // If no scopes is passed in then just having a valid auth token is enough
    if (
      !req.auth ||
      (scopes && !Scopes.hasPermissionAtLeastOne(req.auth, scopes))
    ) {
      res.status(403).send('Unauthorized');
      return;
    }

    next();
  };
};

interface Tokens {
  accessToken?: string;
  refreshToken?: string;
}

/*
  Read access and refresh token
*/
export const readTokens = (req: AuthedRequest): Tokens => {
  const cookies = req.cookies as Record<string, string>;

  let refreshToken: string | undefined = cookies[`refresh-token-${config.NODE_ENV}`];
  let accessToken: string | undefined = cookies[`access-token-${config.NODE_ENV}`];

  // fallback for reading access and refresh token
  if (!refreshToken && !accessToken) {
    accessToken = req.header('Authorization');
    refreshToken = req.header('Authorization Refresh');

    if (accessToken) {
      accessToken = accessToken.split(' ')[1];
    }

    if (refreshToken) {
      refreshToken = refreshToken.split(' ')[1];
    }
  }
  return { accessToken, refreshToken };
};

const authInfoFromToken = (token: AccessUserTokenPayload): AuthInfo => {
  let scopes: Scope[] = token.scopes ?? [];
  if (!token.noRoleInScopes) {
    scopes = [...Scopes.fromRole(token.role), ...scopes];
  }

  return {
    role: token.role,
    userId: token.id,
    scopes,
    impersonatingUser: token.impersonatingUser,
  };
};


export const authSetUserContext = (req: Request, auth: AuthInfo): void => {
  (req as AuthedRequest).auth = auth;
};

export const authSetUserContextFromToken = (req: AuthedRequest, token: string): void => {
  try {
    const decodedAT = verify(token, config.ACCESS_TOKEN_SECRET) as AccessUserTokenPayload;
    req.auth = authInfoFromToken(decodedAT);
  } catch {}
};

const authenticateAccessToken = (
  req: AuthedRequest,
  accessToken: string,
  secret: string
): Error | null => {
  try {
    const decodedAT = verify(accessToken, secret) as TokenPayloadBase;


    const decodedUserAt = decodedAT as AccessUserTokenPayload;
    if (decodedUserAt.id && decodedUserAt.role) {
      // This is a valid, non-expired token.
      // Set valid context...

      authSetUserContext(req, authInfoFromToken(decodedUserAt));
      return null;
    }

    return null;
  } catch (e) {
    const error = e as VerifyErrors;
    return error;
  }
};

export const authenticateContext = async (
  tokens: Tokens,
  sreq: Request,
  res?: Response
): Promise<boolean> => {

  if (!tokens.accessToken) {
    console.error('Access token required to authenticate');
    return false;
  }

  const req = sreq as AuthedRequest;

  // try user access token
  const userTokenError = authenticateAccessToken(
    req,
    tokens.accessToken,
    config.ACCESS_TOKEN_SECRET
  );

  if (!userTokenError) {
    return true;
  }

  if (userTokenError.name === 'TokenExpiredError') {
    // Token expired - token should be refreshed
  } else {
    // Invalid token - try with integration secret
    const integrationTokenError = authenticateAccessToken(
      req,
      tokens.accessToken,
      config.INTEGRATION_TOKEN_SECRET
    );

    if (!integrationTokenError) {
      return true;
    }

    // Invalid access token error - they don't expire
    console.error(`Invalid access token (${tokens.accessToken}`, {
      userTokenEror: userTokenError,
      integrationTokenError,
    });

    return false;
  }

  // Perform token refresh

  // decode refresh token
  // for worker, we only have access token
  if (!tokens.refreshToken) {
    console.error(`No refresh token to refresh with`);
    return false;
  }

  let decodedRT = null;

  try {
    decodedRT = verify(tokens.refreshToken, config.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
  } catch (e) {
    const error = e as VerifyErrors;

    if (error.name === 'TokenExpiredError') {
      // No log required - normal operation
      return false;
    }

    console.error(`Invalid refresh token (${tokens.refreshToken})`, { error });
    return false;
  }

  // if no token found
  if (!decodedRT || !decodedRT.role || !decodedRT.id) {
    console.error(`No valid refresh token payload`, { token: decodedRT });
    return false;
  }

  // get repositories
  const userRepository = getCustomRepository(UserRepository);

  const user = await userRepository.findOne(decodedRT.id)

  // if user doesn't exist or
  // user doesn't belong to that team
  if (!user) {
    // revoke tokens
    if (res) {
      LoginCookies.removeAccessCookies(new AuthedContext({ req, res }));
    }

    return false;
  }
  const role = user.role;
  // regenerate tokens
  LoginCookies.setAccessCookiesAndContext(user as MeWithTokens, role, req, res);

  return true;
};

/*
  Note:
  frontend uses access and refresh token both
  whereas worker only uses access token
  */
export const authTokenMiddleware = async (
  ureq: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const req = (ureq as unknown) as AuthedRequest;

  // read tokens
  const tokens = readTokens(req);

  // if no access token, send to next middleware
  if (!tokens.accessToken) {
    return next();
  }

  await authenticateContext(tokens, req, res);
  next();
};
