export function number_format(
  number,
  decimals,
  dec_point,
  thousands_sep,
  roundtag
) {
  /*
   * 参数说明：
   * number：要格式化的数字
   * decimals：保留几位小数
   * dec_point：小数点符号
   * thousands_sep：千分位符号
   * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
   * */
  number = (number + "").replace(/[^0-9+-Ee.]/g, "");
  roundtag = roundtag || "ceil"; //"ceil","floor","round"
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
    dec = typeof dec_point === "undefined" ? "." : dec_point,
    s = "",
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      console.log();

      return (
        "" +
        parseFloat(
          Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(
            prec * 2
          )
        ) /
          k
      );
    };
  s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
}
//   console.log(number_format(2, 2, ".", ","))//"2.00"
//   console.log(number_format(3.7, 2, ".", ","))//"3.70"
//   console.log(number_format(3, 0, ".", ",")) //"3"
//   console.log(number_format(9.0312, 2, ".", ","))//"9.03"
//   console.log(number_format(9.00, 2, ".", ","))//"9.00"
//   console.log(number_format(39.715001, 2, ".", ",", "floor")) //"39.71"
//   console.log(number_format(9.7, 2, ".", ","))//"9.70"
//   console.log(number_format(39.7, 2, ".", ","))//"39.70"
//   console.log(number_format(9.70001, 2, ".", ","))//"9.71"
//   console.log(number_format(39.70001, 2, ".", ","))//"39.71"
//   console.log(number_format(9996.03, 2, ".", ","))//"9996.03"
//   console.log(number_format(1.797, 3, ".", ",", "floor"))//"1.797"

/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
export function formatCurrency(num) {
  num = num.toString().replace(/\$|\\,/g, "");
  if (isNaN(num)) num = "0";
  let sign = num == (num = Math.abs(num));
  num = Math.floor(num * 100 + 0.50000000001);
  let cents = num % 100;
  num = Math.floor(num / 100).toString();
  if (cents < 10) cents = "0" + cents;
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
    num =
      num.substring(0, num.length - (4 * i + 3)) +
      "," +
      num.substring(num.length - (4 * i + 3));
  return (sign ? "" : "-") + num + "." + cents;
}
export function fmoney(s, n) {
  /*
   * 参数说明：
   * s：要格式化的数字
   * n：保留几位小数
   * */
  n = n > 0 && n <= 20 ? n : 2;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  var l = s
      .split(".")[0]
      .split("")
      .reverse(),
    r = s.split(".")[1];
  var t = "";
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
  }
  return (
    t
      .split("")
      .reverse()
      .join("") +
    "." +
    r
  );
}
//调用
//   fmoney(9.7,2);//9.70
//   fmoney('12345.675910', 3);//12,345.676

/*
将数值四舍五入后格式化.
@param num 数值(Number或者String)
@param cent 要保留的小数位(Number)
@param isThousand 是否需要千分位 0:不需要,1:需要(数值类型);
@return 格式的字符串,如'1,234,567.45'
@type String
*/
export function formatNumber(num, cent, isThousand) {
  num = num.toString().replace(/\$|\,/g, "");
  if (isNaN(num))
    //检查传入数值为数值类型.
    num = "0";
  if (isNaN(cent))
    //确保传入小数位为数值型数值.
    cent = 0;
  cent = parseInt(cent);
  cent = Math.abs(cent); //求出小数位数,确保为正整数.
  if (isNaN(isThousand))
    //确保传入是否需要千分位为数值类型.
    isThousand = 0;
  isThousand = parseInt(isThousand);
  if (isThousand < 0) isThousand = 0;
  if (isThousand >= 1)
    //确保传入的数值只为0或1
    isThousand = 1;
  let sign = num == (num = Math.abs(num)); //获取符号(正/负数)
  //Math.floor:返回小于等于其数值参数的最大整数
  num = Math.floor(num * Math.pow(10, cent) + 0.50000000001); //把指定的小数位先转换成整数.多余的小数位四舍五入.
  let cents = num % Math.pow(10, cent); //求出小数位数值.
  num = Math.floor(num / Math.pow(10, cent)).toString(); //求出整数位数值.
  cents = cents.toString(); //把小数位转换成字符串,以便求小数位长度.
  while (cents.length < cent) {
    //补足小数位到指定的位数.
    cents = "0" + cents;
  }
  if (isThousand == 0)
    //不需要千分位符.
    return (sign ? "" : "-") + num + "." + cents;
  //对整数部分进行千分位格式化.
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
    num =
      num.substring(0, num.length - (4 * i + 3)) +
      "," +
      num.substring(num.length - (4 * i + 3));
  return (sign ? "" : "-") + num + "." + cents;
}

//金额转换成大写
export function toDaX(num) {
  //金额大小写转换
  if (isNaN(num) || num > Math.pow(10, 12)) return "";
  var cn = "零壹贰叁肆伍陆柒捌玖";
  var unit = new Array("拾佰仟", "分角");
  var unit1 = new Array("万亿", "");
  if (parseFloat(num) == 0 || num == "") {
    return "零圆";
  }
  var numArray = num.toString().split(".");
  var start = new Array(numArray[0].length - 1, 2);
  function toChinese(num, index) {
    num = num.replace(/\d/g, function($1) {
      return cn.charAt($1) + unit[index].charAt(start-- % 4 ? start % 4 : -1);
    });
    return num;
  }
  for (var i = 0; i < numArray.length; i++) {
    var tmp = "";
    for (var j = 0; j * 4 < numArray[i].length; j++) {
      var strIndex = numArray[i].length - (j + 1) * 4;
      var str = numArray[i].substring(strIndex, strIndex + 4);
      start = i ? 2 : str.length - 1;
      var tmp1 = toChinese(str, i);
      tmp1 = tmp1.replace(/(零.)+/g, "零").replace(/零+$/, "");
      tmp1 = tmp1.replace(/^壹拾/, "拾");
      tmp = tmp1 + unit1[i].charAt(j - 1) + tmp;
    }
    numArray[i] = tmp;
  }
  numArray[1] = numArray[1] ? numArray[1] : "";
  (numArray[0] = numArray[0] ? numArray[0] + "元" : numArray[0]),
    (numArray[1] = numArray[1].replace(/^零+/, ""));
  numArray[1] = numArray[1].match(/分/) ? numArray[1] : numArray[1] + "整";
  return numArray[0] + numArray[1];
}
/** 金额格式化 添加“,”分隔符 */
export function addComma(money) {
  if (money == "") {
    return "";
  }
  if (money) {
    money = money.trim();
  }
  if (/[^0-9\.\-\+]/.test(money)) {
    return money;
  }
  money = parseFloat(money) + "";
  if ("NaN" == money) {
    return "0.00";
  }
  var money_flag = "";
  if (money.indexOf("-") != -1) {
    money = money.replace(/-/g, "");
    money_flag = "-";
  }

  money = money.replace(/^(\d*)$/, "$1.");
  money = (money + "00").replace(/(\d*\.\d\d)\d*/, "$1");
  money = money.replace(".", ",");
  var re = /(\d)(\d{3},)/;
  while (re.test(money)) {
    money = money.replace(re, "$1,$2");
  }
  money = money.replace(/,(\d\d)$/, ".$1");
  money = money_flag + "" + money.replace(/^\./, "0.");
  return money;
}

/** 金额格式化 去“,”分隔符 */
export function delComma(value) {
  var rtnVal = value + "";
  return rtnVal.replace(/,/g, "");
}

/**
 * 金额格式化 字符串添加小数点
 */
export function addPoint(money) {
  if (/[^0-9\\.]/.test(money)) {
    return money;
  }

  if (money.length < 3 || money.indexOf(".") > -1) {
    return money;
  }

  return (
    money.substring(0, money.length - 2) +
    "." +
    money.substring(money.length - 2, money.length)
  );
}
/**
 * 金额格式化 数字去小数点
 */
export function removePoint(money) {
  if (/[^0-9\.]/.test(money)) {
    return money;
  }

  var valueFloat = parseFloat(money) * 100;
  var valueInt = parseInt(valueFloat);
  return valueInt;
}
/* 格式化小数点后两位数字 以百分比显示 */
export function addPercent(str) {
  var percent = Math.floor(str * 100) / 100;
  percent = percent.toFixed(2);
  return percent + "%";
}

/** 字符格式化 添加 空格 分隔符 */
export function addSpace(value) {
  if (value == null || value == "") {
    return "";
  }

  value = value + "";
  var tmpStr = "";
  while (value.length > 4) {
    tmpStr = tmpStr + value.substring(0, 4) + " ";
    value = value.substring(4, value.length);
  }
  tmpStr = tmpStr + value;
  return tmpStr;
}

/** 字符格式化 去除 空格 分隔符 */
export function removeSpace(value) {
  var rtnVal = value + "";
  return rtnVal.replace(/ /g, "");
}
