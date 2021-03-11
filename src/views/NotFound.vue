<template>
  NOTFOUND 404
  <div style="width:200px;border:1px solid #fff">
    <a-input-group>
      <a-input />
      <a-input />
    </a-input-group>
    <hr />
    <d-input v-model:value="title" :maxlength="888" placeholder="请输入手号">
      Titile - 标题</d-input
    >
    <br />
    {{ title }}
    <br />
    <input type="text" name="rrr" />
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
import { DInput } from "@/components";
export default {
  components: { DInput },
  name: "NotFund",
  component: {
    DInput
  },
  setup() {
    const state = reactive({
      title: ""
    });
    return {
      ...toRefs(state)
    };
  }
};
</script>
