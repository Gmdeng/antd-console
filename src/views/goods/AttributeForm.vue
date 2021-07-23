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
        <a-form-item label="属性名称" v-bind="validateInfos.name">
          <a-input v-model:value="frmModel.name" placeholder="请输入属性名称" />
        </a-form-item>
        <a-form-item label="排序" v-bind="validateInfos.idx">
          <a-input-number
            v-model:value="frmModel.idx"
            :precision="0"
            :formatter="limitNumber"
            :parser="limitNumber"
            :min="0"
            placeholder="请输入排序"
          />
        </a-form-item>
        <a-form-item label="选项值" v-bind="validateInfos.idx">
          <a-input
            v-model:value="frmModel.options"
            placeholder="please input domain"
            style="width: 60%; margin-right: 8px"
          />
          <MinusCircleOutlined
            v-if="frmModel.options.length > 1"
            class="dynamic-delete-button"
            :disabled="frmModel.options.length === 1"
            @click="removeDomain(domain)"
          />
        </a-form-item>
        <a-form-item label=" ">
          <a-button type="dashed" style="width: 60%" @click="addDomain">
            <PlusOutlined />
            Add field
          </a-button>
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
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons-vue";
import attributeApi from "@/api/attributeApi";
import catalogApi from "@/api/catalogApi";
import { useForm } from "@ant-design-vue/use";
import { limitNumber, handleHttpResut } from "@/library/utils/Functions";
export default defineComponent({
  name: "UserForm",
  components: {
    MinusCircleOutlined,
    PlusOutlined
  },
  setup() {
    /*** 上层接口==============================================*/
    const interEvtSubmit = inject("interEvtSubmit");
    const interEvtReset = inject("interEvtReset");
    const interData = inject("interData");
    const interEvtCloseLoad = inject("interEvtCloseLoad");
    /*** 接口============================================== end */
    // 定义变量名称
    const state = reactive({
      dsTreeData: []
    });
    //获取父级选项
    catalogApi.getTreeSelects().then(res => {
      if (res.code == 0) {
        state.dsTreeData = [];
        state.dsTreeData.push(res.data);
        //alert(JSON.stringify(res.data));
      }
    });
    // 表单绑定数据
    const frmModel = reactive({
      id: "", // ID
      catalogId: "", // 用分类ID
      name: "", // 属性名称
      idx: 0, // 排序
      options: []
    });

    // 表单验证
    const rulesRef = reactive({
      catalogId: [
        {
          required: true,
          message: "请选择分类"
        }
      ],
      name: [
        {
          required: true,
          message: "请输入属性名称"
        }
      ],
      idx: [
        {
          required: true,
          message: "请输入排序"
        }
      ],
      options: [
        {
          type: "array",
          required: true,
          message: "请选择增加选项值"
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
        let result = await attributeApi.saveData(toRaw(frmModel));
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
      attributeApi.getFormData(frmModel.id).then(res => {
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
