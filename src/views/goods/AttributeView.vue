<template>
  <a-form :model="frmModel" v-bind="formItemLayoutWithOutLabel">
    <a-form-item
      v-for="(option, index) in frmModel.options"
      :key="option.key"
      v-bind="index === 0 ? formItemLayout : {}"
      :label="index === 0 ? 'Domains' : ''"
      :name="['options', index, 'value']"
      :rules="{
        required: true,
        message: 'domain can not be null',
        trigger: 'change'
      }"
    >
      <a-input
        v-model:value="option.value"
        placeholder="please input domain"
        style="width: 40%; margin-right: 8px"
      />
      <a-input
        v-model:value="option.key"
        placeholder="please input domain"
        style="width: 40%; margin-right: 8px"
      />
      <MinusCircleOutlined
        v-if="frmModel.options.length > 1"
        class="dynamic-delete-button"
        :disabled="frmModel.options.length === 1"
        @click="removeDomain(option)"
      />
    </a-form-item>
    <a-form-item v-bind="formItemLayoutWithOutLabel">
      <a-button type="dashed" style="width: 60%" @click="addDomain">
        <PlusOutlined />
        Add field
      </a-button>
    </a-form-item>
    <a-form-item v-bind="formItemLayoutWithOutLabel">
      <a-button type="primary" html-type="submit" @click="submitForm"
        >Submit</a-button
      >
      <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { defineComponent, reactive, inject } from "vue";
import { useForm } from "@ant-design-vue/use";
export default defineComponent({
  setup() {
    const interEvtCloseLoad = inject("interEvtCloseLoad");
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 4
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 20
        }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 20,
          offset: 4
        }
      }
    };
    const frmModel = reactive({
      id: "", // ID
      catalogId: "", // 用分类ID
      name: "", // 属性名称
      idx: 0, // 排序
      options: [{ name: "", notes: "" }]
    });

    // 表单验证
    const rulesRef = reactive({});
    const { resetFields, validate } = useForm(frmModel, rulesRef);
    const submitForm = () => {
      validate()
        .then(() => {
          console.log("values", frmModel.domains);
        })
        .catch(error => {
          console.log("error", error);
        });
    };

    const resetForm = () => {
      resetFields();
    };

    const removeDomain = item => {
      let index = frmModel.options.indexOf(item);

      if (index !== -1) {
        frmModel.options.splice(index, 1);
      }
    };

    const addDomain = () => {
      frmModel.options.push({
        value: "",
        key: Date.now()
      });
    };
    interEvtCloseLoad();
    return {
      formItemLayout,
      formItemLayoutWithOutLabel,
      frmModel,
      submitForm,
      resetForm,
      removeDomain,
      addDomain
    };
  },

  components: {
    MinusCircleOutlined,
    PlusOutlined
  }
});
</script>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
