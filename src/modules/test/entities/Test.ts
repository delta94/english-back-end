import { ObjectType, Field, registerEnumType, InputType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, OneToMany } from "typeorm";
import { ORMObject } from "../../../types/ORMObject";
import { TestQuestion } from "../../testQuestion/entities/TestQuestion";
import { Part } from "../../part/entities/Part";

export enum SkillsType {
    Reading = 'Reading',
    Listening = 'Listening',
}

registerEnumType(SkillsType, {
    name: 'SkillsType',
});

@ObjectType()
@InputType('AudioSecondsInput')
export class AudioSeconds {
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

    @Field(_type => SkillsType)
    @Column()
    public skillType!: SkillsType;

    @Field(_type => [AudioSeconds], { nullable: true })
    @Column({ type: 'json', nullable: true })
    public autdioPartSecs?: AudioSeconds[];

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
