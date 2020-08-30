import { ObjectType, Field } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from "typeorm";
import { ORMObject } from "../../../types/ORMObject";
import { TestQuestion } from "../../testQuestion/entities/TestQuestion";
import { Test } from "../../test/entities/Test";


@ObjectType()
@Entity()
export class Part extends ORMObject<Part> {
    @Field()
    @PrimaryGeneratedColumn()
    public readonly id!: string;

    @Field()
    @Column()
    public partName!: string;

    @Field()
    @Column({ type: 'text' })
    public description!: string;

    @Field(_type => Test, { nullable: true })
    @OneToOne(
        _type => Test,
        test => test.part,
        { nullable: true }
    )
    public testQuestion?: Promise<TestQuestion>;

    @Field(_type => TestQuestion, { nullable: true })
    @OneToOne(
        _type => TestQuestion,
        testQuestion => testQuestion.part,
        { nullable: true }
    )
    public test?: Promise<Test>;
    
    @Field()
    @CreateDateColumn()
    public createdAt!: Date;

    @Field()
    @CreateDateColumn()
    public updatedAt!: Date;

    @Field({ nullable: true })
    @Column({ nullable: true })
    @CreateDateColumn()
    public deleteAt?: Date;

}
