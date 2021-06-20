/**
 * 封装axios请求
 *  params是添加到url的请求字符串中的，用于get请求,例如shinyway.com?key=params
 *  而data是添加到请求体（body）中的， 用于post请求,传递参数
 * console.info(JSON.stringify(process.env))
 * axios.defaults.headers.common['Authorization'] = ''
 * axios.defaults.transformRequest =[obj=> qs.stringify(obj)]
 *
 */
import axios from "axios";
import store from "@/store/index";
import qs from "qs";
import { message } from "ant-design-vue";
// HTTP代码
const HttpCodeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。", //"登录已过期，请重新登录";
  403: "用户得到授权，但是访问是被禁止的。您没有权限，无法访问", //"您没有权限，无法访问";
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。", // "404请求不存在Not Found 404"
  405: "请求方法不被允许。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。"
};

// 创建axios实例 axiso的一些基础参数配置,
const instance = axios.create({
  // 配置在config/prod.env里的baseApi
  baseURL: process.env.VUE_APP_API_VER,
  // 设置cross跨域 并设置访问权限 允许跨域携带cookie信息
  // 允许携带token ,这个是解决跨域产生的相关问题
  withCredentials: true,
  crossDomain: true,
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "X-Requested-With": "XMLHttpRequest"
    },
    delete: {
      // 用来删除服务器的资源
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8;"
    },
    head: {
      // 安全、幂等；
      // 与get方法类似，但不返回message body内容，仅仅是获得获取资源的部分信息（content-type、content-length）；
      // restful框架中较少使用
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8;"
    },
    get: {
      // 安全、幂等；
      // 用于获取资源；用来查询数据，不对服务器的数据做任何的修改，新增，删除等操作...
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8;"
    },
    post: {
      // 非安全、非幂等；
      // 用于创建子资源, 用来数据的提交，新增操作..
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8;"
    },
    put: {
      // 非安全、非幂等；
      // 用于创建子资源, 用来数据的提交，新增操作..
      // put请求与post一样都会改变服务器的数据，但是put的侧重点在于对于数据的修改操作，但是post侧重于对于数据的增加
      "Content-Type": "application/json;charset=utf-8"
    },
    patch: {
      // 非安全、幂等；
      // 用于创建、更新资源，于PUT类似，区别在于PATCH代表部分更新；
      // 后来提出的接口方法，使用时可能去要验证客户端和服务端是否支持；
      // PATCH是最新的 HTTP verb被推荐用于 已知资源进行局部更新
      "Content-Type": "application/x-www-form-urlencoded"
    },
    options: {
      // 安全、幂等；
      // 用于url验证，验证接口服务是否正常；
    }
  },
  timeout: 5000, // 超时时间
  retry: 4, //请求次数
  retryDelay: 1000 //请求的间隙
});

// 请求拦截器
instance.interceptors.request.use(
  request => {
    const { headers, method, params } = request;
    // 设置授权的TOKEN
    if (store.getters["auth/accessToken"]) {
      headers["AuthorizationToken"] = store.getters["auth/accessToken"];
    }

    // 过滤空参数
    if (params) {
      const keys = Object.keys(params);
      console.info("Keys:" + keys);
      for (let key of keys) {
        const value = params[key];
        switch (value) {
          case undefined:
          case null:
          case "":
            delete params[key];
            break;
        }
      }
    }
    // 判断为post请求，序列化传来的参数
    if (method === "post") {
      request.data = qs.stringify(request.data, {
        // arrayFormat: "brackets", // //brackets ids[]=12&ids[]=333
        arrayFormat: "indices", // ids[0]=1&ids[1]=2
        allowDots: true // ids[0].id=12&ids[1].name=ricky
        // allowDots: false // ids[][id]=12&ids[][name]=ricky
      });
    } else if (method === "put") {
      console.info("use put method do it");
      console.info("不格式化成URL参数");
    } else if (method === "patch") {
      request.data = qs.stringify(request.data, {
        arrayFormat: "repeat", // ids=1&ids=2
        allowDots: true
      });
    }
    return request;
  },
  error => {
    // 处理错误信息
    message.warning("请求超时!");
    return Promise.reject(error);
  }
);
// 响应拦截器
instance.interceptors.response.use(
  res => {
    // 关闭loadding 延时两秒
    /************************** */
    const { status, data } = res;
    console.info("RETURN DATA:", status, data);
    //   1.判空
    if (
      data === "" ||
      data.length === 0 ||
      data === "undefined" ||
      data === undefined
    ) {
      message.info("后台传来的data为空/为undefined");
      //Message.error("后台传来的data为空/为undefined");
      console.log("后台传来的data为空/为undefined");
    }
    //   2.错误提示(前提是接口跑通了，只是对里边某些值做下详细判断。要先跟后台商定好，对某个固定的字段进行判断，并且确定固定字段来承接 错误信息，方便展示)
    if (res.data && !res.data.code == 0) {
      console.log("ERROR NO:" + res.data.msg);
      if (res.data.code == 999) {
        // Message.error(res.data.msg);
      }
    }

    return data;
  },
  error => {
    // 关闭loadding 延时两秒
    // setTimeout(() => {
    //   store.commit("CONTROL_SUBMIT_FLAG", false);
    // }, 2000);
    // 请求错误时做些事(接口错误、超时等)

    // console.log(error);
    // 打开控制台，可以看到error包含了几个对象:message, config, code, request, response,可以拿来请求超时等问题
    //  1.判断请求超时
    if (
      error.code === "ECONNABORTED" &&
      error.message.indexOf("timeout") !== -1
    ) {
      //根据你设置的timeout/真的请求超时 判断请求现在超时了，处理方案
      console.log("错误回调", error);
      // Message.error("网络超时.");
      var config = error.config;
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount >= config.retry) {
        return Promise.reject(error);
      }

      // Increase the retry count
      config.__retryCount += 1;

      // Create new promise to handle exponential backoff
      var backoff = new Promise(function(resolve) {
        setTimeout(function() {
          //console.log('resolve');
          resolve();
        }, config.retryDelay || 1);
      });

      return backoff.then(function() {
        return instance(config);
      });
    }
    //  2.需要重定向到错误页面
    else if (error.response) {
      const { config, data, status, statusText } = error.response;
      console.log(config);
      console.log(statusText);
      //处理各种状态下的消息
      let content = HttpCodeMessage[status];
      if (content == undefined) content = data?.message ?? "未知异常";
      message.error(content);
    } else if (error.message) {
      const msg = error.message;
      switch (msg) {
        case "Network Error":
          message.error("网络错误, 无法连接服务器");
          break;
        default:
          message.error(msg);
          break;
      }
    }
    return Promise.reject(error); // 在调用的那边可以拿到(catch)你想返回的错误信息
  }
);
export default instance;
