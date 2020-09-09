import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder, getCustomRepository } from 'typeorm';

// import { ApolloError } from 'apollo-server-express';
import { Test, NewTestInput } from './entities/Test';
import { ApolloError } from 'apollo-server-errors';
import { TestQuestionRepository } from '../testQuestion/TestQuestionRepository';


type T = Test;

class MySelectQueryBuilder extends SelectQueryBuilder<T> {
}

@EntityRepository(Test)
export class TestRepository extends Repository<T> {
  public createQueryBuilder(_alias?: string, queryRunner?: QueryRunner): MySelectQueryBuilder {
    return new MySelectQueryBuilder(super.createQueryBuilder('test', queryRunner));
  }

  public async createTest(data: NewTestInput): Promise<Test | undefined> {
    const {testQuestionInputIds, ...dataTest} = data;
    // for Test
    const test = new Test(dataTest);
    await test.save();
    const testId = test.id;
    // for TestQuestion
    if(testQuestionInputIds){
      if(!testQuestionInputIds.testId){
        testQuestionInputIds.testId = testId;
      }
      const testQuestions = getCustomRepository(TestQuestionRepository).createListTestQuestions(testQuestionInputIds);
      if(!testQuestions){
        return undefined;
      }
    }
    return test;
  }
  public async updatePart(id: string, data: NewTestInput): Promise<Test>{
    const test = await this.findOne(id);
    if(!test){
        throw new ApolloError(`No Test found`, 'NOT_FOUND');
    }
    test.updateWith({...data});
    return test;
  }
}
