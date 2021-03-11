<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
export default {
  name: "UsestoreCom",
  setup() {
    let store = useStore(),
      userStore = computed(() => store.state.user), // 获取整个state
      username = computed(() => store.state.user.username), // 获取单个state
      getters = computed(() => store.getters), // 获取整个getters
      gUsername = computed(() => store.getters["user/username"]), //获取单个getters
      // mitations的使用方式1
      totalNum = ref(30),
      setTotal = totalNum => store.commit("user/setTotal", totalNum),
      // actions的使用方式1
      testNum = ref(50),
      testActions = testNum => store.dispatch("user/testActions", testNum);
    onMounted(() => {
      // state
      console.log(userStore.value.username); // admin
      console.log(username.value); // admin
      console.log("-----------------");
      // getters
      console.log(getters.value["user/username"]); // admin
      console.log(gUsername.value); // admin
      console.log("-----------------");
      // mutations
      setTotal(totalNum.value);
      // mitations的使用方式2
      // store.commit('user/setTotal', 20)
      console.log(store.getters["user/total"]); // 30
      console.log("-----------------");
      // actions
      testActions(testNum.value);
      // actions的使用方式2
      // store.dispatch('user/testActions', 40)
    });
    return {
      userStore,
      username,
      getters,
      gUsername
    };
  }
};
</script>
