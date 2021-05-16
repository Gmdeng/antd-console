<template>
  <div class="gm-desc">
    <a-page-header
      class="demo-page-header"
      style="border: 1px solid rgb(235, 237, 240)"
      title="模块管理"
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
                  <a-menu-item @click="handleEditEvent('VIEW', record.id)">查看</a-menu-item>
                  <a-menu-item @click="handleEditEvent('EDIT', record.id)">修改</a-menu-item>
                  <a-menu-item @click="handleEditEvent('DELETE', record.id)">删除</a-menu-item>
                  <a-menu-divider />
                  <a-menu-item @click="handleEditEvent('AUDTH', record.id)">审核</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <span>
              <a-divider type="vertical" />
            </span>
          </template>
        </a-table-column>
        <a-table-column key="code" title="编码" data-index="code" />
        <a-table-column key="name" title="名称" data-index="name" />
        <a-table-column key="type" title="类型" data-index="type" />
        <a-table-column key="icon" title="图标" data-index="icon">
          <template #default="{ record }">
            <component :is="$AntdIcons[record.icon]" />
          </template>
        </a-table-column>
        <a-table-column key="idx" title="排序" data-index="idx" />
        <a-table-column key="url" title="链接地址" data-index="url" />
        <a-table-column key="operate" title="权限" data-index="operate">
          <template #default="{ text: operate }">
            <span v-for="(it, k) in operate" :key="k">
              <a-tag>{{it}}</a-tag>
            </span>
            <span v-for="(it, k) in operateList" :key="k">
              <a-tag :color="it.color" v-if="(operate & it.key) == it.key">
                {{ it.text }}
              </a-tag>
            </span>
          </template>
        </a-table-column>
        <a-table-column key="status" title="状态" data-index="status" />
        <a-table-column key="action" title="创建时间/人">
          <template #default="{ record }">
            {{ record.createOn }}/{{ record.createBy }}
          </template>
        </a-table-column>
      </a-table>
    </a-spin>
  </div>
  <d-drawer :title="formTitle" ref="refEditWrap" :refreshParent="refreshPage">
    <module-form></module-form>
  </d-drawer>
  <d-drawer title="查看表单" ref="refViewWrap" :footerVisible="false">
    <module-view></module-view>
  </d-drawer>
</template>
<script>
import { reactive, ref, toRefs, onMounted } from "vue";
import { DownOutlined, EditOutlined } from "@ant-design/icons-vue";

import { DDrawer } from "@/components";
import { handleSimpleEvent } from "@/library/utils/Functions";
import moduleApi from "@/api/moduleApi";
import ModuleForm from "./ModuleForm";
import ModuleView from "./ModuleView";
export default {
  components: {
    //图标
    DownOutlined,
    EditOutlined,
    // 组件
    DDrawer,
    ModuleForm,
    ModuleView
  },
  setup() {
    const refEditWrap = ref(); // 编辑
    const refViewWrap = ref(); // 查看
    // Vue2.0中 data
    const state = reactive({
      formTitle: "",
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
      } else if (type == "DELETE") {
        // 
        handleSimpleEvent("删除", moduleApi.deleteData, {moduleId: data}, refreshPage);
      } else if(type == "AUDTH"){
        handleSimpleEvent("审核", moduleApi.authData, {moduleId: data, status: 1}, refreshPage);
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
      moduleApi
        .getDataListByPage(param)
        .then(res => {
          if (res.code == 0) {
            // alert(JSON.stringify(res.dataList));
            // alert(JSON.stringify(res.pager));
            state.pagination.total = res.pager.totalRecord;
            state.pagination.pageSize = res.pager.pageSize;
            state.dataList = res.dataList;
            // alert(JSON.stringify(state.dataList));
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
      //alert(val + "=======" + txt);
      let param = {
        pageSize: state.pagination.pageSize,
        current: state.pagination.current
      };
      loadData(param);
    };
    // 页面加载事件
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
      refViewWrap,
      refreshPage
    };
  }
};
</script>
