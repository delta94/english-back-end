import { CookieOptions, Response } from 'express';
import { MeWithTokens } from '../entities/User';

import { AccessTokens, createUserTokens } from './createTokens';

import {
  AuthedContext,
  AuthedRequest,
  ImpersonatingUser,
  Scopes,
  UserRole,
} from '../../../auth/AuthedContext';
import { authSetUserContextFromToken } from '../../../auth/AuthMiddleware';
import { config } from '../../../config';

export class LoginCookies {
  public static cookieOptions: CookieOptions = {
    domain: config.DOMAIN,
    sameSite: process.env.NODE_ENV !== 'production' ? false : 'lax',
    secure: false,
    httpOnly: true,
  };

  public static removeAccessCookies(ctx: AuthedContext): void {
    ctx.res.clearCookie(`access-token-${config.NODE_ENV}`, this.cookieOptions);
    ctx.res.clearCookie(`refresh-token-${config.NODE_ENV}`, this.cookieOptions);
  }

  // public static createChatTokens(me: Me, relation: TeamUserRelation): AccessTokens {
  //   return createUserTokens(me, relation.teamId, relation.role, {
  //     scopes: [Scopes.chat.socket],
  //     onlyScopes: true,
  //     neverExpire: true,
  //   });
  // }

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
    console.log('this.cookieOptions', this.cookieOptions)
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
