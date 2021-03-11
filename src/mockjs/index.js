import Mock from "mockjs";
// 设置所有ajax请求的超时时间，模拟网络传输耗时 //timeout: '200 - 400'
// 参考文当 http://mockjs.com/examples.html
Mock.setup({
  timeout: "200 - 400"
});

const mockFiles = require.context("./virtually", false, /\.js$/);
let mocks = [];

mockFiles.keys().forEach(key => {
  mocks.push(...mockFiles(key));
});

// 将所有的mock文件引入
mocks.forEach(item => {
  // console.info(item.response);
  Mock.mock(item.url, item.type, item.response());
});
