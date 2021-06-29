<template>
  <div class="gm-desc">
    <a-page-header
      class="demo-page-header"
      style="border: 1px solid rgb(235, 237, 240)"
      title="用户管理"
      sub-title="User Management "
    >
      <template #extra>
        <a-button key="3" @click="handleEditEvent('ADD')"
          ><FormOutlined />新增</a-button
        >
        <a-tooltip title="点击显示查询条件" color="#f50">
          <a-button @click="searchVisible = !searchVisible">
            <SearchOutlined />
            <DownOutlined v-if="!searchVisible"/>
            <UpOutlined v-if="searchVisible"/>
          </a-button>
        </a-tooltip>
      </template>
      <a-descriptions
        v-if="searchVisible"
        :column="{ xs: 4, sm: 8, md: 12 }"
        layout="vertical"
      >
        <template #extra>
          <a-radio-group>
            <a-button type="danger" @click="onResetData"> 复原 </a-button>
            <a-button type="primary" @click="onSearchData"> 搜索 </a-button>
          </a-radio-group>
        </template>
        <a-descriptions-item label="创建时间">
          <a-date-picker
            v-model:value="searchData.created"
            valueFormat="YYYY-MM-DD"
          />
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="2">
          <a-range-picker
            v-model:value="searchData.rangeDate"
            valueFormat="YYYY-MM-DD"
          />
        </a-descriptions-item>
        <a-descriptions-item label="用户">
          <a-input v-model:value="searchData.userId" placeholder="用户" />
        </a-descriptions-item>
        <a-descriptions-item label="手机号">
          <a-input v-model:value="searchData.mobile" placeholder="手机号" />
        </a-descriptions-item>
        <a-descriptions-item label="邮箱">
          <a-input v-model:value="searchData.email" placeholder="邮箱" />
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>
  </div>
  {{ searchData }}
  <!-- 头部内容end -->
  <div class="gm-container">
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
    <user-form></user-form>
  </d-drawer>
  <d-drawer title="查看表单" ref="refViewWrap" :footerVisible="false">
    <user-view></user-view>
  </d-drawer>
</template>
<script>
import { createVNode, reactive, ref, toRefs, onMounted } from "vue";
import { DownOutlined, EditOutlined } from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";
import { DDrawer } from "@/components";

import userApi from "@/api/userApi";
import UserForm from "./UserForm";
import UserView from "./UserView";
import pager from "@/library/Common";
export default {
  components: {
    //图标
    DownOutlined,
    EditOutlined,
    // 组件
    DDrawer,
    UserForm,
    UserView
  },
  setup() {
    const refEditWrap = ref(),
      refViewWrap = ref();
    // Vue2.0中 data
    const state = reactive({
      formTitle: "",
      searchVisible: false,
      loading: true,
      dataList: [],
      pagination: pager, // 分页参数
      searchData: {
        created: "",
        userId: "",
        mobile: "",
        email: "",
        rangeDate: ""
      }
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
      } else if (type == "DELETE" || type == "AUTH") {
        let typeText = type == "DELETE" ? "删除" : "审核";
        Modal.confirm({
          title: `确认想${typeText}这条记录吗?`,
          icon: createVNode(DownOutlined),
          content:
            "When clicked the OK button, this dialog will be closed after 1 second",
          onOk() {
            return new Promise((resolve, reject) => {
              setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
            }).catch(() => console.log("Oops errors!"));
          },
          onCancel() {}
        });
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
      userApi
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
      loadData();
    };
    const onSearchData = () => {
      state.pagination.current = 1;
      loadData();
    };
    const onResetData = () => {
      state.searchData = {
        created: "",
        userId: "",
        mobile: "",
        email: "",
        rangeDate: ""
      }
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
      refreshPage,
      onSearchData,
      onResetData
    };
  }
};
</script>
