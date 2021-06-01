<template>
  <div id="time-line">
    <div class="item" v-for="item in items" :key="item.index">
      <div class="item-index">{{ item.index }}</div>
      <div class="item-content">{{ item.content }}</div>
    </div>
  </div>
</template>
<style scoped>
.item {
  border: 1px solid rebeccapurple;
  margin-left: 30px; /*用左边margin显示时间线*/
  width: auto; /*因为左边部分用于显示时间线，所以右边部分减去30px*/
  height: auto; /*高度由内容决定*/
  position: relative;
  margin-bottom: 10px;
  cursor: pointer;
}
.item::before {
  content: "";
  width: 11px;
  height: 11px;
  border-radius: 100%;
  background-color: #be540d;
  position: absolute;
  top: 0px;
  left: -22px;
  z-index: 1000;
}
.item::after {
  content: "";
  width: 3px;
  height: calc(100% + 10px); /*加上10px是item底部的margin*/
  background-color: #c4194c;
  position: absolute;
  top: 0;
  bottom: 10px;
  left: -11px;
}
.item-index {
  line-height: 12px;
  font-size: 12px;
  position: relative;
  color: #656565;
}
.item-content {
  width: 100%;
  height: auto; /*由内容决定*/
  position: relative;
  white-space: pre-wrap; /*保留空白符序列，但是正常地进行换行*/
  word-wrap: break-word; /*在长单词或 URL 地址内部进行换行*/
}
/* 添加鼠标悬浮效果 */
.item:hover::before {
  transform: scale3d(1.2, 1.2, 1);
  background-color: #569ffb;
}

.item:hover::after {
  transform: scale3d(1.1, 1, 1);
  background-color: #569ffb;
}

.item:hover .item-index {
  transform: scale3d(1.01, 1.01, 1);
  color: #343434;
}
</style>
<script>
import { defineComponent, toRefs, reactive } from "vue";

export default defineComponent({
  name: "DMenu",
  setup() {
    const state = reactive({
      items: [
        {
          index: "2020-8-14 13:20:30",
          content: "开始毕设。。"
        },
        { index: "2020-8-15 13:20:30", content: "写前端。。" },
        {
          index: "2020-8-16 13:20:30",
          content: "还在写前端。。"
        },
        {
          index: "2020-8-17 13:20:30",
          content: "仍在写前端。。"
        },
        { index: "2020-8-18 13:20:30", content: "不想写前端。。" },
        { index: "2020-8-19 13:20:30", content: "还得写前端。。。。。" }
      ]
    });
    return {
      ...toRefs(state)
    };
  }
});
</script>
