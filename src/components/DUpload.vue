<template>
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
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";
import { getBase64 } from "@/library/utils/Functions";
export default defineComponent({
  name: "DUpload",
  setup() {
    const state = reactive({
      previewVisible: false,
      previewImage: null,
      dsTreeData: [],
      fileData: null,
      fileList: []
    });

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
    return {
      ...toRefs(state),
      handlePreview,
      handlePreviewCancel,
      handleChange,
      handleBeforeUpload
    };
  }
});
</script>
