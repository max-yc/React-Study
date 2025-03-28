import { RequestConfig } from "@/api/Axios/types/index.d";
import Axios, { AxiosResponse, AxiosStatic } from "axios";
import { generateCacheKey, isJsonStr } from "@/api/Axios/utils";
import StorageData from "@/api/Axios/utils/StorageData";

class AxiosExtend {
  protected storageData: StorageData;

  constructor() {
    this.storageData = StorageData.getInstance(); // 本地变量存储
  }

  /**
   * 取消重复请求：添加待处理请求
   * @param config 配置项
   */
  public addPendingRequest(config: RequestConfig) {
    const { url, params, cancelRequest } = config;
    if (cancelRequest) {
      const requestKey = generateCacheKey(url || "", params);
      if (this.storageData.pendingRequest.has(requestKey)) {
        config.cancelToken = new Axios.CancelToken((cancel) => {
          // cancel 函数的参数会作为 promise 的 error 被捕获
          cancel(`${url} 请求已取消`);
        });
      } else {
        config.cancelToken =
          config.cancelToken ||
          new Axios.CancelToken((cancel) => {
            this.storageData.pendingRequest.set(requestKey, cancel);
          });
      }
    }
  }

  /**
   * 取消重复请求：删除待处理请求
   * @param response 响应体
   */
  public removePendingRequest(
    response: AxiosResponse & { config: RequestConfig }
  ) {
    if (response?.config?.cancelRequest) {
      const requestKey = generateCacheKey(
        response.config.url || "",
        response.config.params
      );
      // 判断是否有这个 key
      if (this.storageData.pendingRequest.has(requestKey)) {
        const cancelToken = this.storageData.pendingRequest.get(requestKey);
        cancelToken(requestKey);
        this.storageData.pendingRequest.delete(requestKey);
      }
    }
  }

  /**
   * 取消单个pending请求
   * @param url 请求URL
   * @param params 请求参数
   */
  public cancelPending<T extends Record<string, unknown>>(
    url: string,
    params: T
  ): void {
    const requestKey = generateCacheKey(url || "", params);
    if (this.storageData.pendingRequest.has(requestKey)) {
      const cancel = this.storageData.pendingRequest.get(requestKey);
      cancel(`${url} 请求已取消`);
      this.storageData.pendingRequest.delete(requestKey);
    }
  }

  /**
   * 清空pending请求(退出页面时)
   */
  public clearAllPending() {
    for (const [, cancel] of this.storageData.pendingRequest) {
      cancel("cancel request");
    }
    this.storageData.pendingRequest.clear();
  }

  /**
   * 错误重新请求
   * @param err AxiosError类型的错误对象
   * @param axios axios实例
   */
  public againRequest(
    err: {
      config: RequestConfig & {
        retry?: number;
        retryDelay?: number;
        __retryCount?: number;
      };
    },
    axios: AxiosStatic
  ): Promise<AxiosResponse> {
    const config = err.config;
    // config.retry 具体接口配置的重发次数
    if (!config || !config.retry) return Promise.reject(err);

    // 设置用于记录重试计数的变量 默认为0
    config.__retryCount = config.__retryCount || 0;

    // 判断是否超过了重试次数
    if (config.__retryCount >= config.retry) {
      return Promise.reject(err);
    }
    // 重试次数
    config.__retryCount += 1;

    // 延时处理
    const backoff = new Promise<void>(function (resolve) {
      setTimeout(function () {
        resolve();
      }, config.retryDelay || 1000);
    });

    // 重新发起axios请求
    return backoff.then(function () {
      // 判断是否是JSON字符串
      // TODO: 未确认config.data再重发时变为字符串的原因
      if (config.data && isJsonStr(config.data)) {
        config.data = JSON.parse(config.data);
      }
      return axios(config);
    });
  }
}

export default AxiosExtend;
