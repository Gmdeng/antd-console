import Axios from "@/library/Axios";
/**
 * 角色相关接口
 */
const BASE_URL = "/admin/system/role";
export default {
  /**
   * 获取所有菜单
   */
  getAllMenus() {
    return Axios.get(`${BASE_URL}/getAllMenus`);
  },
  /**
   * 分页获取数据列表
   */
  getDataListByPage(params) {
    console.info(JSON.stringify(params));
    return Axios.get(`${BASE_URL}/getList`);
  },
  /**
   * 保存
   */
  saveData(formData) {
    return Axios.post(`${BASE_URL}/saveData`, formData);
  },
  /**
   * 获取明细
   * @param {*} id
   */
  getDetail(id) {
    return Axios.get(`${BASE_URL}/getDetail?id=${id}`);
  },
  /**
   * 保存
   */
  postAarry(formData) {
    return Axios.post(`${BASE_URL}/postAarry`, formData);
  },
  postList(formData) {
    return Axios.post(`${BASE_URL}/postList`, formData);
  },
  postBeanList(formData) {
    return Axios.put(`${BASE_URL}/postBeanList`, formData);
  },
  postBeanOne(formData) {
    return Axios.post(`${BASE_URL}/postBeanOne`, formData);
  },
  postBeanMore(formData) {
    return Axios.put(`${BASE_URL}/postBeanMore`, formData);
  },
  postRules(formData) {
    return Axios.patch(`${BASE_URL}/postRules`, formData);
  },
  postBeanArry(formData) {
    return Axios.patch(`${BASE_URL}/postBeanArry`, formData);
  }
};
