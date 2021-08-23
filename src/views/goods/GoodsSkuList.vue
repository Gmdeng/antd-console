<template>
  <div class="gm-desc">
    <a-page-header
      class="demo-page-header"
      style="border: 1px solid rgb(235, 237, 240)"
      title="商品SKU管理"
      sub-title="Goods Stock Keeping Unit Management "
    >
      <template #extra>
        <a-button key="3" @click="handleEditEvent('ADD')"
          ><FormOutlined />新增</a-button
        >
      </template>
    </a-page-header>
  </div>
  <!-- 头部内容end -->
  <div class="gm-container">
    <d-filter-bar
      v-model:value="searchData"
      :options="searchOptions"
      @onSearch="refreshPage"
      placeholder="请输入属性名称查询"
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
                </a-menu>
              </template>
            </a-dropdown>
            <span>
              <a-divider type="vertical" />
            </span>
          </template>
        </a-table-column>
        <a-table-column key="thumb" title="缩略图" data-index="thumb" />
        <a-table-colum
          key="catalogName"
          title="所属分类"
          data-index="catalogName"
        />
        <a-table-column key="name" title="商品名称" data-index="name" />
        <a-table-column key="code" title="商品编码" data-index="code" />
        <a-table-column key="brandName" title="品牌ID" data-index="brandName" />
        <a-table-column key="unit" title="单位" data-index="unit" />
        <a-table-column key="price" title="销售价" data-index="price" />
      </a-table>
    </a-spin>
  </div>
  <!-- 组件 -->
  <d-drawer title="增加SKU" ref="refAddWrap" :refreshParent="refreshPage">
    <goods-sku-add-form></goods-sku-add-form>
  </d-drawer>
  <d-drawer :title="formTitle" ref="refEditWrap" :refreshParent="refreshPage">
    <goods-sku-form></goods-sku-form>
  </d-drawer>
  <d-drawer title="查看表单" ref="refViewWrap" :footerVisible="false">
    <goods-sku-view></goods-sku-view>
  </d-drawer>
</template>
<script>
import { reactive, ref, toRefs, onMounted } from "vue";
import { DownOutlined, EditOutlined } from "@ant-design/icons-vue";
import { DDrawer, DFilterBar } from "@/components";

import goodsSkuApi from "@/api/goodsSkuApi";
import GoodsSkuAddForm from "./GoodsSkuAddForm";
import GoodsSkuForm from "./GoodsSkuForm";
import GoodsSkuView from "./GoodsSkuView";
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
    GoodsSkuForm,
    GoodsSkuView,
    GoodsSkuAddForm
  },
  setup() {
    const refEditWrap = ref(),
      refAddWrap = ref(),
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
        refAddWrap.value.Open(data);
      } else if (type == "EDIT") {
        state.formTitle = "修改表单";
        refEditWrap.value.Open(data);
      } else if (type == "VIEW") {
        refViewWrap.value.Open(data);
      } else if (type == "DELETE") {
        //
        handleSimpleEvent(
          "删除",
          goodsSkuApi.deleteData,
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
        pager: {
          pageSize: state.pagination.pageSize,
          indexPage: state.pagination.current
        }
      };
      Object.assign(param, state.searchData);
      //
      goodsSkuApi
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
      refAddWrap,
      refEditWrap,
      refViewWrap,
      refreshPage
    };
  }
};
</script>
