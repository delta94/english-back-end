import { ObjectType, registerEnumType } from 'type-graphql';
import { IsIn } from 'class-validator';
import { InputType, Field } from 'type-graphql';
import { CreateDateColumn, Column, Entity, PrimaryColumn } from 'typeorm';

export enum AssetEntity {
  ewebinar = 'ewebinar',
  user = 'user',
  team = 'team',
}

registerEnumType(AssetEntity, {
  name: 'AssetEntity',
  description: 'Assets are either part of an ewebinar a user or a team',
});

export enum ImageHint {
  default = 'default',
  profile = 'profile',
  forceJpeg = 'forceJpeg',
}

registerEnumType(ImageHint, {
  name: 'ImageHint',
  description: 'Image asset hints to help resize',
});

@ObjectType()
export class ImageAsset {
  @Field()
  public height!: number;

  @Field()
  public width!: number;

  @Field(_type => ImageHint)
  public hint!: ImageHint;

  @Field()
  @IsIn(['image/jpeg', 'image/png', 'image/svg+xml', 'video/mp4'])
  public fileType!: string;
}

@InputType()
export class ImageAssetInput {
  @Field()
  public height!: number;

  @Field()
  public width!: number;

  @Field(_type => ImageHint, { nullable: true })
  public hint?: ImageHint;

  @Field({ nullable: true })
  @IsIn(['image/jpeg', 'image/png', 'image/svg+xml', 'video/mp4'])
  public fileType?: string;
}

@ObjectType()
export class VideoAsset {
  @Field()
  public fileSize!: number;
}

@InputType()
export class VideoAssetInput {
  @Field()
  public ewebinarId!: string;

  @Field()
  public fileSize!: number;
}

@Entity()
@ObjectType()
export class Asset {
  @Field()
  @PrimaryColumn('varchar')
  public url!: string;

  @Column({ default: 1 })
  @Field()
  public useCount!: number;

  @Column({ type: 'enum', enum: AssetEntity })
  @Field(_type => AssetEntity)
  public entity!: AssetEntity;

  @Field()
  @Column()
  public entityId!: string;

  @Field()
  @Column()
  public name!: string;

  @Field(_type => ImageAsset, { nullable: true })
  @Column({ type: 'json', nullable: true })
  public image?: ImageAsset;

  @Field(_type => VideoAsset, { nullable: true })
  @Column({ type: 'json', nullable: true })
  public video?: VideoAsset;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;
}

@ObjectType()
export class AssetUrls {
  constructor(url: string, uploadUrl: string) {
    this.url = url;
    this.uploadUrl = uploadUrl;
  }

  @Field()
  public url!: string;

  @Field()
  public uploadUrl!: string;
}

@InputType()
export class AssetInput {
  @Field()
  public entity!: AssetEntity;

  @Field({ nullable: true })
  public entityId?: string;

  @Field()
  public name!: string;

  @Field(_type => ImageAssetInput, { nullable: true })
  public image?: ImageAssetInput;
}
