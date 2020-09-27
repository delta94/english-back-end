import { ObjectType, Field, registerEnumType, InputType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";
import { ORMObject } from "../../../types/ORMObject";
import { TestQuestion } from "../../testQuestion/entities/TestQuestion";
import { Test, SkillsType } from "../../test/entities/Test";
import { OrderDirection } from "../../user/entities/UserFilter";

export enum EnglishCertificateType {
  Toiec = "Toiec",
  IELTS = "IELTS",
  Custom ="Custom",
}

registerEnumType(EnglishCertificateType, {
  name: "EnglishCertificateType",
});
@ObjectType()
@Entity()
export class Part extends ORMObject<Part> {
  @Field()
  @PrimaryGeneratedColumn()
  public readonly id!: string;

  @Field()
  @Column()
  public partName!: string;

  @Field()
  @Column({ type: "text" })
  public description!: string;

  @Field(_type => SkillsType)
  @Column()
  public skillType!: SkillsType;

  @Field(_type => EnglishCertificateType)
  @Column()
  public certificateType!: EnglishCertificateType;

  @Field(_type => TestQuestion, { nullable: true })
  @OneToMany(_type => TestQuestion, testQuestion => testQuestion.part, { nullable: true })
  public testQuestion?: Promise<TestQuestion>;

  @Field(_type => Test, { nullable: true })
  @OneToOne(_type => Test, test => test.part, {
    nullable: true,
  })
  public test?: Promise<Test>;

  @Field(_type => Number)
  @Column({ default: 0 })
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
export class NewPartInput implements Partial<Part> {
  @Field({ nullable: true })
  public id?: string;

  @Field()
  public partName!: string;

  @Field(_type => SkillsType)
  public skillType!: SkillsType;

  @Field()
  public description!: string;

  @Field(_type => EnglishCertificateType)
  public certificateType!: EnglishCertificateType;
  
  @Field({ nullable: true })
  public displayOrder?: number;

}

@InputType()
export class PartIdsInput{
  @Field(_type => [String])
  public ids!: string[];
}


@InputType()
export class PartFilterInput{
  @Field(_type => SkillsType, {nullable: true })
  public skillType?: SkillsType;

  @Field(_type => EnglishCertificateType, {nullable: true })
  public certificateType?: EnglishCertificateType;

  @Field(_type => OrderDirection, { nullable: true })
  public orderDirection?: OrderDirection;

  @Field({ nullable: true })
  public cursor?: string;

  @Field(_type => PartIdsInput, {nullable: true})
  public partIds?: PartIdsInput;
}

@ObjectType()
export class Parts {
  @Field(_type => [Part])
  public parts!: Part[];

  @Field()
  public total!: number;

  @Field({ defaultValue: false })
  public nextCursor?: string;
}

