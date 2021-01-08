import _ from 'lodash';
import shortid from 'shortid';
import httpContext from 'express-http-context';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { Request, Response, NextFunction } from 'express';
import onFinished from 'on-finished';
// import onHeaders from 'on-headers';

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

const calcResponseTime = (
  req: { _startAt: number[] },
  res: { _startAt: number[] },
  digits: number = 3
): string | undefined => {
  if (!req._startAt || !res._startAt) {
    return undefined;
  }

  // return truncated value
  return (
    (res._startAt[0] - req._startAt[0]) * 1e3 +
    (res._startAt[1] - req._startAt[1]) * 1e-6
  ).toFixed(digits);
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

  // onHeaders(res, () => recordStartTime(res));

  onFinished(res, () => {
    if (
      req.method === 'OPTIONS' ||
      (req.path === '/' && res.statusCode === 200) ||
      ignoredOperators.indexOf(req.body.operationName) !== -1
    ) {
      return;
    }

    const responseTime = calcResponseTime(req, res as any);

    const msg = `${req.method}:${req.body.operationName || req.path}`;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = {
      status: res.statusCode,
      responseTime: responseTime ? `${responseTime}ms` : undefined,
      ...(!req.body.operationName
        ? {
            ...req.body,
            ...req.params,
          }
        : {}),
    };

    if (res.statusCode < 200 && res.statusCode > 299) {
      console.error(msg, payload);
    } else {
      console.info(msg, payload);
    }
  });

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
