import { ObjectType, Field, InputType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn, RelationId, ManyToOne, DeleteDateColumn, UpdateDateColumn } from "typeorm";
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
    @RelationId((testQuestion: TestQuestion) => testQuestion.test)
    public testId!: string;

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
    @ManyToOne(
      _type => Part,
      part => part.testQuestion,
      { cascade: true }
    )
    @JoinColumn()
    public part!: Part;

    @RelationId((testQuestion: TestQuestion) => testQuestion.part)
    public partId!: string;
    
    @Field(_type => Number)
    @Column({default: 0})
    public order!: number;

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

@InputType()
export class TestQuestionInputId {
  @Field(_type => String, {nullable: true})
  public testId?: string;

  @Field(_type => String, {nullable: true})
  public partId?: string;

  @Field(_type => String, {nullable: true})
  public questionId?: string;
}

@InputType()
export class PartIdAndQuestionIdsInput {

  @Field(_type => String, {nullable: true})
  public partId?: string;

  @Field(_type => [String])
  public questionIds!: string[];
}

@InputType()
export class TestQuestionInputIds {

  @Field(_type => String, {nullable: true})
  public testId?: string;

  @Field(_type => [PartIdAndQuestionIdsInput])
  public partIdAndQuestionIdsInput!: PartIdAndQuestionIdsInput[];

}


