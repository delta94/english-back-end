import { Resolver, Authorized, Mutation, Arg, Query } from "type-graphql";
import { Part, NewPartInput, PartFilterInput, PartIdsInput, Parts } from "../entities/Part";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PartRepository } from "../PartRepository";
// import { AuthedContext } from "../../../auth/AuthedContext";

@Resolver(_of => Part)
export class PartResolver {
  constructor(@InjectRepository(Part) private readonly partRepository: PartRepository) {}

  @Authorized()
  @Query(_type => Part)
  public async part(@Arg('id') id: string): Promise<Part | undefined> {
    return await this.partRepository.findOne(id);
  }

  @Authorized()
  @Query(_type => Parts)
  public async getParts(@Arg('data') data: PartFilterInput): Promise<Parts | undefined> {
    return await this.partRepository.getParts(data);
  }

  @Authorized()
  @Query(_type => [Part])
  public async getPartsFromIds(@Arg('data') data: PartIdsInput): Promise<Part[] | undefined> {
    return await this.partRepository.getPartsFromIds(data);
  }

  @Authorized()
  @Mutation(_returns => Part)
  public async createPart(@Arg('data') data: NewPartInput): Promise<Part | undefined> {
    return this.partRepository.createPart(data);
  }

  @Authorized()
  @Mutation(_returns => Part)
  public async updatePart(@Arg('data') data: NewPartInput): Promise<Part> {
    return await this.partRepository.updatePart(data);
  }
}