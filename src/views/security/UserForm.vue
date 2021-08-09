<template>
  <a-row :gutter="24">
    <a-col :sm="24" :md="12" :xl="12">
      <a-form
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :scrollToFirstError="true"
      >
        <a-form-item label="用户名" v-bind="validateInfos.userId">
          <a-input v-model:value="frmModel.userId" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="昵称" v-bind="validateInfos.petName">
          <a-input v-model:value="frmModel.petName" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item label="手机号" v-bind="validateInfos.mobile">
          <a-input v-model:value="frmModel.mobile" placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item label="邮箱" v-bind="validateInfos.email">
          <a-input v-model:value="frmModel.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="角色" v-bind="validateInfos.roles">
          <a-select
            mode="multiple"
            placeholder="请选择角色"
            v-model:value="frmModel.roles"
          >
            <a-select-option v-for="it in roleList" :key="it.id">
              {{ it.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="允许登录IP" v-bind="validateInfos.allowIpaddr">
          <a-textarea
            v-model:value="frmModel.allowIpaddr"
            placeholder="允许登录IP, 优先于拒绝"
            :auto-size="{ minRows: 2, maxRows: 5 }"
            showCount
            :maxlength="100"
          />
        </a-form-item>
        <a-form-item label="拒绝登录IP" v-bind="validateInfos.denyIpaddr">
          <a-textarea
            v-model:value="frmModel.denyIpaddr"
            placeholder="拒绝登录IP"
            :auto-size="{ minRows: 2, maxRows: 5 }"
            showCount
            :maxlength="100"
          />
        </a-form-item>
        <a-form-item label="备注" v-bind="validateInfos.remarks">
          <a-textarea
            v-model:value="frmModel.remarks"
            placeholder="备注说明"
            :auto-size="{ minRows: 2, maxRows: 5 }"
            showCount
            :maxlength="100"
          />
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>
<script>
import {
  defineComponent,
  reactive,
  inject,
  onMounted,
  toRaw,
  toRefs
} from "vue";
import userApi from "@/api/userApi";
import roleApi from "@/api/roleApi";
import validatorApi from "@/api/validatorApi";
import { useForm } from "@ant-design-vue/use";
import { limitNumber, handleHttpResut } from "@/library/utils/Functions";
export default defineComponent({
  name: "UserForm",
  setup() {
    /*** 上层接口==============================================*/
    const interEvtSubmit = inject("interEvtSubmit");
    const interEvtReset = inject("interEvtReset");
    const interData = inject("interData");
    const interEvtCloseLoad = inject("interEvtCloseLoad");
    /*** 接口============================================== end */
    // 定义变量名称
    const state = reactive({
      roleList: []
    });

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
      roles: []
    });

    // 获取所有可用的角色
    roleApi.getAvailableRoleNames().then(res => {
      if (res.code == 0) {
        //console.info(res.data);
        state.roleList = res.data;
      }
    });

    // 验证编码唯一性
    const validateUserId = async (rule, value) => {
      let ret = await validatorApi.getCheckUserUniqueUID(value);
      if (ret.code == 0) {
        return Promise.resolve();
      } else {
        let id = ret.data;
        if (frmModel.id == "" || id != frmModel.id) {
          return Promise.reject("该编码已经被占用");
        }
      }
      return Promise.resolve();
    };

    // 表单验证
    const rulesRef = reactive({
      userId: [
        {
          required: true,
          message: "请输入用户名"
        },
        {
          validator: validateUserId,
          trigger: "change" // blur change
        }
      ],
      petName: [
        {
          required: true,
          message: "请输入昵称"
        }
      ],
      roles: [
        {
          type: "array",
          required: true,
          message: "请选择角色"
        }
      ]
    });

    const { resetFields, validate, validateInfos } = useForm(
      frmModel,
      rulesRef
    );

    // 调用上级接口--提交表单
    interEvtSubmit(() => {
      return validate().then(data => {
        //state.demoData = data;
        console.info("提交数据：", data);
        return userApi.saveData(toRaw(frmModel)).then(ret => {
          return handleHttpResut(ret);
        });
      });
    });

    // 重置表单事件
    interEvtReset(async () => {
      resetFields();
    });

    // 初始化表单
    const initFormData = () => {
      userApi.getFormData(frmModel.id).then(res => {
        if (res.code == 0) {
          Object.assign(frmModel, res.data);
          interEvtCloseLoad();
        }
      });
    };

    // 加载初始化数据
    onMounted(() => {
      if (interData.value == undefined) {
        frmModel.id = null;
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
      limitNumber,
      frmModel,
      validateInfos
    };
  }
});
</script>
