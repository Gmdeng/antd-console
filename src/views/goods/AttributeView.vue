<template>
  <a-descriptions title="用户信息 User Info" bordered>
    <a-descriptions-item label="用户名">
      {{ frmModel.userId }}
    </a-descriptions-item>
    <a-descriptions-item label="昵称">
      {{ frmModel.petName }}
    </a-descriptions-item>
    <a-descriptions-item label="状态">
      <a-tag color="cyan">{{ frmModel.status }}</a-tag>
    </a-descriptions-item>
    <a-descriptions-item label="手机号">
      {{ frmModel.mobile }}
    </a-descriptions-item>
    <a-descriptions-item label="邮箱" :span="2">
      {{ frmModel.email }}
    </a-descriptions-item>
    <a-descriptions-item label="角色" :span="3">
      <a-tag color="cyan" v-for="(it, key) in frmModel.roles" :key="key">
        {{ it.name }}
      </a-tag>
    </a-descriptions-item>
    <a-descriptions-item label="允许登录IP" :span="3">
      {{ frmModel.allowIpaddr }}
    </a-descriptions-item>
    <a-descriptions-item label="拒绝登录IP" :span="3">
      {{ frmModel.denyIpaddr }}
    </a-descriptions-item>
    <a-descriptions-item label="备注" :span="3">
      {{ frmModel.remarks }}
    </a-descriptions-item>
    <a-descriptions-item label="更新人/时间">
      {{ frmModel.updateBy }} /{{ frmModel.updateOn }}
    </a-descriptions-item>
    <a-descriptions-item label="创建人/时间">
      {{ frmModel.createBy }} /{{ frmModel.createOn }}
    </a-descriptions-item>
  </a-descriptions>

  <a-space>
    <a-date-picker
      show-time
      placeholder="Select Time"
      @change="onChange"
      @ok="onOk"
    />
    <a-range-picker
      :show-time="{ format: 'HH:mm' }"
      format="YYYY-MM-DD HH:mm"
      :placeholder="['Start Time', 'End Time']"
      @change="onChange"
      @ok="onOk"
    />
  </a-space>
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
