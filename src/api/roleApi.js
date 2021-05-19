import Axios from "@/library/Axios";
/**
 * 角色相关接口
 */
const BASE_URL = "/admin/system/role";
export default {
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
   * @param {ID} id
   */
  getDetail(id) {
    return Axios.get(`${BASE_URL}/getDetail?id=${id}`);
  }
};
