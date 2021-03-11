<template>
  <a-row :gutter="24">
    <a-col :sm="24" :md="12" :xl="12">
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="用户名" v-bind="validateInfos.userId">
          <a-input v-model:value="frmModel.userId" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="昵称" v-bind="validateInfos.petName">
          <a-input v-model:value="frmModel.petName" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item label="手机号" v-bind="validateInfos.mobile">
          <a-input v-model:value="frmModel.mobile" placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item label="角色" v-bind="validateInfos.roles">
          <a-input v-model:value="frmModel.roles" placeholder="请输入角色" />
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
import roleApi from "@/api/roleApi";
import { useForm } from "@ant-design-vue/use";
import { limitNumber } from "@/library/utils/Functions";
export default defineComponent({
  name: "ModuleForm",
  setup() {
    // 接
    const interEvtSubmit = inject("interEvtSubmit");
    const interEvtReset = inject("interEvtReset");
    const interData = inject("interData");
    // Vue2.0中 data 定义变量名称
    const state = reactive({
      operateList: [
        { value: 1, label: "增加" },
        { value: 2, label: "修改" },
        { value: 4, label: "删除" },
        { value: 8, label: "取消" },
        { value: 16, label: "审核" },
        { value: 32, label: "查看" }
      ],
      dsTreeData: [
        {
          title: "根目录", //按照官方文档这里的键值对应该是title 下面就不写注释了
          value: "0", //按照光放文档这里的键值对应该是value 下面就不写注释了
          key: "0-0"
        },

        {
          title: "Node1", //按照官方文档这里的键值对应该是title 下面就不写注释了
          value: "1", //按照光放文档这里的键值对应该是value 下面就不写注释了
          key: "0-1",
          children: [
            {
              title: "Child Node1", //title
              value: "0-1-1", // value
              key: "0-1-1"
            },
            {
              title: "Child Node2",
              value: "0-1-2",
              key: "0-1-2"
            }
          ]
        },
        {
          title: "Node2",
          value: "2",
          key: "0-2",
          children: [
            {
              title: "Child Node2-1",
              value: "0-2-1",
              key: "0-2-1"
            },
            {
              title: "Child Node2-2",
              value: "0-2-2",
              key: "0-2-2"
            }
          ]
        }
      ]
    });
    // 表单绑定数据
    const frmModel = reactive({
      id: "", // ID
      userId: "", // 用户名
      petName: "", // 昵称
      mobile: "", // 手机号
      roles: "", //角色
      allowIpaddr: "", // 允许登录IP
      denyIpaddr: "", // 拒绝登录IP
      notes: "" // 描述
    });
    const rulesRef = reactive({
      userId: [
        {
          required: true,
          message: "请输入用户名"
        }
      ],
      petName: [
        {
          required: true,
          message: "请输入昵称"
        }
      ],
      mobile: [
        {
          required: true,
          message: "请输入手机号"
        }
      ],
      roles: [
        {
          required: true,
          message: "请输入角色"
        }
      ]
    });
    const { resetFields, validate, validateInfos } = useForm(
      frmModel,
      rulesRef
    );
    //提交处理
    // const processSubmit = ;
    // const processReset = ;
    // 调用上级接口
    interEvtSubmit(async () => {
      try {
        let data = await validate();
        console.log(toRaw(frmModel));
        console.log(data);
        // alert("完成" + JSON.stringify(toRaw(frmModel)));
        roleApi.saveData(toRaw(frmModel)).then;
        return true;
      } catch (err) {
        console.log("error", err);
        new Error("参数必须是number类型，并且小于等于10");
      }
    });
    interEvtReset(async () => {
      resetFields();
    });
    // 初始化表单
    const initFormData = () => {
      roleApi.getDetail(frmModel.id).then(res => {
        if (res.code == 0) {
          Object.assign(frmModel, res.data);
        }
      });
    };
    // 加载初始化数据
    onMounted(() => {
      // console.info("onMounted...." + interData.value);
      //console.info(JSON.stringify(interData.value));
      if (interData.value == undefined) {
        frmModel.id = null;
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
