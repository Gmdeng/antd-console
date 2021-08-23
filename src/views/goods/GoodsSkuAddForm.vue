<template>
  <a-row :gutter="24">
    <a-col :sm="24" :md="12" :xl="12">
      <a-form
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 14 }"
        :scrollToFirstError="true"
      >
        <a-form-item label="商品" v-bind="validateInfos.goodsId">
          <a-select
            v-model:value="frmModel.goodsId"
            show-search
            placeholder="选择商品"
            style="width: 200px"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :options="goodsList"
            @search="handleSearch"
            @change="handleChange"
          >
          </a-select>
        </a-form-item>
        <a-form-item label="所属分类" v-bind="validateInfos.code">
          <a-input v-model:value="frmModel.code" placeholder="请输入商品编码" />
        </a-form-item>
        <a-form-item label="商品条码" v-bind="validateInfos.barCode">
          <a-input
            v-model:value="frmModel.barCode"
            placeholder="请输入商品条码"
          />
        </a-form-item>
        <a-form-item label="商品销售规格">
          ss
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
import goodsSpuApi from "@/api/goodsSpuApi";
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
      goodsList: [],
      specs: [
        {
          name: "彩色",
          code: "Color",
          options: ["红色", "黄色", "绿色", "蓝色"]
        },
        {
          name: "大小",
          code: "size",
          options: ["10cm", "15cm", "20cm", "30cm"]
        }
      ]
    });

    // 表单绑定数据
    const frmModel = reactive({
      id: "", // ID
      goodsId: "", // 商品ID
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

    // 调用上级接口--提交表单
    interEvtSubmit(() => {
      return validate().then(data => {
        //state.demoData = data;
        console.info("提交数据：", data);
        return goodsSpuApi.saveData(toRaw(frmModel)).then(ret => {
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
      goodsSpuApi
        .getFormData(frmModel.id)
        .then(res => {
          if (res.code == 0) {
            Object.assign(frmModel, res.data);
            interEvtCloseLoad();
          }
        })
        .catch(err => {
          alert("9333" + err);
        });
    };

    //
    const handleSearch = () => {};
    const handleChange = () => {};
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
      validateInfos,
      handleSearch,
      handleChange
    };
  }
});
</script>
