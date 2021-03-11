<template>
  <a-row :gutter="24">
    <a-col :sm="12" :md="12" :xl="12">
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="编码" v-bind="validateInfos.code">
          <a-input v-model:value="frmModel.code" placeholder="请输入编码" />
        </a-form-item>
        <a-form-item label="名称" v-bind="validateInfos.name">
          <a-input v-model:value="frmModel.name" placeholder="请输入名称" />
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
        <a-form-item label="权限">
          <a-table
            defaultExpandAllRows="true"
            :pagination="false"
            :row-key="record => record.id"
            :data-source="dataList"
          >
            <a-table-column key="name" title="名称" data-index="name" />
            <a-table-column key="operate" title="权限" data-index="operate">
              <template #default="{ record }">
                <a-checkbox-group
                  v-model:value="frmModel.permissions[record.id]"
                >
                  <span v-for="(it, k) in operateList" :key="k">
                    <a-checkbox
                      :value="it.value"
                      v-if="(record.operate & it.value) == it.value"
                      >{{ it.label }}</a-checkbox
                    >
                  </span>
                </a-checkbox-group>
              </template>
            </a-table-column>
          </a-table>
        </a-form-item>
      </a-form>
    </a-col>
    <a-col :sm="24" :md="12" :xl="12"> {{ frmModel.permissions }}</a-col>
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
  name: "RoleForm",
  setup() {
    const interEvtSubmit = inject("interEvtSubmit");
    const interEvtReset = inject("interEvtReset");
    const interData = inject("interData");
    const state = reactive({
      dataList: [
        {
          id: 1,
          name: "权限管理",
          operate: 1,
          children: [
            { id: 2, name: "模块", operate: 10 },
            { id: 3, name: "角色", operate: 9 },
            { id: 4, name: "用户", operate: 3 }
          ]
        },
        {
          id: 10,
          name: "订单管理",
          operate: 1,
          children: [
            { id: 12, name: "模块", operate: 10 },
            { id: 13, name: "角色", operate: 9 },
            { id: 14, name: "用户", operate: 3 }
          ]
        },
        {
          id: 20,
          name: "商品管理",
          operate: 1,
          children: [
            { id: 22, name: "模块", operate: 10 },
            { id: 23, name: "角色", operate: 9 },
            { id: 24, name: "用户", operate: 3 }
          ]
        }
      ],
      operateList: [
        { value: 1, label: "查看" },
        { value: 2, label: "增加" },
        { value: 4, label: "修改" },
        { value: 8, label: "删除" },
        { value: 16, label: "取消" },
        { value: 32, label: "审核" }
      ]
    });
    // 表单绑定数据
    const frmModel = reactive({
      id: "", // ID
      code: "", // 编码
      name: "", // 名称
      idx: "", // 排序
      remarks: "", // 描述,
      permissions: {
        1: [],
        2: [],
        3: [],
        4: [],
        10: [],
        12: [],
        13: [],
        14: [],
        20: [],
        22: [],
        23: [],
        24: []
      }
    });
    const rulesRef = reactive({
      name: [
        {
          required: true,
          message: "请输入角色名称"
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
        alert("完成" + JSON.stringify(toRaw(frmModel)));
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
    // 权限表选择事件
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
      onSelect: (record, selected, selectedRows) => {
        console.log("onSelect:", record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(
          "onSelectAll",
          selected,
          selectedRows,
          JSON.stringify(changeRows)
        );
      }
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
      validateInfos,
      rowSelection
    };
  }
});
</script>
