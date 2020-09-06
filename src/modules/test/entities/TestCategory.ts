import { ObjectType, Field } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { ORMObject } from "../../../types/ORMObject";
import { Test } from "./Test";
import { EnglishCertificateType } from "../../part/entities/Part";

@ObjectType()
@Entity()
export class TestCategory extends ORMObject<TestCategory> {
    @Field()
    @PrimaryGeneratedColumn()
    public readonly id!: string;

    @Field(_type => String)
    @Column()
    public testCategoryName!: string;

    @Field(_type => [Test], { nullable: true })
    @OneToMany(
        _type => Test,
        test => test.testCategory,
        { nullable: true }
    )
    public test?: Promise<Test[]>;

    @Field(_type => EnglishCertificateType)
    @Column()
    public certificateType!: EnglishCertificateType;

    @Field(_type => Boolean)
    @Column({ default: false })
    public isPublished!: boolean;

    @Field()
    @CreateDateColumn()
    public createdAt!: Date;

    @Field()
    @UpdateDateColumn()
    public updatedAt!: Date;

    @Field({ nullable: true })
    @Column({ nullable: true })
    @DeleteDateColumn()
    public deleteAt?: Date;

}
