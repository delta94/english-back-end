process.env.TZ = "UTC";

import { ApolloServer } from "apollo-server-express";
// import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import "reflect-metadata";
import bodyParser from "body-parser";
// import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import express from "express";
// import logger from 'morgan';
import { Container } from "typedi";
import * as TypeORM from "typeorm";
// local imports
import { config } from "./config";
// import { authorizeToken } from './middleware/authorizeToken';
// import v1Router from './RestAPI/v1';
import { createSchema } from "./utils/createSchema";
import _ from "lodash";
import { MiddlewareFn } from "type-graphql";
// import shortid from 'shortid';

// initialize configuration
dotenv.config();

// register 3rd party IOC container
TypeORM.useContainer(Container);

// interface VariablesMap {
//   [key: string]: any;
// }
// const stripPII = (variables: VariablesMap | undefined): VariablesMap | undefined => {
//   if (!variables) {
//     return undefined;
//   }

//   const PIIandSensitiveKeys = ['password'];

//   const deepTransform = (obj: VariablesMap): VariablesMap => {
//     return _.transform(obj, (result, value, key) => {
//       // transform to a new object
//       result[key] = _.isObject(value)
//         ? deepTransform(value)
//         : PIIandSensitiveKeys.includes(key)
//         ? '***'
//         : value;
//     });
//   };

//   return deepTransform(variables);
// };

// const apolloLoggingPlugin: ApolloServerPlugin = {
//   // Fires whenever a GraphQL request is received from a client.
//   requestDidStart(requestContext) {
//     const shortId = shortid();

//     // Too many setsStatus and notifications requests to log...
//     if (
//       requestContext.request.operationName !== 'setsStatus' &&
//       !(
//         requestContext.request.query &&
//         requestContext.request.query.includes('query overdueNotifications')
//       )
//     ) {
//       console.log(
//         `${shortId} `,
//         '(REQUEST) [',
//         requestContext.request.operationName || requestContext.request.query,
//         ']: ',
//         stripPII(requestContext.request.variables)
//       );
//     }

//     return {
//       didEncounterErrors(context) {
//         console.log(
//           `${shortId} `,
//           '(ERROR) [',
//           context.request.operationName,
//           ']: ',
//           context.errors
//         );
//       },

//       /*
//       // Fires whenever Apollo Server will parse a GraphQL
//       // request to create its associated document AST.
//       parsingDidStart(_requestContext) {
//         console.log('Parsing started!');
//       },

//       // Fires whenever Apollo Server will validate a
//       // request's document AST against your GraphQL schema.
//       validationDidStart(_requestContext) {
//         console.log('Validation started!');
//       }
//       */
//     };
//   },
// };

export const ErrorInterceptor: MiddlewareFn<any> = async (
  {
    /*context , info */
  },
  next
) => {
  return next();
  /*
  try {
    return await next();
  } catch (err) {
    // write error to file log
    console.error('ERROR: ', err, '\n  Context: ', context.req);

    // rethrow the error
    throw err;
  }
  */
};

const bootstrap = async () => {
  try {
    // create TypeORM connection
    await TypeORM.createConnection();

    // build TypeGraphQL executable schema
    const schema = await createSchema(Container);

    // Create GraphQL server
    const server = new ApolloServer({
      schema,
      context: ({ req, res }) => ({ req, res }),
      debug: process.env.NODE_ENV !== "production",
      //   plugins: [apolloLoggingPlugin],
      introspection: true, // Turned on for Gatsby build of webinar pages,
      playground: true,
      engine: {
        reportSchema: true,
        debugPrintReports: true,
      },
    });

    const app = express();
    // app.use(logger(process.env.NODE_ENV !== 'local' ? 'tiny' : 'dev'));
    // app.use(cookieParser());
    app.use(bodyParser.urlencoded({ limit: "60mb", extended: true }));
    app.use(bodyParser.json({ limit: "60mb" }));
    // app.use(authorizeToken);

    server.applyMiddleware({ app, cors: config.cors });

    app.use("/healthcheck", require("express-healthcheck")());
    // app.use('/v1', v1Router);
    app.use("/", require("express-healthcheck")());

    const port = config.port;
    app.listen({ port }, () =>
      // tslint:disable-next-line: no-console
      console.log(
        `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
      )
    );
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.error(err);
  }
};

bootstrap();
