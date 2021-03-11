import Axios from "@/library/Axios";
/**
 * 订单相关
 */
const BASE_URL = "/saleOrder";
export default {
  /**
   * 获取菜单
   */
  getMenuList() {
    return Axios.get(`${BASE_URL}/getOrderList`);
  }
};
