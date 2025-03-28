/**
 * Promise并发控制
 */
export class ConcurrentExecutor<T extends (...args: unknown[]) => unknown> {
  private readonly defaultFn?: T;
  private readonly limitNum: number; // 最大并发数量
  private promiseTaskQueue: (() => Promise<ReturnType<T>>)[] = [];
  private runningPromise: Promise<ReturnType<T>>[] = []; // 运行中的Promise
  private racePromise: Promise<ReturnType<T>> | null = null; // 竞速promise

  constructor(defaultFn?: T, limit: number = 5) {
    this.limitNum = limit;
    this.defaultFn = defaultFn;
    this.initTask(); // 初始化任务队列
  }

  /**
   * asyncLimit 方法用于执行异步任务并控制并发数。它的主要作用是从任务队列中取出一个任务，并将任务转化为 Promise 实例进行执行
   * @param resolve 成功回调
   * @param reject 失败回调
   */
  asyncLimit(
    resolve: (value: ReturnType<T>) => void,
    reject: (reason?: unknown) => void
  ) {
    const task = this.promiseTaskQueue.shift();
    if (task) {
      const p: Promise<ReturnType<T>> = task();
      const e: Promise<ReturnType<T>> = p
        .then((res: ReturnType<T>) => {
          resolve(res);
          this.runningPromise.splice(this.runningPromise.indexOf(e), 1);
          if (this.promiseTaskQueue.length === 0) {
            this.initTask();
          }
          return res; // 显式返回结果以保持Promise链的类型
        })
        .catch((err: unknown) => {
          reject(err);
          throw err; // 重新抛出错误以保持Promise链的类型
        });
      this.runningPromise.push(e);
      if (this.runningPromise.length >= this.limitNum) {
        this.racePromise = Promise.race(this.runningPromise);
      }
    }
  }

  /**
   * asyncExecute 方法是业务侧用于调用并发控制的函数。它的主要作用是将任务添加到任务队列中，并根据当前是否存在竞速 Promise 进行相应的处理
   * @param item 请求参数
   */
  public asyncExecute(item: string): Promise<ReturnType<T>>;
  public asyncExecute<I extends (...args: unknown[]) => unknown>(item: {
    fn: I;
    value: Parameters<I>[0]; // 使用 Parameters 替代 Func
  }): Promise<ReturnType<I>>;
  public asyncExecute<I extends (...args: unknown[]) => unknown>(
    item: string | { fn: I; value: Parameters<I>[0] }
  ): Promise<ReturnType<T> | ReturnType<I>> {
    return new Promise((resolve, reject) => {
      this.promiseTaskQueue.push(this.getTask(item));
      if (this.racePromise) {
        this.racePromise = this.racePromise.then(async () => {
          this.asyncLimit(resolve, reject);
          return await Promise.race(this.runningPromise);
        });
      } else {
        this.asyncLimit(resolve, reject);
      }
    });
  }

  /**
   * 根据传入的 item，返回一个获取任务的函数。调用后，它会执行传入的处理函数或默认处理函数 并返回一个Promise。
   * @param item 请求参数
   */
  getTask<I extends (...args: unknown[]) => unknown>(
    item: unknown | { fn: I; value: Parameters<I>[0] }
  ): () => Promise<ReturnType<T>> {
    return () =>
      new Promise((resolve) => {
        if (typeof item === "object" && item !== null && "fn" in item) {
          const typedItem = item as { fn: I; value: Parameters<I>[0] };
          resolve(typedItem.fn(typedItem.value) as ReturnType<T>);
        } else {
          if (!this.defaultFn) {
            throw new Error("默认函数未定义");
          }
          resolve(this.defaultFn(item) as ReturnType<T>);
        }
      });
  }

  /**
   * 初始化并发限制相关变量
   * this.promiseTaskQueue ：存储执行中和执行过的 Promise 任务的数组。
   * this.runningPromise ：存储正在执行的 Promise 的数组。
   * this.racePromise ：标志进入竞速状态的 Promise，开始并发限制。
   */
  initTask() {
    this.promiseTaskQueue = []; // 真实执行promise集合
    this.runningPromise = []; // 执行中的promise集合
    this.racePromise = null; // 竞速promise，标志进入
  }
}
