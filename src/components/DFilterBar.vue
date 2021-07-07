<template>
  <div class="filterbox" v-click-away="onClickAway">
    {{ options }}
    <br />
    -----------------------------
    {{ frmData }}
    <a-input
      size="large"
      class="filter-input"
      allow-clear
      @focus="show = true"
      v-model:value="frmData.keywords"
      :placeholder="placeholder"
    >
      <template #prefix>
        <SearchOutlined class="filter-search" />
      </template>
    </a-input>
    <div class="filterbox-group" v-show="show" :key="1">
      <div
        class="filterbox-item"
        v-for="(filterItem, index) in options"
        :key="index"
      >
        <!-- 自定义时间 -->
        <template v-if="filterItem.type == 'date-range-picker'">
          <a-range-picker v-model:value="frmData[filterItem.dataIndex]">
            <a-badge>{{ filterItem.label }}</a-badge>
          </a-range-picker>
        </template>
        <a-popover
          v-else
          placement="bottomLeft"
          :getPopupContainer="e => e.parentNode"
        >
          <template v-slot:content>
            <!-- 多选 -->
            <a-checkbox-group v-if="filterItem.type == 'checkbox'">
              <a-row v-for="(item, i) in filterItem.options" :key="i">
                <a-col>
                  <a-checkbox :value="item.value">{{ item.label }}</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
            <!-- 单选 -->
            <a-radio-group v-else-if="filterItem.type == 'radio'">
              <a-row v-for="(item, i) in filterItem.options" :key="i">
                <a-col>
                  <a-radio :value="item.value">{{ item.label }}</a-radio>
                </a-col>
              </a-row>
            </a-radio-group>
          </template>
          <div>
            <a-badge
              :dot="
                filterItem.type == 'radio' && options[index].defaultValue
                  ? true
                  : false
              "
            >
              {{ filterItem.label }}
              <a-badge
                v-if="filterItem.type == 'checkbox'"
                class="checkbox-badge"
                :count="options[index].defaultValue.length"
              />
            </a-badge>
            <v-icon name="icon-xiala" class="fr"></v-icon>
          </div>
        </a-popover>
      </div>
    </div>
    <!-- tags -->
    <div class="filter-tags" v-if="hasTag">
      <span v-for="(it, j) in options" :key="j">
        <span v-if="it.type == 'date-range-picker'">
          <span>
            <a-tag closable v-if="it.defaultValue.length">
              {{ it.defaultValue.join(" ~ ") }}
            </a-tag>
          </span>
        </span>
        <span v-else>
          <template v-for="(sub, i) in it.options">
            <template v-if="it.type == 'checkbox'">
              <a-tag
                closable
                :key="i"
                v-if="it.defaultValue.indexOf(sub.value) != -1"
                >{{ sub.label }}</a-tag
              >
            </template>
            <template v-else-if="it.type == 'radio'">
              <a-tag closable :key="i" v-if="item.defaultValue == sub.value">{{
                sub.label
              }}</a-tag>
            </template>
          </template>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, watch } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  name: "DFilterBar",
  components: { SearchOutlined },
  props: {
    placeholder: { type: String, default: "搜索" },
    options: {
      type: Array,
      default: null
    },
    value: [Object, {}]
  },
  setup(props, context) {
    console.info(context);
    const state = reactive({
      show: false,
      timer: null,
      frmData: { keywords: "" }
    });
    //
    // 观察
    watch(
      () => props.options,
      (newValue, oldValue) => {
        alert(newValue + " === " + oldValue);
      }
    );
    //方法
    const finalFilter = () => {
      let obj = {};
      props.options.map(v => {
        obj[v.dataIndex] = v.defaultValue;
      });
      obj[this.dataIndex] = this.keywords;
      //this.$emit("input", obj);
    };
    // initialize
    const initialize = () => {
      // alert(JSON.stringify(props.options));
      props.options.forEach(el => {
        //alert(el.dataIndex);
        state.frmData[el.dataIndex] = el.defaultValue;
      });
    };
    // 事件
    const closeCheckEvent = (eq, val) => {
      console.info(eq, val);
      finalFilter();
    };
    const closeRadioEvent = (eq, val) => {
      console.info(eq, val);
    };
    const closeTimeEvent = val => {
      console.info(val);
    };
    const changeDateEvent = val => {
      console.info(val);
    };
    const cleanEmptyEvent = () => {
      state.show = true;
      state.keywords = "";
    };
    const onClickAway = event => {
      console.log(event);
    };
    //
    initialize();
    return {
      ...toRefs(state),
      closeCheckEvent,
      closeRadioEvent,
      closeTimeEvent,
      changeDateEvent,
      cleanEmptyEvent,
      onClickAway
    };
  }
});
</script>

<style lang="scss" scoped>
$input-bg: #fff;
.filterbox {
  background: $input-bg;
  border-radius: 4px;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1);
  // overflow: hidden;
  .filter-tags {
    padding: 10px 20px;
    border-top: 1px solid #d5d5d5;
  }
  .filter-search {
    font-size: 16px;
  }
  .filter-input .ant-input {
    border: 0;
    outline: none;
    box-shadow: none;
  }
  .filterbox-group {
    border-top: 1px solid #d5d5d5;
    display: flex;
    // background: @background-color-base;
    .filterbox-item {
      font-size: 14px;
      padding: 10px;
      min-width: 100px;
      border-right: 1px solid #eee;
      .checkbox-badge {
        transform: scale(0.8);
        vertical-align: text-top;
      }
    }
  }
}
</style>
