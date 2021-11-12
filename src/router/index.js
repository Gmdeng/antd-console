import { createRouter, createWebHashHistory } from "vue-router";
import defaultRouter from "./DefaultRouters";
import runtime from "./RunRouters";
import store from "@/store/index";
// 子路由
let newChild = defaultRouter[0].children.concat(runtime);
defaultRouter[0].children = newChild;
// console.info(newChild);
// console.info(defaultRouter[0].children);
const router = createRouter({
  // 4. 采用hash 模式
  history: createWebHashHistory(),
  // 采用 history 模式
  // history: createWebHistory(),
  // history: createWebHistory(process.env.BASE_URL),
  // 2. 定义路由配置
  routes: [
    ...defaultRouter,
    {
      path: "/",
      name: "index",
      redirect: "/home"
    },
    {
      path: "/about",
      name: "About",
      component: () => import("../views/About.vue")
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue")
    },
    {
      path: "/notFound",
      name: "NotFound",
      component: () => import("../views/NotFound.vue")
    },
    {
      path: "/demo",
      name: "Demo",
      component: () => import("../views/Demo.vue")
    },
    {
      // 通配找不到的页面
      path: "/:pathMatch(.*)",
      redirect: "/notFound",
      hidden: true
    }
  ]
});
// 路由拦截器 - 前置拦截
router.beforeEach((to, form, next) => {
  console.info("router.beforeEach.................");
  // 创建存储对象
  console.info(store.state.user.username);
  console.info(store.getters);
  console.info(form);
  //document.title = to.matched[0].meta.title;
  // 登录页面直接跳出
  if (to.name === "Login") {
    next();
    return;
  }
  // 需要登录验证
  // TODO
  // 需要权限验证
  // TODO
  next();
});

//
router.beforeResolve(() => {
  console.info("router.beforeResolve.................");
});
// 路由拦截器 - 前置拦截
router.afterEach(() => {
  console.info("router.afterEach.................");
});
export default router;
