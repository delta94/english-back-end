import { Resolver, Authorized, Mutation, Arg, Query } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { TestRepository } from "../TestRepository";
import { Test, NewTestInput, TestFilterInput, Tests, TestsUpdateInput } from "../entities/Test";
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
  @Query(_type => Tests)
  public async getTests(@Arg('data') data: TestFilterInput): Promise<Tests | undefined> {
    return await this.testRepository.getTests(data);
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

  @Authorized()
  @Mutation(_returns => [Test])
  public async updateTests(@Arg('data') data: TestsUpdateInput): Promise<Test[]> {
    return await this.testRepository.updateTests(data);
  }

  @Authorized()
  @Mutation(_returns => Test)
  public async removeFromCat(@Arg('id') id: string): Promise<Test> {
    return await this.testRepository.removeFromCat(id);
  }


  @Authorized()
  @Mutation(_returns => String)
  public async removeTest(@Arg('id') id: string): Promise<string> {
    await this.testRepository.removeTest(id);
    return id;
  }
}