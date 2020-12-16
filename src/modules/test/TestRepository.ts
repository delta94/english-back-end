import { DeleteResult, EntityRepository, getCustomRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';

// import { ApolloError } from 'apollo-server-express';
import { Test, NewTestInput, TestFilterInput, Tests, TestsUpdateInput } from './entities/Test';
import { ApolloError } from 'apollo-server-errors';
import { OrderDirection } from '../user/entities/UserFilter';
import { queryWithPagination } from '../../utils/pagination';
import { TestCategoryRepository } from './TestCategoryRepository';


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
    const {id, testCategoryId, ...dataTest} = data;
    const test = await this.createQueryBuilder().where('id = :id',{id}).getOne();
    if(!test){
        throw new ApolloError(`No Test found`, 'NOT_FOUND');
    }
    if(testCategoryId){
      const testCategory = await getCustomRepository(TestCategoryRepository).findOneOrFail({id: testCategoryId});
      test.testCategory = Promise.resolve(testCategory);
      test.save();
    }
    test.updateWith({...dataTest});
    return test;
  }

  public async removeFromCat(id: string): Promise<Test>{
    const test = await this.createQueryBuilder().where('id = :id',{id}).getOne();
    if(!test){
        throw new ApolloError(`No Test found`, 'NOT_FOUND');
    }
    test.testCategory = Promise.resolve(null);
    test.save();
    return test;
  }

  public async updateTests(data: TestsUpdateInput): Promise<Test[]>{
    const testCategory = await getCustomRepository(TestCategoryRepository).findOneOrFail({id: data.testCategoryId});
    const promises: Promise<Test>[] = data.testIds.ids.map(async id => {
      const test = await this.findOneOrFail({id});
      test.testCategory = Promise.resolve(testCategory);
      return test.save();
    });
    return Promise.all(promises);
  }

  public async getTests(data: TestFilterInput): Promise<Tests> {
    let query = this.createQueryBuilder().where(
      "test.certificateType = :certificateType",
      { certificateType: data.certificateType }
    );
    if (data.skillType) {
      query = query.andWhere("test.skillType = :skillType", {
        skillType: data.skillType,
      });
    }

    if (data.testIds?.ids && data.testIds?.ids.length > 0) {
      const ids = data.testIds.ids;
      query = query.andWhere(`test.id NOT IN (:ids)`, { ids : ids.map(id => id) });
    }
    // response ordering rules
    const orderDirection = data.orderDirection || OrderDirection.Desc;
    const { newQuery, total, nextCursor } = await queryWithPagination(
      query,
      {
        orderBy: "displayOrder",
        orderDir: orderDirection,
        limit: 100,
      },
      data.cursor
    );

    const { entities: tests } = await newQuery.getRawAndEntities();
    return {
      tests,
      total,
      nextCursor,
    };
  }
  public async removeTest(id: string): Promise<DeleteResult>{
    const res = await this.createQueryBuilder()
      .where("id = :id", { id })
      .delete()
      .execute();
    return res;
  }
}
