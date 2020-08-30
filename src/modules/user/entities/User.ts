import { ObjectType, Field, registerEnumType, InputType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { IsEmail, IsUrl } from "class-validator";
import { ORMObject } from "../../../types/ORMObject";

export enum UserState {
    New = 'New',
    HasCreated = 'HasCreated',
    HasPublished = 'HasPublished',
}

registerEnumType(UserState, {
    name: 'UserState',
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

    @Field({ nullable: true })
    @Column({ nullable: true })
    @IsEmail()
    public displayEmail?: string;

    @Column({ type: 'varchar', nullable: true })
    public confirmationInvite?: string | null;

    @Field({ nullable: false })
    @Column({ nullable: false })
    public firstName!: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public lastName?: string;

    @Field({ description: 'First + Last name' })
    public name!: string;

    public get fullName() {
        return [this.firstName, this.lastName].join(' ');
    }


    @Field({ nullable: true })
    @Column({ nullable: true })
    public phone?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public company?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public title?: string;

    @Field({ nullable: true })
    @Column({ type: 'text', nullable: true })
    public bio?: string;

    @Field(_type => SocialLink, { nullable: true })
    @Column({ type: 'json', nullable: true })
    public socialLinks?: SocialLink;

    @Field({ nullable: true })
    @Column({ nullable: true, default: null })
    public password?: string;

    @Field(_type => UserState)
    @Column({ type: 'enum', enum: UserState, default: UserState.New })
    public state!: UserState;

    @Field({ nullable: true })
    @Column({ nullable: false, default: false })
    public isVerified?: boolean;

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

    @Field(_type => UserState)
    public state!: UserState;
}