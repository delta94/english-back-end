import {
  EntityRepository,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  getCustomRepository,
  getManager,
} from "typeorm";

// import { ApolloError } from 'apollo-server-express';
import {
  Question,
  NewQuestionInput,
  QuestionType,
  QuestionFilterType,
  Questions,
} from "./entities/Question";
import {
  TestQuestion,
  TestQuestionInputId,
} from "../testQuestion/entities/TestQuestion";
import { TestQuestionRepository } from "../testQuestion/TestQuestionRepository";
import { queryWithPagination } from "../../utils/pagination";
import { OrderDirection } from "../user/entities/UserFilter";

type T = Question;

class MySelectQueryBuider extends SelectQueryBuilder<T> {}

@EntityRepository(Question)
export class QuestionRepository extends Repository<T> {
  public createQueryBuilder(
    _alias?: string,
    queryRunner?: QueryRunner
  ): MySelectQueryBuider {
    return new MySelectQueryBuider(
      super.createQueryBuilder("question", queryRunner)
    );
  }

  public async createQuestion(data: NewQuestionInput): Promise<Question> {
    const question = new Question({
      questionName: data.questionName,
      audioSec: data.audioSec,
      questionType: data.questionType
        ? data.questionType
        : QuestionType.SingleChoice,
      content: data.content,
      explaination: data.explaination,
      skillType: data.skillType,
      certificateType: data.certificateType,
      answers: data.answers,
      result: data.result,
      description: data.description,
      image: data.image,
    });
    await question.save();
    // create test question part
    const testQuestionInputId: TestQuestionInputId = {
      partId: data.partId,
      testId: data.testId,
    };

    if (data.partId || data.testId) {
      const testQuestionRepo = getCustomRepository(TestQuestionRepository);
      await testQuestionRepo.updateOrCreateTestPart(
        testQuestionInputId,
        question
      );
    }
    return question;
  }

  public async updateQuestion(data: NewQuestionInput): Promise<Question> {
    const { partId, testId, ...dataQuestion } = data;
    const question = await this.findOneOrFail(data.id);
    question.updateWith(dataQuestion);
    await question.save();
    // update test question part
    const testQuestionInputId: TestQuestionInputId = {
      partId: data.partId,
      testId: data.testId,
    };
    if (data.partId || data.testId) {
      const testQuestionRepo = getCustomRepository(TestQuestionRepository);
      await testQuestionRepo.updateOrCreateTestPart(
        testQuestionInputId,
        question
      );
    }
    return question;
  }

  public async getQuestions(data: QuestionFilterType): Promise<Questions> {
    let query = this.createQueryBuilder().where(
      "question.certificateType = :certificateType",
      { certificateType: data.certificateType }
    );
    if (data.skillType) {
      query = query.andWhere("question.skillType = :skillType", {
        skillType: data.skillType,
      });
    }
    if (data.testId) {
      query = query.andWhere(`question.id NOT IN (
        ${getManager()
          .createQueryBuilder(TestQuestion, "test_question")
          .select("test_question.questionId")
          .where(
            `test_question.questionId = question.id and test_question.testId = ${data.testId}`
          )
          .getQuery()}
      )`);
    }
    // response ordering rules
    const orderDirection = data.orderDirection || OrderDirection.Desc;
    const { newQuery, total, nextCursor } = await queryWithPagination(
      query,
      {
        orderBy: "question.updatedAt",
        orderDir: orderDirection,
      },
      data.cursor
    );

    const { entities: questions } = await newQuery.getRawAndEntities();
    return {
      questions,
      total,
      nextCursor,
    };
  }
}
