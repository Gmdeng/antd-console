/**
 * 插件实际是一个函数

Vuex 的 store 接受 plugins 选项，这个选项暴露出每次 mutation 的钩子。Vuex 插件就是一个函数，它接收 store 作为唯一参数：

定义 插件
 * @param {*} store 
 */
export const saveInLocal = store => {
  // 当 store 初始化后调用
  console.log("store初始化了");

  store.subscribe((mutaion, state) => {
    // 每次 mutatios 之后调用
    // mutation 的格式为 { type, payload }
    console.dir(mutaion);
    console.dir(state);
    console.log("提交mutation");
  });
};
