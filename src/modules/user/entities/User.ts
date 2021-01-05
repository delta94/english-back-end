import { ObjectType, Field, registerEnumType, InputType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, VersionColumn } from "typeorm";
import { IsEmail, IsNotEmpty, IsUrl } from "class-validator";
import { ORMObject } from "../../../types/ORMObject";
import { UserRole } from "../../../auth/AuthedContext";

export enum UserState {
    New = 'New',
    HasCreated = 'HasCreated',
    HasPublished = 'HasPublished',
}
registerEnumType(UserState, {
  name: 'UserState',
});
export enum LevelClass {
  Silver = 'Silver',
  Gold = 'Gold',
  Diamond = 'Diamond'
}

registerEnumType(LevelClass, {
  name: 'LevelClass',
});
@ObjectType()
@InputType('SocialLinkInput')
export class SocialLink {
    @Field({ nullable: true })
    @IsUrl()
    public facebook?: string;

    @Field({ nullable: true })
    @IsUrl()
    public twitter?: string;

    @Field({ nullable: true })
    @IsUrl()
    public linkedin?: string;
}
@ObjectType()
@Entity()
export class User extends ORMObject<User> {
    @Field()
    @PrimaryGeneratedColumn()
    public readonly id!: string;

    @Column({ default: false })
    public isOps!: boolean;

    @Field()
    @CreateDateColumn()
    public createdAt!: Date;

    @Field()
    @CreateDateColumn()
    public updatedAt!: Date;

    @Field({ nullable: true })
    @Column('varchar', { nullable: true })
    public profileMediaUrl?: string;

    @Field()
    @Column({ unique: true })
    @IsEmail()
    public email!: string;


    @Field({ nullable: false })
    @Column({ nullable: false })
    public firstName!: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public lastName?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public address?: string;

    @Field({ nullable: true })
    @Column({ type: 'enum', enum: LevelClass, nullable: true })
    public level?: LevelClass;

    @Field()
    @Column({ type: 'enum', enum: UserRole })
    public role!: UserRole;

    @Field({ description: 'First + Last name' })
    public name!: string;

    public get fullName() {
        return [this.firstName, this.lastName].join(' ');
    }


    @Field({ nullable: true })
    @Column({ nullable: true })
    public phone?: string;

    @Field(_type => SocialLink, { nullable: true })
    @Column({ type: 'json', nullable: true })
    public socialLinks?: SocialLink;

    @Field({ nullable: true })
    @Column({ nullable: true, default: null })
    public password?: string;


    @Field({ nullable: true })
    @Column({ nullable: false, default: false })
    public isVerified?: boolean;

    @Field()
    @VersionColumn()
    public version!: number;

}


@ObjectType()
@InputType()
export class UserInput implements Partial<User> {
    @Field(_type => String)
    public firstName!: string;

    @Field(_type => String)
    public lastName?: string;

    @Field()
    public email!: string;
}
@ObjectType()
export class ImpersonatingUser {
  @Field()
  public userId!: string;
}
@ObjectType()
export class Me extends User {
  // Field resolvers are not available in backend
  @Field(_type => ImpersonatingUser, { nullable: true })
  protected impersonatingUser?: ImpersonatingUser;

}

@InputType({ description: 'Change password' })
export class ChangePasswordInput implements Partial<User> {
  @Field()
  public token!: string;

  @Field()
  @IsEmail()
  public email!: string;

  @Field()
  public password!: string;
}
@InputType()
export class UserBaseInput {
  // } implements Partial<User> {

  // User fields
  @Field({ nullable: true })
  public profileMediaUrl?: string;

  @Field()
  @IsNotEmpty()
  public firstName!: string;

  @Field()
  @IsNotEmpty()
  public lastName!: string;

  @Field({ nullable: true })
  @IsEmail()
  public email?: string;

  @Field({ nullable: true })
  public phone?: string;

  @Field(_type => SocialLink, { nullable: true })
  public socialLinks?: SocialLink;

  @Field({ nullable: true })
  public address?: string;

}
@InputType()
export class NewUserInput extends UserBaseInput {
  @Field({ nullable: true })
  public password?: string;

  @Field(_type => UserRole)
  public role!: UserRole;

  @Field()
  @IsEmail()
  public email!: string;
}

@InputType({ description: 'Update me' })
export class UpdateMeInput extends UserBaseInput {
  @Field()
  public id!: string;

  @Field({ nullable: true })
  public password?: string;
}

export class MeWithTokens extends Me {
  public impersonatingUser?: ImpersonatingUser;
}
