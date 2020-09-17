import { InputType, Field, registerEnumType } from 'type-graphql';

export enum OrderDirection {
  Asc = 'Asc',
  Desc = 'Desc',
}

registerEnumType(OrderDirection, {
  name: 'OrderDirection',
  description: 'Query Order Direction',
});

export enum UserOrderByFields {
  CreatedAt = 'createdAt',
  FirstName = 'firstName',
}

registerEnumType(UserOrderByFields, {
  name: 'UserOrderByFields',
  description: 'Allow orderBy fields',
});

@InputType()
export class UserFilters {
  @Field(_type => UserOrderByFields, { nullable: true })
  public orderBy?: UserOrderByFields;

  @Field(_type => OrderDirection, { nullable: true })
  public orderDirection?: OrderDirection;

  @Field(_type => Boolean, { nullable: true })
  public isActive?: boolean;
}
