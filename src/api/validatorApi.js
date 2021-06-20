import Axios from "@/library/Axios";
/**
 * 模块相关接口
 *
 */
const BASE_URL = "/admin/validator";
export default {
  /**
   * 验证模块编码唯一性
   * @param {*} code
   * @returns
   */
  getCheckModuleUniqueCode(code) {
    return Axios.get(`${BASE_URL}/CheckModuleUniqueCode?code=${code}`);
  },

  /**
   * 验证角色编码唯一性
   * @param {*} code
   * @returns
   */
  getCheckRoleUniqueCode(code) {
    return Axios.get(`${BASE_URL}/CheckRoleUniqueCode?code=${code}`);
  },

  /**
   * 验证用户名唯一性
   * @param {用户名} uid
   * @returns
   */
  getCheckUserUniqueUID(uid) {
    return Axios.get(`${BASE_URL}/CheckUserUniqueUID?uid=${uid}`);
  }
};
