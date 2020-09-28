import { ObjectType, Field, InputType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, OneToMany, ManyToOne, RelationId } from "typeorm";
import { ORMObject } from "../../../types/ORMObject";
import { EnglishCertificateType } from "../../part/entities/Part";
import { OrderDirection } from "../../user/entities/UserFilter";
import { Test } from "./Test";
import { TestGroup } from "./TestGroup";

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

    @Field(_type => [Test], { nullable: true })
    @OneToMany(
      _type => Test,
      test => test.testCategory,
      { nullable: true }
    )
    public tests?: Promise<Test[]>;

    @Field(_type => TestGroup, { nullable: true })
    @ManyToOne(
      _type => TestGroup,
      testGroup => testGroup.testCategories,
      { nullable: true }
    )
    public testGroup?: Promise<TestGroup>;

    @RelationId((testCategory: TestCategory) => testCategory.testGroup)
    public testGroupId!: string;

    @Field(_type => Boolean)
    @Column({ default: false })
    public isPublished!: boolean;

    @Field(_type => Number)
    @Column({default: 0})
    public displayOrder!: number;

    @Field(_type => Number)
    @Column({default: 0})
    public displayOrderGroup!: number;

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
export class NewTestCategoryInput {
  @Field({ nullable: true })
  public id?: string;

  @Field({ nullable: true })
  public testGroupId?: string;

  @Field()
  public testCategoryName!: string;
 
  @Field(_type => EnglishCertificateType, { nullable: true })
  public certificateType?: EnglishCertificateType;

  @Field(_type => Boolean, { nullable: true })
  public isPublished?: boolean;

  @Field(_type => Number, { nullable: true })
  public displayOrder?: number;

  @Field(_type => Number, { nullable: true })
  public displayOrderGroup?: number;
}
@InputType()
export class TestCategoryIdsInput{
  @Field(_type => [String])
  public ids!: string[];
}
@InputType()
export class TestCategoryFilterInput{

  @Field(_type => EnglishCertificateType, {nullable: true })
  public certificateType?: EnglishCertificateType;

  @Field(_type => OrderDirection, { nullable: true })
  public orderDirection?: OrderDirection;

  @Field({ nullable: true })
  public cursor?: string;

  @Field(_type => TestCategoryIdsInput, {nullable: true})
  public testCategoryIds?: TestCategoryIdsInput;
}

@ObjectType()
export class TestCategories {
  @Field(_type => [TestCategory])
  public testCategories!: TestCategory[];

  @Field()
  public total!: number;

  @Field({ defaultValue: false })
  public nextCursor?: string;
}