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
 * @param {*} value
 */
export function limitNumber(value) {
  if (typeof value === "string") {
    return !isNaN(Number(value)) ? value.replace(/\./g, "") : 0;
  } else if (typeof value === "number") {
    return !isNaN(value) ? String(value).replace(/\./g, "") : 0;
  } else {
    return 0;
  }
}
