import {
  EntityRepository,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  getCustomRepository,
  DeleteResult,
} from "typeorm";

// import { ApolloError } from 'apollo-server-express';
import {
  TestQuestion,
  TestQuestionInputId,
  TestQuestionInputIds,
  PartIdAndQuestionIdsInput,
} from "./entities/TestQuestion";
import { PartRepository } from "../part/PartRepository";
import { TestRepository } from "../test/TestRepository";
import { QuestionRepository } from "../question/QuestionRepository";
import { Question } from "../question/entities/Question";

type T = TestQuestion;

class MySelectQueryBuider extends SelectQueryBuilder<T> {}

@EntityRepository(TestQuestion)
export class TestQuestionRepository extends Repository<T> {
  public createQueryBuilder(
    _alias?: string,
    queryRunner?: QueryRunner
  ): MySelectQueryBuider {
    return new MySelectQueryBuider(
      super.createQueryBuilder("test_question", queryRunner)
    );
  }
  public async getTestQuestions(
    testId: string
  ): Promise<TestQuestion[] | undefined> {
    return await this.createQueryBuilder().where('test_question.testId = :testId', {testId}).getMany();
  }

  public async updateOrCreateTestPart(
    testQuestionInputId: TestQuestionInputId,
    question: Question
  ): Promise<TestQuestion> {
    const part = await getCustomRepository(PartRepository).findOne({
      id: testQuestionInputId.partId,
    });
    const test = await getCustomRepository(TestRepository).findOne({
      id: testQuestionInputId.testId,
    });
    const testQuestion = new TestQuestion();
    testQuestion.question = Promise.resolve(question);
    if (part) {
      testQuestion.part = Promise.resolve(part);
    }
    if (test) {
      testQuestion.test = Promise.resolve(test);
    }
    await testQuestion.save();
    return testQuestion;
  }
  public async createTestQuestion(
    testQuestionInputId: TestQuestionInputId
  ): Promise<TestQuestion> {
    const part = await getCustomRepository(PartRepository).findOne({
      id: testQuestionInputId.partId,
    });
    const test = await getCustomRepository(TestRepository).findOne({
      id: testQuestionInputId.testId,
    });
    const question = await getCustomRepository(QuestionRepository).findOne({
      id: testQuestionInputId.questionId,
    });
    const testQuestion = new TestQuestion();
    if (question) {
      testQuestion.question = Promise.resolve(question);
    }
    if (part) {
      testQuestion.part = Promise.resolve(part);
    }
    if (test) {
      testQuestion.test = Promise.resolve(test);
    }
    return await testQuestion.save();
  }

  public async removeTestQuestion(id: string): Promise<DeleteResult> {
    const res = await this.createQueryBuilder()
      .where("id = :id", { id })
      .delete()
      .execute();
    return res;
  }
  public async createListTestQuestions(
    testQuestionInputIds: TestQuestionInputIds
  ): Promise<TestQuestion[]> {
    const { testId, partIdAndQuestionIdsInput } = testQuestionInputIds;
   
    const test = await getCustomRepository(TestRepository).findOne({
      id: testId,
    });
    
    const testQuestions: TestQuestion[] = [];
    partIdAndQuestionIdsInput.map(async (p: PartIdAndQuestionIdsInput) => {
      const part = await getCustomRepository(PartRepository).findOne({
        id: p.partId,
      });
      if (p.questionIds.length > 0) {
        p.questionIds.map(async (e: string) => {
          const question = await getCustomRepository(QuestionRepository).findOne({
            id: e,
          });
          const testQuestion = new TestQuestion();
          if (p.partId) {
            testQuestion.part = Promise.resolve(part!);
          }
          if (testId) {
            testQuestion.test = Promise.resolve(test!);
          }
          testQuestion.question = Promise.resolve(question!);
          await testQuestion.save();
          testQuestions.push(testQuestion);
        });
      }
    });

    console.log('testQuestions', testQuestions);
    return await this.save(testQuestions);
  }
}
