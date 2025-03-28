import { getBaseUrl } from "./getBaseUrl";

/**
 * 更新Cookie的函数
 * @param url - 需要获取Cookie的目标URL
 * @description
 * 1. 获取baseUrl和当前页面URL
 * 2. 将URL存储到chrome.storage
 * 3. 创建新标签页并监听加载状态
 * 4. 获取目标页面的Cookie
 * 5. 将Cookie设置到本地环境
 * 6. 关闭新开启的标签页
 */
export const updateCookie = async (url: string): Promise<void> => {
  try {
    const baseUrl: string = getBaseUrl(url);
    const currentUrl: string = await getCurrentTabUrl();

    await chrome.storage.local.set({ baseUrl, currentUrl });
    console.log("数据已存储");

    await removeCookie(url, "session_id");
    await removeCookie(currentUrl, "session_id");

    const tab = await chrome.tabs.create({ url, active: false });
    console.log("新页面已打开，标签页:", tab);

    await new Promise<void>((resolve) => {
      const listener = async (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo
      ): Promise<void> => {
        if (tabId === tab.id && changeInfo.status === "complete") {
          try {
            console.log("新标签页加载完成");

            // 使用标签页ID获取特定页面的cookie
            const cookie = await getSessionId({ tabId: tab.id });

            if (!cookie) {
              throw new Error("未找到 session_id");
            }

            await chrome.storage.local.set({ sessionId: cookie.value });
            console.log("Cookie 已存储:", cookie);

            await setCookieForLocalhost(cookie.value);
            await chrome.tabs.remove(tabId);
            console.log("新标签页已关闭");

            // 刷新当前页面
            await refreshCurrentPage();

            // 显示全局提醒
            showGlobalNotification("Cookie", "Cookie更新成功，页面已刷新");

            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
          } catch (error) {
            console.error("处理 Cookie 时发生错误:", error);
            await chrome.tabs.remove(tabId);
            chrome.tabs.onUpdated.removeListener(listener);
            showGlobalNotification("Cookie", "Cookie更新失败");
            throw error;
          }
        }
      };

      chrome.tabs.onUpdated.addListener(listener);
    });
  } catch (error) {
    console.error("更新 Cookie 时发生错误:", error);
    showGlobalNotification("Cookie", "Cookie更新失败");
    throw error;
  }
};

/**
 * 显示全局通知
 * @param title - 通知标题
 * @param message - 通知消息
 */
export const showGlobalNotification = (
  title: string,
  message: string,
  autoCloseDelay: number = 1500
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const notificationId = `notification_${Date.now()}`;

      const notificationOptions = {
        type: "basic" as chrome.notifications.TemplateType,
        iconUrl: chrome.runtime.getURL("images/plugins.png"),
        title,
        message,
        priority: 2,
      } satisfies chrome.notifications.NotificationOptions;

      chrome.notifications.create(
        notificationId,
        notificationOptions,
        (createdId) => {
          if (chrome.runtime.lastError) {
            console.error("通知创建失败:", chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            console.log("通知已创建，ID:", createdId);
            resolve();

            // 添加自动关闭定时器
            setTimeout(async () => {
              try {
                chrome.notifications.clear(notificationId);
                console.log("通知已自动关闭");
              } catch (error) {
                console.warn("自动关闭通知时发生错误:", error);
              }
            }, autoCloseDelay);
          }
        }
      );
    } catch (error) {
      console.error("显示通知时发生错误:", error);
      reject(error);
    }
  });
};

/**
 * 获取当前标签页的 URL
 * @returns 当前标签页的 URL
 */
const getCurrentTabUrl = async (): Promise<string> => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tabs.length || !tabs[0].url) {
    throw new Error("未找到活动的标签页");
  }
  return tabs[0].url;
};

/**
 * 获取 sessionId
 * @param params - 获取 sessionId 的参数
 * @returns sessionId
 */
interface GetSessionIdParams {
  /** 基础URL */
  baseUrl?: string;
  /** 标签页ID */
  tabId?: number;
}
export const getSessionId = async ({
  baseUrl,
  tabId,
}: GetSessionIdParams = {}): Promise<chrome.cookies.Cookie | null> => {
  let url: string;

  if (tabId) {
    // 如果提供了标签页ID，获取该标签页的URL
    const tab = await chrome.tabs.get(tabId);
    if (!tab.url) {
      throw new Error("无法获取标签页 URL");
    }
    url = tab.url;
  } else {
    // 否则使用当前活动标签页或baseUrl
    const currentUrl = await getCurrentTabUrl();
    const currentBaseUrl = getBaseUrl(currentUrl);
    url = baseUrl ? baseUrl : currentBaseUrl;
  }

  const cookie = await chrome.cookies.get({
    url,
    name: "session_id",
  });
  return cookie;
};

/**
 * 删除指定 URL 和名称的 Cookie
 * @param url - 目标 URL
 * @param name - Cookie 名称
 * @returns Promise<boolean> - 是否删除成功
 */
export const removeCookie = async (
  url: string,
  name: string
): Promise<boolean> => {
  try {
    await chrome.cookies.remove({ url, name });
    console.log(`已删除 ${name} cookie`);
    return true;
  } catch (error) {
    console.error("删除 Cookie 失败:", error);
    return false;
  }
};

/**
 * 将 Cookie 设置到 localhost
 * @param {string} sessionId - 要设置的 Cookie 值
 * @returns {Promise<void>} 返回一个 Promise
 * @throws {Error} 当 currentUrl 未找到时抛出错误
 */
export const setCookieForLocalhost = async (
  sessionId: string
): Promise<chrome.cookies.Cookie | null> => {
  const { currentUrl } = await chrome.storage.local.get("currentUrl");

  if (!currentUrl) {
    throw new Error("currentUrl 未找到");
  }

  try {
    new URL(currentUrl);
  } catch {
    throw new Error("无效的 URL 格式");
  }

  // 先检查是否存在现有的 session_id cookie
  const existingCookie = await getSessionId({ baseUrl: currentUrl });

  // 如果存在现有cookie，先删除它
  if (existingCookie) {
    await removeCookie(currentUrl, "session_id");
  }

  const cookie = await chrome.cookies.set({
    url: currentUrl,
    name: "session_id",
    value: sessionId,
    path: "/",
    secure: false,
    httpOnly: true,
  });

  if (!cookie) {
    throw new Error("Cookie 设置失败");
  }

  console.log("Cookie 设置成功:", cookie);
  return cookie;
};

/**
 * 刷新当前页面的函数
 * @returns {Promise<boolean | null>} 返回刷新操作结果，失败时返回null
 * @throws {Error} 当刷新操作失败时抛出错误
 * @description
 * 1. 获取当前活动标签页
 * 2. 执行页面刷新操作
 * 3. 处理可能的错误情况
 */
export const refreshCurrentPage = async (): Promise<boolean | null> => {
  try {
    const currentTab = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!currentTab[0]?.id) {
      console.warn("未找到当前活动标签页");
      return null;
    }

    console.log("正在刷新标签页:", currentTab[0].id);
    await chrome.tabs.reload(currentTab[0].id);
    console.log("页面刷新成功");

    return true;
  } catch (error) {
    console.error("刷新页面时发生错误:", error);
    return false;
  }
};
