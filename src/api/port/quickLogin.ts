import server from "@/api/Axios";
import { RoleEnum } from "@/page/QuickLogin/const";

interface QuickLoginParams {
  corp_id?: string;
  name?: string;
  role_type: string;
  search_token_env?: string;
  page: number;
}

export interface QuickLoginResponse {
  avatar: string;
  companyName: string;
  corp_id: number;
  host: string;
  name: string;
  role_type: keyof typeof RoleEnum;
  staff_extId: string;
  url: string;
}

/**
 * 快速登录查询接口（测试环境）
 */
export const quickLoginSearch = (data: QuickLoginParams) => {
  return server<QuickLoginParams, QuickLoginResponse[]>({
    url: "/api/qls_bp/search_token",
    method: "GET",
    data,
  });
};

/**
 * 快速登录查询接口（小租户/大租户）
 */
export const quickLoginSearchSmallLarge = (data: QuickLoginParams) => {
  return server<QuickLoginParams, QuickLoginResponse[]>({
    url: "/api/ql/search",
    method: "GET",
    data,
  });
};
