import menuApi from "@/api/menuApi";
import router from "@/router";
import { TreeToList } from "@/library/utils/Functions";
const MENU_STORAGE = "menu-tree";
const FIXED_MENU = { key: 0, url: "/home", name: "主页", closable: false }; // 固定菜单
//
const menuModule = {
  namespaced: true,
  state() {
    let availableMenus = [], // 左边菜单
      availableMenuList = [],
      openMenus = [], // 打开菜单
      activeMenu = FIXED_MENU;

    // 如果存在菜单数据则加载
    const mentTreeData = localStorage.getItem(MENU_STORAGE);
    if (mentTreeData) {
      availableMenus = JSON.parse(mentTreeData);
    }
    //初始化打开菜单
    openMenus.push(FIXED_MENU);
    return {
      availableMenus,
      availableMenuList,
      openMenus,
      activeMenu
    };
  },
  getters: {
    menuList({ availableMenus }) {
      return availableMenus;
    },
    menuMap({ availableMenus }) {
      return keyGen => {
        const data = availableMenus.reduce((map, item) => {
          map[keyGen(item)] = item;
          return map;
        }, {});
        return data;
      };
    },
    filterMenu({ availableMenus }) {
      // console.info(JSON.stringify(availableMenus));
      return filter => {
        const recursion = menu => {
          for (var item of menu) {
            if (filter(item)) {
              return item;
            }
            // 如果存在子菜单则递归一次
            const { children } = item;
            if (children?.length > 0) {
              const callback = recursion(children);
              if (callback) return callback;
            }
          }
          return null;
        };

        return recursion(availableMenus ?? []);
      };
    }
  },
  mutations: {
    // 保存数据
    saveMenuTree(state, data) {
      // let routes = router.options.routes;
      // console.info(JSON.stringify(routes));
      // 保存数据
      state.availableMenus = data;
      state.availableMenuList = TreeToList(data);
      localStorage.setItem(MENU_STORAGE, JSON.stringify(data));
    },
    // 新增 - tab
    addTab(state, newTab) {
      state.openMenus.push(newTab);
      state.activeMenu = newTab;
      //alert(JSON.stringify(state.activeMenu));
      router.push(state.activeMenu.url);
    },
    // 刷新 - tab
    refreshTab(state, menus) {
      state.openMenus = menus;
    },
    // 切换当前 - tab
    switchTab(state, tab) {
      state.activeMenu = tab;
      // alert(JSON.stringify(state.activeMenu));
      router.push(state.activeMenu.url);
    },
    // 关闭 - tab
    closeTab(state, tabKey) {
      let idx = state.openMenus.findIndex(f => f.key == tabKey);
      let newTabs = state.openMenus.filter(f => f.key !== tabKey);
      state.activeMenu = newTabs[idx - 1];
      state.openMenus = newTabs;
      router.push(state.activeMenu.url);
    }
  },
  actions: {
    async loadMenu({ commit }) {
      const { data } = await menuApi.getMenuList();
      commit("saveMenuTree", data);
    },
    addMenu({ state, commit }, menu) {
      let hasTab = state.openMenus.find(f => f.key == menu.key);
      if (!hasTab) {
        let currMenu = state.availableMenus;
        for (var key of menu.keyPath.reverse()) {
          currMenu = currMenu.find(f => f.id == key);
          const { children } = currMenu;
          currMenu = children?.length > 0 ? children : currMenu;
        }
        // alert(JSON.stringify(currMenu));
        let hasTab = {
          key: currMenu.id,
          name: currMenu.name,
          url: currMenu.url,
          closable: true
        };
        commit("addTab", hasTab);
      } else {
        commit("switchTab", hasTab);
      }
    },
    switchMenu({ state, commit }, tabKey) {
      if (state.activeMenu.key == tabKey) return;
      let hasTab = state.openMenus.find(f => f.key == tabKey);
      commit("switchTab", hasTab);
    },
    closeMenu({ commit }, tabKey) {
      if (tabKey == FIXED_MENU.key) return;
      commit("closeTab", tabKey);
    },
    closeAllMenu({ state, commit }) {
      let newTabs = state.openMenus.filter(f => f.key == FIXED_MENU.key);
      commit("refreshTab", newTabs);
    },
    closeLeftMenu({ state, commit }) {
      let indexNum = state.openMenus.findIndex(
        f => f.key == state.activeMenuKey
      );
      let newTabs = state.openMenus.filter(
        (f, idx) => f.key == FIXED_MENU.key || idx <= indexNum
      );
      commit("refreshTab", newTabs);
    },
    closeRightMenu({ state, commit }) {
      let indexNum = state.openMenus.findIndex(
        f => f.key == state.activeMenuKey
      );
      let newTabs = state.openMenus.filter(
        (f, idx) => f.key == FIXED_MENU.key || idx >= indexNum
      );
      commit("refreshTab", newTabs);
    },
    closeOtherMenu({ state, commit }) {
      let newTabs = state.openMenus.filter(
        f => f.key == FIXED_MENU.key || f.key == state.activeMenuKey
      );
      commit("refreshTab", newTabs);
    }
  }
};
export default menuModule;
