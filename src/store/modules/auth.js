import confirm from "ant-design-vue/es/modal/confirm";
const state = {
  accessToken: "Init-Data"
};
const getters = {};
const mutations = {
  saveToken(state, data) {
    state.accessToken = data;
    // alert("Ext: " + data);
  }
};
const actions = {
  async login() {},
  async logout({ state, commit }) {
    // alert(998);
    commit("saveToken", 9898);
    confirm({
      title: "您确认要退出系统吗?" + state.accessToken,
      content:
        "When clicked the OK button, this dialog will be closed after 1 second",
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
