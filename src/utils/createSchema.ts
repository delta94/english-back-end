import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';
import { myAuthChecker } from '../middleware/MyAuthChecker';
import { UserResolver } from '../modules/user/resolvers/UserResolver';
import { PartResolver } from '../modules/part/resolver/PartResolver';
import { QuestionResolver } from '../modules/question/resolver/QuestionResolver';
import { TestResolver } from '../modules/test/resolver/TestResolver';
import { TestCategoryResolver } from '../modules/test/resolver/TestCategoryResolver';
import { AssetResolver } from '../modules/assets/resolvers/AssetResolver';
import { TestQuestionResolver } from '../modules/testQuestion/resolver/TestQuestionResolver';
import { TestGroupResolver } from '../modules/test/resolver/TestGroupResolver';
import { LoginResolvers } from '../modules/user/resolvers/LoginResolver';
import { MeResolver } from '../modules/user/resolvers/MeResolvers';

export const createSchema = (container: any): Promise<GraphQLSchema> => {
  return buildSchema({
    container,
    resolvers: [
      AssetResolver,
      PartResolver,
      UserResolver,
      QuestionResolver,
      TestResolver,
      TestCategoryResolver,
      TestQuestionResolver,
      TestGroupResolver,
      LoginResolvers,
      MeResolver,
    ],
    authChecker: myAuthChecker,
    emitSchemaFile: {
      path: __dirname + '/../schema.gql',
      commentDescriptions: true,
    },
    globalMiddlewares: [
      /*ErrorInterceptor*/
    ],
  });
};
