import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';
import { myAuthChecker } from '../middleware/MyAuthChecker';
// import { ConversationResolver } from '../modules/chat/resolvers/ConversationResolver';
// import { AttendeeResolvers } from '../modules/attendee/resolvers/AttendeeResolvers';
// import { InteractionResolvers } from '../modules/interaction/resolvers/InteractionResolvers';
// import { NotificationsResolver } from '../modules/notification/resolvers/NotificationsResolver';
// import { LoginResolvers } from '../modules/user/resolvers/LoginResolvers';
import { UserResolver } from '../modules/user/resolvers/UserResolver';
// import { EWebinarResolver } from '../modules/ewebinar/resolvers/EWebinarResolver';
// import { EWebinarSetResolver } from '../modules/ewebinarSet/resolvers/EWebinarSetResolver';
// import { AnalyticsResolvers } from '../modules/analytics/resolvers/AnalyticsResolvers';
// import { MeResolver } from '../modules/user/resolvers/MeResolvers';
// import { EWebinarFieldResolvers } from '../modules/ewebinar/resolvers/EWebinarFieldResolvers';
// import { TeamResolver } from '../modules/team/resolvers/TeamResolver';
// import { TestResolvers } from '../modules/tester/resolvers/TestResolver';
// import { InvoiceResolver } from '../modules/invoice/resolvers/InvoiceResolver';
// import { MessageResolver } from '../modules/chat/resolvers/MessageResolver';
// import { ReactionResolver } from '../modules/reaction/resolvers/reactionResolvers';

export const createSchema = (container: any): Promise<GraphQLSchema> => {
  return buildSchema({
    container,
    resolvers: [
    //   EWebinarResolver,
    //   EWebinarFieldResolvers,
    //   EWebinarSetResolver,
    //   NotificationsResolver,
    //   InteractionResolvers,
    //   AttendeeResolvers,
    //   InvoiceResolver,
    //   MessageResolver,
    //   ConversationResolver,
    //   TeamResolver,
    //   TestResolvers,
      UserResolver,
    //   MeResolver,
    //   LoginResolvers,
    //   AnalyticsResolvers,
    //   ReactionResolver,
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
