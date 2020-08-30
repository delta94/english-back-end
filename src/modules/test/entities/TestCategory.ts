import { ObjectType, Field, InputType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { ORMObject } from "../../../types/ORMObject";
import { SkillsType } from "./Test";



@ObjectType()
@InputType('TestSkillTypeInput')
export class TestSkillType {
  @Field({ nullable: true })
  public TestId?: string;

  @Field({ nullable: true })
  public skillType?: SkillsType;

}

@ObjectType()
@Entity()
export class TestCategory extends ORMObject<TestCategory> {
    @Field()
    @PrimaryGeneratedColumn()
    public readonly id!: string;

    @Field(_type => String)
    @Column()
    public testCategoryName!: string;


    @Field(_type => [TestSkillType])
    @Column({ type: 'json' })
    public testSkillType!: TestSkillType[];

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
