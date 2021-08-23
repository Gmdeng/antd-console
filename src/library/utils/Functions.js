import { Modal, notification } from "ant-design-vue";
import { h, createVNode } from "vue";
import { DownOutlined } from "@ant-design/icons-vue";

/**
 * 树转列表
 *
 * @param tree Tree JSON 数组
 * @param field 子节点字段
 */
export function FindTreeNode(treeJson, val, field = "id") {
  //arr.reduce(function(prev, cur, index, arr) {console.log(prev, cur, index);
  //  return prev + cur;
  // }，0) //注意这里设置了初始值}

  return treeJson.reduce((list, item) => {
    if (item[field] == val) {
      list.push(item);
    } else {
      let childrenData = item["children"];
      if (childrenData?.length > 0) {
        childrenData = FindTreeNode(childrenData, val);
        list = list.concat(childrenData);
      }
    }
    return list;
  }, []);

  // let retValue = null;
  // try {
  //   treeJson.forEach(curItem => {
  //     let tempValue = curItem[field];
  //     if (tempValue == value) {
  //       retValue = curItem;
  //       throw new Error("Find done");
  //     } else {
  //       let childrenData = curItem["children"];
  //       console.info(curItem.id + "-childrenData1=" + childrenData);
  //       if (childrenData != undefined && childrenData?.length > 0) {
  //         console.info(curItem.id + "-childrenData2=调用");
  //         let tmp = FindTreeNode(childrenData, value);
  //         if (tmp != null) {
  //           retValue = tmp;
  //           throw new Error("Find done Last.");
  //         }
  //       }
  //     }
  //   });
  // } catch (e) {
  //   console.info(e);
  // }
  // return retValue;
}

// 超简单sku组合算法
//let arr = [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9],
//   [10, 11, 12]
// ];
// let allArr = cartesianSku(...arr )
// console.log(allArr)
export function cartesianSku() {
  return Array.prototype.reduce.call(
    arguments,
    function(a, b) {
      var ret = [];
      a.forEach(function(a) {
        b.options.forEach(function(b) {
          ret.push(a.concat([b]));
        });
      });
      return ret;
    },
    [[]]
  );
}
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
 * 清除空的节点
 *
 * @param tree Tree JSON 数组
 * @param children 子节点字段
 */
export function TreeCleanEmptyNode(treeList, children = "children") {
  treeList.forEach(it => {
    let childrenData = it[children];
    if (childrenData?.length > 0) {
      TreeCleanEmptyNode(childrenData, children);
    } else {
      delete it[children];
    }
  });
}
/**
 * 格式化金额
 * @param {金额} val
 */
export function formatterMoney(val) {
  val = val.toString().replace(/\$|\\,/g, "");
  if (isNaN(val)) val = "0";
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
 * 金额
 * @param {} str
 * @returns
 */
export function MoneySeparator(value) {
  return `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // alert(str);
  // str = str.replace(/\\￥\s?|(,*)/g, "");
  // // console.info(str);
  // var reg = /\d+\.{0,1}\d{1,2}/;
  // var results = reg.exec(str);
  // if (results == null) return "￥ 0.00";
  // var arr = results.toString().split(".");
  // var retNum = parseInt(arr[0], 10)
  //   .toString()
  //   .replace(/(?=(\d{3})+(?!\d))/g, ",");
  // if (retNum.indexOf(",") == 0) retNum = retNum.substr(1);
  // if (arr.length > 1) {
  //   return "￥ " + retNum + "." + arr[1];
  // } else {
  //   return "￥ " + retNum + ".00";
  // }
}
/**
 * 限制只能为整数字
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
export function handleSimpleEvent(typeText, apiHandler, data, callback) {
  //alert(apiHandler);
  Modal.confirm({
    title: `确认想${typeText}这条记录吗?`,
    icon: createVNode(DownOutlined),
    content: "当点击确认按键后, 将该请求提交到后台进行处理.",
    onOk() {
      // return new Promise((resolve, reject) => {
      //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
      // }).catch(() => console.log("Oops errors!"));
      apiHandler(data).then(res => {
        if (res.code == 0) {
          notification["success"]({
            message: "数据处理成功",
            description: "正在为您刷新当前页面数据.请稍后",
            onClose: () => {
              if (typeof callback == "function") callback();
            }
          });
        } else {
          notification["warning"]({
            message: "数据处理异常",
            description: "." + res.msg
          });
        }
      });
    },
    onCancel() {}
  });
}

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
    return Promise.resolve("操作成功");
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
  return Promise.reject("数据异常");
}

/**
 * let img = await getBase64(file.originFileObj)
 * @param {*} file
 * @returns
 */
const getBase64 = async file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};
export { getBase64 };
