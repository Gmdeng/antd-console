<template>
  <!-- 修改密码 -->
  <a-modal v-model:visible="visible" title="个人信息" :footer="null">
    <a-tabs v-model:activeKey="activeKey" tabPosition="left">
      <a-tab-pane key="1" tab="基本信息">
        <a-list item-layout="horizontal" :data-source="data">
          <template #header>
            <div>基本信息</div>
          </template>

          <a-list-item>
            <a-list-item-meta description="小王蟹">
              <template #title>
                昵称
              </template>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta description="小王蟹">
              <template #title>
                昵称
              </template>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-tab-pane>
      <a-tab-pane key="2" tab="安全设置">
        <a-list item-layout="horizontal" :data-source="data">
          <template #header>
            <div>基本信息</div>
          </template>

          <a-list-item>
            <a-list-item-meta description="当前密码强度:强">
              <template #title>
                账户密码
              </template>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta description="已绑定手机:138****8293">
              <template #title>
                密保手机
              </template>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta
              description="未设置密保问题，密保问题可有效保护账户安全"
            >
              <template #title>
                密保问题
              </template>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta description="已绑定邮箱:ant***sign.com">
              <template #title>
                备用邮箱
              </template>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta
              description="未绑定 MFA 设备，绑定后，可以进行二次确认"
            >
              <template #title>
                MFA 设备
              </template>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-tab-pane>
      <a-tab-pane key="3" tab="消息">
        <a-list item-layout="horizontal" :data-source="data">
          <template #header>
            <div>消息通知</div>
          </template>

          <a-list-item>
            <a-list-item-meta description="小王蟹">
              <template #title>
                昵称
              </template>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta description="小王蟹">
              <template #title>
                昵称
              </template>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>
<script>
import { defineComponent, reactive, toRefs, ref } from "vue";
import { useForm } from "@ant-design-vue/use";
export default defineComponent({
  name: "DProfile",
  setup(props) {
    console.info(props);
    //const { ctx } = getCurrentInstance();
    const state = reactive({
      activeKey: ref("1"),
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
