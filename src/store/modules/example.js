// // 内容比较多，这边可以把相似或者功能相同的组成一个模块，更方便维护
// // 模块文件在store.js中引用

// // import {
// //   // 引用封装好的接口
// //   reqAddress,
// //   reqCategorys,
// //   reqShops
// // } from "../../api/index";

// // 基础数据状态,现在在任何文件都可以引用，引用时 this.$store.xxx 即可
const state = {
  latitude: 40.10038, // 纬度
  longitude: 116.36867, // 经度
  address: {}, // 地址信息对象
  categorys: [], // 分类数组
  shops: [] // 商家数组
};

// 直接更改state的多个方法的对象，现在在任何文件都可以引用，
// 引用时 this.$store.commit（'xxxx'）即可
const mutations = {
  RECEIVE_ADDRESS: (state, { address }) => {
    // 接受地址
    state.address = address;
  },
  RECEIVE_REQCATEGORYS: (state, { categorys }) => {
    // 接受食品分类数组
    state.categorys = categorys;
  },
  RECEIVE_REQSHOPS: (state, { shops }) => {
    // 接受商家数组
    state.shops = shops;
  }
};

// 与后台交互的数据，现在在任何文件都可以引用，
// 引用时 this.$store.dispatch（'xxxx'）即可
const actions = {
  // // 异步获取地址
  // async getAddress({ commit, state }) {
  //   // 发送ajax异步请求
  //   // const geohash = state.latitude + "," + state.longitude;
  //   // const result = await reqAddress(geohash);
  //   // // 提交一个mutations
  //   // if (result.code === 0) {
  //   //   commit("RECEIVE_ADDRESS", { address: result.data });
  //   // }
  // },
  // // 异步获取分类列表
  // async getCategorys({ commit }) {
  //   // const result = await reqCategorys();
  //   // if (result.code === 0) {
  //   //   commit("RECEIVE_REQCATEGORYS", { categorys: result.data });
  //   // }
  // },
  // // 异步获取商家列表
  // async getShops({ commit, state }) {
  //   // const { latitude, longitude } = state;
  //   // const result = await reqShops({ latitude, longitude });
  //   // if (result.code === 0) {
  //   //   commit("RECEIVE_REQSHOPS", { shops: result.data });
  //   // }
  // }
};

export default {
  // 把方法暴露出去
  namespaced: true,
  state,
  mutations,
  actions
};
