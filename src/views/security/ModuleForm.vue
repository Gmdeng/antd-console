<template>
  <a-row :gutter="24">
    <a-col :sm="24" :md="12" :xl="12">
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="上级目录" v-bind="validateInfos.parentId">
          <a-tree-select
            v-model:value="frmModel.parentId"
            size="large"
            :tree-data="dsTreeData"
            placeholder="请选择上级目录"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item label="编码" v-bind="validateInfos.code">
          <a-input v-model:value="frmModel.code" placeholder="请输入编码" />
        </a-form-item>
        <a-form-item label="名称" v-bind="validateInfos.name">
          <a-input v-model:value="frmModel.name" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="图标" v-bind="validateInfos.icon">
          <a-input v-model:value="frmModel.icon" placeholder="请输入图标" />
        </a-form-item>
        <a-form-item label="链接地址" v-bind="validateInfos.url">
          <a-input v-model:value="frmModel.url" placeholder="请输入链接地址" />
        </a-form-item>
        <a-form-item label="权限" v-bind="validateInfos.operate">
          <a-checkbox-group
            v-model:value="frmModel.operate"
            :options="operateList"
          />
        </a-form-item>
        <a-form-item label="类型" v-bind="validateInfos.type">
          <a-radio-group v-model:value="frmModel.type" button-style="solid">
            <a-radio-button value="M">菜单</a-radio-button>
            <a-radio-button value="F">功能</a-radio-button>
          </a-radio-group>
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

import moduleApi from "@/api/moduleApi";
import validatorApi from "@/api/validatorApi";
import { useForm } from "@ant-design-vue/use";
import { limitNumber, handleHttpResut } from "@/library/utils/Functions";
export default defineComponent({
  name: "ModuleForm",
  setup() {
    /*** 上层接口==============================================*/
    const interEvtSubmit = inject("interEvtSubmit");
    const interEvtReset = inject("interEvtReset");
    const interData = inject("interData");
    const interEvtCloseLoad = inject("interEvtCloseLoad");
    /*** 接口============================================== end */
    // Vue2.0中 data 定义变量名称
    const state = reactive({
      operateList: [],
      dsTreeData: []
    });
    //获取父级选项
    moduleApi.getTreeSelects().then(res => {
      if (res.code == 0) {
        state.dsTreeData = [];
        state.dsTreeData.push(res.data);
        //alert(JSON.stringify(res.data));
      }
    });
    //获取操作项
    moduleApi.getAllActions().then(res => {
      if (res.code == 0) {
        //let jsonDatas = JSON.parse(JSON.stringify(res.data));
        let jsonDatas = res.data;
        for(let k in jsonDatas){
          let json = { value: k*1, label: jsonDatas[k] };
          state.operateList.push(json);
        }
      }
    })
     
    // 表单绑定数据
    const frmModel = reactive({
      id: "", // ID
      parentId: "0", // ID
      code: "", // 编码
      name: "", // 名称
      idx: 0, // 排序
      type: "M", // 类型
      icon: "", // 图标
      url: "", // 链接地址
      operate: [32], // 权限
      remarks: "" // 描述
    });
    // 验证编码唯一性
    const validateCode = async (rule, value) => {
      let ret = await validatorApi.getCheckModuleUniqueCode(value);
      if (ret.code == 0) {
        return Promise.resolve();
      } else {
        let id = ret.data;
        console.info("frmModel.id == " + (frmModel.id == ""));
        console.info("frmModel.id == " + ( id != frmModel.id));
        if (frmModel.id == "" || id != frmModel.id) {
          return Promise.reject("该编码已经被占用");
        }
      }
      return Promise.resolve();
    };
    // 表单验证
    const rulesRef = reactive({
      name: [
        {
          required: true,
          message: "请输入模块名称"
        }
      ],
      parentId: [
        {
          required: true,
          message: "请选择上级目录",
          type: 'number'
        }
      ],
      code: [
        {
          required: true,
          message: "请输入角模块编码"
        },
        {
          validator: validateCode //          trigger: 'blur' // blur change
        }
      ],
      idx: [
        {
          required: true,
          message: "请输入排序",
          type: 'number'
        }
      ],
      type: [
        {
          required: false,
          message: "请输入类型"
        }
      ],
      icon: [
        {
          required: false,
          message: "请输入图标"
        }
      ],
      operate: [
        {
          required: false,
          message: "请输入类型",
          type: 'array'
        }
      ]
    });
    
    // 表单
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
        let result = await moduleApi.saveData(toRaw(frmModel));
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
      moduleApi.getFormData(frmModel.id).then(res => {
        if (res.code == 0) {
          Object.assign(frmModel, res.data);
          //
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
    // 暴露方法和属性
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
