import { DeleteResult, EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';

// import { ApolloError } from 'apollo-server-express';
import { ApolloError } from 'apollo-server-errors';
import { NewTestCategoryInput, TestCategory } from './entities/TestCategory';


type T = TestCategory;

class MySelectQueryBuilder extends SelectQueryBuilder<T> {
}

@EntityRepository(TestCategory)
export class TestCategoryRepository extends Repository<T> {
  public createQueryBuilder(_alias?: string, queryRunner?: QueryRunner): MySelectQueryBuilder {
    return new MySelectQueryBuilder(super.createQueryBuilder('test_category', queryRunner));
  }

  public async createTestCategory(data: NewTestCategoryInput): Promise<TestCategory | undefined> {
    // for Test Category
    const testCategory = new TestCategory(data);
    return await testCategory.save();
  }
  public async updateTestCategory(data: NewTestCategoryInput): Promise<TestCategory>{
    const {id, ...dataTestCategory} = data;
    const testCategory = await this.findOne(id);
    if(!testCategory){
        throw new ApolloError(`No Test Category found`, 'NOT_FOUND');
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
