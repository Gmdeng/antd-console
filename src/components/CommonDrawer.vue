<template>
  <a-drawer
    v-model:visible="state.visible"
    :title="title"
    :width="width"
    :placement="placement"
    :get-container="$parent.$el?.nextSibling"
    :body-style="{
      height: `calc(100% - (55px + ${footer ? 53 : 0}px))`,
      overflow: 'auto'
    }"
    wrap-class-name="common-drawer"
    destroy-on-close
  >
    <slot />
    <footer class="common-drawer-footer" v-if="footer">
      <a-button @click="close">
        {{ cancelText }}
      </a-button>
      <a-button
        type="primary"
        @click="clickOkHandle"
        :loading="state.confirmLoading"
        style="margin-left: 8px"
      >
        {{ okText }}
      </a-button>
    </footer>
  </a-drawer>
</template>
<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "CommonDrawer",
  props: {
    title: String,
    width: {
      type: Number,
      default: 700
    },
    footer: {
      type: Boolean,
      default: true
    },
    placement: String,
    okText: {
      type: String,
      default: "确定"
    },
    cancelText: {
      type: String,
      default: "取消"
    }
  },
  setup() {
    const state = reactive({
      visible: false,
      data: undefined,
      confirmLoading: false,
      onOk: async () => {}
    });
    /**方法*************************/
    const open = data => {
      state.visible = true;
      state.data = data;
    };

    const close = () => {
      state.visible = false;
    };

    const onOk = callback => {
      state.onOk = callback;
    };

    const clickOkHandle = async () => {
      if (typeof state.onOk === "function") {
        state.confirmLoading = true;
        try {
          const value = await state.onOk();
          console.info(value);
        } finally {
          state.confirmLoading = false;
        }
      }
      close();
    };

    // provide<DrawerData>(CommonDrawerData, {
    //   onOk,
    //   close,
    //   data: toRef(state, "data")
    // });

    return {
      state,
      open,
      close,
      onOk,
      clickOkHandle
    };
  }
});
</script>

<style lang="scss">
.common-drawer {
  .common-drawer-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
  }
}
</style>
