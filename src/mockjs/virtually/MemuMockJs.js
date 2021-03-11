// var data = {"data" : [],"status":200,"message":"ok"}
// export default data;
const sysMenus = {
  url: "/api/menus/getMenuList",
  type: "get",
  response: () => {
    return {
      code: 0,
      msg: "success",
      data: [
        {
          id: 1,
          name: "首页",
          url: "/home",
          icon: "BankOutlined",
          children: null
        },
        {
          id: 2,
          name: "用户管理",
          url: null,
          icon: "TeamOutlined",
          children: [
            {
              id: 4,
              children: null,
              name: "用户列表",
              url: "/list",
              icon: null
            },
            {
              id: 5,
              children: null,
              name: "角色管理",
              url: "/from",
              icon: null
            }
          ]
        },
        {
          id: 3,
          name: "系统管理",
          url: null,
          icon: "BlockOutlined",
          children: [
            {
              id: 6,
              children: null,
              name: "菜单管理",
              url: "/menus",
              icon: null
            }
          ]
        }
      ]
    };
  }
};
module.exports = [sysMenus];
