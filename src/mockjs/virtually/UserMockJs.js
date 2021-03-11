// 模块管理的模拟数据
// export default data;k
const userDataListByPage = {
  url: "/v1/user/getDataListByPage",
  type: "post",
  response: () => {
    return {
      code: 0,
      msg: "success",
      data: {
        totalRecord: 89,
        "dataList|10": [
          {
            "id|+1": 1,
            userId: "@cword(2,5)", // @ctitle
            petName: "@word(6,10)",
            mobile: "@word(6,10)",
            allowIpaddr: "127.0.0.1",
            denyIpaddr: "127.0.0.1",
            url: "@word(6,10)",
            roles: [
              { id: 1, name: "管理员" },
              { id: 2, name: "观察员" }
            ],
            "status|1-4": 1,
            createOn: "@date",
            createBy: "@cname"
          }
        ]
      }
    };
  }
};
const userDetail = {
  url: "/v1/user/getDetail",
  type: "get",
  response: () => {
    return {
      code: 0,
      msg: "success",
      data: {
        "id|+1": 1,
        name: "@cword(2,5)", // @ctitle
        code: "@word(6,10)",
        "idx|1-999": 1,
        "status|1-4": 1,
        createOn: "@date",
        createBy: "@cname"
      }
    };
  }
};
const userSaveData = {
  url: "/v1/user/saveData",
  type: "post",
  response: () => {
    return {
      code: 0,
      msg: "success"
    };
  }
};
const userDelData = {
  url: "/v1/user/delData",
  type: "get",
  response: () => {
    return {
      code: 0,
      msg: "success"
    };
  }
};
const userAuthData = {
  url: "/v1/user/authData",
  type: "get",
  response: () => {
    return {
      code: 0,
      msg: "success"
    };
  }
};

module.exports = [
  userDataListByPage,
  userDetail,
  userSaveData,
  userDelData,
  userAuthData
];
