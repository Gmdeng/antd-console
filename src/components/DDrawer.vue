<template>
  <a-drawer
    :title="title"
    placement="right"
    width="80%"
    :closable="true"
    v-model:visible="state.visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
    destroy-on-close
  >
    <slot />
    <div class="footer" v-if="footerVisible">
      <a-button type="primary" @click="onSubmitHandle">{{ okText }}</a-button>
      &nbsp; <a-button @click="onResetHandle">{{ resetText }}</a-button> &nbsp;
      <a-button @click="onClose" style="float:right">{{ cancelText }}</a-button>
      &nbsp;
    </div>
  </a-drawer>
</template>
<script>
import {
  defineComponent,
  reactive,
  provide,
  toRef,
  getCurrentInstance
} from "vue";

export default defineComponent({
  name: "DDrawer",
  //这个为关紧
  props: {
    //接收子组件传值
    title: String,
    footerVisible: {
      type: Boolean,
      default: true
    },
    okText: {
      type: String,
      default: "确定"
    },
    resetText: {
      type: String,
      default: "重置"
    },
    cancelText: {
      type: String,
      default: "取消"
    }
  },
  setup() {
    const { ctx } = getCurrentInstance();
    // 通过reactive 可以初始化一个可响应的数据，与Vue2.0中的Vue.observer很相似
    const state = reactive({
      visible: false,
      submitLoading: false,
      data: undefined,
      onSubmitEvent: async e => {
        e.preventDefault();
      },
      onResetEvent: async e => {
        e.preventDefault();
      }
    });
    // 方法
    const Open = data => {
      state.visible = true;
      state.data = data;
    };
    // 事件 Event处理Process
    const onClose = () => {
      state.visible = false;
    };
    /*==与子组件进行交互==================================== */

    // 重新设置处理事件入口
    const interEvtSubmit = process => {
      // console.info("setup event submit");
      // ctx.$message.info("setup event submit");
      state.onSubmitEvent = process;
    };
    const interEvtReset = process => {
      state.onResetEvent = process;
    };
    // 提供调用
    provide("interData", toRef(state, "data"));
    provide("interEvtSubmit", interEvtSubmit);
    provide("interEvtReset", interEvtReset);

    /*==操作处理事件==================================== */

    // 提交事件
    const onSubmitHandle = async evt => {
      evt.preventDefault();
      if (typeof state.onSubmitEvent == "function") {
        try {
          await state.onSubmitEvent(evt);
        } catch (error) {
          console.error(error);
          ctx.$message.error(error);
          state.visible = false;
        }
      } else {
        state.visible = false;
      }
    };
    const onResetHandle = async evt => {
      evt.preventDefault();
      if (typeof state.onResetEvent == "function") {
        state.onResetEvent();
      }
    };
    return {
      state,
      Open,
      onClose,
      onSubmitHandle,
      onResetHandle
    };
  }
});
</script>
<style lang="scss" scoped>
.footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: left;
  z-index: 1;
}
</style>
