<template v-if="filter(data)">
  <a-sub-menu v-if="hasChildren(data)" :key="data.id" v-bind="menuProps">
    <template v-slot:title>
      <component :is="$AntdIcons[data.icon]" />
      <!-- <span role="img">
        <img class="menu-icon" v-if="data.icon" :src="data.icon" />
      </span> -->
      <span>{{ data.name }}</span>
    </template>
    <d-menu
      v-for="item of data.children"
      :data="item"
      :key="item.id"
      :filter="filter"
    />
  </a-sub-menu>
  <a-menu-item v-else :key="data.id" v-bind="menuProps">
    <component :is="$AntdIcons[data.icon]" v-if="data.icon" />
    <span>{{ data.name }}</span>
  </a-menu-item>
</template>

<script>
import { defineComponent, toRefs, reactive } from "vue";
import { Menu } from "ant-design-vue";
import { AppstoreOutlined } from "@ant-design/icons-vue";
const DEFAULT_PROPS = {
  data: Object,
  filter: {
    type: Function,
    default: () => true
  }
};

export default defineComponent({
  name: "DMenu",
  props: {
    ...Menu.SubMenu.props,
    ...DEFAULT_PROPS
  },
  components: { AppstoreOutlined },
  setup(props) {
    const menuProps = { ...props };
    const defaultPropsKeys = Object.keys(DEFAULT_PROPS);
    // 移除与Antd菜单组件不相关数据
    for (var key of defaultPropsKeys) {
      delete menuProps[key];
    }
    /*=属性定义========================================*/
    const data = reactive({
      collapsed: false,
      loading: false,
      username: "What's Ip"
    });
    /*=定义方法函数========================================*/
    const hasChildren = menu => {
      const { filter } = props;
      const children = menu?.children;
      if (children == null || children.length == 0) return false;

      // 校验过滤后的参数
      for (const item of children) {
        if (filter(item)) return true;
      }
      return false;
    };
    /*=自定义事件========================================*/
    return {
      ...toRefs(data),
      menuProps,
      hasChildren
    };
  }
});
</script>

<style lang="scss" scoped>
.menu-icon {
  height: 16px;
  width: 16px;
  margin: -4px 10px 0 0;
}
</style>
