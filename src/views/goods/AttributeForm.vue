<template>
  <a-row :gutter="24">
    <a-col :sm="24" :md="24" :xl="24">
      <a-form
        :model="frmModel"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 14 }"
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
          <a-input
            v-model:value="frmModel.name"
            placeholder="请输入属性名称"
            allow-clear
          />
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
        <a-form-item
          v-for="(option, index) in frmModel.options"
          :key="index"
          :label="index === 0 ? '选项' : ''"
          :name="['options', index, 'name']"
          :rules="{
            required: true,
            message: '选项名称不能为空',
            trigger: 'change'
          }"
          :wrapperCol="{
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 }
          }"
        >
          <a-input
            v-model:value="option.name"
            placeholder="请输入选项名称"
            style="width: 40%; margin-right: 8px"
          />
          <a-input
            v-model:value="option.notes"
            placeholder="请输入选项备注"
            style="width: 40%; margin-right: 8px"
          />
          <MinusCircleOutlined
            v-if="frmModel.options.length > 1"
            class="dynamic-delete-button"
            @click="removeOption(option)"
          />
        </a-form-item>
        <a-form-item
          :wrapperCol="{
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 }
          }"
        >
          <a-button type="dashed" style="width: 60%" @click="addOption">
            <PlusOutlined />
            Add Option 新增选项
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
      }
    });
    // 表单结构模型
    const frmModel = reactive({
      id: "", // ID
      catalogId: "", // 用分类ID
      name: "", // 属性名称
      idx: 0, // 排序
      options: [{ name: "", notes: "" }]
    });

    // 表单验证
    const rulesRef = reactive({
      name: [
        {
          required: true,
          message: "请输入属性名称"
        }
      ],
      catalogId: [
        {
          required: true,
          message: "请选择分类"
        }
      ]
    });
    const { resetFields, validate, validateInfos } = useForm(
      frmModel,
      rulesRef
    );

    const removeOption = item => {
      let index = frmModel.options.indexOf(item);
      if (index !== -1) {
        frmModel.options.splice(index, 1);
      }
    };

    const addOption = () => {
      frmModel.options.push({
        name: "",
        notes: ""
      });
    };
    // 初始化表单
    const initFormData = () => {
      attributeApi.getFormData(frmModel.id).then(res => {
        if (res.code == 0) {
          Object.assign(frmModel, res.data);
          if (frmModel.options == null)
            frmModel.options = [{ name: "", notes: "" }];
          interEvtCloseLoad();
        }
      });
    };

    // 调用上级接口--提交表单
    interEvtSubmit(() => {
      return validate().then(data => {
        //state.demoData = data;
        console.info("提交数据：", data);
        return attributeApi.saveData(toRaw(frmModel)).then(ret => {
          return handleHttpResut(ret);
        });
      });
    });

    // 重置表单事件
    interEvtReset(async () => {
      resetFields();
    });

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
      validateInfos,
      frmModel,
      removeOption,
      addOption
    };
  }
});
</script>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
