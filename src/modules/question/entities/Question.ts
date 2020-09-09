import { ObjectType, Field, registerEnumType, InputType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { ORMObject } from "../../../types/ORMObject";
import { TestQuestion } from "../../testQuestion/entities/TestQuestion";
import { SkillsType } from "../../test/entities/Test";
import { EnglishCertificateType } from "../../part/entities/Part";

export enum QuestionType {
  SingleChoice = "SingleChoice",
  MultiChoice = "MultiChoice",
  FillBlank = "FillBlank",
}

registerEnumType(QuestionType, {
  name: "QuestionType",
});

@ObjectType()
@InputType("AnswersInput")
export class Answers {
  @Field({ nullable: true })
  public keyAnswer?: string;

  @Field({ nullable: true })
  public answerContent?: string;
}

@ObjectType()
@InputType("QuestionFilterTypeInput")
export class QuestionFilterType {
  
  @Field(_type => SkillsType, { nullable: true})
  public skillType?: SkillsType;

  @Field(_type => EnglishCertificateType)
  public certificateType!: EnglishCertificateType;
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

  @Field({nullable: true})
  @Column({ type: "text" , nullable: true})
  public description?: string;

  @Field({nullable: true})
  @Column({ type: "text" , nullable: true})
  public content?: string;

  @Field({nullable: true})
  @Column({ type: "text" , nullable: true})
  public explaination?: string;

  @Field(_type => String)
  @Column()
  public image?: string;

  @Field(_type => [Answers])
  @Column({ type: "json" })
  public answers?: Answers[];

  @Field(_type => TestQuestion, { nullable: true })
  @OneToOne(_type => TestQuestion, testQuestion => testQuestion.question, {
    nullable: true,
  })
  public testQuestion?: Promise<TestQuestion>;

  @Field(_type => SkillsType)
  @Column()
  public skillType!: SkillsType;

  @Field(_type => EnglishCertificateType)
  @Column()
  public certificateType!: EnglishCertificateType;

  @Field(_type => String)
  @Column()
  public result!: string;

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
export class NewQuestionInput {
  
  @Field({ nullable: true })
  public id?: string;

  @Field()
  public questionName!: string;

  @Field()
  public audioSec?: number;

  @Field(_type => QuestionType)
  public questionType!: QuestionType;

  @Field({ nullable: true })
  public content?: string;

  @Field({ nullable: true })
  public description?: string;

  @Field({ nullable: true })
  public explaination?: string;

  @Field({ nullable: true })
  public image?: string;

  @Field(_type => SkillsType)
  public skillType!: SkillsType;

  @Field(_type => EnglishCertificateType)
  public certificateType!: EnglishCertificateType;

  @Field(_type => [Answers])
  public answers!: Answers[];

  @Field(_type => String)
  public result!: string;

  @Field(_type => String, { nullable: true })
  public partId?: string;

  @Field(_type => String, { nullable: true })
  public testId?: string;
}