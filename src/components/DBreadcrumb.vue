<template>
  <a-breadcrumb class="gm-breadcrumb">
    <a-breadcrumb-item v-for="(it, idx) in paths" :key="idx">
      <transition name="slide-fade">
        <span v-if="idx == paths.length - 1" class="last-bm">{{ it }}</span>
        <span v-else class="none-bm">{{ it }}</span>
      </transition>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>
<script>
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  props: {
    paths: { type: Array }
  },
  setup() {
    const state = reactive({
      name: ""
    });
    const show = ref(false);
    return {
      state,
      show
    };
  }
});
</script>
<style lang="scss">
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
.gm-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 20px;
  margin-left: 18px;
  .last-bm {
    color: #97a8be;
  }
  .none-bm {
    color: #1051d4;
    font-weight: 900;
    cursor: text;
  }
}
</style>
