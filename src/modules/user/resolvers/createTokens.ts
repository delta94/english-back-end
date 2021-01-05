import { Secret, sign, SignOptions } from 'jsonwebtoken';
import config from '../../../config';
import { ObjectType, Field } from 'type-graphql';
import {
  AccessUserTokenPayload,
  RefreshTokenPayload,
  Scopes,
  Scope,
  UserRole,
  ImpersonatingUser,
} from '../../../auth/AuthedContext';
import { User } from '../entities/User';

@ObjectType()
export class AccessTokens {
  @Field({ nullable: false })
  public refreshToken!: string;

  @Field({ nullable: false })
  public accessToken!: string;
}

const signToken = (
  token: AccessUserTokenPayload | RefreshTokenPayload,
  secret: Secret,
  options: SignOptions
): string => {
  return sign(token, secret, options);
};

export const createUserTokens = (
  user: User,
  role: UserRole,
  options?: {
    scopes?: Scope[];
    onlyScopes?: boolean;
    neverExpire?: boolean;
    impersonatingUser?: ImpersonatingUser;
  }
): AccessTokens => {
  const scopes = [
    ...(options?.scopes ?? []),
    user.isOps && Scopes.role.ops,
  ].filter(s => Boolean(s)) as Scope[]; // Additional scopes

  const payload: AccessUserTokenPayload = {
    id: user.id,
    role,
    scopes,
    noRoleInScopes: options?.onlyScopes,
    impersonatingUser: options?.impersonatingUser,
  };

  const accessToken = signToken(payload, config.ACCESS_TOKEN_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRE,
  });

  const refPayload: RefreshTokenPayload = {
    id: user.id,
    role,
    scopes,
    version: user.version,
  };

  const refreshToken = signToken(refPayload, config.REFRESH_TOKEN_SECRET, {
    expiresIn: options?.neverExpire ? '50y' : config.REFRESH_TOKEN_EXPIRE,
  });

  return { refreshToken, accessToken };
};



export const createWorkerToken = async (
  userId: string,
  role: UserRole,
  scopes: Scope[]
): Promise<string> => {
  const accessToken = signToken(
    {
      id: userId,
      scopes,
      role,
      noRoleInScopes: true,
    },
    config.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '3h',
    }
  );

  return accessToken;
};
