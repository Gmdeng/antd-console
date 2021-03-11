<template>
  <div class="gm-desc">
    <a-page-header
      class="demo-page-header"
      style="border: 1px solid rgb(235, 237, 240)"
      title="卡片列表"
      sub-title="这是一个小标题This is a subtitle"
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
  <!-- 头部内容end -->
  <div class="gm-container">
    <a-spin :spinning="loading" style="width: 100%">
      <a-table :data-source="data" :loading="false">
        <a-table-column-group>
          <template #title><span style="color: #1890ff">姓名</span></template>
          <a-table-column key="firstName" data-index="firstName">
            <template #title
              ><span style="color: #1890ff">First Name</span></template
            >
          </a-table-column>
          <a-table-column
            key="lastName"
            title="Last Name"
            data-index="lastName"
          />
        </a-table-column-group>
        <a-table-column key="age" title="年龄" data-index="age" />
        <a-table-column key="address" title="地址" data-index="address" />
        <a-table-column key="tags" title="标志" data-index="tags">
          <template #default="{ text: tags }">
            <span>
              <a-tag v-for="tag in tags" :key="tag" color="blue">{{
                tag
              }}</a-tag>
            </span>
          </template>
        </a-table-column>
        <a-table-column key="action" title="操作">
          <template #default="{ record }">
            <a-dropdown>
              <a class="ant-dropdown-link" @click.prevent>
                操作<SettingOutlined />
                <DownOutlined />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="onEditEvent('VIEW', record.firstName)"
                    >查看</a-menu-item
                  >
                  <a-menu-item @click="onEditEvent('EDIT', record.firstName)"
                    >修改</a-menu-item
                  >
                  <a-menu-item @click="onEditEvent('DELETE', record.firstName)">
                    删除
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item @click="onEditEvent('AUDTH', record.firstName)"
                    >审核</a-menu-item
                  >
                </a-menu>
              </template>
            </a-dropdown>
            <span>
              <a-divider type="vertical" />
              <a-popconfirm
                title="Are you sure delete this task?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="onConfirmDelete"
              >
                <a>Delete</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table-column>
      </a-table>
    </a-spin>
  </div>
  <d-drawer title="新增/修改表单" ref="refEditWrap">
    <list-from></list-from>
  </d-drawer>
  <d-drawer title="查看表单" ref="refViewWrap" :footerVisible="false">
    <list-from></list-from>
  </d-drawer>
</template>
<script>
import { createVNode, reactive, ref, getCurrentInstance } from "vue";
import { DownOutlined, SettingOutlined } from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";
import { DDrawer } from "@/components";
import ListFrom from "./ListFrom";
export default {
  components: {
    //图标
    DownOutlined,
    SettingOutlined,
    // 组件
    ListFrom,
    DDrawer
  },
  setup() {
    const ctx = getCurrentInstance();
    const refEditWrap = ref();
    const refViewWrap = ref();
    const data = [
      {
        key: "1",
        firstName: "John",
        lastName: "Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
        tags: ["nice", "developer"]
      },
      {
        key: "2",
        firstName: "Jim",
        lastName: "Green",
        age: 42,
        address: "London No. 1 Lake Park",
        tags: ["loser"]
      },
      {
        key: "3",
        firstName: "Joe",
        lastName: "Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"]
      }
    ];
    const dataList = reactive({ code: 0, list: [] });
    const loading = ref(false);
    // 编辑
    const onEditEvent = (type, data) => {
      if (type == "EDIT") {
        refEditWrap.value.Open(data);
      } else if (type == "VIEW") {
        refViewWrap.value.Open(data);
      } else if (type == "DELETE" || type == "AUDTH") {
        let titleText =
          type == "DELETE"
            ? "Do you want to delete these items?"
            : "Do you want to auth these items?";
        Modal.confirm({
          title: titleText,
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
    const onConfirmDelete = e => {
      console.log(e);
      ctx.$message.success("Click on Yes");
    };
    return {
      dataList,
      data,
      loading,
      onConfirmDelete,
      onEditEvent,
      refEditWrap,
      refViewWrap
    };
  }
};
</script>
