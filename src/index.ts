process.env.TZ = "UTC";

import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import bodyParser from "body-parser";
import httpContext from 'express-http-context';
import dotenv from "dotenv";
import express from "express";
import { Container } from "typedi";
import * as TypeORM from "typeorm";
import cookieParser from 'cookie-parser';
// local imports
import { AuthedContext, AuthedRequest } from './auth/AuthedContext';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { config } from "./config";
import { createSchema } from "./utils/createSchema";
import _ from "lodash";
import { MiddlewareFn } from "type-graphql";
import ImgRouter from "./uploadMulter";
import { authTokenMiddleware } from "./auth/AuthMiddleware";

// import shortid from 'shortid';

// initialize configuration
dotenv.config();

// register 3rd party IOC container
TypeORM.useContainer(Container);

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
      context: ({ req, res }) => new AuthedContext({ req: req as AuthedRequest, res }),
      debug: process.env.NODE_ENV !== "production",
        // plugins: [apolloLoggingPlugin],
      introspection: true, // Turned on for Gatsby build of webinar pages,
      playground: true,
      engine: {
        reportSchema: true,
        debugPrintReports: true,
      },
    });
 
    const app = express();
    // app.use(logger(process.env.NODE_ENV !== 'local' ? 'tiny' : 'dev'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ limit: "60mb", extended: true }));
    app.use(bodyParser.json({ limit: "60mb" }));
    app.use(httpContext.middleware);
    app.use(loggerMiddleware);
    app.use(authTokenMiddleware);
    
    app.use('/public',express.static("public"));
    app.use("/healthcheck", require("express-healthcheck")());
    app.use('/uploads', ImgRouter);
    server.applyMiddleware({ app, cors: config.cors });
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
