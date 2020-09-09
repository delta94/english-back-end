import {
  EntityRepository,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  getCustomRepository,
} from "typeorm";

// import { ApolloError } from 'apollo-server-express';
import { TestQuestion, TestQuestionInputId, TestQuestionInputIds, PartIdAndQuestionIdsInput } from "./entities/TestQuestion";
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
  public async updateOrCreateTestPart(
    testQuestionInputId: TestQuestionInputId,
    question: Question
  ): Promise<TestQuestion> {
    const part = await getCustomRepository(PartRepository).findOne({id: testQuestionInputId.partId});
    const test = await getCustomRepository(TestRepository).findOne({id: testQuestionInputId.testId});
    const testQuestion = new TestQuestion();
    testQuestion.question = question;
    if (part) {
      testQuestion.part = part;
    }
    if (test) {
      testQuestion.test = test;
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
      testQuestion.question = question;
    }
    if (part) {
      testQuestion.part = part;
    }
    if (test) {
      testQuestion.test = test;
    }
    await testQuestion.save();
    return testQuestion;
  }

  public async createListTestQuestions(
    testQuestionInputIds: TestQuestionInputIds
  ): Promise<TestQuestion[] | undefined> {
    const { testId ,partIdAndQuestionIdsInput } = testQuestionInputIds;
    if(partIdAndQuestionIdsInput.length === 0){
      return undefined;
    }
    const testQuestions: TestQuestion[] = [];
    partIdAndQuestionIdsInput.map((p: PartIdAndQuestionIdsInput) => {
      if(p.questionIds.length > 0){
        p.questionIds.map((e: string) => {
          const testQuestion = new TestQuestion();
          if(p.partId){
            testQuestion.partId = p.partId;
          }
          if(testId){
            testQuestion.testId = testId;
          }
          testQuestion.questionId = e;
          testQuestions.push(testQuestion);
        });
      }
     

    });
    return await this.save(testQuestions);
  }
  
}
