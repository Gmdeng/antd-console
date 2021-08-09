<template>
  <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-row :gutter="24">
      <a-col :sm="12" :md="12" :xl="12">
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
        {{ frmModel }}
      </a-col>
      <a-col :sm="24" :md="12" :xl="12">
        {{ permissions }}
        <hr />
        <a-table
          defaultExpandAllRows="true"
          :pagination="false"
          :row-key="record => record.id"
          :data-source="menuList"
        >
          <a-table-column key="name" title="名称" data-index="name" />
          <a-table-column key="acts" title="权限" data-index="acts">
            <template #default="{ record }">
              <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                <a-checkbox
                  v-model:checked="checkAlls[record.id]"
                  :indeterminate="indeterminates[record.id]"
                  @change="onCheckAllChange(record.id)"
                >
                  Check all
                </a-checkbox>
              </div>
              <a-checkbox-group
                v-model:value="permissions[record.id]"
                :options="record.notes"
              />
            </template>
          </a-table-column>
        </a-table>
      </a-col>
    </a-row>
  </a-form>
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
import roleApi from "@/api/roleApi";
import validatorApi from "@/api/validatorApi";
import { useForm } from "@ant-design-vue/use";
import {
  limitNumber,
  handleHttpResut,
  TreeCleanEmptyNode,
  TreeToList,
  FindTreeNode
} from "@/library/utils/Functions";
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
      menuList: [],
      optionList: [],
      checkAlls: {},
      indeterminates: {},
      permissions: {}
    });

    // 表单绑定数据
    const frmModel = reactive({
      id: "", // ID
      code: "", // 编码
      name: "", // 名称
      idx: 0, // 排序
      notes: "", // 描述,
      privileges: []
    });

    // 获取所有菜单
    roleApi.getAllMenus().then(res => {
      if (res.code == 0) {
        console.info(res.data);
        state.menuList = res.data;
        TreeCleanEmptyNode(state.menuList);
        state.optionList = TreeToList(res.data);
        state.optionList.forEach(it => {
          state.checkAlls[it.id] = false;
          state.indeterminates[it.id] = false;
          state.permissions[it.id] = [];
        });
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
          trigger: "change" // blur change
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

    // 处理选中子项
    const handleCheckedChildren = (childList, flg) => {
      childList.forEach(it => {
        state.permissions[it.id] = [];
        if (flg == true) {
          it.notes.forEach(item => {
            state.permissions[it.id].push(item.value);
          });
        }
        //
        let childrenData = it["children"];
        console.info(it.id + "-childrenData1=" + childrenData);
        if (childrenData != undefined && childrenData?.length > 0) {
          handleCheckedChildren(childrenData, flg);
        }
      });
    };
    // 全选事件
    const onCheckAllChange = id => {
      //alert(state.checkAlls[id]);
      let selectedNodes = FindTreeNode(state.menuList, id);
      handleCheckedChildren(selectedNodes, state.checkAlls[id]);
    };
    // 调用上级接口--提交表单
    interEvtSubmit(() => {
      return validate().then(data => {
        //state.demoData = data;
        // alert(JSON.stringify(frmModel.permissions));
        frmModel.privileges = [];
        for (var key in state.permissions) {
          // alert(key + "长度==" + frmModel.permissions[key].length);
          if (state.permissions[key].length > 0) {
            frmModel.privileges.push({
              moduleId: key,
              values: state.permissions[key]
            });
          }
        }
        // 判断选中的模块权限
        if (frmModel.privileges.length == 0) {
          notification["error"]({
            message: "至少选中一项",
            description: "模块权限至少选中一项."
          });
          return Promise.reject("至少选中一项");
        }
        console.info("提交数据：", data);
        return roleApi.saveData(toRaw(frmModel)).then(ret => {
          return handleHttpResut(ret);
        });
      });
    });
    // interEvtSubmit(async () => {
    //   try {
    //     let data = await validate();
    //     // console.log(toRaw(frmModel));
    //     console.log(data);
    //     // alert(JSON.stringify(frmModel.permissions));
    //     frmModel.privileges = [];
    //     for (var key in state.permissions) {
    //       // alert(key + "长度==" + frmModel.permissions[key].length);
    //       if (state.permissions[key].length > 0) {
    //         frmModel.privileges.push({
    //           moduleId: key,
    //           values: state.permissions[key]
    //         });
    //       }
    //     }
    //     // 判断选中的模块权限
    //     if (frmModel.privileges.length == 0) {
    //       notification["error"]({
    //         message: "至少选中一项",
    //         description: "模块权限至少选中一项."
    //       });
    //       return false;
    //     }
    //     // frmModel.privileges = permissions;
    //     let result = await roleApi.saveData(toRaw(frmModel));
    //     return handleHttpResut(result);
    //   } catch (err) {
    //     console.error("error", err);
    //     return false;
    //   }
    // });

    // 重置表单事件
    interEvtReset(async () => {
      resetFields();
    });

    // 初始化表单
    const initFormData = () => {
      roleApi.getFormData(frmModel.id).then(res => {
        if (res.code == 0) {
          Object.assign(frmModel, res.data);
          Object.assign(state.permissions, frmModel.permissions);
          //if (frmModel.hasOwnProperty("permissions")) {
          if (Object.prototype.hasOwnProperty.call(frmModel, "permissions")) {
            delete frmModel.permissions;
          }
          interEvtCloseLoad();
        }
      });
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
      onCheckAllChange
    };
  }
});
</script>
