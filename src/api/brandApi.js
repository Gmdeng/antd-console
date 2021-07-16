import Axios from "@/library/Axios";
/**
 * 用户相关接口
 */
const BASE_URL = "/admin/goods/brand";
export default {
  /**
   * 分页获取数据列表
   */
  getDataListByPage(params) {
    // console.info(JSON.stringify(params));
    return Axios.post(`${BASE_URL}/getDataListByPage`, params);
  },
  /**
   * 保存
   */
  saveData(formData) {
    return Axios.post(`${BASE_URL}/saveData`, formData);
  },
  /**
   * 获取表单明细
   */
  getFormData(id) {
    return Axios.get(`${BASE_URL}/getFormData?id=${id}`);
  },
  /**
   * 获取明细
   */
  getDetail(id) {
    return Axios.get(`${BASE_URL}/getDetail?id=${id}`);
  },
  /**
   * 审核
   * @param {*} formData
   * @returns
   */
  authData(formData) {
    return Axios.post(`${BASE_URL}/authData`, formData);
  },

  /**
   * 删除
   * @param {*} formData
   * @returns
   */
  deleteData(formData) {
    return Axios.post(`${BASE_URL}/deleteData`, formData);
  }
};
