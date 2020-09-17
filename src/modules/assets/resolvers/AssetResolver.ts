import { Resolver, Authorized, Mutation, Arg } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { AssetRepository } from "../AssetRepository";
import { Asset, AssetInput } from "../entities/Asset";

@Resolver(_of => Asset)
export class AssetResolver {
  constructor(@InjectRepository(Asset) private readonly assetRepository: AssetRepository) {}

  @Authorized()
  @Mutation(_returns => Asset)
  public async uploadMedia(@Arg('data') data: AssetInput): Promise<Asset> {
    return this.assetRepository.createUploadUrl(data);
  }
}