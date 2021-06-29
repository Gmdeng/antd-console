 /**
  * a-table 分页参数结构
  */
 const pager = {
    current: 1,
    total: 0, //总条数
    pageSize: 15, // 每页条数
    defaultPageSize: 15, //默认每页显示数量
    showSizeChanger: true, // 显示可改变每页数量
    pageSizeOptions: ["15", "30", "50", "100"], // 每页数量选项
    showTotal: (total, range) => `共 ${total} 条数据, - ${range} ` // 显示总数
  }
  export default pager;
