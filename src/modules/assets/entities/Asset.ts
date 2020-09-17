import { IsIn } from 'class-validator';
import { ObjectType, registerEnumType } from 'type-graphql';
import { InputType, Field } from 'type-graphql';
import { CreateDateColumn, Column, Entity, PrimaryColumn } from 'typeorm';
import { ORMObject } from '../../../types/ORMObject';

export enum MediaType {
  Image = "image",
  Audio = "audio",
  Video = "video"
}

registerEnumType(MediaType, {
  name: "MediaType",
});


@Entity()
@ObjectType()
export class Asset extends ORMObject<Asset> {
  @Field()
  @PrimaryColumn('varchar')
  public url!: string;

  @Field()
  @Column()
  public name!: string;

  @Field()
  @Column()
  public path!: string;

  @Field(_type => String)
  @IsIn(['image/jpeg', 'image/png', 'image/svg+xml', 'video/mp4', 'audio/mpeg'])
  @Column()
  public type!: string;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;
}

@InputType()
export class AssetInput {

  @Field()
  public name!: string;
  
  @Field(_type => String)
  public type!: string;

  @Field(_type => MediaType)
  public typeFolder!: MediaType;
}
