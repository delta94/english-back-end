import { DeleteResult, EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';

// import { ApolloError } from 'apollo-server-express';
import { ApolloError } from 'apollo-server-errors';
import { OrderDirection } from '../user/entities/UserFilter';
import { queryWithPagination } from '../../utils/pagination';
import { NewTestGroupInput, TestGroup, TestGroupFilterInput, TestGroups } from './entities/TestGroup';


type T = TestGroup;

class MySelectQueryBuilder extends SelectQueryBuilder<T> {
}

@EntityRepository(TestGroup)
export class TestGroupRepository extends Repository<T> {
  public createQueryBuilder(_alias?: string, queryRunner?: QueryRunner): MySelectQueryBuilder {
    return new MySelectQueryBuilder(super.createQueryBuilder('test_group', queryRunner));
  }
  public async getTestGroups(data: TestGroupFilterInput): Promise<TestGroups> {
    let query = this.createQueryBuilder().where(
      "test_group.certificateType = :certificateType",
      { certificateType: data.certificateType }
    );


    if (data.testGroupIds?.ids && data.testGroupIds?.ids.length > 0) {
      const ids = data.testGroupIds.ids;
      query = query.andWhere(`test_group.id NOT IN (:ids)`, { ids : ids.map(id => id) });
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

    const { entities: testGroups } = await newQuery.getRawAndEntities();
    return {
    testGroups,
      total,
      nextCursor,
    };
  }
  
  public async createTestGroup(data: NewTestGroupInput): Promise<TestGroup | undefined> {
    // for Test Group
    const testGroup = new TestGroup(data);
    return await testGroup.save();
  }
  public async updateTestGroup(data: NewTestGroupInput): Promise<TestGroup>{
    const {id, ...dataTestGroup} = data;
    const testGroup = await this.findOne({id});
    if(!testGroup){
        throw new ApolloError(`No Test Group found`, 'NOT_FOUND');
    }
    testGroup.updateWith({...dataTestGroup});
    return testGroup;
  }

  public async removeTestGroup(id: string): Promise<DeleteResult>{
    const res = await this.createQueryBuilder()
      .where("id = :id", { id })
      .delete()
      .execute();
    return res;
  }
  
}
