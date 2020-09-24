import { Resolver, Authorized, Mutation, Arg, Query } from "type-graphql";
import { Part, NewPartInput, EnglishCertificateType } from "../entities/Part";
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
  @Query(_type => [Part])
  public async parts(@Arg('certificateType') certificateType: EnglishCertificateType): Promise<Part[] | undefined> {
    return await this.partRepository.find({
      where : {certificateType},
      order: {
        displayOrder: 'ASC',
        createdAt: 'DESC',
      },
    });
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