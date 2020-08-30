import { AuthChecker } from 'type-graphql';
// import { MyContext } from '../types/MyContext';
// import { ForbiddenError } from 'apollo-server-core';
// tslint:disable-next-line: no-empty-interface
interface MyContext {}
export const myAuthChecker: AuthChecker<MyContext> = async (
  _resolverData,
  _roles
): Promise<boolean> => {
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
//   const token = resolverData.context.req;
//   if (!token.userId) {
//     console.log('Failed Auth Check for: ', resolverData.info.fieldName);

//     throw new ForbiddenError(
//       'Access denied! You need to be authorized to perform this action!'
//     );
//   }

//   if (roles.length === 0) {
//     // No roles specified
//     return true;
//   }

//   if (roles.indexOf(token.role) === -1) {
//     console.log('Failed Roles Auth Check for: ', resolverData.info.fieldName);

//     throw new ForbiddenError(
//       'Access denied! You do not have permissions to perform this action!'
//     );
//   }

  return true;
};
