import type { AxiosRequestConfig } from "axios";

export type RequestFunc = <O = any, D = any>(url: string, params?: any, options?: AxiosRequestConfig<O>) => Promise<D>

export interface RequestArtifactory {
  get: RequestFunc,
  post: RequestFunc,
  put: RequestFunc,
  patch: RequestFunc
}