import { Modal, notification } from "ant-design-vue";
import { h, createVNode } from "vue";
import { DownOutlined } from "@ant-design/icons-vue";
/**
 * 树转列表
 *
 * @param tree Tree JSON 数组
 * @param children 子节点字段
 */
export function TreeToList(tree, children = "children") {
  return tree.reduce((list, item) => {
    let childrenData = item[children];
    if (childrenData?.length > 0) {
      childrenData = TreeToList(childrenData);
      list = list.concat(childrenData);
    }

    list.push(item);
    return list;
  }, []);
}

/**
 * 格式化金额
 * @param {金额} val
 */
export function money(val) {
  val = val.toString().replace(/\$|\\,/g, "");
  if (isNaN(val)) {
    val = "0";
  }
  let sign = val == (val = Math.abs(val));
  val = Math.floor(val * 100 + 0.50000000001);
  let cents = val % 100;
  val = Math.floor(val / 100).toString();
  if (cents < 10) {
    cents = "0" + cents;
  }
  for (let i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
    val =
      val.substring(0, val.length - (4 * i + 3)) +
      "," +
      val.substring(val.length - (4 * i + 3));
  }

  return (sign ? "" : "-") + val + "." + cents;
}

/**
 * 正则替换小数点
 * @param {*} val
 */
export function limitNumber(val) {
  if (typeof val === "string") {
    return !isNaN(Number(val)) ? val.replace(/\./g, "") : 0;
  } else if (typeof val === "number") {
    return !isNaN(val) ? String(val).replace(/\./g, "") : 0;
  } else {
    return 0;
  }
}

/**
 * 处理事件
 * @param {*} typeText 提示信息
 * @param {*} apiHandler API处理事件
 * @param {*} data 事件参数
 * @param {*} callback 回调方法 
 */
export function handleSimpleEvent (typeText, apiHandler, data, callback){
  //alert(apiHandler);
  Modal.confirm({
    title: `确认想${typeText}这条记录吗?`,
    icon: createVNode(DownOutlined),
    content:
      "当点击确认按键后, 将该请求提交到后台进行处理.",
    onOk() {
      // return new Promise((resolve, reject) => {
      //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
      // }).catch(() => console.log("Oops errors!"));
      apiHandler(data).then(res=>{
        if(res.code == 0){
          notification["success"]({
            message: "数据处理成功",
            description: "正在为您刷新当前页面数据.请稍后",
            onClose: ()=>{
              if(typeof(callback) == "function" )
                callback();
            }
          });
        }else{
          notification["warning"]({
            message: "数据处理异常",
            description: "." + res.msg
          });
        }
      });
    },
    onCancel() {}
  });
};

/**
 * 处理响应结果
 * @param {*} ret {code: 0, data:[], message: ''}
 */
export function handleHttpResut(ret) {
  if (ret.code === 0) {
    notification["success"]({
      message: "数据提交成功",
      description: "正在为您更新当前页面数据."
    });
    return true;
  }

  //let errMsg = "";
  //if (ret.code === 1000) {
  //alert("Fail:" + typeof ret.data);
  let arrErr = [];
  for (var key in ret.data) {
    arrErr.push(h("b", key));
    arrErr.push(h("span", { style: "margin-left: 10px;" }, ret.data[key]));
    arrErr.push(h("br"));
  }
  //
  notification["warning"]({
    message: "数据异常",
    description: h("p", { style: "color: red" }, arrErr)
  });
  return false;
}
