import { Arg, Authorized, FieldResolver, Query, Resolver, Root, Mutation } from 'type-graphql';
import { NewUserInput, User } from '../entities/User';
// import { MyContext, UserRole } from '../../../types/MyContext';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../UserRepsitory';
// import { UserRepository } from '../UserRepository';
// import { MyContext } from '../../../types/MyContext';

@Resolver(_of => User)
export class UserResolver {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: UserRepository,
  ) {}

  @Authorized()
  @Query(_type => User)
  public async user(@Arg('id') id: string): Promise<User | undefined> {
    return await this.UserRepository.findOne(id);
  }

  @Authorized()
  @Query(_type => [User])
  public async users(): Promise<User[] | undefined> {
    return await this.UserRepository.find();
  }

  @Authorized()
  @Mutation(_type => User)
  public async createUser(@Arg('data') data: NewUserInput): Promise<User> {
    console.log('ALOOOOO')
    return await this.UserRepository.createUser(data);
  }

  

  @FieldResolver()
  public async name(@Root() user: User): Promise<string> {
    return [user.firstName, user.lastName].join(' ');
  }

  @Query(_returns => Boolean)
  public async isEmailAlreadyExist(@Arg('email') email: string): Promise<boolean> {
    const user = await this.UserRepository.findByEmail(email);
    return Boolean(user);
  }
}
