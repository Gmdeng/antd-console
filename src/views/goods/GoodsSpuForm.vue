<template>
  <a-row :gutter="24">
    <a-col :sm="24" :md="12" :xl="12">
      <a-form
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 14 }"
        :scrollToFirstError="true"
      >
        <a-form-item label="商品分类" v-bind="validateInfos.catalogId">
          <a-tree-select
            v-model:value="frmModel.catalogId"
            size="large"
            :tree-data="dsTreeData"
            placeholder="请选择商品分类"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item label="商品名称" v-bind="validateInfos.name">
          <a-input v-model:value="frmModel.name" placeholder="请输入商品名称" />
        </a-form-item>
        <a-form-item label="商品编码" v-bind="validateInfos.code">
          <a-input v-model:value="frmModel.code" placeholder="请输入商品编码" />
        </a-form-item>
        <a-form-item label="商品条码" v-bind="validateInfos.barCode">
          <a-input
            v-model:value="frmModel.barCode"
            placeholder="请输入商品条码"
          />
        </a-form-item>
        <a-form-item label="品牌" v-bind="validateInfos.brandId">
          <a-select v-model:value="frmModel.brandId">
            <a-select-option
              :value="d.id"
              v-for="(d, idx) in dsBrandList"
              :key="idx"
              >{{ d.cnName }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="缩略图" v-bind="validateInfos.thumb">
          <a-input v-model:value="frmModel.thumb" placeholder="请输入缩略图" />
        </a-form-item>
        <a-form-item label="单位" v-bind="validateInfos.unit">
          <a-input v-model:value="frmModel.unit" placeholder="请输入单位" />
        </a-form-item>
        <a-form-item label="销售价" v-bind="validateInfos.price">
          <a-input-number
            style="width: 100%"
            v-model:value="frmModel.price"
            placeholder="请输入销售价"
            :formatter="
              value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
          />
        </a-form-item>
        <a-form-item label="价值" v-bind="validateInfos.pv">
          <a-input v-model:value="frmModel.pv" placeholder="请输入价值" />
        </a-form-item>
        <a-form-item label="运费" v-bind="validateInfos.freight">
          <a-input-number
            style="width: 100%"
            v-model:value="frmModel.freight"
            placeholder="请输入运费"
            :formatter="
              value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
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
import goodsSpuApi from "@/api/goodsSpuApi";
import catalogApi from "@/api/catalogApi";
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
    const state = reactive({
      dsTreeData: [],
      dsBrandList: []
    });
    //获取父级选项
    catalogApi.getTreeSelects().then(res => {
      if (res.code == 0) {
        state.dsTreeData = [];
        state.dsTreeData.push(res.data);
      }
    });
    //获取品牌
    brandApi.getBrandList().then(res => {
      if (res.code == 0) {
        // state.dsBrandList = [];
        state.dsBrandList = res.dataList;
      }
    });
    // 表单绑定数据
    const frmModel = reactive({
      id: "", // ID
      catalogId: "", //分类ID catalogId
      name: "", //商品名称 name
      code: "", //商品编码 code
      barCode: "", //商品条码 barCode
      brandId: "", //品牌ID brandId
      thumb: "", //缩略图 thumb
      unit: "", //单位 unit
      specsOwn: "", //规格参数JSON specsOwn
      idx: "", //排序 idx
      price: "", //销售价 price
      pv: "", //价值  pv
      status: "", //销售状态 status
      averageCost: "", //商品加权平均成本 averageCost
      freight: "" //运费 freight
    });

    // 表单验证
    const rulesRef = reactive({
      name: [
        {
          required: true,
          message: "请输入商品名称"
        }
      ],
      code: [
        {
          required: true,
          message: "请输入商品编码"
        }
      ],
      brandId: [
        {
          required: true,
          message: "请输入品牌"
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
