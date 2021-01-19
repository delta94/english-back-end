import {
  Arg,
  ArgumentValidationError,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { Me, User, UpdateMeInput, MeWithTokens } from '../entities/User';
import { AuthedContext } from '../../../auth/AuthedContext';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { hashPassword } from '../../../utils/hashPassword';
import { UserRepository } from '../UserRepsitory';
import { AssertNonNull } from '../../../utils/NullableType';

@Resolver(_of => Me)
export class MeResolver {
  public constructor(
    @InjectRepository(User) private readonly UserRepository: UserRepository,
  ) {}

  @Authorized()
  @Query(_returns => Me, { nullable: true })
  public async me(@Ctx() ctx: AuthedContext): Promise<Me | undefined> {
    console.log('aaaaa', ctx.userAuth())
    const auth = ctx.userAuth();
    if(!auth){
      return undefined;
    }
    const me = (await this.UserRepository.findOne(auth.userId) as MeWithTokens);
    me.impersonatingUser = auth.impersonatingUser;

    return me;
  }

  @Authorized()
  @Mutation(_returns => Me)
  public async updateMe(@Arg('data') data: UpdateMeInput, @Ctx() ctx: AuthedContext): Promise<Me> {
    const user = data;
   
    const auth = ctx.userAuth();

    const userId = AssertNonNull(auth.userId);

    const UserRepository = this.UserRepository;
    const me = await UserRepository.findById(userId);

    if (me.email !== user.email) {
      const emailExists = await this.UserRepository.findOne({ email: user.email });
      if (emailExists) {
        throw new ArgumentValidationError([
          {
            property: 'email',
            constraints: { email: `There is already an account associated with this email.` },
            children: [],
          },
        ]);
      }

      await me.updateWith(
        {
          ...user,
          isVerified: false,
        }
      );
    } else if (!me.password && user.password) {
      await me.updateWith(
        {
          ...user,
          password: await hashPassword(user, user.password),
        },
      );
    } else {
      await me.updateWith(user);
    }

    const newMe = (await this.UserRepository.findOneOrFail(auth.userId)) as MeWithTokens;
    newMe.impersonatingUser = auth.impersonatingUser;

    return newMe;
  }

 
}
