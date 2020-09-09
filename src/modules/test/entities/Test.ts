import { ObjectType, Field, registerEnumType, InputType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, OneToMany, DeleteDateColumn, UpdateDateColumn } from "typeorm";
import { ORMObject } from "../../../types/ORMObject";
import { TestQuestion, TestQuestionInputIds } from "../../testQuestion/entities/TestQuestion";
import { Part, EnglishCertificateType } from "../../part/entities/Part";

export enum SkillsType {
  Reading = 'Reading',
  Listening = 'Listening',
}

registerEnumType(SkillsType, {
  name: 'SkillsType',
});

@ObjectType()
@InputType('AudioSecondsInput')
export class PartAndAudioSeconds {
  @Field({ nullable: true })
  public partId?: string;

  @Field({ nullable: true })
  public autdioSecs?: number;

}


@ObjectType()
@Entity()
export class Test extends ORMObject<Test> {
  @Field()
  @PrimaryGeneratedColumn()
  public readonly id!: string;

  @Field(_type => String)
  @Column()
  public testName!: string;

  @Field()
  @Column({ type: "text" })
  public description?: string;

  @Field(_type => SkillsType)
  @Column()
  public skillType!: SkillsType;

  @Field(_type => EnglishCertificateType)
  @Column()
  public certificateType!: EnglishCertificateType;

  @Field(_type => [PartAndAudioSeconds], { nullable: true })
  @Column({ type: 'json', nullable: true })
  public partAndAudioSecs?: PartAndAudioSeconds[];


  @Field(_type => [TestQuestion], { nullable: true })
  @OneToMany(
    _type => TestQuestion,
    testQuestion => testQuestion.test,
    { nullable: true }
  )
  public testQuestions?: Promise<TestQuestion[]>;


  @Field(_type => Part, { nullable: true })
  @OneToOne(
    _type => Part,
    part => part.test,
    { nullable: true }
  )
  public part?: Promise<Part>;


  @Field(_type => Boolean)
  @Column({ default: false })
  public isPublished!: boolean;

  @Field(_type => Number)
  @Column({ default: 0 })
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
export class NewTestInput {
  @Field({ nullable: true })
  public id?: string;

  @Field()
  public testName!: string;

  @Field(_type => SkillsType, { nullable: true })
  public skillType?: SkillsType;

  @Field({ nullable: true })
  public description?: string;

  @Field(_type => EnglishCertificateType, { nullable: true })
  public certificateType?: EnglishCertificateType;

  @Field({ nullable: true })
  public isPublished?: boolean;

  @Field(_type => [PartAndAudioSeconds], { nullable: true })
  public partAndAudioSecs?: PartAndAudioSeconds[];

  @Field(_type => TestQuestionInputIds, { nullable: true })
  public testQuestionInputIds?: TestQuestionInputIds;

}
