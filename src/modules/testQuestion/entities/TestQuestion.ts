import { ObjectType, Field } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn, RelationId, ManyToOne } from "typeorm";
import { ORMObject } from "../../../types/ORMObject";
import { Question } from "../../question/entities/Question";
import { Part } from "../../part/entities/Part";
import { Test } from "../../test/entities/Test";


@ObjectType()
@Entity()
export class TestQuestion extends ORMObject<TestQuestion> {
    @Field()
    @PrimaryGeneratedColumn()
    public readonly id!: string;

    @Field(_type => Test)
    @ManyToOne(
      _type => Test,
      test => test.testQuestions,
    )
    public test!: Test;

    @Field(_type => Question)
    @OneToOne(
      _type => Question,
      question => question.testQuestion,
      { cascade: true }
    )
    @JoinColumn()
    public question!: Question;
    @RelationId((testQuestion: TestQuestion) => testQuestion.question)
    public questionId!: string;

    @Field(_type => Part)
    @OneToOne(
      _type => Part,
      part => part.testQuestion,
      { cascade: true }
    )
    @JoinColumn()
    public part!: Part;

    @RelationId((testQuestion: TestQuestion) => testQuestion.part)
    public partId!: string;
    
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
