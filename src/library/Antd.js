import Antd, { message, notification } from "ant-design-vue";
// import Router from "@/router";
import "ant-design-vue/dist/antd.css";

// 防止弹出大量消息
message.config({
  duration: 2,
  maxCount: 1
});

//写配置//一些参你也可以配置到动态的，看个人需要
notification.config({
  placement: "topRight",
  top: "50px",
  duration: 3
});
// 切换页面销毁所有对话框
// Router.beforeEach(() => {
//   Modal.destroyAll();
// });

export default Antd;
