import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { Agent } from 'https';


const makeGet = <O = any, D = any>(request: AxiosInstance, url: string, params: D, options?: AxiosRequestConfig) => { 
  return request.get<O, D>(url, { params, ...options });
};

const makePost = <O = any, D = any>(request: AxiosInstance, url: string, data: D, options?: AxiosRequestConfig) => { 
  return request.post<O, D>(url, data, options);
};

const makePut = <O = any, D = any>(request: AxiosInstance, url: string, data: D, options?: AxiosRequestConfig) => { 
  return request.put<O, D>(url, data, options);
};

const makePatch = <O = any, D = any>(request: AxiosInstance, url: string, data: D, options?: AxiosRequestConfig) => { 
  return request.patch<O, D>(url, data, options);
};

export const requestFactory = (
  baseUrl: string,
  interceptors?: {
    request?: (req: AxiosRequestConfig) => AxiosRequestConfig | any,
    response?: (resp: AxiosResponse | any) => any
  }
) => { 
  const instance = axios.create({
    timeout: 3000 * 10,
    responseType: 'json',
    baseURL: (baseUrl || '').replace(/(\/)*$/, ''),
    proxy: false,
    httpsAgent: new Agent({ rejectUnauthorized: false })
  });

  instance.interceptors.response.use((resp) => { 
    return resp.data;
  });

  if (interceptors) { 
    const { request, response } = interceptors;
    if (typeof request === 'function') { 
      instance.interceptors.request.use(request);
    }
    if (typeof response === 'function') { 
      instance.interceptors.response.use(response);
    }
  }

  return {
    get: <O = any, D = any>(url: string, params?: any, options?: AxiosRequestConfig) => makeGet<O, D>(instance, url, params, options),
    post: <O = any, D = any>(url: string, data?: any, options?: AxiosRequestConfig) => makePost<O, D>(instance, url, data, options),
    put: <O = any, D = any>(url: string, data?: any, options?: AxiosRequestConfig) => makePut<O, D>(instance, url, data, options),
    patch: <O = any, D = any>(url: string, data?: any, options?: AxiosRequestConfig) => makePatch<O, D>(instance, url, data, options),
  };
};



