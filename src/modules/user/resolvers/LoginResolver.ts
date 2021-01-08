import { ApolloError, AuthenticationError } from 'apollo-server-core';
// import * as bcrypt from 'bcryptjs';
import {
  Arg,
  Authorized,
  Directive,
  Ctx,
  Mutation,
  Resolver,
} from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { getCustomRepository } from 'typeorm';
import { TokenRepository } from '../TokenRepository';

import { ChangePasswordInput, Me, MeWithTokens, User } from '../entities/User';
import { LoginCookies } from './LoginCookies';
import { AuthedContext } from '../../../auth/AuthedContext';
import { hashPassword } from '../../../utils/hashPassword';
import { UserRepository } from '../UserRepsitory';
// import { sendConfirmationEmail, sendResetPasswordEmail } from '../../../utils/sendEmail/UserEmails';
// import {
//   sendInvitationAcceptedEmail,
//   sendInvitationDeclinedEmail,
// } from '../../../utils/sendEmail/TeamEmails';
// import eventsDispatcher from '../../events/EventDispatcher';


@Resolver(_of => Me)
export class LoginResolvers {
  public constructor(
    @InjectRepository(User) private readonly UserRepository: UserRepository,
  ) {}

  @Directive(`@rateLimit(
      window: "60s",
      max: 10,
      message: "Too many logins attempted. Please try again later."
  )`)
  @Directive(`@cost(complexity: 4)`)
  @Mutation(_returns => Me)
  public async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: AuthedContext
  ): Promise<Me> {
    const me = (await this.UserRepository.findOne({ email }));
    
    if (!me) {
      throw new AuthenticationError("Sorry, that email and password didn't work.");
    }
    if (!me.password) {
      throw new ApolloError(`Sorry, that password can not empty.`);
    }
    const role = me.role;
    if(password !== me.password){
      throw new AuthenticationError("Sorry, that email and password didn't work.");
    } 
    // const valid = await bcrypt.compare(password, me.password);
    // if (!valid) {
    //   throw new AuthenticationError("Sorry, that email and password didn't work.");
    // }

    // Make sure if we've ever had an issue with verification or subscription that we correct that on login
    

    // set token cookies
    LoginCookies.setAccessCookiesAndContext(me as MeWithTokens, role, ctx.req, ctx.res);
    return me;
  }

  @Authorized()
  @Mutation(_returns => Boolean)
  public async logout(@Ctx() ctx: AuthedContext): Promise<boolean> {
    LoginCookies.removeAccessCookies(ctx);
    return true;
  }





  // @Authorized()
  // @Mutation(_returns => User)
  // public async skipVerifyEmail(@Ctx() ctx: AuthedContext): Promise<User> {
  //   if (process.env.NODE_ENV === 'production') {
  //     throw new Error('ERROR: function only allow on development environments');
  //   }
  //   const auth = ctx.userAuth();

  //   const user = await this.UserRepository.findOneOrFail(auth.userId);
  //   const team = await this.teamRepository.findOneOrFail(auth.teamId);

  //   return await this.verifyUserAndVerifyTeamSubscription(user, team);
  // }

  // @Authorized()
  // @Mutation(_returns => String)
  // public async resendConfirmationEmail(@Ctx() ctx: AuthedContext): Promise<string> {
  //   const auth = ctx.userAuth();

  //   const user = await this.UserRepository.findOneOrFail(auth.userId);
  //   let inviteToken = user.confirmationInvite;

  //   if (!inviteToken) {
  //     inviteToken = generateToken(32);
  //     await this.UserRepository.update(user.id, {
  //       confirmationInvite: inviteToken,
  //     });
  //   }

  //   await sendConfirmationEmail(user, inviteToken);
  //   return 'Confirmation email sent again';
  // }

  // @Mutation(_type => String)
  // public async resetPassword(@Arg('email') email: string): Promise<string> {
  //   const user = await this.UserRepository.findByEmail(email);
  //   if (!user) {
  //     return 'If you\'re an existing user, please see your Inbox for a Password reset email.';
  //   }
  //   const expiresAt = new Date();
  //   expiresAt.setMinutes(expiresAt.getMinutes() + 30);

  //   const token = await getCustomRepository(TokenRepository).generateResetToken(
  //     expiresAt,
  //     'User',
  //     user.id,
  //     'reset-password'
  //   );

  //   void sendResetPasswordEmail(user, token);

  //   return 'If you\'re an existing user, please see your Inbox for a Password reset email.';
  // }

  @Mutation(_type => Me)
  public async changePassword(
    @Arg('data') changePasswordData: ChangePasswordInput,
    @Ctx() ctx: AuthedContext
  ): Promise<Me> {
    const user = await this.UserRepository.findOne({ email: changePasswordData.email });
    if (!user) {
      throw new ApolloError(`Invalid password reset attempt.`);
    }
    const role = user.role;
    const resetToken = await getCustomRepository(TokenRepository).findOne({
      targetType: 'User',
      targetID: user.id,
      tokenType: 'reset-password',
      token: changePasswordData.token,
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new ApolloError(
        'Your password reset attempt has expired.  Please start the password reset process again.'
      );
    }


    user.password = await hashPassword(user, changePasswordData.password);
    await this.UserRepository.save(user);
    await getCustomRepository(TokenRepository).delete(resetToken.id);

    const me = user as Me;
    // set token cookies
    LoginCookies.setAccessCookiesAndContext(
      me as MeWithTokens,
      role,
      ctx.req,
      ctx.res
    );

    return me;
  }


 
}
