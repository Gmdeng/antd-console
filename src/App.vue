<template>
  <a-config-provider :locale="zh_CN">
    <router-view />
  </a-config-provider>
</template>
<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import { useStore } from "vuex";
import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");
export default {
  name: "App",
  setup() {
    // 状态管理器
    const store = useStore();
    let menuStore = window.sessionStorage.getItem("MENU_STORE");
    // 在页面加载时读取 sessionStorage
    if (!(menuStore == "undefined")) {
      store.replaceState(Object.assign({}, store.state, JSON.parse(menuStore)));
    }
    // 在页面刷新时将 store保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      window.sessionStorage.setItem("MENU_STORE", JSON.stringify(store.state));
    });
    return {
      zh_CN
    };
  }
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  widows: 100%;
  height: 100%;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
