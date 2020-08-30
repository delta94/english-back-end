import { Arg, Authorized, FieldResolver, Query, Resolver, Root, Mutation } from 'type-graphql';
import { User, UserInput } from '../entities/User';
// import { MyContext, UserRole } from '../../../types/MyContext';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../UserRepsitory';
// import { MyContext } from '../../../types/MyContext';

@Resolver(_of => User)
export class UserResolver {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  @Authorized()
  @Query(_type => User)
  public async user(@Arg('id') id: string): Promise<User | undefined> {
    return await this.userRepository.findOne(id);
  }

  // @Authorized()
  @Query(_type => [User])
  public async users(): Promise<User[] | undefined> {
    console.log('HELLO', 'OKAY')
    return await this.userRepository.find();
  }

  @Authorized()
  @Mutation(_type => User)
  public async createUser(@Arg('data') data: UserInput): Promise<User> {
    
    const user = new User({
      ...data,
      createdAt: new Date(),
    });
    await user.save();
    return user;
  }

  

  @FieldResolver()
  public async name(@Root() user: User): Promise<string> {
    return [user.firstName, user.lastName].join(' ');
  }
}
