import _ from 'lodash';
import shortid from 'shortid';
import httpContext from 'express-http-context';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { Request, Response, NextFunction } from 'express';
import onHeaders from 'on-headers';

const ignoredOperators = ['setsStatus', 'IntrospectionQuery'];

interface VariablesMap {
  [key: string]: any;
}
const stripPII = (variables: VariablesMap | undefined): VariablesMap | undefined => {
  if (!variables) {
    return undefined;
  }

  const PIIandSensitiveKeys = ['password'];

  const deepTransform = (obj: VariablesMap): VariablesMap => {
    return _.transform(obj, (result, value, key) => {
      // transform to a new object
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      result[key] = _.isObject(value)
        ? deepTransform(value)
        : PIIandSensitiveKeys.includes(key)
        ? '***'
        : value;
    });
  };

  return deepTransform(variables);
};


export interface LoggedResponse<ResBody = any> extends Response<ResBody> {
  _startAt: number[];
}

export interface LoggedRequest<ReqBody = any> extends Request<any, any, ReqBody, any> {
  _startAt: number[];

  logId: string;
}

const recordStartTime = (req: LoggedRequest | LoggedResponse) => {
  req._startAt = process.hrtime();
};

export const loggerMiddleware = async (
  sreq: Request,
  sres: Response<any>,
  next: NextFunction
): Promise<void> => {
  const res = sres as LoggedResponse;
  const req = sreq as LoggedRequest;

  req.logId = shortid();

  httpContext.set('req', req);
  httpContext.set('res', res);

  recordStartTime(req);
  next();

  onHeaders(res, () => recordStartTime(res));

};

export const apolloLoggingPlugin: ApolloServerPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  requestDidStart(requestContext) {
    // Too many setsStatus and notifications requests to log...
    if (
      requestContext.request.operationName &&
      ignoredOperators.indexOf(requestContext.request.operationName) === -1 &&
      !(
        requestContext.request.query &&
        requestContext.request.query.includes('query overdueNotifications')
      )
    ) {
      console.info(
        `graphql:${requestContext.request.operationName || requestContext.request.query}`,
        stripPII(requestContext.request.variables),
        -1
      );
    }

    return {
      didEncounterErrors(context) {
        console.error(`graphql:${context.request.operationName}`, context.errors, -1);
      },

      /*
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      parsingDidStart(_requestContext) {
        console.log('Parsing started!');
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      validationDidStart(_requestContext) {
        console.log('Validation started!');
      }
      */
    };
  },
};
