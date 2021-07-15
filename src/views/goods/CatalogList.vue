<template>
  <div class="gm-desc">
    <a-page-header
      class="demo-page-header"
      style="border: 1px solid rgb(235, 237, 240)"
      title="商品分类管理"
      sub-title="这是一个小标题This is a subtitle"
    >
      <template #extra>
        <a-button key="3" @click="handleEditEvent('ADD')">新增</a-button>
      </template>
    </a-page-header>
  </div>
  <!-- 头部内容end -->
  <div class="gm-container">
    <a-spin :spinning="loading" style="width: 100%">
      <a-table
        :defaultExpandAllRows="false"
        :pagination="false"
        :row-key="record => record.id"
        :data-source="dataList"
        :loading="loading"
      >
        <a-table-column key="action" title="操作" width="180px">
          <template #default="{ record }">
            <a-dropdown>
              <a class="ant-dropdown-link" @click.prevent>
                <edit-outlined />Edit
                <down-outlined />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="handleEditEvent('VIEW', record.id)"
                    >查看</a-menu-item
                  >
                  <a-menu-item @click="handleEditEvent('EDIT', record.id)"
                    >修改</a-menu-item
                  >
                  <a-menu-item @click="handleEditEvent('DELETE', record.id)"
                    >删除</a-menu-item
                  >
                </a-menu>
              </template>
            </a-dropdown>
            <span>
              <a-divider type="vertical" />
            </span>
          </template>
        </a-table-column>
        <a-table-column key="name" title="名称" data-index="name" />
        <a-table-column key="keywords" title="关键词" data-index="idx" />
        <a-table-column key="idx" title="排序" data-index="idx" />
      </a-table>
    </a-spin>
  </div>
  <d-drawer :title="formTitle" ref="refEditWrap" :refreshParent="refreshPage">
    <catalog-form></catalog-form>
  </d-drawer>
  <d-drawer title="查看表单" ref="refViewWrap" :footerVisible="false">
    <catalog-view></catalog-view>
  </d-drawer>
</template>
<script>
import { reactive, ref, toRefs, onMounted } from "vue";
import { DDrawer } from "@/components";
import {
  handleSimpleEvent,
  TreeCleanEmptyNode
} from "@/library/utils/Functions";
import catalogApi from "@/api/catalogApi";
import CatalogForm from "./CatalogForm";
import CatalogView from "./CatalogView";
export default {
  components: {
    // 组件
    DDrawer,
    CatalogForm,
    CatalogView
  },
  setup() {
    const refEditWrap = ref(); // 编辑
    const refViewWrap = ref(); // 查看
    // Vue2.0中 data
    const state = reactive({
      formTitle: "",
      loading: true,
      dataList: [],
      operateList: []
    });

    // 编辑事件
    const handleEditEvent = (type, data) => {
      if (type == "ADD") {
        state.formTitle = "新增表单";
        refEditWrap.value.Open(data);
      } else if (type == "EDIT") {
        state.formTitle = "修改表单";
        refEditWrap.value.Open(data);
      } else if (type == "VIEW") {
        refViewWrap.value.Open(data);
      } else if (type == "DELETE") {
        //
        handleSimpleEvent(
          "删除",
          catalogApi.deleteData,
          { catalogId: data },
          refreshPage
        );
      }
    };

    // 加载数据列表
    const loadData = () => {
      let param = {};
      state.loading = true;
      catalogApi
        .getDataListByPage(param)
        .then(res => {
          if (res.code == 0) {
            state.dataList = res.dataList;
            TreeCleanEmptyNode(state.dataList);
          }
          state.loading = false;
        })
        .catch(() => {
          //alert(err);
          state.loading = false;
        });
    };
    // 刷新页面
    const refreshPage = () => {
      loadData();
    };
    // 页面加载事件
    onMounted(() => {
      loadData();
    });
    return {
      ...toRefs(state),
      handleEditEvent,
      refEditWrap,
      refViewWrap,
      refreshPage
    };
  }
};
</script>
