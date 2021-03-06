import {
  EntityRepository,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from "typeorm";
import { Asset, AssetInput } from "./entities/Asset";
// import { config } from '../../config';
// tslint:disable
// const YoutubeDlWrap = require('youtube-dl-wrap');

class MySelectQueryBuider extends SelectQueryBuilder<Asset> {}

@EntityRepository(Asset)
export class AssetRepository extends Repository<Asset> {
  public createQueryBuilder(
    _alias?: string,
    queryRunner?: QueryRunner
  ): MySelectQueryBuider {
    return new MySelectQueryBuider(
      super.createQueryBuilder("asset", queryRunner)
    );
  }

  public async createUploadUrl(assetInput: AssetInput, time: number, extension?: string): Promise<Asset> {

    
    const filepath = `${assetInput.typeFolder}/${assetInput.name}-${time}` + extension;
    const draftAsset = this.create({url: filepath, path: filepath, ...assetInput});
    await this.save(draftAsset);
   
    return draftAsset;
  }
}
