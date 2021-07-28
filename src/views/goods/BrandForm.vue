<template>
  <a-row :gutter="24">
    <a-col :sm="24" :md="12" :xl="12">
      <a-form
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 14 }"
        :scrollToFirstError="true"
      >
        <a-form-item label="中文名称" v-bind="validateInfos.cnName">
          <a-input
            v-model:value="frmModel.cnName"
            placeholder="请输入中文名称"
          />
        </a-form-item>
        <a-form-item label="英文名称" v-bind="validateInfos.enName">
          <a-input
            v-model:value="frmModel.enName"
            placeholder="请输入英文名称"
          />
        </a-form-item>
        <a-form-item label="LOGO图标" v-bind="validateInfos.logo">
          <a-input v-model:value="frmModel.logo" placeholder="请输入LOGO图标" />
        </a-form-item>
        <a-form-item label="网站" v-bind="validateInfos.website">
          <a-input v-model:value="frmModel.website" placeholder="请输入网站" />
        </a-form-item>

        <a-form-item label="品牌故事" v-bind="validateInfos.stroy">
          <a-textarea
            v-model:value="frmModel.stroy"
            placeholder="请输入品牌故事"
            :auto-size="{ minRows: 2, maxRows: 5 }"
            showCount
            :maxlength="100"
          />
        </a-form-item>
        <a-form-item label="简介" v-bind="validateInfos.summary">
          <a-textarea
            v-model:value="frmModel.summary"
            placeholder="简介"
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
import brandApi from "@/api/brandApi";
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
    const state = reactive({});

    // 表单绑定数据
    const frmModel = reactive({
      id: "", // ID
      cnName: "", // 中文名称
      enName: "", // 英文名称
      logo: "", // LOGO图标
      website: "", // 网站
      stroy: "", // 品牌故事
      summary: "" // 简介
    });

    // 表单验证
    const rulesRef = reactive({
      cnName: [
        {
          required: true,
          message: "请输入中文名称"
        }
      ],
      enName: [
        {
          required: true,
          message: "请输入英文名称"
        }
      ],
      logo: [
        {
          required: true,
          message: "请输入LOGO图标"
        }
      ]
    });

    const { resetFields, validate, validateInfos } = useForm(
      frmModel,
      rulesRef
    );

    // 调用上级接口
    interEvtSubmit(async () => {
      try {
        let data = await validate();
        // console.log(toRaw(frmModel));
        console.log(data);
        let result = await brandApi.saveData(toRaw(frmModel));
        return handleHttpResut(result);
      } catch (err) {
        console.error("error", err);
        return false;
      }
    });

    // 重置表单事件
    interEvtReset(async () => {
      resetFields();
    });

    // 初始化表单
    const initFormData = () => {
      brandApi.getFormData(frmModel.id).then(res => {
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
      limitNumber,
      frmModel,
      validateInfos
    };
  }
});
</script>
