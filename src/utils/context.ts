import { AuthedContext } from '../auth/AuthedContext';
import httpContext from 'express-http-context';

export const useContext = (): AuthedContext => {
  const req = httpContext.get('req');
  const res = httpContext.get('res');
  return {
    req,
    res
  };
};
