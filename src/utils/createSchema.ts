import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';
import { myAuthChecker } from '../middleware/MyAuthChecker';
import { UserResolver } from '../modules/user/resolvers/UserResolver';
import { PartResolver } from '../modules/part/resolver/PartResolver';
import { QuestionResolver } from '../modules/question/resolver/QuestionResolver';
import { TestResolver } from '../modules/test/resolver/TestResolver';
import { TestCategoryResolver } from '../modules/test/resolver/TestCategoryResolver';
import { AssetResolver } from '../modules/assets/resolvers/AssetResolver';

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
