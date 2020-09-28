import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { NewTestGroupInput, TestGroup, TestGroupFilterInput, TestGroups } from "../entities/TestGroup";
import { TestGroupRepository } from "../TestGroupRepository";
// import { AuthedContext } from "../../../auth/AuthedContext";

@Resolver(_of => TestGroup)
export class TestGroupResolver {
  
constructor(@InjectRepository(TestGroup) private readonly testGroupRepository: TestGroupRepository) {}

  @Authorized()
  @Query(_type => TestGroup)
  public async getTestGroup(@Arg('id') id: string): Promise<TestGroup | undefined> {
    return await this.testGroupRepository.findOne({id});
  }

  @Authorized()
  @Query(_type => TestGroups)
  public async getTestGroups(@Arg('data') data: TestGroupFilterInput): Promise<TestGroups | undefined> {
    return await this.testGroupRepository.getTestGroups(data);
  }

  @Authorized()
  @Mutation(_returns => TestGroup)
  public async createTestGroup(@Arg('data') data: NewTestGroupInput): Promise<TestGroup | undefined> {
    return this.testGroupRepository.createTestGroup(data);
  }

  @Authorized()
  @Mutation(_returns => TestGroup)
  public async updateTestGroup(@Arg('data') data: NewTestGroupInput): Promise<TestGroup> {
    return await this.testGroupRepository.updateTestGroup(data);
  }

  @Authorized()
  @Mutation(_returns => String)
  public async removeTestGroup(@Arg('id') id: string): Promise<string> {
    await this.testGroupRepository.removeTestGroup(id);
    return id;
  }

}