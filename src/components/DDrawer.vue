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
    <a-spin size="large" tip="Loading..." :spinning="state.spinning">
      <slot />
    </a-spin>
    <div class="footer" v-if="footerVisible">
      <a-button
        type="primary"
        @click="onSubmitHandle2"
        :loading="state.submitLoading"
        :disabled="state.spinning"
      >
        {{ okText }}
      </a-button>
      &nbsp;
      <!-- <a-button @click="onResetHandle" :disabled="state.spinning">{{ resetText }}</a-button> &nbsp; -->
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
  watch,
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
    },
    refreshParent: {
      type: Function,
      default: () => {
        alert("No Refresh Data");
      }
    }
  },
  setup(props) {
    const { ctx } = getCurrentInstance();
    // 通过reactive 可以初始化一个可响应的数据，与Vue2.0中的Vue.observer很相似
    const state = reactive({
      spinning: true,
      visible: false, //是否显示
      submitLoading: false, //提交状态
      data: undefined, // 数据
      onSubmitEvent: e => {
        // 定义提交事件
        e.preventDefault();
      },
      onResetEvent: async e => {
        // 定义重置事件
        e.preventDefault();
      }
    });
    // 观察
    watch(
      () => state.visible,
      (newValue, oldValue) => {
        //alert(newValue +" === "+ oldValue);
        // 因为watch被观察的对象只能是getter/effect函数、ref、热active对象或者这些类型是数组
        // 所以需要将state.count变成getter函数
        if (newValue == false && oldValue == true) {
          state.spinning = true;
        }
      }
    );
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

    // 提供子组件调用
    provide("interData", toRef(state, "data"));
    provide("interEvtSubmit", process => {
      if (typeof process == "function") {
        state.onSubmitEvent = process;
      }
    });
    provide("interEvtReset", process => {
      if (typeof process == "function") {
        state.onResetEvent = process;
      }
    });
    provide("interEvtCloseLoad", () => {
      state.spinning = false;
    });
    /*==操作处理事件==================================== */

    // 提交事件
    const onSubmitHandle = async evt => {
      state.submitLoading = true;
      evt.preventDefault();
      try {
        let ret = await state.onSubmitEvent(evt);
        if (ret) {
          // 刷新parent组件
          props.refreshParent();
          state.visible = false;
        }
        //context.emit("testRefresh", "Ricky", "G-M");
      } catch (error) {
        // alert(99978);
        console.error(error);
        ctx.$message.error(error);
        // state.submitLoading = false;
        //state.visible = false;
      }
      state.submitLoading = false;
    };
    // 提交事件
    const onSubmitHandle2 = evt => {
      state.submitLoading = true;
      evt.preventDefault();
      state
        .onSubmitEvent()
        .then(() => {
          // 刷新parent组件
          props.refreshParent();
          state.visible = false;
        })
        .catch(err => {
          ctx.$message.error(JSON.stringify(err));
        })
        .finally(() => {
          state.submitLoading = false;
        });
      // state.submitLoading = false;
    };
    const onResetHandle = async evt => {
      evt.preventDefault();
      state.onResetEvent();
    };
    // 暴露方法\属性变量
    return {
      state,
      Open,
      onClose,
      onSubmitHandle,
      onSubmitHandle2,
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
