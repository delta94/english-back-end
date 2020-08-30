import { Request, Response } from 'express';
import { registerEnumType } from 'type-graphql';

export enum UserRole {
  Ops = 'Ops',
  Admin = 'Admin',
  Tester = 'Tester',
  Creator = 'Creator',
  Moderator = 'Moderator',
  Presenter = 'Presenter',
}

// Only roles Admins can assign
export const AssignableRoles = [UserRole.Admin, UserRole.Creator, UserRole.Moderator, UserRole.Presenter];
export const CreatorRoles = [UserRole.Ops, UserRole.Admin, UserRole.Tester, UserRole.Creator];
export const AdminRoles = [UserRole.Admin, UserRole.Ops, UserRole.Tester];

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User Authorization Roles',
});

export interface MyRequest extends Request {
  userId: string;
  role: UserRole;
}

export interface MyContext {
  req: MyRequest;
  res: Response;
}
