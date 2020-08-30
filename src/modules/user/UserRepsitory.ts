import {
    EntityRepository,
    QueryRunner,
    Repository,
    SelectQueryBuilder,
  } from 'typeorm';
import { User } from './entities/User';
  
  type T = User;
  
  class MySelectQueryBuider extends SelectQueryBuilder<T> {
    // public scopeInTeam(teamId: string): MySelectQueryBuider {
    //   return this.innerJoin('user.teamRelations', 'relation', 'relation.team = :teamId', { teamId });
    // }
  }
  
  @EntityRepository(User)
  export class UserRepository extends Repository<User> {
    public createQueryBuilder(_alias?: string, queryRunner?: QueryRunner): MySelectQueryBuider {
      return new MySelectQueryBuider(super.createQueryBuilder('user', queryRunner));
    }
  
   
  }
  