/**
 * 
 * 它是一个长期存储得解决方法，因为放在state中的数据在刷新时会丢失，这时候使用这个plugin.js插件它会帮你存储起来。
 *
 * @param {*} store
 *
 */
const plugin = store => {
  let arr = Object.keys(store.state);
  let obj = {};

  arr.forEach(item => {
    if (window.localStorage[item]) {
      obj[item] = JSON.parse(window.localStorage[item]);
      store.replaceState(obj);
    }
  });

  /**
   * 订阅观察 store变化
   */
  // 当 store 初始化后调用
  store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
    // console.log(arr);
    let { type, payload } = mutation;
    console.log("type==================TODO业务处理TODO============="); //
    console.log(type); //
    console.log("payload==========================================="); //
    console.log(payload); //
    console.log("state==========================================="); //
    console.log(JSON.stringify(state.menu.activeMenu));
    // if (state.agreed == false) {
    //   localStorage.removeItem("login");
    //   window.sessionStorage.setItem("login", JSON.stringify(state.login));
    //   // arr.forEach(item => {
    //   //     window.localStorage.clear();
    //   //     window.sessionStorage[item] = JSON.stringify(state[item]);
    //   // });
    // } else if (state.agreed == true) {
    //   sessionStorage.removeItem("login");
    //   window.localStorage.setItem("login", JSON.stringify(state.login));
    //   // arr.forEach(item => {
    //   //     window.sessionStorage.clear();
    //   //     window.localStorage[item] = JSON.stringify(state[item]);
    //   // });
    // }
  });
};

export default plugin;
