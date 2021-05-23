<template>
  <a-row :gutter="24">
    <a-col :sm="12" :md="12" :xl="12">
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="编码" v-if="form_mod == 'EDIT'">
          {{ frmModel.code }}
        </a-form-item>
        <a-form-item
          label="编码"
          v-bind="validateInfos.code"
          v-if="form_mod == 'ADD'"
        >
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
        <a-form-item label="备注" v-bind="validateInfos.notes">
          <a-textarea
            v-model:value="frmModel.notes"
            placeholder="备注说明"
            :auto-size="{ minRows: 2, maxRows: 5 }"
            showCount
            :maxlength="100"
          />
        </a-form-item>
        <a-form-item label="权限">
          <a-table
            :defaultExpandAllRows="false"
            :pagination="false"
            :row-key="record => record.id"
            :data-source="menuList"
          >
            <a-table-column key="name" title="名称" data-index="name" />
            <a-table-column key="actions" title="权限" data-index="actions">
            </a-table-column>
          </a-table>
        </a-form-item>
      </a-form>
    </a-col>
    <a-col :sm="24" :md="12" :xl="12"> {{ frmModel.permissions }}
      <hr/>
      {{menuList}}
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
import validatorApi from "@/api/validatorApi";
import { useForm } from "@ant-design-vue/use";
import { limitNumber, handleHttpResut } from "@/library/utils/Functions";
export default defineComponent({
  name: "RoleForm",
  setup() {
    /*** 上层接口==============================================*/
    const interEvtSubmit = inject("interEvtSubmit");
    const interEvtReset = inject("interEvtReset");
    const interData = inject("interData");
    const interEvtCloseLoad = inject("interEvtCloseLoad");
    /*** 接口============================================== end */
    // 定义变量名称
    const state = reactive({
      form_mod: "EDIT", // 操作
      menuList: [
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
      idx: 0, // 排序
      notes: "" // 描述
    });
    
    // 获取所有菜单
    roleApi.getAllMenus().then(res=>{
      if(res.code== 0){
        console.info(res.data);
        state.menuList = res.data;
      }
    });
    // 验证编码唯一性
    const validateCode = async (rule, value) => {
      let ret = await validatorApi.getCheckRoleUniqueCode(value);
      if (ret.code == 0) {
        return Promise.resolve();
      } else {
        let id = ret.data;
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
          message: "请输入角色名称"
        }
      ],
      code: [
        {
          required: true,
          message: "请输入角色编码"
        },
        {
          validator: validateCode,
          trigger: 'change' // blur change
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

    // 调用上级接口
    interEvtSubmit(async () => {
      try {
        let data = await validate();
        // console.log(toRaw(frmModel));
        console.log(data);
        let result = await roleApi.saveData(toRaw(frmModel));
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
      roleApi.getDetail(frmModel.id).then(res => {
        if (res.code == 0) {
          Object.assign(frmModel, res.data);
          interEvtCloseLoad();
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
      if (interData.value == undefined) {
        state.form_mod = "ADD";
        frmModel.id = null;
        interEvtCloseLoad();
      } else {
        state.form_mod = "EDIT";
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
