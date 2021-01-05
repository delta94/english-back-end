import { Response } from 'express';
import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { LoggedRequest } from '../middleware/loggerMiddleware';

export enum UserRole {
  Member = 'Member',
  Ops = 'Ops',
  Admin = 'Admin',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User Authorization Roles',
});


export type Scope = string;

export const Scopes = {
  role: {
    any: 'role:',
    ops: 'role:ops',
    admin: 'role:admin',
    member: 'role:member',
  },

  user: {
    stopImpersonating: 'user:stop-impersonating',
  },

  chat: {
    any: 'chat:',
    socket: 'chat:socket',
  },

  users: {
    any: 'users:',
    add: {
      any: 'users:add:',
    },
    update: {
      any: 'users:update:',
    },
    remove: {
      any: 'users:remove:',
    },
  },




  all: (scopeTree: Record<string, unknown>): Scope[] => {
    let scopes: Scope[] = [];

    Object.values(scopeTree).map((node: unknown) => {
      if (typeof node === 'string') {
        scopes.push(node);
      } else {
        scopes = scopes.concat(Scopes.all(node as Record<string, unknown>));
      }
    });

    return scopes;
  },



  fromRole: (role: UserRole): Scope[] => {
    let scopes: Scope[] = [];

    switch (role) {
      // @ts-ignore
      case UserRole.Ops:
        scopes = scopes.concat([Scopes.role.ops]);
      // @ts-ignore
      case UserRole.Admin:
        scopes = scopes.concat([Scopes.role.admin]);
    }

    return scopes;
  },

  hasPermissionAtLeastOne: (auth: AuthInfo, scopes: Scope[]): boolean => {
    const authi = auth.scopes; // .map(s => s.toLowerCase());
    const scopesi = scopes; // .map(s => s.toLowerCase());

    for (const have of authi) {
      for (const need of scopesi) {
        if (need.startsWith(have)) {
          return true;
        }
      }
    }

    return false;
  },
};

export const RoleScopes = (roles: UserRole[]): Scope[] => {
  const scopes: Scope[] = [];

  roles.map(r => {
    scopes.push(`role:${r.toString().toLowerCase()}`);
  });

  return scopes;
};

export const AdminRoles: UserRole[] = [UserRole.Admin];

export const AdminRoleScopes: Scope[] = RoleScopes(AdminRoles);

export interface TokenPayloadBase {
  scopes?: string[]; // These scopes are addative to the role scopes
}

@ObjectType()
export class ImpersonatingUser {
  @Field()
  public userId!: string;
}

export interface AccessUserTokenPayload extends TokenPayloadBase {
  id: string;
  role: UserRole;
  noRoleInScopes?: boolean; // If true, only use scopes, not role for scopes
  impersonatingUser?: ImpersonatingUser;
}

export interface RefreshTokenPayload extends AccessUserTokenPayload {
  version: number;
}

export interface UserAuthInfo {
  scopes: string[];
  userId: string;
  role: UserRole;
  impersonatingUser?: ImpersonatingUser;
}


export type AuthInfo = UserAuthInfo;

export interface AuthedRequest<ReqBody = any> extends LoggedRequest<ReqBody> {
  auth: AuthInfo;
}

export class AuthedContext {
  public req!: AuthedRequest;
  public res!: Response;

  public constructor({
    req,
    res,
  }: {
    req: AuthedRequest;
    res: Response;
  }) {
    this.req = req;
    this.res = res;
  }

  public tryUserAuth(): UserAuthInfo | undefined {
    const auth = this.req.auth as UserAuthInfo;
    if (!auth.userId) {
      return undefined;
    }
    return auth;
  }

  public userAuth(): UserAuthInfo {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.tryUserAuth()!;
  }

 
}
