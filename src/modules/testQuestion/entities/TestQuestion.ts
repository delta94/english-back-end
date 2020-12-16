import { ObjectType, Field, InputType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, RelationId, ManyToOne, DeleteDateColumn, UpdateDateColumn } from "typeorm";
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
      { onDelete: "CASCADE" }
    )
    public test!:  Promise<Test>;
    @RelationId((testQuestion: TestQuestion) => testQuestion.test)
    public testId!: string;

    @Field(_type => Question)
    @ManyToOne(
      _type => Question,
      question => question.testQuestion,
      { cascade: true }
    )
    @JoinColumn()
    public question!: Promise<Question>;
    @RelationId((testQuestion: TestQuestion) => testQuestion.question)
    public questionId!: string;

    @Field(_type => Part)
    @ManyToOne(
      _type => Part,
      part => part.testQuestion,
      { cascade: true }
    )
    @JoinColumn()
    public part!:  Promise<Part>;

    @RelationId((testQuestion: TestQuestion) => testQuestion.part)
    public partId!: string;
    
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

@InputType()
export class TestQuestionInputId {
  @Field(_type => String, {nullable: true})
  public id?: string;

  @Field(_type => String, {nullable: true})
  public testId?: string;

  @Field(_type => String, {nullable: true})
  public partId?: string;

  @Field(_type => String, {nullable: true})
  public questionId?: string;

  @Field(_type => Number, {nullable: true})
  public displayOrder?: number;
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


