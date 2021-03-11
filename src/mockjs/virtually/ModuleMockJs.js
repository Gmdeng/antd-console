// 模块管理的模拟数据
// export default data;k
const moduleDataListByPage = {
  url: "/api/admin/scy/module/getDataListByPage",
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
            type: "@word(6,10)",
            "icon|1": [
              "AreaChartOutlined",
              "StockOutlined",
              "RadarChartOutlined",
              "LineChartOutlined"
            ],
            url: "@word(6,10)",
            operate: 31,
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
const moduleDetail = {
  url: "/v1/module/getDetail",
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
const moduleSaveData = {
  url: "/v1/module/saveData",
  type: "post",
  response: () => {
    return {
      code: 0,
      msg: "success"
    };
  }
};
const moduleDelData = {
  url: "/v1/module/delData",
  type: "get",
  response: () => {
    return {
      code: 0,
      msg: "success"
    };
  }
};
const moduleAuthData = {
  url: "/v1/module/authData",
  type: "get",
  response: () => {
    return {
      code: 0,
      msg: "success"
    };
  }
};

module.exports = [
  moduleDataListByPage,
  moduleDetail,
  moduleSaveData,
  moduleDelData,
  moduleAuthData
];
