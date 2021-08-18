<template>
  <a-row :gutter="24">
    <a-col> Test</a-col>
    <a-col> 表单</a-col>
  </a-row>
  <a-row :gutter="24">
    <a-col>
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="库名称" v-bind="validateInfos.dbName">
          <a-input
            v-model:value="formModel.dbName"
            placeholder="请输入库名称"
          />
        </a-form-item>
        <a-form-item label="类型" v-bind="validateInfos.dbType">
          <a-select v-model:value="formModel.dbType" placeholder="请选择类型">
            <a-select-option value="shanghai"> Zone one </a-select-option>
            <a-select-option value="beijing"> Zone two </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="IP地址" v-bind="validateInfos.dbIpAddr">
          <a-input v-model:value="formModel.dbIpAddr" />
        </a-form-item>
        <a-form-item label="端口" v-bind="validateInfos.dbPort">
          <a-input v-model:value="formModel.dbPort" />
        </a-form-item>
        <a-form-item label="状态" v-bind="validateInfos.dbState">
          <a-checkbox-group v-model:value="formModel.dbState">
            <a-checkbox value="1" name="type"> Online </a-checkbox>
            <a-checkbox value="2" name="type"> Promotion </a-checkbox>
            <a-checkbox value="3" name="type"> Offline </a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="描述" v-bind="validateInfos.dbDesc">
          <a-textarea
            v-model:value="formModel.dbDesc"
            placeholder="Autosize height with minimum and maximum number of lines"
            :auto-size="{ minRows: 2, maxRows: 5 }"
          />
          <tinynce-editor
            v-model="formModel.dbDesc"
            placeholder="我是placeholder"
          ></tinynce-editor>
        </a-form-item>
      </a-form>
    </a-col>
    <a-col :sm="12" :md="12" :xl="12"> 表单</a-col>
  </a-row>
</template>
<script>
import { defineComponent, reactive, inject, onMounted, toRaw } from "vue";
import { useForm } from "@ant-design-vue/use";
import TinynceEditor from "@/components/editor";
export default defineComponent({
  name: "ListFrom",
  components: {
    TinynceEditor
  },
  setup() {
    const interEvtSubmit = inject("interEvtSubmit");
    const interEvtReset = inject("interEvtReset");
    const interData = inject("interData");
    const interEvtCloseLoad = inject("interEvtCloseLoad");
    interEvtCloseLoad();
    // 表单绑定数据
    const formModel = reactive({
      dbName: "", // 库名称
      dbType: "", // 类型
      dbIpAddr: "", // IP
      dbPort: "", // 端口
      dbState: [], // 状态
      dbDesc: "" // 描述
    });
    const rulesRef = reactive({
      dbName: [
        {
          required: true,
          message: "Please input 库名称"
        }
      ],
      dbType: [
        {
          required: true,
          message: "Please select 类型"
        }
      ],
      dbIpAddr: [
        {
          required: true,
          message: "Please select IP地址"
        }
      ],
      dbPort: [
        {
          required: true,
          message: "Please input 端口"
        }
      ],
      dbState: [
        {
          required: true,
          message: "Please select state",
          type: "array"
        }
      ],
      dbDesc: [
        {
          required: true,
          message: "Please input 描述"
        }
      ]
    });
    const { resetFields, validate, validateInfos } = useForm(
      formModel,
      rulesRef
    );
    //提交处理
    const onSubmitProcess = async () => {
      try {
        let data = await validate();
        console.log(toRaw(formModel));
        console.log(data);
        alert("完成" + JSON.stringify(data));
        return true;
      } catch (err) {
        console.log("error", err);
        new Error("参数必须是number类型，并且小于等于10");
      }
    };
    const onResetProcess = async () => {
      alert("重置。。。");
      resetFields();
    };
    // 调用上级接口
    interEvtSubmit(onSubmitProcess);
    interEvtReset(onResetProcess);

    // 加载初始化数据
    onMounted(() => {
      console.info("onMounted...." + interData.value);
      console.info(JSON.stringify(interData.value));
      formModel.dbName = interData.value;
    });
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      formModel,
      validateInfos
    };
  }
});
</script>
