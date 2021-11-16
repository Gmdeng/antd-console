import Axios from "@/library/Axios";
/**
 * 用户授权相关接口
 *
 */
const BASE_URL = "/auth/";
export default {
  /**
   *  用户登录
   * @returns
   */
  login(params) {
    return Axios.post(`${BASE_URL}/login`, params);
  },
  /**
   * 获取用户权限
   */
  getPrivilege() {}
};
