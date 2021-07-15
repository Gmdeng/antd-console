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
        <a-form-item label="缩略图">
          {{ fileData }}
          <a-input v-model:value="frmModel.thumb" placeholder="请输入缩略图" />
          <a-upload
            action="http://localhost:9999/api/Upload/doUpload/image"
            list-type="picture-card"
            v-model:file-list="fileList"
            @preview="handlePreview"
            @change="handleChange"
            :beforeUpload="handleBeforeUpload"
            accept=".jpg,.png"
          >
            <div v-if="fileList.length < 8">
              <plus-outlined />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal
            :visible="previewVisible"
            :footer="null"
            @cancel="handlePreviewCancel"
          >
            <img alt="Preview" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-item>
        <a-form-item label="名称" v-bind="validateInfos.name">
          <a-input v-model:value="frmModel.name" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="关键字" v-bind="validateInfos.keywords">
          <a-input
            v-model:value="frmModel.keywords"
            placeholder="请输入关键字"
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
        <a-form-item label="备注" v-bind="validateInfos.notes">
          <a-textarea
            v-model:value="frmModel.notes"
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

import catalogApi from "@/api/catalogApi";
import { useForm } from "@ant-design-vue/use";
import {
  limitNumber,
  handleHttpResut,
  getBase64
} from "@/library/utils/Functions";
export default defineComponent({
  name: "CatalogForm",
  setup() {
    /*** 上层接口==============================================*/
    const interEvtSubmit = inject("interEvtSubmit");
    const interEvtReset = inject("interEvtReset");
    const interData = inject("interData");
    const interEvtCloseLoad = inject("interEvtCloseLoad");
    /*** 接口============================================== end */
    // Vue2.0中 data 定义变量名称
    const state = reactive({
      previewVisible: false,
      previewImage: null,
      dsTreeData: [],
      fileData: null,
      fileList: [
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url:
            "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        },
        {
          uid: "-2",
          name: "image.png",
          status: "done",
          url:
            "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        }
      ]
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
      parentId: "0", // ID
      name: "", // 名称
      idx: 0, // 排序
      thumb: "", // 缩略图
      keywords: "", // 关键字
      notes: "" // 描述
    });
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
          type: "number"
        }
      ],
      idx: [
        {
          required: true,
          message: "请输入排序",
          type: "number"
        }
      ],
      keywords: [
        {
          required: false,
          message: "请输入关键字"
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
        let result = await catalogApi.saveData(toRaw(frmModel));
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
      catalogApi.getFormData(frmModel.id).then(res => {
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
    // 方法
    const handlePreview = () => {
      state.previewVisible = true;
    };
    const handlePreviewCancel = () => {
      state.previewVisible = false;
    };
    const handleChange = async ({ file, fileList }) => {
      state.fileData = file;
      console.info("handleChange ===" + JSON.stringify(file));
      console.info("handleChange ===" + JSON.stringify(fileList));
      // alert(JSON.stringify(event));
      let img = await getBase64(file.originFileObj);
      console.info(img);
    };
    const handleBeforeUpload = file => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        alert("You can only upload JPG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        alert("Image must smaller than 2MB!");
      }
      return isJpgOrPng && isLt2M;
    };
    // 暴露方法和属性
    return {
      ...toRefs(state),
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      limitNumber,
      frmModel,
      validateInfos,
      handlePreview,
      handlePreviewCancel,
      handleChange,
      handleBeforeUpload
    };
  }
});
</script>
