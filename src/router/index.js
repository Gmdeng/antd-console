import { createRouter, createWebHashHistory } from "vue-router";
import defaultRouter from "./DefaultRouters";
import runtime from "./RunRouters";
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

export default router;
