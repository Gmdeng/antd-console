<template>
  <div class="gm-desc">
    <a-page-header
      class="demo-page-header"
      style="border: 1px solid rgb(235, 237, 240)"
      title="商品属性管理"
      sub-title="User Management "
    >
      <template #extra>
        <a-button key="3" @click="handleEditEvent('ADD')"
          ><FormOutlined />新增</a-button
        >
      </template>
    </a-page-header>
  </div>
  {{ searchData }}
  <!-- 头部内容end -->
  <div class="gm-container">
    <d-filter-bar
      v-model:value="searchData"
      :options="searchOptions"
      placeholder="请输入客户名 / 客户手机号等查询"
    ></d-filter-bar>
    <a-spin :spinning="loading" style="width: 100%">
      <a-table
        :row-key="record => record.id"
        :data-source="dataList"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <a-table-column key="action" title="操作" width="110px">
          <template #default="{ record }">
            <a-dropdown>
              <a class="ant-dropdown-link" @click.prevent>
                <EditOutlined />Edit
                <DownOutlined />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="handleEditEvent('VIEW', record.id)"
                    >查看</a-menu-item
                  >
                  <a-menu-item @click="handleEditEvent('EDIT', record.id)"
                    >修改</a-menu-item
                  >
                  <a-menu-item @click="handleEditEvent('DELETE', record.id)">
                    删除
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item @click="handleEditEvent('AUDTH', record.id)"
                    >审核</a-menu-item
                  >
                </a-menu>
              </template>
            </a-dropdown>
            <span>
              <a-divider type="vertical" />
            </span>
          </template>
        </a-table-column>
        <a-table-column key="userId" title="用户名" data-index="userId" />
        <a-table-column key="petName" title="昵称" data-index="petName" />
        <a-table-column key="mobile" title="手机号" data-index="mobile" />
        <a-table-column key="email" title="邮箱" data-index="email" />
        <a-table-column key="status" title="状态" data-index="status" />
        <a-table-column key="create" title="创建时间/人">
          <template #default="{ record }">
            {{ record.createOn }}/{{ record.createBy }}
          </template>
        </a-table-column>
      </a-table>
    </a-spin>
  </div>
  <d-drawer :title="formTitle" ref="refEditWrap" :refreshParent="refreshPage">
    <attribute-form></attribute-form>
  </d-drawer>
  <d-drawer title="查看表单" ref="refViewWrap" :footerVisible="false">
    <attribute-view></attribute-view>
  </d-drawer>
</template>
<script>
import { reactive, ref, toRefs, onMounted } from "vue";
import { DownOutlined, EditOutlined } from "@ant-design/icons-vue";
import { DDrawer, DFilterBar } from "@/components";

import attributeApi from "@/api/attributeApi";
import AttributeForm from "./AttributeForm";
import AttributeView from "./AttributeView";
import { pager } from "@/library/Common";
import { handleSimpleEvent } from "@/library/utils/Functions";

export default {
  components: {
    //图标
    DownOutlined,
    EditOutlined,
    // 组件
    DDrawer,
    DFilterBar,
    AttributeForm,
    AttributeView
  },
  setup() {
    const refEditWrap = ref(),
      refViewWrap = ref();
    // Vue2.0中 data
    const state = reactive({
      testData: {},
      formTitle: "",
      searchVisible: false,
      loading: true,
      dataList: [],
      pagination: pager, // 分页参数
      searchData: {}, // 搜索
      searchOptions: []
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
          attributeApi.deleteData,
          { id: data },
          refreshPage
        );
      }
    };
    // 列表分页事件
    const handleTableChange = (pagination, filters, sorter, ds) => {
      state.pagination.pageSize = pagination.pageSize;
      state.pagination.current = pagination.current;
      //
      loadData();
      return {
        pagination,
        filters,
        sorter,
        ds
      };
    };
    // 加载数据列表
    const loadData = () => {
      state.loading = true;
      let param = {
        pageSize: state.pagination.pageSize,
        current: state.pagination.current
      };
      Object.assign(param, state.searchData);
      //
      attributeApi
        .getDataListByPage(param)
        .then(res => {
          if (res.code == 0) {
            state.pagination.total = res.pager.totalRecord;
            state.pagination.pageSize = res.pager.pageSize;
            state.dataList = res.dataList;
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
      state.pagination.current = 1;
      loadData();
    };
    // 加载事件
    onMounted(() => {
      loadData();
    });
    return {
      ...toRefs(state),
      handleTableChange,
      handleEditEvent,
      refEditWrap,
      refViewWrap,
      refreshPage
    };
  }
};
</script>
