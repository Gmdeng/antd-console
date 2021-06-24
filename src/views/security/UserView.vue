<template>
  <a-row :gutter="24">
    <a-col :sm="24" :md="12" :xl="12">
      <a-form
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :scrollToFirstError="true"
      >
        <a-form-item label="用户名">
          {{ frmModel.userId }}
        </a-form-item>
        <a-form-item label="昵称">
          {{ frmModel.petName }}
        </a-form-item>
        <a-form-item label="手机号">
          {{ frmModel.mobile }}
        </a-form-item>
        <a-form-item label="邮箱">
          {{ frmModel.email }}
        </a-form-item>
        <a-form-item label="角色">
          {{ frmModel.roles }}
        </a-form-item>
        <a-form-item label="允许登录IP">
          {{ frmModel.allowIpaddr }}
        </a-form-item>
        <a-form-item label="拒绝登录IP">
          {{ frmModel.denyIpaddr }}
        </a-form-item>
        <a-form-item label="备注">
          {{ frmModel.remarks }}
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>
<script>
import { defineComponent, reactive, inject, onMounted, toRefs } from "vue";
import userApi from "@/api/userApi";
export default defineComponent({
  name: "UserView",
  setup() {
    /*** 上层接口==============================================*/
    const interData = inject("interData");
    const interEvtCloseLoad = inject("interEvtCloseLoad");
    /*** 接口============================================== end */
    // 定义变量名称
    const state = reactive({});

    // 表单绑定数据
    const frmModel = reactive({
      id: "", // ID
      userId: "", // 用户名
      petName: "", // 昵称
      mobile: "", // 手机号
      email: "", // 邮箱
      allowIpaddr: "", // 允许登录IP
      denyIpaddr: "", // 拒绝登录IP
      notes: "", // 描述,
      roles: [] // 角色
    });

    // 初始化表单
    const initFormData = () => {
      userApi.getDetail(frmModel.id).then(res => {
        if (res.code == 0) {
          Object.assign(frmModel, res.data);
          interEvtCloseLoad();
        }
      });
    };

    // 加载初始化数据
    onMounted(() => {
      if (interData.value == undefined) {
        interEvtCloseLoad();
      } else {
        frmModel.id = interData.value;
        initFormData();
      }
    });
    return {
      ...toRefs(state),
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      frmModel
    };
  }
});
</script>
