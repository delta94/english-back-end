import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Token {
  @Field()
  @PrimaryGeneratedColumn()
  public readonly id!: string;

  @Column({ unique: true })
  public token!: string;

  @Column()
  public targetType!: string;

  @Column()
  public targetID!: string;

  @Column()
  public expiresAt!: Date;

  @Column()
  public tokenType!: string;
}
