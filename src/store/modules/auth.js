import { createVNode } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
//import confirm from "ant-design-vue/es/modal/confirm";
import { Modal } from "ant-design-vue";
/******************************
 * 用户授权相关
 *****************************/
// 数据定义,存放
const state = {
  // 访问TOKEN
  accessToken: "Init-Data",
  // 权限
  prliment: {}
};
// 计算属性
const getters = {};

// 同步处理方法
// 组件调用方式: this.$store.commit('setState', [value])
const mutations = {
  saveToken(state, data) {
    state.accessToken = data;
    // alert("Ext: " + data);
  },
  onlogin(state, data) {
    console.info(state);
    alert("hello " + data);
  }
};

// 异步处理方法
// 组件调用方式: this.$store.dispatch('addPlus', [value])
const actions = {
  // 登录操作
  async login({ state, commit }) {
    console.info(state);
    commit("saveToken", "888888888888");
  },
  // 退出操作
  async logout({ state, commit }) {
    // alert(998);
    commit("saveToken", 9898);
    // 提示确认
    Modal.confirm({
      title: "您确认要退出系统吗?" + state.accessToken,
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode(
        "div",
        { style: "color:red;" },
        "退出当前登录系统! 将需要再次登录才能操作 When clicked the OK button, this dialog will be closed after 1 second"
      ),
      okText: " 确认退出 ",
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log("Oops errors!"));
      },
      cancelText: " 取消 ",
      onCancel() {}
    });
  }
};
export default { state, getters, mutations, actions };
