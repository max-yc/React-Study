import Axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  FcResponse,
  RequestConfig,
  RequestInterceptors,
} from "@/api/Axios/types/index.d";
import {
  generateCacheKey,
  handleAuth,
  handleAuthError,
  handleGeneralError,
  handleNetworkError,
  handleRequestHeader,
} from "@/api/Axios/utils";
import AxiosExtend from "@/api/Axios/utils/AxiosExtend";
import StorageData from "@/api/Axios/utils/StorageData";
import CacheService from "@/api/Axios/utils/CacheService";

/**
 * Axios请求
 * 功能--->>>
 * 拦截：类拦截器
 * 			实例拦截器
 * 			接口拦截器
 * 缓存
 * 取消请求
 * 错误重新请求
 */
class Request {
  protected storageData: StorageData; // 数据存储
  private instance: AxiosInstance; // Axios 实例
  private interceptorsObj?: RequestInterceptors; // 拦截器对象

  constructor(config: RequestConfig) {
    // 添加基础URL配置
    const baseConfig = {
      ...config,
      baseURL: import.meta.env.VITE_API_BASE_URL, // 添加基础URL
    };
    this.instance = Axios.create(baseConfig);
    this.interceptorsObj = config.interceptors;
    this.storageData = StorageData.getInstance(); // 本地变量存储
    const axiosExtend = new AxiosExtend();

    // 全局请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        handleRequestHeader(config);
        handleAuth(config);
        axiosExtend.addPendingRequest(config); // 把当前请求信息添加到pendingRequest对象中
        return config;
      },
      (err: unknown) => err
    );

    // 使用实例拦截器
    this.instance.interceptors.request.use(
      this.interceptorsObj?.requestInterceptors,
      this.interceptorsObj?.requestInterceptorsCatch
    );
    this.instance.interceptors.response.use(
      this.interceptorsObj?.responseInterceptors,
      this.interceptorsObj?.responseInterceptorsCatch
    );

    // 全局响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.status !== 200) {
          if (response.config?.url) {
            // 缓存：不成功则删掉 statusMap 中的状态，下次请求重新请求
            this.storageData.statusMap.delete(response.config.url);
          }
          return Promise.reject(response.data);
        }
        // 响应正常时候就从pendingRequest对象中移除请求
        axiosExtend.removePendingRequest(response);
        handleAuthError(response.data.errno);
        handleGeneralError(response.data.errno, response.data.errmsg);
        return response;
      },
      (err) => {
        // 从pending 列表中移除请求
        axiosExtend.removePendingRequest(err.config || {});
        // 需要特殊处理请求被取消的情况
        if (!Axios.isCancel(err)) {
          // 请求重发
          return axiosExtend.againRequest(err, Axios);
        }
        return err;
      }
    );
  }

  /**
   * 请求方法
   * @param config 配置项
   */
  request<T>(config: RequestConfig): Promise<T> {
    const cacheService = new CacheService(config);
    return new Promise((resolve, reject) => {
      // 单个请求设置拦截器，这里使用单个请求的拦截器
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(
          config as InternalAxiosRequestConfig
        );
      }
      const { url, method = "GET", cache, params } = config;
      const CacheKey = generateCacheKey<T>(url || "", params);
      // 判断缓存
      if (
        url &&
        (method === "GET" ||
          method === "get" ||
          method === "POST" ||
          method === "post")
      ) {
        const cacheRes = cacheService.determineCache(!!cache, CacheKey);
        if (cacheRes)
          return cacheRes.then((r: T) => {
            if (r) {
              return resolve(r);
            } else {
              // 为处理返回Promise为空的情况
              this.handleRequest<T>(
                config,
                CacheKey,
                cacheService,
                resolve,
                reject
              );
            }
          });
      }
      this.handleRequest<T>(config, CacheKey, cacheService, resolve, reject);
    });
  }

  handleRequest<T>(
    config: RequestConfig,
    CacheKey: string,
    cacheService: CacheService,
    resolve: (value: PromiseLike<T> | T) => void,
    reject: (reason?: unknown) => void
  ) {
    const { url, cache } = config;
    this.instance
      .request<unknown, T>(config)
      .then((res) => {
        // 单个响应设置拦截器，这里使用单个响应的拦截器
        if (config.interceptors?.responseInterceptors) {
          res = config.interceptors.responseInterceptors(res);
        }
        if (url && cache) {
          // 缓存：成功进行缓存
          this.storageData.statusMap.set(CacheKey, "complete");
          cacheService.setStorage(CacheKey, (res as FcResponse<T>).data);
          // 缓存：触发resolve的回调函数
          cacheService.triggerACallback(CacheKey, "success", res);
        }
        resolve((res as FcResponse<T>).data);
      })
      .catch((err) => {
        if (url && cache) {
          // 缓存：不成功则删掉 statusMap 中的状态，下次请求重新请求
          this.storageData.statusMap.delete(CacheKey);
          // 缓存：触发resolve的回调函数
          cacheService.triggerACallback(CacheKey, "fail", err);
        }
        handleNetworkError(err.response);
        reject(err);
      });
  }
}

export default Request;
