<template>
  <div
    class="demo-page-header"
    style="background-color: #f5f5f5; padding: 24px"
  >
    <a-page-header
      :ghost="false"
      title="Title"
      sub-title="This is a subtitle"
      @back="() => $router.go(-1)"
    >
      <template #extra>
        <a-button key="3">Operation</a-button>
        <a-button key="2">Operation</a-button>
        <a-button key="1" type="primary">Primary</a-button>
      </template>
      <a-descriptions size="small" :column="3">
        <a-descriptions-item label="Created">Lili Qu</a-descriptions-item>
        <a-descriptions-item label="Association">
          <a>421421</a>
        </a-descriptions-item>
        <a-descriptions-item label="Creation Time"
          >2017-01-10</a-descriptions-item
        >
        <a-descriptions-item label="Effective Time"
          >2017-10-10</a-descriptions-item
        >
        <a-descriptions-item label="Remarks">
          Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>
  </div>
  <a-row :gutter="24">
    <a-col :sm="24" :md="12" :xl="12">
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="id">{{ detail.id }}</a-form-item>
        <a-form-item label="parentId">{{ detail.parentId }}</a-form-item>
        <a-form-item label="类型">{{ detail.type }}</a-form-item>
        <a-form-item label="名称">{{ detail.name }}</a-form-item>
        <a-form-item label="编码">{{ detail.code }}</a-form-item>
        <a-form-item label="权限">{{ detail.operate }}</a-form-item>
        <a-form-item label="排序">{{ detail.idx }}</a-form-item>
        <a-form-item label="链接地址">{{ detail.url }}</a-form-item>
        <a-form-item label="状态">{{ detail.status }}</a-form-item>
        <a-form-item label="更新时间">{{ detail.updateOn }}</a-form-item>
        <a-form-item label="更新人">{{ detail.updateBy }}</a-form-item>
        <a-form-item label="创建时间">{{ detail.createOn }}</a-form-item>
        <a-form-item label="创建人">{{ detail.updateBy }}</a-form-item>
      </a-form>
    </a-col>
  </a-row>
  <a-page-header
    title="Title"
    sub-title="This is a subtitle"
    @back="() => $router.go(-1)"
  >
  </a-page-header>
</template>
<script>
import { defineComponent, reactive, inject, onMounted, toRefs } from "vue";
import moduleApi from "@/api/moduleApi";
export default defineComponent({
  name: "ModuleView",
  setup() {
    // 接口
    //const interEvtReset = inject("interEvtReset");
    const interData = inject("interData");
    const interEvtCloseLoad = inject("interEvtCloseLoad");
    // Vue2.0中 data 定义变量名称
    const state = reactive({
      detail: {}
    });

    // 调用上级接口
    // interEvtReset(async () => {
    //   resetFields();
    // });
    // 初始化表单
    const initFormData = id => {
      moduleApi.getDetail(id).then(res => {
        if (res.code == 0) {
          // Object.assign(frmModel, res.data);
          //
          state.detail = res.data;
          interEvtCloseLoad();
        }
      });
    };
    // 加载初始化数据
    onMounted(() => {
      // console.info("onMounted...." + interData.value);
      // console.info(JSON.stringify(interData.value));
      //alert(interData.value);
      // if (interData.value != undefined) {
      //   //frmModel.id = interData.value;
      initFormData(interData.value);
      // }
    });
    return {
      ...toRefs(state),
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    };
  }
});
</script>
<style scoped>
.demo-page-header :deep(tr:last-child td) {
  padding-bottom: 0;
}
</style>
