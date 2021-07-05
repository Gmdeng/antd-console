<template>
  <!-- 修改密码 -->
  <a-modal
    v-model:visible="visible"
    title="修改密码"
    ok-text="确认修改"
    cancel-text="取消"
    centered
    @cancel="resetFormHandle"
    @ok="submitFormHandle"
  >
    <a-form
      :model="formState"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-item label="原密码" v-bind="validateInfos.oldPasswd">
        <a-input-password
          v-model:value="formState.oldPasswd"
          placeholder="原密码"
        />
      </a-form-item>
      <a-form-item label="新密码" v-bind="validateInfos.newPasswd">
        <a-input-password
          v-model:value="formState.newPasswd"
          placeholder="输入新密码"
        />
      </a-form-item>
      <a-form-item label="确认密码" v-bind="validateInfos.rePasswd">
        <a-input-password
          v-model:value="formState.rePasswd"
          placeholder="再次输入密码"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";
import { useForm } from "@ant-design-vue/use";
export default defineComponent({
  name: "DDrawer",
  setup(props) {
    console.info(props);
    //const { ctx } = getCurrentInstance();
    const state = reactive({
      visible: false //是否显示
    });

    // 密码列新
    const formState = reactive({
      oldPasswd: "", // 旧密码
      newPasswd: "", // 新密码
      rePasswd: "" // 重新密码
    });

    // 表单验证
    const rulesRef = reactive({
      oldPasswd: [
        {
          required: true,
          message: "请输入原密码"
        }
      ],
      newPasswd: [
        {
          required: true,
          message: "请输入新密码"
        }
      ],
      rePasswd: [
        {
          required: true,
          message: "请输入确认新密码"
        },
        {
          validator: async (rule, value) => {
            if (value === "") {
              return Promise.reject("Please input the password again");
            } else if (value !== formState.newPasswd) {
              return Promise.reject("Two inputs don't match!");
            }
            return Promise.resolve();
          },
          trigger: "change" // blur change
        }
      ]
    });

    const { resetFields, validate, validateInfos } = useForm(
      formState,
      rulesRef
    );
    // 定义
    // 方法
    const Open = () => {
      state.visible = true;
    };
    // 事件 Event处理Process
    const onClose = () => {
      resetFields();
      state.visible = false;
    };
    const submitFormHandle = () => {
      validate()
        .then(res => {
          alert(JSON.stringify(res));
        })
        .catch(err => {
          alert("fail..");
          console.error("error", err);
        });
      //state.visible = false;
    };
    const resetFormHandle = () => {
      resetFields();
    };

    // 暴露方法\属性变量
    return {
      ...toRefs(state),
      formState,
      validateInfos,
      Open,
      onClose,
      submitFormHandle,
      resetFormHandle
    };
  }
});
</script>
