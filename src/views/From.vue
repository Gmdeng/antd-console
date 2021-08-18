<template>
  <div class="gm-container">
    <a-row :gutter="24">
      <a-col :sm="12" :md="8" :xl="8">
        <h3>
          所属类目：
          <span></span>
        </h3>
      </a-col>
      <a-col :sm="12" :md="3" :xl="3" :offset="11">
        <a-button type="primary">添加源</a-button>
      </a-col>
    </a-row>
    <a-row :gutter="24" style="margin-top:30px;">
      <a-col :sm="12" :md="8" :xl="8" :style="{ marginBottom: '24px' }">
        <a-card>
          <a-icon
            type="check-circle"
            style="fontSize:16px;color:red"
            v-if="false"
          />
          <a-icon type="close-circle" style="fontSize:16px;color:blue" />
          <span style="margin-left:100px;font-size:16px"
            ><strong>information</strong></span
          >
        </a-card>
        <a-card>
          <a-row>
            <a-col :span="4">
              <a-icon
                type="database"
                theme="twoTone"
                style="fontSize:50px;color:blue;margin-top:10px"
            /></a-col>
            <a-col :span="10">
              <p><strong>库名称：</strong></p>
              <p><strong>IP：</strong></p>
              <p><strong>描述: </strong>{{ "无" }}</p>
            </a-col>
            <a-col :span="9" :offset="1">
              <p><strong>类型：</strong></p>
              <p><strong>端口：</strong></p>
              <p><strong>状态：</strong>启用|停用|未启用</p>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :sm="12" :md="8" :xl="8" :style="{ marginBottom: '24px' }">
        sss
      </a-col>
    </a-row>
    <a-row :gutter="24" style="margin-top:30px;">
      <a-col :sm="12" :md="12" :xl="12" :style="{ marginBottom: '24px' }">
        ==============================
        <a-form
          layout="vertical"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-item v-bind="validateInfos.dbTitle">
            <d-input v-model:value="formModel.dbTitle" :maxlength="99">
              Titile - 标题</d-input
            >
          </a-form-item>
          <a-form-item label="库名称" v-bind="validateInfos.dbName">
            <a-input
              v-model:value="formModel.dbName"
              placeholder="请输入库名称"
            />
          </a-form-item>
          <a-form-item label="类型" v-bind="validateInfos.dbType">
            <a-select v-model:value="formModel.dbType" placeholder="请选择类型">
              <a-select-option value="shanghai">
                Zone one
              </a-select-option>
              <a-select-option value="beijing">
                Zone two
              </a-select-option>
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
              <a-checkbox value="1" name="type">
                Online
              </a-checkbox>
              <a-checkbox value="2" name="type">
                Promotion
              </a-checkbox>
              <a-checkbox value="3" name="type">
                Offline
              </a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="描述" v-bind="validateInfos.dbDesc">
            <a-textarea
              v-model:value="formModel.dbDesc"
              placeholder="Autosize height with minimum and maximum number of lines"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
            <editor
              v-model="formModel.dbDesc"
              :init="state.init"
              :disabled="state.disabled"

            >
            </editor>
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="onSubmit">
              Create
            </a-button>
            <a-button style="margin-left: 10px;" @click="resetFields">
              Reset
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { reactive, toRaw, inject } from "vue";
import { useForm } from "@ant-design-vue/use";
import { DInput } from "@/components";
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver";
// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import "tinymce/plugins/image"; // 插入上传图片插件
import "tinymce/plugins/media"; // 插入视频插件
import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/wordcount"; // 字数统计插件
import "tinymce/skins/ui/oxide/skin.css";
export default {
  name: "From",
  components: {
    Editor,
    DInput
  },
  setup() {
    const interEvtCloseLoad = inject("interEvtCloseLoad");
    interEvtCloseLoad();
    tinymce.init({});
    const state = reactive({
      disabled: true,
      //初始化配置
      init: {
        language_url: `/static/tinymce/langs/zh_CN.js`,
        language: "zh_CN",
        skin_url: `/static/tinymce/skins/ui/oxide`,
        content_css: `/static/tinymce/skins/content/default/content.css`,
        height: 300,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          console.info(failure);
          const img = "data:image/jpeg;base64," + blobInfo.base64();
          success(img);
        }
      }
    });
    // 表单绑定数据
    const formModel = reactive({
      dbTitle: "",
      dbName: "", // 库名称
      dbType: "", // 类型
      dbIpAddr: "", // IP
      dbPort: "", // 端口
      dbState: [], // 状态
      dbDesc: "" // 描述
    });
    const rulesRef = reactive({
      dbTitle: [
        {
          required: true,
          message: "Please input 库名称"
        }
      ],
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
    const onSubmit = e => {
      e.preventDefault();
      validate()
        .then(() => {
          console.log(toRaw(formModel));
        })
        .catch(err => {
          console.log("error", err);
        });
    };
    
    return {
      state,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      formModel,
      resetFields,
      validateInfos,
      onSubmit
    };
  }
};
</script>
<style lang="scss" scoped>
.gm-html {
  margin: 0px;
  background-color: #fff;
  height: 500px;
}
</style>
