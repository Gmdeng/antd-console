import Axios from "@/library/Axios";
/**
 * 模块相关接口
 *
 */
const BASE_URL = "/admin/goods/catalog";
export default {
  /**
   * 分页获取数据列表
   * @param {*} params
   * @returns
   */
  getDataListByPage(params) {
    console.info(JSON.stringify(params));
    return Axios.get(`${BASE_URL}/getList`);
  },

  /**
   * 保存
   * @param {*} formData
   * @returns
   */
  saveData(formData) {
    return Axios.post(`${BASE_URL}/saveData`, formData);
  },

  /**
   * 审核
   * @param {catalogId:157, status:0} formData
   * @returns
   */
  authData(formData) {
    return Axios.post(`${BASE_URL}/authData`, formData);
  },

  /**
   * 删除
   * @param {catalogId:157} formData
   * @returns
   */
  deleteData(formData) {
    return Axios.post(`${BASE_URL}/deleteData`, formData);
  },

  /**
   * 获取表单明细
   * @param {ID} id
   */
  getFormData(id) {
    return Axios.get(`${BASE_URL}/getFormData?id=${id}`);
  },

  /**
   * 获取明细
   * @param {ID} id
   */
  getDetail(id) {
    return Axios.get(`${BASE_URL}/getDetail?id=${id}`);
  },

  /**
   * 获取明细
   * @param {*} code
   * @returns
   */
  getCatalogsByCode(code) {
    return Axios.get(`${BASE_URL}/getCatalogsByCode?code=${code}`);
  },
  /**
   * 选项
   * @returns
   */
  getTreeSelects() {
    return Axios.get(`${BASE_URL}/getTreeSelects`);
  }
};
