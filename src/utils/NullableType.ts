import { ApolloError } from 'apollo-server-express';

export type Nullable<T> = T | null | undefined;
export type NoUndefinedField<T> = { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> };

export function AssertNonNull<T>(t: T): NonNullable<T> {
  if (t === null || t === undefined) {
    console.error('Failed null assertion', null, 2);
    throw new ApolloError(`Asserting failed`);
  }

  return t as NonNullable<T>;
}
