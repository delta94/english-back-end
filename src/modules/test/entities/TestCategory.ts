import { ObjectType, Field } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";
import { ORMObject } from "../../../types/ORMObject";
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

    @Field(_type => EnglishCertificateType)
    @Column()
    public certificateType!: EnglishCertificateType;

    @Field(_type => Boolean)
    @Column({ default: false })
    public isPublished!: boolean;

    @Field(_type => Number)
    @Column({default: 0})
    public displayOrder!: number;

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
