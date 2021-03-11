import MainLayout from "@/layouts/MainLayout.vue";

const routes = [
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
      }
    ]
  }
];

export default routes;
