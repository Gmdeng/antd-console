/**
 *  实现功能
 *  1、默认情况下只禁止空格输入
 *  2、限制只能输入整数
 *  3、限制只能输入整数和小数（价格类）
 *  4、限制只能输入手机号
 *  5、限制最大值和最小值(抛出错误给回调函数)
 */
const addListener = function(el, type, fn) {
  el.addEventListener(type, fn, false);
};
const spaceFilter = function(el) {
  addListener(el, "keyup", () => {
    el.value = el.value.replace(/\s+/, "");
  });
};
const intFilter = function(el) {
  addListener(el, "keyup", () => {
    el.value = el.value.replace(/\D/g, "");
  });
};
const priceFilter = function(el) {
  addListener(el, "keyup", () => {
    el.value = el.value.replace(/[^\d.]*/g, "");
    if (isNaN(el.value)) {
      el.value = "";
    }
  });
};
const specialFilter = function(el) {
  addListener(el, "keyup", () => {
    el.value = el.value.replace(/[^\\a-\\z\\A-\\Z0-9\u4E00-\u9FA5]/g, "");
  });
};
const phoneFilter = function(el) {
  addListener(el, "blur", () => {
    if (!el.value) {
      return;
    }
    const phoneReg = new RegExp("^(13|14|15|16|17|18|19)[0-9]{9}$");
    if (!phoneReg.test(el.value)) {
      alert("手机号输入错误");
      el.value = "";
    }
  });
};
const urlFilter = function(el) {
  addListener(el, "blur", () => {
    if (!el.value) {
      return;
    }
    const urlReg = /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/;
    if (!urlReg.test(el.value)) {
      alert("url输入错误");
      el.value = "";
    }
  });
};
const moneyFilter = function(el) {
  addListener(el, "blur", () => {
    if (!el.value) {
      return;
    }
    let val = el.value;
    val = val.toString().replace(/\$|\,/g, "");
    if (isNaN(val)) {
      val = "0";
    }
    // eslint-disable-next-line eqeqeq
    let sign = val == (val = Math.abs(val));
    val = Math.floor(val * 100 + 0.50000000001);
    let cents = val % 100;
    val = Math.floor(val / 100).toString();
    if (cents < 10) {
      cents = "0" + cents;
    }
    for (let i = 0; i < Math.floor((val.length - (1 + i)) / 3); I++) {
      val =
        val.substring(0, val.length - (4 * i + 3)) +
        "," +
        val.substring(val.length - (4 * i + 3));
    }
    el.value = (sign ? "" : "-") + val + "." + cents;
  });
};
export default {
  bind(el, binding) {
    if (el.tagName.toLowerCase() !== "input") {
      el = el.getElementsByTagName("input")[0];
    }
    spaceFilter(el);
    switch (binding.arg) {
      case "int":
        intFilter(el);
        break;
      case "price":
        priceFilter(el);
        break;
      case "special":
        specialFilter(el);
        break;
      case "phone":
        phoneFilter(el);
        break;
      case "url":
        urlFilter(el);
        break;
      case "money":
        moneyFilter(el);
        break;
      default:
        break;
    }
  }
};
