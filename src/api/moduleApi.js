import Axios from "@/library/Axios";
/**
 * 模块相关接口
 *
 */
const BASE_URL = "/admin/system/module";
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
   * 获取明细
   * @param {ID} id
   */
  getDetail(id) {
    return Axios.get(`${BASE_URL}/getDetail?id=${id}`);
  },
  /**
   * 
   * @returns 
   */
  getTreeSelects(){
    return Axios.get(`${BASE_URL}/getTreeSelects`);
  }
};
