import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder, getCustomRepository } from 'typeorm';

// import { ApolloError } from 'apollo-server-express';
import { Question, NewQuestionInput, QuestionType } from './entities/Question';
import { TestQuestionInputId } from '../testQuestion/entities/TestQuestion';
import { TestQuestionRepository } from '../testQuestion/TestQuestionRepository';


type T = Question;

class MySelectQueryBuider extends SelectQueryBuilder<T> {
  
}

@EntityRepository(Question)
export class QuestionRepository extends Repository<T> {
  public createQueryBuilder(_alias?: string, queryRunner?: QueryRunner): MySelectQueryBuider {
    return new MySelectQueryBuider(super.createQueryBuilder('question', queryRunner));
  }
  
  public async createQuestion(data: NewQuestionInput): Promise<Question>{
    const question = new Question({
      questionName : data.questionName,
      audioSec: data.audioSec,
      questionType: data.questionType ? data.questionType : QuestionType.SingleChoice,
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
    const testQuestionInputId : TestQuestionInputId = {
      partId: data.partId,
      testId: data.testId,
    };

    if(data.partId || data.testId){
      const testQuestionRepo = getCustomRepository(TestQuestionRepository);
      await testQuestionRepo.updateOrCreateTestPart(testQuestionInputId, question);
    }
    return question;
  }

  public async updateQuestion(data: NewQuestionInput): Promise<Question>{
    const {partId, testId , ...dataQuestion} = data;
    const question = await this.findOneOrFail(data.id);
    question.updateWith(dataQuestion);
    await question.save();
    // update test question part
    const testQuestionInputId : TestQuestionInputId = {
      partId: data.partId,
      testId: data.testId,
    };
    if(data.partId || data.testId){
      const testQuestionRepo = getCustomRepository(TestQuestionRepository);
      await testQuestionRepo.updateOrCreateTestPart(testQuestionInputId, question);
    }
    return question;
  }
}
