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
        <a-button key="3" @click="searchVisible = !searchVisible"
          ><SearchOutlined /><DownOutlined v-if="!searchVisible"/>
          <UpOutlined v-if="searchVisible"
        /></a-button>
      </template>
      <a-descriptions
        v-if="searchVisible"
        title="-- 搜索条件 --"
        size="small"
        :column="6"
        layout="vertical"
      >
        <template #extra>
          <a-button type="primary">搜索</a-button>
        </template>
        <a-descriptions-item label="Created">
          <a-input placeholder="Created" />
        </a-descriptions-item>
        <a-descriptions-item label="Created">
          <a-input placeholder="Association" />
        </a-descriptions-item>
        <a-descriptions-item label="Created">
          <a-input placeholder="Creation Time"
        /></a-descriptions-item>
        <a-descriptions-item label="Created">
          <a-input placeholder="Effective Time"
        /></a-descriptions-item>
        <a-descriptions-item label="Created">
          <a-input placeholder="Remark" />
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>
  </div>
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
        <a-table-column key="id" title="ID" data-index="id" />
        <a-table-column key="userId" title="用户名" data-index="userId" />
        <a-table-column key="petName" title="昵称" data-index="petName" />
        <a-table-column key="mobile" title="手机号" data-index="mobile" />
        <a-table-column
          key="allowIpaddr"
          title="允许登录IP"
          data-index="allowIpaddr"
        />
        <a-table-column
          key="denyIpaddr"
          title="拒绝登录IP"
          data-index="denyIpaddr"
        />
        <a-table-column key="status" title="状态" data-index="status" />
        <a-table-column key="create" title="创建时间/人">
          <template #default="{ record }">
            {{ record.createOn }}/{{ record.createBy }}
          </template>
        </a-table-column>
      </a-table>
    </a-spin>
  </div>
  <d-drawer :title="formTitle" ref="refEditWrap">
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
    const refEditWrap = ref();
    const refViewWrap = ref();
    // Vue2.0中 data
    const state = reactive({
      formTitle: "",
      searchVisible: false,
      loading: true,
      dataList: [],
      pagination: {
        total: 0, //总条数
        pageSize: 15, // 每页条数
        defaultPageSize: 15, //默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ["15", "30", "50", "100"], // 每页数量选项
        showTotal: (total, range) => `共 ${total} 条数据, - ${range} ` // 显示总数
      },
      operateList: {
        ADD: { key: 1, text: "增加", color: "red" },
        MODIFY: { key: 2, text: "修改", color: "blue" },
        DELETE: { key: 4, text: "删除", color: "gold" },
        CANCEL: { key: 8, text: "取消", color: "red" },
        AUDIT: { key: 16, text: "审核", color: "green" },
        VIEW: { key: 32, text: "查看", color: "blue" }
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
      //console.info(JSON.stringify(pagination));
      console.info(JSON.stringify(filters));
      console.info(JSON.stringify(sorter));
      // console.info(JSON.stringify(ds.currentDataSource));
      let param = {
        pageSize: pagination.pageSize,
        current: pagination.current
      };
      //
      loadData(param);
      return {
        pagination,
        filters,
        sorter,
        ds
      };
    };
    // 加载数据列表
    const loadData = param => {
      state.loading = true;
      userApi
        .getDataListByPage(param)
        .then(res => {
          if (res.code == 0) {
            state.pagination.total = res.data.totalRecord;
            state.dataList = res.data.dataList;
          }
          state.loading = false;
        })
        .catch(() => {
          //alert(err);
          state.loading = false;
        });
    };
    // 加载事件
    onMounted(() => {
      let param = {
        pageSize: state.pagination.pageSize,
        current: 1
      };
      loadData(param);
    });
    return {
      ...toRefs(state),
      handleTableChange,
      handleEditEvent,
      refEditWrap,
      refViewWrap
    };
  }
};
</script>
