import { ApolloError } from 'apollo-server';
import {
  EntityRepository,
    QueryRunner,
    Repository,
    SelectQueryBuilder,
  } from 'typeorm';
import { NewUserInput, User } from './entities/User';
  
type T = User;
class MySelectQueryBuider extends SelectQueryBuilder<T> {}
  
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public createQueryBuilder(_alias?: string, queryRunner?: QueryRunner): MySelectQueryBuider {
    return new MySelectQueryBuider(super.createQueryBuilder('user', queryRunner));
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.createQueryBuilder()
      .andWhere('user.email = :email', { email })
      .getOne();
  }
  public async findById(id: string): Promise<T> {
    const query = this.createQueryBuilder()
      .andWhere('user.id = :id', { id });

    const entity = await query.getOne();

    if (!entity) {
      throw new ApolloError(`Entity not found`, 'NOT_FOUND');
    }

    return entity;
  }
  public async createUser(data: NewUserInput): Promise<User> {
    const user = new User({
      ...data,
      createdAt: new Date(),
    });
    await user.save();
    return user
  }
}
  