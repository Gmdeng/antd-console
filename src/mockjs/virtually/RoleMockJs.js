// var data = {"data" : [],"status":200,"message":"ok"}
// export default data;k
const roleDataListByPage = {
  url: "/v1/role/getDataListByPage",
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
            name: "@cword(2,5)", // @ctitle
            code: "@word(6,10)",
            "idx|1-999": 1,
            "status|1-4": 1,
            createOn: "@date",
            createBy: "@cname"
          }
        ]
      }
    };
  }
};
const roleDetail = {
  url: "/v1/role/getDetail",
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
const roleSaveData = {
  url: "/v1/role/saveData",
  type: "post",
  response: () => {
    return {
      code: 0,
      msg: "success"
    };
  }
};
const roleDelData = {
  url: "/v1/role/delData",
  type: "get",
  response: () => {
    return {
      code: 0,
      msg: "success"
    };
  }
};
const roleAuthData = {
  url: "/v1/role/authData",
  type: "get",
  response: () => {
    return {
      code: 0,
      msg: "success"
    };
  }
};

module.exports = [
  roleDataListByPage,
  roleDetail,
  roleSaveData,
  roleDelData,
  roleAuthData
];
