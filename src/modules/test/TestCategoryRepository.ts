import { DeleteResult, EntityRepository, getCustomRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';

// import { ApolloError } from 'apollo-server-express';
import { ApolloError } from 'apollo-server-errors';
import { NewTestCategoryInput, TestCategories, TestCategory, TestCategoryFilterInput } from './entities/TestCategory';
import { OrderDirection } from '../user/entities/UserFilter';
import { queryWithPagination } from '../../utils/pagination';
import { TestGroupRepository } from './TestGroupRepository';


type T = TestCategory;

class MySelectQueryBuilder extends SelectQueryBuilder<T> {
}

@EntityRepository(TestCategory)
export class TestCategoryRepository extends Repository<T> {
  public createQueryBuilder(_alias?: string, queryRunner?: QueryRunner): MySelectQueryBuilder {
    return new MySelectQueryBuilder(super.createQueryBuilder('test_category', queryRunner));
  }
  public async getTestCategories(data: TestCategoryFilterInput): Promise<TestCategories> {
    let query = this.createQueryBuilder().where(
      "test_category.certificateType = :certificateType",
      { certificateType: data.certificateType }
    );


    if (data.testCategoryIds?.ids && data.testCategoryIds?.ids.length > 0) {
      const ids = data.testCategoryIds.ids;
      query = query.andWhere(`test_category.id NOT IN (:ids)`, { ids : ids.map(id => id) });
    }
    // response ordering rules
    const orderDirection = data.orderDirection || OrderDirection.Desc;
    const { newQuery, total, nextCursor } = await queryWithPagination(
      query,
      {
        orderBy: "displayOrder",
        orderDir: orderDirection,
      },
      data.cursor
    );

    const { entities: testCategories } = await newQuery.getRawAndEntities();
    return {
      testCategories,
      total,
      nextCursor,
    };
  }
  
  public async createTestCategory(data: NewTestCategoryInput): Promise<TestCategory | undefined> {
    // for Test Category
    const testCategory = new TestCategory(data);
    return await testCategory.save();
  }
  public async updateTestCategory(data: NewTestCategoryInput): Promise<TestCategory>{
    const {id, testGroupId, ...dataTestCategory} = data;
    const testCategory = await this.findOne({id});
    if(!testCategory){
        throw new ApolloError(`No Test Category found`, 'NOT_FOUND');
    }
    if(testGroupId){
      const testGroup = await getCustomRepository(TestGroupRepository).findOneOrFail({id: testGroupId});
      testCategory.testGroup = Promise.resolve(testGroup);
      testCategory.save();
    }
    testCategory.updateWith({...dataTestCategory});
    return testCategory;
  }

  public async removeTestCategory(id: string): Promise<DeleteResult>{
    const res = await this.createQueryBuilder()
      .where("id = :id", { id })
      .delete()
      .execute();
    return res;
  }
  
}
