import qs from "qs";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { message } from "antd";
import { AuthErrMapKey, CodeStatus } from "@/api/Axios/types/index.d";
import server from "@/api/Axios";

/**
 * 错误状态
 */
export const errStatus = {
  301: "资源URL永久重定向",
  302: "资源URL临时重定向",
  400: "错误的请求",
  401: "未授权，请重新登录",
  403: "拒绝访问，没有访问此接口的权限",
  404: "请求错误,未找到该资源",
  405: "请求方法未允许",
  408: "请求超时",
  500: "服务器端出错",
  501: "网络未实现",
  502: "网络错误",
  503: "服务不可用",
  504: "网络超时",
  505: "http版本不支持该请求",
};

/**
 * 处理请求标头
 * @param config 配置
 */
export const handleRequestHeader = (config: AxiosRequestConfig) => {
  // TODO: 后续可添加
  return config;
};

/**
 * 处理身份验证
 * @param config 配置
 */
export const handleAuth = (config: AxiosRequestConfig) => {
  // TODO: 后续可添加
  return config;
};

/**
 * 处理网络错误
 * @param response 响应体
 */
export const handleNetworkError = (
  response: AxiosResponse & { redirected: boolean }
) => {
  const { status, redirected } = response || {};
  const errMessage = status
    ? errStatus[status as keyof typeof errStatus] ||
      `其他连接错误--->>>${status}`
    : "无法连接到服务器！";
  message.error(errMessage);
  if (status === 401 || status === 302 || status === 403 || redirected) {
    if (self !== top) return window.parent.$broadcast.broadcast("logout");
    server({ url: "/logout" });
    const redirect = window.location.href;
    const baseURL =
      window.env.indexOf("local") === -1
        ? `${window.location.origin}/api`
        : "http://10.114.242.30/api";
    window.location.href = `${baseURL}/pi-sso/logout?redirect=` + redirect;
  }
};

/**
 * 错误映射
 */
export const authErrMap = {
  10031: "登录失效，需要重新登录", // token 失效
  10032: "您太久没登录，请重新登录~", // token 过期
  10033: "账户未绑定角色，请联系管理员绑定角色",
  10034: "该用户未注册，请联系管理员注册用户",
  10035: "code 无法获取对应第三方平台用户",
  10036: "该账户未关联员工，请联系管理员做关联",
  10037: "账号已无效",
  10038: "账号未找到",
};

/**
 * 处理认证错误
 * @param code 状态码
 */
export const handleAuthError = (code: AuthErrMapKey) => {
  if (Reflect.has(authErrMap, code)) {
    message.error(authErrMap[code as keyof typeof authErrMap]);
    return false;
  }
  return true;
};

/**
 * 处理一般错误
 * @param code  状态码
 * @param errmsg 错误信息
 */
export const handleGeneralError = (code: CodeStatus, errmsg: string) => {
  if (code === CodeStatus.Error) {
    message.error(errmsg);
    return false;
  }
  return true;
};

/**
 * 拼接url参数
 * @param url url路径
 * @param data 数据参数
 */
export const generateCacheKey = <T>(url: string, data?: T) => {
  if (data && Reflect.ownKeys(data).length) {
    return url + "?" + qs.stringify(data);
  } else {
    return url;
  }
};

// 判断一个字符串是否为JSON字符串
export const isJsonStr = (str: unknown) => {
  if (typeof str === "string") {
    try {
      const obj = JSON.parse(str);
      return !!(typeof obj === "object" && obj);
    } catch {
      return false;
    }
  }
};
