import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { authErrMap, errStatus } from "@api/Axios/utils";

/**
 * 请求拦截器
 */
export interface RequestInterceptors {
  // 请求拦截
  requestInterceptors?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig;
  requestInterceptorsCatch?: (err: unknown) => unknown;
  // 响应拦截
  responseInterceptors?: <T = AxiosResponse>(config: T) => T;
  responseInterceptorsCatch?: (err: unknown) => unknown;
}

/**
 * 自定义请求配置
 */
export interface RequestConfig extends InternalAxiosRequestConfig {
  headers?: AxiosRequestHeaders;
  storage?: "indexDB" | "localStorage" | "sessionStorage" | "window"; // 储存方式，默认window
  cache?: boolean; // 是否需要缓存
  retry?: boolean; // 是否需要重试
  retryDelay?: number; // 重试延迟
  interceptors?: RequestInterceptors; // 实例方法拦截器
  cancelRequest?: boolean; // 取消请求
}

/**
 * 请求方式
 */
export type RequestWay<T = unknown, R = AxiosResponse<T>, D = unknown> = (
  config: AxiosResponse<D>
) => Promise<R>;

/**
 * 取消请求源
 */
export interface CancelRequestSource {
  [index: string]: () => void;
}

/**
 * 网络错误
 */
export type ErrStatusType = typeof errStatus;
export type ErrStatusKey = keyof typeof errStatus;
export type ErrStatusValue = ErrStatusType[ErrStatusKey];

/**
 * 身份错误
 */
export type AuthErrMapType = typeof authErrMap;
export type AuthErrMapKey = keyof typeof authErrMap;
export type AuthErrMapValue = AuthErrMapType[AuthErrMapKey];

/**
 * 请求结构
 */
interface FcRequestConfig<T> extends RequestConfig {
  data?: T;
}

/**
 * 响应结构
 */
export interface FcResponse<T> {
  code: CodeStatus;
  data: T;
  msg: string;
  [key: string]: T;
}

/**
 * 缓存回调格式
 */
export interface RequestCallback {
  onSuccess: (data: unknown) => void;
  onError: (error: unknown) => void;
}

/**
 * 返回 code 码
 */
export enum CodeStatus {
  Error = 0,
  Success = 200,
}
