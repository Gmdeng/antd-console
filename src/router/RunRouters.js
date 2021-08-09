const routes = [
  {
    path: "/roleList",
    name: "RoleList",
    component: () => import("@/views/security/RoleList.vue")
  },
  {
    path: "/userList",
    name: "UserList",
    component: () => import("@/views/security/UserList.vue")
  },
  {
    path: "/moduleList",
    name: "ModuleList",
    component: () => import("@/views/security/ModuleList.vue")
  },
  {
    path: "/returnOrderList",
    name: "ReturnOrderList",
    component: () => import("@/views/order/ReturnOrderList.vue")
  },
  {
    path: "/saleOrderList",
    name: "SaleOrderList",
    component: () => import("@/views/order/SaleOrderList.vue")
  },
  {
    path: "/shipOrderList",
    name: "ShipOrderList",
    component: () => import("@/views/order/ShipOrderList.vue")
  },
  {
    path: "/stockList",
    name: "StockList",
    component: () => import("@/views/inventory/StockList.vue")
  },
  {
    path: "/attributeList",
    name: "AttributeList",
    component: () => import("@/views/goods/AttributeList.vue")
  },
  {
    path: "/brandList",
    name: "BrandList",
    component: () => import("@/views/goods/BrandList.vue")
  },
  {
    path: "/catalogList",
    name: "CatalogList",
    component: () => import("@/views/goods/CatalogList.vue")
  },
  {
    path: "/goodsSpuList",
    name: "GoodsSpuList",
    component: () => import("@/views/goods/GoodsSpuList.vue")
  },
  {
    path: "/goodsSkuList",
    name: "GoodsSkuList",
    component: () => import("@/views/goods/GoodsSkuList.vue")
  },
  {
    path: "/articleList",
    name: "ArticleList",
    component: () => import("@/views/article/ArticleList.vue")
  },
  {
    path: "/categoryList",
    name: "CategoryList",
    component: () => import("@/views/article/CategoryList.vue")
  },
  {
    path: "/tagsList",
    name: "TagsList",
    component: () => import("@/views/article/TagsList.vue")
  },
  {
    path: "/commentList",
    name: "CommentList",
    component: () => import("@/views/article/CommentList.vue")
  }
];
export default routes;
