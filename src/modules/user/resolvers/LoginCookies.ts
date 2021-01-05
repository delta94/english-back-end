import { CookieOptions, Response } from 'express';

import { config } from '../../../config';
import { MeWithTokens } from '../entities/User';
import {
  AuthedContext,
  AuthedRequest,
  ImpersonatingUser,
  Scopes,
  UserRole,
} from '../../../auth/AuthedContext';
import { AccessTokens, createUserTokens } from './createTokens';
// import eventsDispatcher from '../../events/EventDispatcher';
import { authSetUserContextFromToken } from '../../../auth/AuthMiddleware';

export class LoginCookies {
  public static cookieOptions: CookieOptions = {
    domain: process.env.NODE_ENV !== 'production' ? undefined : config.DOMAIN,
    sameSite: process.env.NODE_ENV !== 'production' ? false : 'lax',
    secure: process.env.NODE_ENV !== 'production' ? false : true,
    httpOnly: true,
  };

  public static removeAccessCookies(ctx: AuthedContext): void {
    ctx.res.clearCookie(`access-token-${process.env.NODE_ENV ?? 'local'}`, this.cookieOptions);
    ctx.res.clearCookie(`refresh-token-${process.env.NODE_ENV ?? 'local'}`, this.cookieOptions);
  }


  public static setAccessCookiesAndContext(
    me: MeWithTokens,
    role: UserRole,
    req: AuthedRequest,
    res?: Response,
    impersonatingUser?: ImpersonatingUser
  ): AccessTokens {
    const tokens = createUserTokens(me, role, {
      impersonatingUser,
      scopes: impersonatingUser ? [Scopes.user.stopImpersonating] : undefined,
    });

    if (res) {
      res.cookie(`access-token-${config.NODE_ENV}`, tokens.accessToken, {
        maxAge: config.accessTokenMaxAge,
        ...this.cookieOptions,
      });
      res.cookie(`refresh-token-${config.NODE_ENV}`, tokens.refreshToken, {
        maxAge: config.refreshTokenMaxAge,
        ...this.cookieOptions,
      });
    }

    // set user context
    authSetUserContextFromToken(req, tokens.accessToken);

    // void eventsDispatcher.identify(me, team, relation);

    // me.chatTokens = LoginCookies.createChatTokens(me, relation);
    me.impersonatingUser = impersonatingUser;

    return tokens;
  }
}
