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
import { notification } from "ant-design-vue";
import moduleApi from "@/api/moduleApi";
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
      parentId: "", // ID
      code: "", // 编码
      name: "", // 名称
      idx: "", // 排序
      type: "M", // 类型
      icon: "", // 图标
      url: "", // 链接地址
      operate: [32], // 权限
      remarks: "" // 描述
    });
    const rulesRef = reactive({
      name: [
        {
          required: true,
          message: "请输入角色名称"
        }
      ],
      parentId: [
        {
          required: true,
          message: "请选择上级目录"
        }
      ],
      code: [
        {
          required: true,
          message: "请输入角色编码"
        }
      ],
      idx: [
        {
          required: true,
          message: "请输入排序"
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
          message: "请输入类型"
        }
      ]
    });
    // 表单
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
        let ret = await moduleApi.saveData(toRaw(frmModel));
        if (ret.code === 0) {
          // alert("Success:" + JSON.stringify(ret.msg));
          notification["success"]({
            message: "数据提交成功",
            description: "正在为您刷新当前页面数据."
          });
        } else {
          //alert("Fail:" + JSON.stringify(ret.data));
          notification["warning"]({
            message: "数据异常",
            description: "." + ret.data
          });
        }
        return true;
      } catch (err) {
        console.error("error", err);
        return false;
      }
    });
    interEvtReset(async () => {
      resetFields();
    });
    // 初始化表单
    const initFormData = () => {
      moduleApi.getDetail(frmModel.id).then(res => {
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
