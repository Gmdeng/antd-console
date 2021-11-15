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
  login() {
    return Axios.get(`${BASE_URL}/login`);
  }
};
