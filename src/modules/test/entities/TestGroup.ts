import { ObjectType, Field, InputType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { ORMObject } from "../../../types/ORMObject";
import { EnglishCertificateType } from "../../part/entities/Part";
import { OrderDirection } from "../../user/entities/UserFilter";
import { TestCategory } from "./TestCategory";

@ObjectType()
@Entity()
export class TestGroup extends ORMObject<TestGroup> {
    @Field()
    @PrimaryGeneratedColumn()
    public readonly id!: string;

    @Field(_type => String)
    @Column()
    public testGroupName!: string;

    @Field(_type => String)
    @Column()
    public link!: string;

    @Field({ nullable: true })
    @Column({ default: 0 })
    public parentId!: string;

    @Field(_type => EnglishCertificateType)
    @Column()
    public certificateType!: EnglishCertificateType;

    @Field(_type => [TestCategory], { nullable: true })
    @OneToMany(
      _type => TestCategory,
      testCategory => testCategory.testGroup,
      { nullable: true }
    )
    public testCategories?: Promise<TestCategory[]>;

    @Field(_type => Boolean)
    @Column({ default: false })
    public isPublished!: boolean;

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
export class NewTestGroupInput {
  @Field({ nullable: true })
  public id?: string;

  @Field({ nullable: true })
  public testGroupName?: string;
 
  @Field({ nullable: true })
  public parentId?: string;

  @Field(_type => Boolean, { nullable: true })
  public isPublished?: boolean;

  @Field(_type => Number, { nullable: true })
  public displayOrder?: number;

  @Field({ nullable: true })
  public link?: string;

  @Field(_type => EnglishCertificateType, {nullable: true})
    public certificateType?: EnglishCertificateType;
}

@InputType()
export class TestGroupIdsInput{
  @Field(_type => [String])
  public ids!: string[];
}
@InputType()
export class TestGroupFilterInput{

  @Field(_type => OrderDirection, { nullable: true })
  public orderDirection?: OrderDirection;

  @Field(_type => EnglishCertificateType, { nullable: true })
  public certificateType?: EnglishCertificateType;

  @Field({ nullable: true })
  public cursor?: string;

  @Field(_type => TestGroupIdsInput, {nullable: true})
  public testGroupIds?: TestGroupIdsInput;
}

@ObjectType()
export class TestGroups {
  @Field(_type => [TestGroup])
  public testGroups!: TestGroup[];

  @Field()
  public total!: number;

  @Field({ defaultValue: false })
  public nextCursor?: string;
}