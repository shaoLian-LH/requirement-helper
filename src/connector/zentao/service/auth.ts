import { post } from './http';

export const loginWithAccountInfo = (account: string, pwd: string) => { 
  return post<any, { token?: string }>('/tokens', {
    account: account,
    password: pwd
  });
};