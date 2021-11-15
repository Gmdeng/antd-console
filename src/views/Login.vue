<template>
  <div class="gm-container bg">
    <a-card title="用户登录 [User Login ]" hoverable class="login-body">
      <a-form
        :model="formState"
        :label-col="{ span: 0 }"
        :wrapper-col="{ span: 24 }"
        layout="vertical"
      >
        <a-form-item>
          <d-input
            icon="UserOutlined"
            v-model:value="formState.oldPasswd"
            key="userid"
            >用户名/手机号</d-input
          >
        </a-form-item>
        <a-form-item label="用户名">
          <a-input
            v-model:value="formState.oldPasswd"
            placeholder="请输入登录用户名"
            size="large"
            ><template #prefix>
              <user-outlined type="user" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password
            v-model:value="formState.newPasswd"
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
            :loading="loading_login"
            >登录</a-button
          >
          <a-button type="primary" block size="large" @click="onlogin"
            >登录3</a-button
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
// import { useRouter } from "vue-router";
import { useStore, mapActions } from "vuex";
export default defineComponent({
  components: { DInput },
  name: "Login",
  setup() {
    //const router = useRouter();
    const store = useStore();
    const formState = reactive({
      newPasswd: "hell", // 新密码
      oldPasswd: "", // 旧密码
      rePasswd: "" // 重新密码
    });
    const state = reactive({
      loading_login: false, // 登录标记
      treeData: [
        {
          tit: "Node1", //按照官方文档这里的键值对应该是title 下面就不写注释了
          name: "0-0", //按照光放文档这里的键值对应该是value 下面就不写注释了
          key: "0-0",
          children: [
            {
              tit: "Child Node1", //title
              name: "0-0-1", // value
              key: "0-0-1"
            },
            {
              tit: "Child Node2",
              name: "0-0-2",
              key: "0-0-2"
            }
          ]
        },
        {
          tit: "Node2",
          name: "0-1",
          key: "0-1",
          children: [
            {
              tit: "Child Node2-1",
              name: "0-2-1",
              key: "0-2-1"
            },
            {
              tit: "Child Node2-2",
              name: "0-2-2",
              key: "0-2-2"
            }
          ]
        }
      ]
    });
    //登录处理事件
    const handleLogin = () => {
      console.info(store);
      state.loading_login = true;
      alert("3333" + store.state.auth.accessToken);
      store
        .dispatch("auth/login", formState)
        .then(res => {
          alert(res);
        })
        .catch(err => {
          alert("Fail: " + err);
        })
        .finally(() => {
          state.loading_login = false;
        });

      //router.push("/home");
    };
    return {
      ...toRefs(state),
      formState,
      handleLogin,
      ...mapActions("auth", ["onlogin"])
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
