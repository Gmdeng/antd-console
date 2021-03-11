<script>
import { computed, onMounted } from "vue";
import { mapState, mapGetters, mapMutations, mapActions, useStore } from "vuex";
export default {
  name: "MapxxxCom",
  setup() {
    let store = useStore(),
      username2 = computed(() => store.getters["user/username"]),
      // mapState
      states = mapState("user", ["accessToken", "rolename"]),
      accessToken = computed(states.accessToken.bind({ $store: store })),
      rolename = computed(states.rolename.bind({ $store: store })),
      // mapGetters
      getters = mapGetters("user", ["username", "avatar"]),
      username = computed(getters.username.bind({ $store: store })),
      avatar = computed(getters.avatar.bind({ $store: store })),
      // mapMutations
      mutations = mapMutations("user", ["setUserList", "setTotal"]),
      setUserList = mutations.setUserList.bind({ $store: store }),
      setTotal = mutations.setTotal.bind({ $store: store }),
      // mapActions
      actions = mapActions("user", ["testActions"]),
      testActions = actions.testActions.bind({ $store: store });
    onMounted(() => {
      // mapState
      console.log("mapState accessToken: " + accessToken.value);
      console.log("mapState rolename: " + rolename.value);
      // mapGetters
      console.log("mapGetters username: " + username.value);
      console.log("mapGetters avatar:" + avatar.value);
      // mapMutations
      setUserList([{ name: "abc" }]);
      console.log(store.getters["user/userList"]);
      console.log(setTotal);
      // mapActions
      testActions();
    });
    return {
      //
    };
  }
};
</script>
