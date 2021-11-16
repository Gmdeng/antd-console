<template>
  <div class="gm-container bg">
    <a-card title="用户登录 [User Login ]" hoverable class="login-body">
      <a-form
        :model="formState"
        :label-col="{ span: 0 }"
        :wrapper-col="{ span: 24 }"
        layout="vertical"
      >
        <a-form-item v-bind="validateInfos.userName">
          <d-input
            icon="UserOutlined"
            v-model:value="formState.userName"
            key="userid"
            >用户名/手机号</d-input
          >
        </a-form-item>
        <a-form-item label="用户名" v-bind="validateInfos.userName">
          <a-input
            v-model:value="formState.userName"
            placeholder="请输入登录用户名"
            size="large"
            ><template #prefix>
              <user-outlined type="user" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="密码" v-bind="validateInfos.passwd">
          <a-input-password
            v-model:value="formState.passwd"
            placeholder="输入登录密码"
            size="large"
            ><template #prefix>
              <lock-outlined type="user" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            block
            size="large"
            @click="handleLogin"
            :loading="FLG_LOADING_LOGIN"
            >登录</a-button
          >
        </a-form-item>
        <a-form-item>
          <a-tree-select
            v-model="value"
            size="large"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            :replace-fields="{
              children: 'children',
              key: 'key',
              value: 'name',
              title: 'title'
            }"
            placeholder="Please select"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";
import { DInput } from "@/components";
import { useStore } from "vuex";
import { useForm } from "@ant-design-vue/use";
import { MobileNumberValidator, PasswordValidator } from "@/library/Validator";
export default defineComponent({
  components: { DInput },
  name: "Login",
  setup() {
    //const router = useRouter();
    const store = useStore();
    // 表单结构
    const formState = reactive({
      userName: "", // 用户名不能为空
      passwd: "" // 密码必须为6位
    });
    // 表单校验规则
    const formRules = reactive({
      userName: [
        {
          required: true,
          message: "用户名不能为空"
        },
        {
          validator: MobileNumberValidator,
          message: "用户名必须是一个手机号"
        }
      ],
      passwd: [
        {
          required: true,
          message: "密码不能为空"
        },
        {
          validator: PasswordValidator
        }
      ]
    });
    const state = reactive({
      FLG_LOADING_LOGIN: false, // 登录标记
      treeData: [
        {
          title: "Node1", //按照官方文档这里的键值对应该是title 下面就不写注释了
          name: "0-0", //按照光放文档这里的键值对应该是value 下面就不写注释了
          key: "0-0",
          children: [
            {
              title: "Child Node1", //title
              name: "0-0-1", // value
              key: "0-0-1"
            },
            {
              title: "Child Node2",
              name: "0-0-2",
              key: "0-0-2"
            }
          ]
        },
        {
          title: "Node2",
          name: "0-1",
          key: "0-1",
          children: [
            {
              title: "Child Node2-1",
              name: "0-2-1",
              key: "0-2-1"
            },
            {
              title: "Child Node2-2",
              name: "0-2-2",
              key: "0-2-2"
            }
          ]
        }
      ]
    });
    // 表单验证对象创建
    const { validate, validateInfos } = useForm(formState, formRules);
    //登录处理事件
    const handleLogin = () => {
      console.info(store);
      state.FLG_LOADING_LOGIN = true;
      alert("3333" + store.state.auth.accessToken);
      //验证执行
      validate()
        .then(data => {
          // 
          store
            .dispatch("auth/login", data)
            .then(res => {
              alert(res);
            })
            .catch(err => {
              alert("Fail: " + err);
            })
            .finally(() => {
              state.FLG_LOADING_LOGIN = false;
            });
        })
        .catch(() => {
          state.FLG_LOADING_LOGIN = false;
        });
      //router.push("/home");
    };
    return {
      ...toRefs(state),
      formState,
      handleLogin,
      validateInfos
    };
  }
});
</script>
<style lang="scss">
.bg {
  background: #edeeed url("../assets/background.svg") repeat;
  height: 100%;
  margin: 0;
  overflow: hidden;
}
.login-body {
  width: 380px;
  margin: 100px auto;
}
</style>
