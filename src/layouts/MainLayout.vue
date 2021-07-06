<template>
  <a-layout class="main-layout">
    <!-- 侧栏菜单 -->
    <a-layout-sider
      class="main-sider"
      v-model:collapsed="collapsed"
      collapsible
    >
      <!-- <template #trigger>
      </template> -->
      <div class="logo">
        <img src="../assets/logoM.png" />
        <strong>System Admin</strong>
      </div>
      <a-menu theme="dark" mode="inline" @click="onTabsAdd">
        <template
          v-for="item of $store.state.menu.availableMenus"
          :key="item.id"
        >
          <d-menu :data="item" />
        </template>
      </a-menu>
    </a-layout-sider>
    <!-- 侧栏菜单 end -->
    <!-- 右边部分 -->
    <a-layout>
      <a-layout-header class="gm-header" style="background: #fff; padding: 0;">
        <div class="gm-header-lefter">
          <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined
            v-else
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          Hello System
        </div>
        <div class="gm-header-righter">
          <!-- 头像 -->
          <a-dropdown>
            <span class="avatar-dropdown menu-item">
              <a-spin :spinning="loading">
                <a-avatar
                  class="account-avatar"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
                <div class="account-name">
                  <span v-if="username">王三狗子</span>
                  <span v-else>{{ loading }}loading...</span>
                  <DownOutlined />
                </div>
              </a-spin>
            </span>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="onProfile">
                  <user-outlined />
                  个人中心
                </a-menu-item>
                <a-menu-item @click="onModifyPasswd">
                  <lock-outlined />
                  修改密码
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item @click="onExitLogin">
                  <logout-outlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <!-- 注销按钮 
          <span class="menu-item menu-icon">
            <logout-outlined />
          </span>
          -->
        </div>
      </a-layout-header>
      <div class="main-navbar">
        <a-tabs
          tab-position="top"
          hide-add
          @edit="onTabsEdit"
          type="editable-card"
          @change="onTabsChange"
          v-model:activeKey="activeKey"
        >
          <a-tab-pane
            v-for="tab in $store.state.menu.openMenus"
            :key="tab.key"
            :tab="tab.name"
            :closable="tab.closable"
          >
          </a-tab-pane>
          <template #tabBarExtraContent>
            <a-dropdown>
              <BarsOutlined />
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="onTabsAction('closeLeftMenu')"
                    >刷新当前页</a-menu-item
                  >
                  <a-menu-item @click="onTabsAction('closeLeftMenu')">
                    关闭左边
                  </a-menu-item>
                  <a-menu-item @click="onTabsAction('closeRightMenu')"
                    >关闭右边</a-menu-item
                  >
                  <a-menu-item @click="onTabsAction('closeAllMenu')"
                    >关闭全部</a-menu-item
                  >
                  <a-menu-item @click="onTabsAction('closeRightMenu')"
                    >关闭其他</a-menu-item
                  >
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </a-tabs>
        <!-- 菜单面包屑 -->
        <d-breadcrumb :paths="menus" />
        <!-- 菜单面包屑 end  -->
      </div>
      <!-- 内容部分 -->
      <a-layout-content class="main-content">
        <router-view></router-view>
      </a-layout-content>
      <!-- 内容部分 end -->
      <!-- <a-layout-footer class="main-footer">
        xxx ©2018 Created by Ant UED
      </a-layout-footer> -->
    </a-layout>
  </a-layout>
  <!-- 修改密码 -->
  <d-modify-password ref="refModifyPassowdWrap"></d-modify-password>
  <!-- 个人信息 -->
  <d-profile ref="refProfileWrap"></d-profile>
</template>
<script>
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  computed,
  getCurrentInstance,
  ref
} from "vue";

import { DMenu, DBreadcrumb } from "@/components";
import {
  DownOutlined,
  BarsOutlined,
  UserOutlined,
  LockOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { DModifyPassword, DProfile } from "@/components";
export default defineComponent({
  name: "MainLayout",
  components: {
    DMenu,
    DBreadcrumb,
    DownOutlined,
    BarsOutlined,
    UserOutlined,
    LockOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LogoutOutlined,
    DModifyPassword,
    DProfile
  },
  setup(props, context) {
    context.attrs;
    context.slots;
    context.emit;
    const refModifyPassowdWrap = ref(); // 编辑
    const refProfileWrap = ref();
    // console.dir(props);
    const { ctx } = getCurrentInstance();
    // 状态管理器
    const store = useStore();
    const route = useRoute();

    /*=属性定义========================================*/
    const state = reactive({
      collapsed: true,
      loading: false,
      username: "What's Ip",
      menus: ["主页", "列表"]
    });

    // 当前活动KEY
    const activeKey = computed(() => store.state.menu.activeMenu.key),
      getters = computed(() => store.getters), // 获取整个getters
      filterMenu = computed(() => store.getters["menu/filterMenu"]); //获取单个getters
    /*=监听定义========================================*/
    // 监听路由路劲, immediate 是否立即执行一次
    watch(
      () => route.path,
      newValue => {
        console.info("======================");
        console.info(newValue);
      },
      { immediate: true }
    );
    // 加载菜单数据
    store.dispatch("menu/loadMenu");
    /*=自定义事件========================================*/
    // 个人资料
    const onProfile = () => {
      ctx.$message.success("个人资料");
      refProfileWrap.value.Open();
    };
    // 修改密码
    const onModifyPasswd = () => {
      ctx.$message.error("修改密码");
      refModifyPassowdWrap.value.Open();
    };
    // 菜单操作事件
    const onTabsAdd = item => {
      store.dispatch("menu/addMenu", item);
    };
    // 菜单操作事件 type= {"AllMenu", "OtherMenu", "RightMenu", "LeftMenu"}
    const onTabsAction = type => {
      store.dispatch("menu/" + type);
    };
    // 菜单操作事件
    const onTabsEdit = (key, evt) => {
      if (evt == "remove") {
        store.dispatch("menu/closeMenu", key);
      } else if (evt == "add") {
        alert("TODO: i am add Event");
      }
    };
    // 菜单切换操作事件
    const onTabsChange = key => {
      store.dispatch("menu/switchMenu", key);
    };
    // 退出
    const onExitLogin = () => {
      store.dispatch("auth/logout");
    };
    return {
      ...toRefs(state),
      onProfile,
      onModifyPasswd,
      onTabsEdit,
      onTabsAdd,
      onTabsAction,
      onTabsChange,
      onExitLogin,
      activeKey,
      getters,
      filterMenu,
      refModifyPassowdWrap,
      refProfileWrap
    };
  }
});
</script>
<style lang="scss" sc>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.main-layout {
  height: 100%;
  width: 100%;
  & .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
      color: #1890ff;
    }
  }
  & .logo {
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
    color: #fff;
    font-size: 24px;
    overflow: hidden;
    & img {
      display: inline-block;
      height: 32px;
      vertical-align: middle;
    }
  }
  & .main-sider {
    box-shadow: 2px 0 4px #888;
  }
  & .main-content {
    border-top: 4px solid rgb(238, 236, 236);
    min-height: 280px;
    overflow: auto;
    background-color: #ececec;
  }
  & .main-navbar {
    position: relative;
    padding: 0;
  }
  & .main-footer {
    height: 20px;
    padding: 0px 15px;
  }
}
.gm-header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  overflow: hidden;
  &-lefter {
    flex-grow: 4;
  }
  &-righter {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    .menu-item {
      transition: all 0.3s;
      &:hover {
        cursor: pointer;
        color: #1890ff;
        background-color: #f5f5f5;
      }
    }
    .menu-icon {
      font-size: 18px;
      line-height: 64px;
      padding: 0 10px;
    }
    .avatar-dropdown {
      margin: 0px 8px;
      padding: 0px 10px;
      .account-avatar {
        margin-right: 8px;
      }
      .account-name {
        float: right;
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.ant-layout-sider-collapsed .logo {
  text-align: center;
}
.ant-tabs-bar.ant-tabs-top-bar {
  margin: 0 0 8px 0;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 1px 4px #ddd;
}
.ant-tabs-tab-prev,
.ant-tabs-tab-next {
  background-color: rgba(255, 255, 255, 0.089);
}
.ant-tabs-tabpane {
  padding: 0px 15px;
  background-color: rgb(255, 255, 255);
}

/* breadcrumb transition */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all 0.5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
