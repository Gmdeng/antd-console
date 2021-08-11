<template>
  <div class="filterbox">
    <div class="filterbox-input">
      <a-input
        size="large"
        class="filter-input"
        allow-clear
        v-model:value="frmData.keywords"
        :placeholder="placeholder"
      >
        <template #prefix>
          <SearchOutlined class="filter-search" />
        </template>
        <template #suffix>
          <a-button type="primary" @click="onSearchEvent" size="large">
            搜索
          </a-button>
        </template>
      </a-input>
    </div>
    <div class="filterbox-group" :key="1">
      <div
        class="filterbox-item"
        v-for="(filterItem, index) in options"
        :key="index"
      >
        <!-- 自定义时间 -->
        <template v-if="filterItem.type == 'date-picker'">
          <a-date-picker
            v-model:value="frmData[filterItem.dataIndex]"
            valueFormat="YYYY-MM-DD"
            @focus="show = true"
          >
            <a-badge>{{ filterItem.label }}</a-badge>
          </a-date-picker>
        </template>
        <!-- 日期范围 -->
        <template v-else-if="filterItem.type == 'date-range-picker'">
          <a-range-picker
            v-model:value="frmData[filterItem.dataIndex]"
            valueFormat="YYYY-MM-DD"
            @focus="show = true"
          >
            <a-badge>{{ filterItem.label }}</a-badge>
          </a-range-picker>
        </template>
        <!-- 输入框 -->
        <template v-else-if="filterItem.type == 'input'">
          <a-input
            size="small"
            allow-clear
            v-model:value="frmData[filterItem.dataIndex]"
            :placeholder="filterItem.label"
          ></a-input>
        </template>
        <a-popover
          v-else
          placement="bottomLeft"
          :getPopupContainer="e => e.parentNode"
        >
          <template v-slot:content>
            <!-- 多选 -->
            <a-checkbox-group
              v-if="filterItem.type == 'checkbox'"
              v-model:value="frmData[filterItem.dataIndex]"
            >
              <a-row v-for="(item, i) in filterItem.options" :key="i">
                <a-col>
                  <a-checkbox :value="item.value">{{ item.label }}</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
            <!-- 单选 -->
            <a-radio-group
              v-else-if="filterItem.type == 'radio'"
              v-model:value="frmData[filterItem.dataIndex]"
            >
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
                filterItem.type == 'radio' &&
                frmData[filterItem.dataIndex].length > 0
                  ? true
                  : false
              "
            >
              {{ filterItem.label }}
              <a-badge
                v-if="filterItem.type == 'checkbox'"
                class="checkbox-badge"
                :count="frmData[filterItem.dataIndex].length"
              />
            </a-badge>
          </div>
        </a-popover>
      </div>
    </div>
    <!-- tags -->
    <div class="filter-tags" v-if="hasTag">
      <span v-for="(it, j) in options" :key="j">
        <span v-if="it.type == 'date-range-picker'">
          <span>
            <a-tag
              closable
              v-if="frmData[it.dataIndex].length"
              @close.prevent="clseTagEvent(it.dataIndex)"
            >
              {{ frmData[it.dataIndex].join(" ~ ") }}
            </a-tag>
          </span>
        </span>
        <span v-else-if="it.type == 'date-picker'">
          <span>
            <a-tag
              closable
              v-if="frmData[it.dataIndex].length"
              @close.prevent="clseTagEvent(it.dataIndex)"
            >
              {{ frmData[it.dataIndex] }}
            </a-tag>
          </span>
        </span>
        <span v-else-if="it.type == 'input'">
          <a-tag
            closable
            v-if="frmData[it.dataIndex].length > 0"
            @close.prevent="clseTagEvent(it.dataIndex)"
          >
            {{ frmData[it.dataIndex] }}
          </a-tag>
        </span>
        <span v-else>
          <template v-for="(sub, i) in it.options">
            <template v-if="it.type == 'checkbox'">
              <a-tag
                closable
                :key="i"
                @close.prevent="clseTagEvent(it.dataIndex, sub.value)"
                v-if="frmData[it.dataIndex].indexOf(sub.value) != -1"
              >
                {{ sub.label }}</a-tag
              >
            </template>
            <template v-else-if="it.type == 'radio'">
              <a-tag
                closable
                @close.prevent="clseTagEvent(it.dataIndex)"
                :key="i"
                v-if="frmData[it.dataIndex] == sub.value"
              >
                {{ sub.label }}</a-tag
              >
            </template>
          </template>
        </span>
      </span>
    </div>
    <!-- tags end -->
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, watch, computed } from "vue";
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
    // onSearch: {
    //   type: Function,
    //   default: () => {
    //     alert("No Refresh Data");
    //   }
    // }
  },
  setup(props, context) {
    // console.info(context);
    const state = reactive({
      show: false,
      timer: null,
      hasTag: true,
      frmData: computed({
        get() {
          return props.value;
        },
        set(v) {
          context.emit("update:value", v);
        }
      })
    });
    //
    // 观察
    watch(
      () => state.frmData,
      (newValue, oldValue) => {
        alert(newValue + " === " + oldValue);
      }
    );
    // 方法
    // 初始化
    const initialize = () => {
      props.options.forEach(el => {
        state.frmData[el.dataIndex] = el.defaultValue;
      });
    };
    // 事件
    const clseTagEvent = (dataIndex, idx) => {
      let arr = props.options.filter(item => {
        return item.dataIndex === dataIndex;
      });
      // 清空选择值
      if (arr.length == 1) {
        if (arr[0].type == "input") {
          state.frmData[dataIndex] = "";
        } else if (arr[0].type == "date-picker") {
          state.frmData[dataIndex] = "";
        } else if (arr[0].type == "date-range-picker") {
          state.frmData[dataIndex] = [];
        } else if (arr[0].type == "checkbox") {
          // alert(idx);
          // alert(JSON.stringify(state.frmData[dataIndex]));
          for (var i = 0; i < state.frmData[dataIndex].length; i++) {
            // alert(state.frmData[dataIndex][i]);
            if (state.frmData[dataIndex][i] == idx) {
              state.frmData[dataIndex].splice(i, 1);
              break;
            }
          }
          // state.frmData[dataIndex] = [];
        } else if (arr[0].type == "radio") {
          state.frmData[dataIndex] = "";
        }
      }
      // console.info(dataIndex);
    };
    const onClickAway = () => {
      state.show = false;
      // console.log(event);
    };
    const onSearchEvent = () => {
      context.emit("onSearch");
    };
    //
    initialize();
    return {
      ...toRefs(state),
      clseTagEvent,
      onClickAway,
      onSearchEvent
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
  border-bottom: 5px solid #424141;
  margin-bottom: 10px;
  // overflow: hidden;
  .filter-tags {
    padding: 10px 20px;
    border-top: 1px solid #d5d5d5;
    //background-color: seagreen;
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
