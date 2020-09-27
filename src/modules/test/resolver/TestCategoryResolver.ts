import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { EnglishCertificateType } from "../../part/entities/Part";
import { NewTestCategoryInput, TestCategory } from "../entities/TestCategory";
import { TestCategoryRepository } from "../TestCategoryRepository";
// import { AuthedContext } from "../../../auth/AuthedContext";

@Resolver(_of => TestCategory)
export class TestCategoryResolver {
  
constructor(@InjectRepository(TestCategory) private readonly testCategoryRepository: TestCategoryRepository) {}

  @Authorized()
  @Query(_type => TestCategory)
  public async getTestCategory(@Arg('id') id: string): Promise<TestCategory | undefined> {
    return await this.testCategoryRepository.findOne(id);
  }

  @Authorized()
  @Query(_type => [TestCategory])
  public async getTestCategories(@Arg('certificateType') certificateType: EnglishCertificateType): Promise<TestCategory[] | undefined> {
    return await this.testCategoryRepository.find({
      where : {certificateType},
      order: {
        displayOrder: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  @Authorized()
  @Mutation(_returns => TestCategory)
  public async createTestCategory(@Arg('data') data: NewTestCategoryInput): Promise<TestCategory | undefined> {
    return this.testCategoryRepository.createTestCategory(data);
  }

  @Authorized()
  @Mutation(_returns => TestCategory)
  public async updateTestCategory(@Arg('data') data: NewTestCategoryInput): Promise<TestCategory> {
    return await this.testCategoryRepository.updateTestCategory(data);
  }

  @Authorized()
  @Mutation(_returns => String)
  public async removeTestCategory(@Arg('id') id: string): Promise<string> {
    await this.testCategoryRepository.removeTestCategory(id);
    return id;
  }

}