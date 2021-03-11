<template>
  <div class="mt-5">
    <div class="btn btn-primary my-2" @click="fnCallChild">
      点我调用Son组件里的方法
    </div>

    <button @click="show = !show">
      Toggle render
    </button>

    <transition name="slide-fade">
      <p v-if="show">hello</p>
    </transition>

    <button v-on:click="add">Add</button>
    <button v-on:click="remove">Remove</button>
    <transition-group name="list">
      <span v-for="item in items" v-bind:key="item" class="list-item">
        {{ item }}
      </span>
    </transition-group>

    <hr />
    <button @click="rankData">rankDataa</button>
    <ul>
      <transition-group name="breadcrumb">
        <li v-for="(item, i) in datalist" :key="item.id" @click="del(i)">
          {{ item.id }} --- {{ item.name }}
        </li>
      </transition-group>
    </ul>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs } from "vue";

export default defineComponent({
  name: "father",
  setup() {
    const RefChilde = ref(); //RefChilde 要和Son组件上的class名相同
    const fnCallChild = () => {
      RefChilde.value.sonFn(); //sonFn是子组件里的方法
    };

    const state = reactive({
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10,
      datalist: [
        { id: 1, name: "赵高" },
        { id: 2, name: "秦桧" },
        { id: 3, name: "严嵩" }
      ]
    });
    const show = ref(false);
    const randomIndex = () => {
      return Math.floor(Math.random() * state.items.length);
    };
    const add = () => {
      state.items.splice(randomIndex(), 0, state.nextNum++);
    };
    const remove = () => {
      state.items.splice(randomIndex(), 1);
    };
    const rankData = () => {
      state.datalist = [];
      state.datalist = [
        { id: 1, name: "赵高" },
        { id: 2, name: "秦桧" },
        { id: 3, name: "严嵩" },
        { id: 4, name: "魏忠贤" }
      ];
    };
    return {
      rankData,
      add,
      remove,
      RefChilde,
      fnCallChild,
      show,
      ...toRefs(state)
    };
  }
});
</script>
<style lang="scss" scoped>
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
.list-item {
  display: inline-block;
  margin-right: 10px;
  font-weight: 900;
  color: rgb(201, 6, 201);
}
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease-out;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

li {
  border: 1px dashed #999;
  margin: 5px;
  line-height: 35px;
  font-size: 14px;
  padding-left: 5px;
  width: 100%;
}

li:hover {
  background-color: hotpink;
  transition: all 0.5s ease;
}
.v-enter,
.v-leave-to {
  opacity: 0;
  transform: translateY(80px);
}

.v-enter-active,
.v-leave-active {
  transition: all 0.6s ease;
}

/*v-move 和 v-leave-active 配合使用，能够实现列表后续的元素，渐渐地漂上来的效果 */

.v-move {
  transition: all 0.6s ease;
}
.v-leave-active {
  position: absolute;
}

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
