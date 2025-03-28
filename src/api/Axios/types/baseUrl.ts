// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/**
 * 代理名称
 */
export const enum PROXY {
  API = "/api",
}

/**
 * 服务器地址
 */
export const enum BaseUrl {
  API = `${PROXY.API}`,
  // --------------------------- 本地 ---------------------------
}
