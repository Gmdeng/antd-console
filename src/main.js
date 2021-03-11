import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
import Antd from "@/library/Antd";
import Axios from "@/library/Axios";
import "ant-design-vue/dist/antd.css";
import "@/assets/styles/styles.scss";
import * as AntdIcons from "@ant-design/icons-vue";
//
const app = createApp(App)
  .use(store)
  .use(router)
  .use(Antd);

// 注册组件
Object.keys(AntdIcons).forEach(key => {
  app.component(key, AntdIcons[key]);
});
// 添加到全局
app.config.globalProperties.$AntdIcons = AntdIcons;
app.config.productionTip = false;
// app.config.isCustomElement();
// app.config.globalProperties.$message = message;
app.config.globalProperties.$httpClient = Axios;
app.config.errorHandler = (err, vm, info) => {
  console.info(err);
  console.info(vm);
  console.dir(info);
};
// app.component();
// app.directive();
// app.mixin();
app.mount("#app");
//
// 启用模拟数据
// VUE_APP_MOCK的值为true，并且在开发环境下
console.info(process.env.VUE_APP_MOCK == "false");
if (
  process.env.VUE_APP_MOCK == "true" &&
  process.env.NODE_ENV == "development"
) {
  console.info("开启Mockjs 模拟数据模式******************");
  console.info(process.env.VUE_APP_MOCK);
  console.info(process.env.NODE_ENV);
  require("@/mockjs");
}
