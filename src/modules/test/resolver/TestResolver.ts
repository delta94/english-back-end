import { Resolver, Authorized, Mutation, Arg, Query } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { TestRepository } from "../TestRepository";
import { Test, NewTestInput } from "../entities/Test";
// import { AuthedContext } from "../../../auth/AuthedContext";

@Resolver(_of => Test)
export class TestResolver {
  constructor(@InjectRepository(Test) private readonly testRepository: TestRepository) {}

  @Authorized()
  @Query(_type => Test)
  public async test(@Arg('id') id: string): Promise<Test | undefined> {
    return await this.testRepository.findOne(id);
  }


  @Authorized()
  @Mutation(_returns => Test)
  public async createTest(@Arg('data') data: NewTestInput): Promise<Test | undefined> {
    return this.testRepository.createTest(data);
  }

  @Authorized()
  @Mutation(_returns => Test)
  public async updateTest(@Arg('data') data: NewTestInput): Promise<Test> {
    return await this.testRepository.updateTest(data);
  }
}