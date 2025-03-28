import { FcRequestConfig, FcResponse, RequestConfig } from "./types";
import Request from "@/api/Axios/method";

/**
 * @description: 函数的描述
 * @interface D 请求参数的interface
 * @interface T 响应结构的intercept
 * @param {FcRequestConfig} config 不管是GET还是POST请求都使用data
 * @param {Request} instance 外部实例
 * @param {RequestConfig} instanceConfig 外部实例配置
 * @returns {Promise} 响应
 *
 * 注意：blob格式的响应结果不支持本地缓存，请使用本地window缓存
 */
type FC_SERVER = {
  <D, T = unknown>(config: FcRequestConfig<D>): Promise<FcResponse<T>>;
  <D, T = unknown>(config: FcRequestConfig<D>, instance: Request): Promise<
    FcResponse<T>
  >;
  <D, T = unknown>(
    config: FcRequestConfig<D>,
    instanceConfig: RequestConfig
  ): Promise<FcResponse<T>>;
};
const server: FC_SERVER = <D, T = unknown>(
  config: FcRequestConfig<D>,
  params?: Request | RequestConfig
): Promise<FcResponse<T>> => {
  const { method = "GET" } = config;
  if (method === "get" || method === "GET") config.params = config.data;
  const AxiosInstance =
    params instanceof Request
      ? params
      : new Request((params as RequestConfig) || {});
  return AxiosInstance.request<FcResponse<T>>(config);
};

export default server;
