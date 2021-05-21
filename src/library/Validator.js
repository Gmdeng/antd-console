// 手机号验证
export function MobileNumberValidator(rule, value, callback) {
  const idcardReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
  if (!idcardReg.test(value)) {
    callback("非法格式");
  }
  // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
  callback();
}

// 邮箱验证
export function EmailValidator(rule, value, callback) {
  const idcardReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
  if (!idcardReg.test(value)) {
    callback("非法格式");
  }
  // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
  callback();
}

// 身份证验证
export function IDValidator(rule, value, callback) {
  const idcardReg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/;
  if (!idcardReg.test(value)) {
    callback("非法格式");
  }
  callback();
}

// 自定义校验函数，要求输入的是一个正整数
export function PositiveInteger(rule, value, callback) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) {
    // 如果需要返回 error msg，就把它传给 `callback()`
    callback("请输入大于等于0的整数");
  }
  // 如果通过校验，调用无参数的 `callback()` 即可
  callback();
}

// 内容验证
export function ContentValidator(rule, value, callback) {
  const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
  if (!reg.test(value)) {
    callback("仅允许输入汉字、字母、数字和下划线");
  } else if (value && value.length > 140) {
    callback("文字内容多于140字");
  }
  callback();
}

// 价格
export function PriceValidator(rule, value, callback) {
  //  let reg = /^\d+$|^\d+\.\d+$/   // 可以0开头
  let reg = /^[1-9][0-9]*$|^[1-9][0-9]*\.\d+$/; // 不能0开头
  if (!value.trim().length) {
    callback("请填写价格");
  } else if (!reg.test(value.trim())) {
    callback("请填写价格，为大于等于0的数字");
  }
  callback();
}

// 数量
export function QuantityValidator(rule, value, callback) {
  // let reg = /^\+?[1-9][0-9]*$/ // 正整数 可输入加号
  let reg = /^[1-9][0-9]*$/; // 正整数
  if (!value.trim().length) {
    callback("请填写数量");
  } else if (!reg.test(value.trim())) {
    callback("请填写数量，为大于等于0的整数");
  }
  callback();
}
// 金额
export function AmountValidator(rule, value, callback) {
  if (!value) {
    callback("请输入提现金额");
  } else if (!value.trim().length) {
    callback("请输入提现金额");
  } else if (isNaN(value)) {
    callback("请输入正确的提现金额");
  } else if (Number(value) > Number(this.avalibleAmount)) {
    callback("提现金额已超出可用金额");
  } else if (
    value.indexOf(".") > -1 &&
    value.toString().split(".")[1].length > 2
  ) {
    callback("请输入正确的提现金额，小数点后保留两位数字");
  }

  callback();
}
