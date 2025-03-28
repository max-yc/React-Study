import { RequestCallback } from "@/api/Axios/types/index.d";

class StorageData {
  private static instance: StorageData;

  // 取消重复请求
  public pendingRequest = new Map();

  // 存储缓存数据
  public cacheMap: Map<string, unknown> = new Map();

  // 存储缓存当前状态
  public statusMap: Map<string, "pending" | "complete"> = new Map();

  // 存放等待状态的请求回调
  public callbackMap: Map<string, RequestCallback[]> = new Map();

  // 私有构造函数确保单例模式
  private constructor() {}

  // 获取 StorageData 实例
  public static getInstance(): StorageData {
    if (!StorageData.instance) {
      StorageData.instance = new StorageData();
    }
    return StorageData.instance;
  }
}

export default StorageData;
