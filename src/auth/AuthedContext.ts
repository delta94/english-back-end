import { Request, Response } from 'express';
import _ from 'lodash';

// export enum UserRole {
//   Ops = 'Ops',
//   Admin = 'Admin',
//   Tester = 'Tester',
//   Creator = 'Creator',
//   Moderator = 'Moderator',
//   Presenter = 'Presenter',
// }

// Only roles Admins can assign
// export const AssignableRoles = [
//   UserRole.Admin,
//   UserRole.Creator,
//   UserRole.Moderator,
//   UserRole.Presenter,
// ];

// registerEnumType(UserRole, {
//   name: 'UserRole',
//   description: 'User Authorization Roles',
// });


export interface TokenPayloadBase {
  scopes?: string[];
  teamId: string;
}

export interface AccessTokenPayload extends TokenPayloadBase {
  id: string;
  role: string;
}



export interface RefreshTokenPayload extends AccessTokenPayload {
  version: number;
}

// tslint:disable-next-line: no-empty-interface
export interface AuthInfo {

}

export interface AuthedRequest extends Request {
  _startAt: number[];
  auth: AuthInfo;
  logId: string;
}

export interface AuthedContext {
  req: AuthedRequest;
  res: Response;
}
