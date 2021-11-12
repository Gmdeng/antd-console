import { createStore, createLogger } from "vuex";
import createPersistedState from "vuex-persistedstate";
import plugin from "./plugin/plugins";

// 生产
const isProd = process.env.NODE_ENV == "production";

// 导入所有模块
let modulesFiles = require.context("./modules", false, /\.js$/);

//
let customModules = {};
modulesFiles.keys().forEach(key => {
  customModules[key.replace(/\.\/|\.js/g, "")] = modulesFiles(key).default;
});
// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
//   const value = modulesFiles(modulePath);
//   modules[moduleName] = value.default;
//   return modules;
// }, {});

// 导入所有 vuex 模块，自动加入namespaced:true，用于解决vuex命名冲突
Object.keys(customModules).forEach(key => {
  customModules[key]["namespaced"] = true;
});
// 插件
const customPlugins = [plugin, createPersistedState()];
// 非生产环境添加日志
if (!isProd) {
  customPlugins.push(createLogger());
}
export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: customModules,
  plugins: customPlugins
});

/**
 * mapGetters,mapState,mapMutations,mapActions
 * 格式: mapActions(namespace,[mutationName])
 *     
 *  获取整个state
    获取: userStore = computed( () => store.state.user )
    使用: userStore.value.username
    插值式中使用: userStore.username
    获取单个state
    获取: username = computed( () => store.state.user.username )
    使用: username.value
    插值式中使用: username
    获取整个getters
    获取: getters = computed( () => store.getters )
    使用: getters.value[“user/username”]
    插值式中使用: getters[“user/username”]
    获取单个getters
    获取: gUsername = computed( () => store.getters[“user/username”] )
    使用: gUsername.value
    插值式中使用: gUsername
    mutations的使用
    方式一、直接调用 store.commit(“user/setTotal”, 20)
    方式二、
    let totalNum = ref(30),
    setTotal = totalNum => store.commit(“user/setTotal”, totalNum);// 声明变量
    setTotal(totalNum.value)// 执行方法
    actions的使用
    方式一、直接调用 store.dispatch(“user/testActions”, 20)
    方式二、
    let testNum = ref(30),
    testActions = testNum => store.dispatch(“user/testActions”, testNum);// 声明变量
    testActions(testNum.value)// 执行方法
 */
