import Axios from "@/library/Axios";
/**
 * 菜单相关
 */
const BASE_URL = "/admin/menu";
export default {
  /**
   * 获取菜单
   */
  getMenuList() {
    return Axios.get(`${BASE_URL}/getMenuList`);
  }
};
