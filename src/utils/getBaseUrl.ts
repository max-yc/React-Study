/**
 * 从完整URL中提取基础URL（协议 + 域名）
 * @param url 完整的URL字符串
 * @returns 基础URL
 * @example
 * getBaseUrl('https://wbtest.tongchengwuxian.online/api/auth/staff_login_test?token=123')
 * // 返回: 'https://wbtest.tongchengwuxian.online'
 */
export const getBaseUrl = (url: string): string => {
  try {
    const urlObject = new URL(url);
    return `${urlObject.protocol}//${urlObject.hostname}`;
  } catch (error) {
    console.error("Invalid URL:", error);
    return "";
  }
};
