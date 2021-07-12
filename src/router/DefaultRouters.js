import MainLayout from "@/layouts/MainLayout.vue";
/**
 * 静态路由
 */
const staticRouters = [
  {
    path: "/home",
    name: "Home",
    component: MainLayout,
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@/views/Home.vue")
      },
      {
        path: "/from",
        name: "From",
        component: () => import("@/views/From.vue")
      },
      {
        path: "/list",
        name: "List",
        component: () => import("@/views/List.vue")
      },
      {
        path: "/login",
        name: "Login",
        component: () => import("@/views/Login.vue")
      }
    ]
  }
];

export default staticRouters;
