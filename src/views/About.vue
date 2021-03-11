<template>
  <div class="about">
    <h1>This is an about page333</h1>
    <a-empty /><br /><br />
    <a-empty :image="simpleImage" />
    <a-button type="primary" @click="showMessage">
      Primary
    </a-button>
  </div>
</template>
<script>
import { Empty } from "ant-design-vue";
export default {
  methods: {
    showMessage() {
      this.$message.success("This is a normal message");
    }
  },
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  }
};
</script>
