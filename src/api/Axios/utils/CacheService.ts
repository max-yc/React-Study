import { RequestConfig } from "@/api/Axios/types/index.d";
import StorageData from "@/api/Axios/utils/StorageData";

// 添加类型定义
interface StoredData<T> {
  value: T;
  expiration: number;
}

class CacheService {
  protected config: RequestConfig | undefined;
  protected storageData: StorageData;
  private dbName = "CacheDB";
  private storeName = "cache";
  private db: IDBDatabase | null = null;

  constructor(config?: RequestConfig) {
    this.config = config;
    this.storageData = StorageData.getInstance(); // 本地变量存储
  }

  /**
   * 判断是否缓存
   * @param needCache 是否缓存
   * @param cacheKey key值
   */
  public determineCache(needCache: boolean, cacheKey: string) {
    // 判断是否需要缓存
    if (needCache) {
      const storage = this.getStorage(cacheKey);
      if (storage) {
        const currentStatus = this.storageData.statusMap.get(cacheKey);

        // 判断当前的接口缓存状态，如果是 complete ，则代表缓存完成
        if (currentStatus === "complete") {
          return this.config?.storage === "indexDB"
            ? storage
            : Promise.resolve(storage);
        }

        // 如果是 pending ，则代表正在请求中，这里放入回调函数
        if (currentStatus === "pending") {
          return new Promise((resolve, reject) => {
            if (this.storageData.callbackMap.has(cacheKey)) {
              this.storageData.callbackMap.get(cacheKey)!.push({
                onSuccess: resolve,
                onError: reject,
              });
            } else {
              this.storageData.callbackMap.set(cacheKey, [
                {
                  onSuccess: resolve,
                  onError: reject,
                },
              ]);
            }
          });
        }
      }

      this.storageData.statusMap.set(cacheKey, "pending");
    }
  }

  /**
   * 触发回调
   * @param cacheKey key值
   * @param successOrFailure 成功 | 失败
   * @param response 返回值
   */
  public triggerACallback<T>(
    cacheKey: string,
    successOrFailure: "success" | "fail",
    response: T
  ) {
    if (this.storageData.callbackMap.has(cacheKey)) {
      this.storageData.callbackMap.get(cacheKey)!.forEach((callback) => {
        if (successOrFailure === "success") {
          callback.onSuccess(response);
        }
        if (successOrFailure === "fail") {
          callback.onError(response);
        }
      });
      // 缓存：调用完成后清掉
      this.storageData.callbackMap.delete(cacheKey);
    }
  }

  /**
   * 获取储存
   * @param key 键值
   */
  public getStorage(key: string) {
    const storage = this.config?.storage;
    switch (storage) {
      case "localStorage":
      case "sessionStorage":
        return JSON.parse(<string>window[storage].getItem(key));
      case "indexDB": {
        return this.retrieveIndexDB(key);
      }
      default:
        return this.storageData.cacheMap.get(key);
    }
  }

  /**
   * 修改储存
   * @param key 键值
   * @param response 储存值
   */
  public setStorage<T>(key: string, response: T) {
    if (response) {
      const storage = this.config?.storage;
      switch (storage) {
        case "localStorage":
        case "sessionStorage":
          window[storage].setItem(key, JSON.stringify(response || ""));
          return;
        case "indexDB":
          return this.storeIndexDB(key, response);
        default:
          this.storageData.cacheMap.set(key, response);
      }
    }
  }

  /**
   * 初始化 IndexedDB
   */
  private async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  /**
   * IndexDB 存储数据并设置过期时间
   */
  async storeIndexDB<T>(
    key: string,
    value: T,
    expiration: number = 86400000
  ): Promise<void> {
    const db = await this.initDB();
    const transaction = db.transaction(this.storeName, "readwrite");
    const store = transaction.objectStore(this.storeName);

    const data: StoredData<T> = {
      value,
      expiration: Date.now() + expiration,
    };

    return new Promise((resolve, reject) => {
      const request = store.put(data, key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * IndexDB 获取数据并检查过期时间
   */
  async retrieveIndexDB<T>(key: string): Promise<T | null> {
    const db = await this.initDB();
    const transaction = db.transaction(this.storeName, "readonly");
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const data = request.result as StoredData<T> | undefined;

        if (data && Date.now() < data.expiration) {
          resolve(data.value);
        } else if (data) {
          // 数据过期，删除并返回 null
          this.deleteFromIndexDB(key).finally(() => resolve(null));
        } else {
          resolve(null);
        }
      };
    });
  }

  /**
   * 从 IndexedDB 删除数据
   */
  private async deleteFromIndexDB(key: string): Promise<void> {
    const db = await this.initDB();
    const transaction = db.transaction(this.storeName, "readwrite");
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * 清理过期数据
   */
  async clearExpiredData(): Promise<void> {
    const db = await this.initDB();
    const transaction = db.transaction(this.storeName, "readwrite");
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.openCursor();
      const now = Date.now();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          const data = cursor.value as StoredData<unknown>;
          if (data.expiration < now) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }
}

export default CacheService;
