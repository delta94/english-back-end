import { ObjectType, Field, registerEnumType, InputType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from "typeorm";
import { ORMObject } from "../../../types/ORMObject";
import { TestQuestion } from "../../testQuestion/entities/TestQuestion";

export enum QuestionType {
    SingleChoice = 'SingleChoice',
    MultiChoice = 'MultiChoice',
    FillBlank = 'FillBlank',
}

registerEnumType(QuestionType, {
    name: 'QuestionType',
});

@ObjectType()
@InputType('AnswersInput')
export class Answers {
  @Field({ nullable: true })
  public keyAnswer?: string;

  @Field({ nullable: true })
  public answerContent?: number;

}

@ObjectType()
@Entity()
export class Question extends ORMObject<Question> {
    @Field()
    @PrimaryGeneratedColumn()
    public readonly id!: string;

    @Field(_type => String)
    @Column()
    public questionName!: string;

    @Field(_type => Number)
    @Column()
    public audioSec?: number;

    @Field(_type => QuestionType)
    @Column()
    public questionType!: QuestionType;

    @Field()
    @Column({ type: 'text' })
    public description!: string;

    @Field()
    @Column({ type: 'text' })
    public content!: string;

    @Field(_type => [Answers], { nullable: true })
    @Column({ type: 'json', nullable: true })
    public answers?: Answers[];

    @Field(_type => TestQuestion, { nullable: true })
    @OneToOne(
        _type => TestQuestion,
        testQuestion => testQuestion.question,
        { nullable: true }
    )
    public testQuestion?: Promise<TestQuestion>;

  

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
