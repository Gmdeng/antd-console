// 表单验证
export async function PasswordValidator(rule, value) {
  /** 密码至少包含 数字和英文、长度6-20 */
  //const regex0= /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
  /** 密码至少包含 数字，英文、字符中的两种以上， 长度6-20 */
  //const regex1= /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/;
  /** 密码至少包含 数字，英文、可以有字符， 长度6-20 */
  //const regex2= /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/;
  //1, 密码中必须包含大小写 字母、数字、特称字符，至少6个字符，最多30个字符；
  //const pwdRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{6,30}$/;
  //2, 密码中必须包含字母（不区分大小写）、数字、特称字符，至少6个字符，最多30个字符；
  const pwdRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,30}$/;
  //3, 密码中必须包含字母（不区分大小写）、数字，至少6个字符，最多30个字符；
  //const pwdRegex = new RegExp("(?=.*[0-9])(?=.*[a-zA-Z]).{6,30}");
  if (!pwdRegex.test(value)) {
    return Promise.reject("密码中必须包含字母、数字");
  }
  return Promise.resolve();
}
// 手机号验证
export async function MobileNumberValidator(rule, value) {
  const idcardReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
  if (!idcardReg.test(value)) {
    return Promise.reject("无效手机号码格式");
  }
  // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
  return Promise.resolve();
}

// 邮箱验证
export async function EmailValidator(rule, value) {
  const idcardReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
  if (!idcardReg.test(value)) {
    return Promise.reject("无效邮箱格式");
  }
  // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
  return Promise.resolve();
}

// 身份证验证
export async function IDValidator(rule, value) {
  const idcardReg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/;
  if (!idcardReg.test(value)) {
    return Promise.reject("无效身份证格式");
  }
  return Promise.resolve();
}

// 自定义校验函数，要求输入的是一个正整数
export async function PositiveIntegerValidator(rule, value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) {
    // 如果需要返回 error msg，就把它传给 `callback()`
    return Promise.reject("请输入大于等于0的整数");
  }
  // 如果通过校验，调用无参数的 `callback()` 即可
  return Promise.resolve();
}

// 内容验证
export async function ContentValidator(rule, value) {
  const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
  if (!reg.test(value)) {
    return Promise.reject("仅允许输入汉字、字母、数字和下划线");
  } else if (value && value.length > 140) {
    return Promise.reject("文字内容多于140字");
  }
  return Promise.resolve();
}

// 价格
export async function PriceValidator(rule, value) {
  //  let reg = /^\d+$|^\d+\.\d+$/   // 可以0开头
  let reg = /^[1-9][0-9]*$|^[1-9][0-9]*\.\d+$/; // 不能0开头
  if (!value.trim().length) {
    return Promise.reject("请填写价格");
  } else if (!reg.test(value.trim())) {
    return Promise.reject("请填写价格，为大于等于0的数字");
  }
  return Promise.resolve();
}

// 数量
export async function QuantityValidator(rule, value) {
  // let reg = /^\+?[1-9][0-9]*$/ // 正整数 可输入加号
  let reg = /^[1-9][0-9]*$/; // 正整数
  if (!value.trim().length) {
    return Promise.reject("请填写数量");
  } else if (!reg.test(value.trim())) {
    return Promise.reject("请填写数量，为大于等于0的整数");
  }
  return Promise.resolve();
}
// 金额
export async function AmountValidator(rule, value) {
  if (!value) {
    return Promise.reject("请输入金额");
  } else if (!value.trim().length) {
    return Promise.reject("请输入金额");
  } else if (isNaN(value)) {
    return Promise.reject("请输入正确的金额");
    // } else if (Number(value) > Number(this.avalibleAmount)) {
    //   return Promise.reject("提现金额已超出可用金额");
  } else if (
    value.indexOf(".") > -1 &&
    value.toString().split(".")[1].length > 2
  ) {
    return Promise.reject("请输入正确金额，小数点后保留两位数字");
  }
  return Promise.resolve();
}
