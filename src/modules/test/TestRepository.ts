import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';

// import { ApolloError } from 'apollo-server-express';
import { Test, NewTestInput } from './entities/Test';
import { ApolloError } from 'apollo-server-errors';


type T = Test;

class MySelectQueryBuilder extends SelectQueryBuilder<T> {
}

@EntityRepository(Test)
export class TestRepository extends Repository<T> {
  public createQueryBuilder(_alias?: string, queryRunner?: QueryRunner): MySelectQueryBuilder {
    return new MySelectQueryBuilder(super.createQueryBuilder('test', queryRunner));
  }

  public async createTest(data: NewTestInput): Promise<Test | undefined> {
    // for Test
    const test = new Test(data);
    return await test.save();
  }
  public async updateTest(data: NewTestInput): Promise<Test>{
    const {id, ...dataTestd} = data;
    const test = await this.findOne(id);
    if(!test){
        throw new ApolloError(`No Test found`, 'NOT_FOUND');
    }
    test.updateWith({...dataTestd});
    return test;
  }
}
