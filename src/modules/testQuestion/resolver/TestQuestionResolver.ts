import { Resolver, Authorized, Mutation, Arg, Query } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { TestQuestionRepository } from "../TestQuestionRepository";
import { TestQuestion, TestQuestionInputId, TestQuestionInputIds } from "../entities/TestQuestion";
// import { AuthedContext } from "../../../auth/AuthedContext";

@Resolver(_of => TestQuestion)
export class TestQuestionResolver {
  constructor(@InjectRepository(TestQuestion) private readonly testQuestionRepository: TestQuestionRepository) {}

  @Authorized()
  @Query(_type => [TestQuestion])
  public async getTestQuestions(@Arg('testId') id: string): Promise<TestQuestion[] | undefined> {
    return await this.testQuestionRepository.getTestQuestions(id);
  }

  @Authorized()
  @Mutation(_type => TestQuestion)
  public async createTestQuestion(@Arg('data') data: TestQuestionInputId): Promise<TestQuestion | undefined> {
    return await this.testQuestionRepository.createTestQuestion(data);
  }

  @Mutation(_type => [TestQuestion])
  public async createListTestQuestions(@Arg('data') data: TestQuestionInputIds): Promise<TestQuestion[]> {
    return await this.testQuestionRepository.createListTestQuestions(data);
  }

  @Authorized()
  @Mutation(_type => String)
  public async removeTestQuestion(@Arg('id') id: string): Promise<string> {
    await this.testQuestionRepository.removeTestQuestion(id);
    return id;
  }

}