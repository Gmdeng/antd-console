import { notification } from "ant-design-vue";
import { h } from "vue";
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
 * 处理响应结果
 * @param {*} ret {code: 0, data:[], message: ''}
 */
export function handleHttpResut(ret) {
  // alert(ret.code);
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