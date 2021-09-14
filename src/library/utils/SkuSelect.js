export class SkuSelect {
  constructor(group_attrs, sku_list) {
    this.groupAttrs = group_attrs;
    this.skuList = sku_list;
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    this.skuList.map(subArr => subArr.sort());
    // 将多个数据合并为一个
    this.available = this.groupAttrs.reduce(
      (total, current) => [...total, ...current],
      []
    );
    this.excludes = this.getCompleteExcludes();
  }

  /**
   * 获取完成排除
   * @returns
   */
  getCompleteExcludes() {
    const skuList = this.skuList.reduce(
      (total, current) => [...total, ...current],
      []
    );

    return Array.from(
      new Set(
        this.available
          .map(item => !skuList.includes(item) && item)
          .filter(Boolean)
      )
    );
  }

  /**
   * 查询可用
   * @param {*} selected
   * @returns
   */
  queryAvailable(selected) {
    let unavailable = this.getUnavailable();

    if (unavailable.length === 0) {
      return this.available;
    }

    let excludes = Array.from(this.excludes);
    let available = Array.from(this.available);

    if (selected.some(Boolean) && this.groupAttrs.length > 1) {
      if (this.groupAttrs.length - selected.length === 1) {
        unavailable.forEach(item => {
          let exclude = item
            .map(v => !selected.includes(v) && v)
            .filter(Boolean);

          if (exclude.length === 1) {
            excludes = excludes.concat(exclude);
          }
        });
      } else if (this.groupAttrs.length === selected.length) {
        let selectedCombine = this.getSelectedCombine(selected);

        unavailable.forEach(v => {
          selectedCombine.forEach(c => {
            let exclude = v
              .map(item => !c.includes(item) && item)
              .filter(Boolean);

            if (exclude.length === 1) {
              excludes = excludes.concat(exclude);
            }
          });
        });
      }

      excludes = Array.from(new Set(excludes));
    }

    return this.getAvailable(available, excludes);
  }

  /**
   * 获取选择组合
   * @param {*} selected
   * @returns
   */
  getSelectedCombine(selected) {
    let results = [];

    let len = selected.length;

    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        let result = [];

        result.push(selected[i], selected[j]);
        results.push(result);
      }
    }

    return results;
  }

  /**
   * 获取可用
   * @param {*} data
   * @param {*} excludes
   * @returns
   */
  getAvailable(data, excludes) {
    excludes.forEach(item => {
      let index = data.indexOf(item);

      if (index !== -1) {
        data.splice(index, 1);
      }
    });

    return data;
  }

  /**
   * 获取不可用的
   * @returns
   */
  getUnavailable() {
    return this.getDiffArray(this.calcDescartes(this.groupAttrs), this.skuList);
  }

  /**
   * [calcDescartes 生成笛卡尔积]
   * @param  {[type]} array [description]
   * @return {[type]}       [description]
   */
  calcDescartes(array) {
    if (array.length < 2) return array[0] || [];

    return [].reduce.call(array, function(col, set) {
      let res = [];

      col.forEach(function(c) {
        set.forEach(function(s) {
          let t = [].concat(Array.isArray(c) ? c : [c]);
          t.push(s);
          res.push(t);
        });
      });

      return res;
    });
  }

  /**
   * 获取不用数组
   * @param {*} full_sku_list
   * @param {*} this_sku_list
   * @returns
   */
  getDiffArray(full_sku_list, this_sku_list) {
    full_sku_list.map(subArr => subArr.sort());

    let unavailable = [];

    full_sku_list.forEach(sArr => {
      if (
        typeof this_sku_list.find(
          item => item.toString() === sArr.toString()
        ) === "undefined"
      ) {
        unavailable.push(sArr);
      }
    });

    return unavailable;
  }
}
// let attrs = [
//   {
//     id: 1,
//     name: "颜色",
//     options: [
//       { id: 1000, name: "黑色", selected: false },
//       { id: 2000, name: "蓝色", selected: false }
//     ]
//   },
//   {
//     id: 2,
//     name: "内存",
//     options: [
//       { id: 3000, name: "128G", selected: false },
//       { id: 4000, name: "256G", selected: false }
//     ]
//   },
//   {
//     id: 3,
//     name: "网络类型",
//     options: [
//       { id: 5000, name: "移动", selected: false },
//       { id: 6000, name: "联通", selected: false }
//     ]
//   }
// ];
// let sku_list = [
//   [1000, 3000, 5000],
//   [1000, 3000, 6000],
//   [1000, 4000, 5000],
//   [1000, 4000, 6000],
//   [2000, 3000, 5000],
//   [2000, 3000, 6000],
//   [2000, 4000, 5000],
//   [2000, 4000, 6000]
// ];

// //
// let groupAttrs = attrs.map(value => value.options.map(option => option.id));
// let skuSelect = new SkuSelect(groupAttrs, sku_list);

// let availableArr = skuSelect.queryAvailable(this.selected);
// console.info(groupAttrs);
// document.write(JSON.stringify(groupAttrs));
// document.write("<hr/>");
// document.write(JSON.stringify(skuSelect));
// document.write("<hr/>");
// document.write(JSON.stringify(availableArr));

// let arrs = [
//   [1000, 2000],
//   [3000, 4000],
//   [5000, 6000]
// ];
// let doc = arrs.reduce((total, current) => [...total, ...current], []);
// document.write("<hr/>");
// document.write(JSON.stringify(doc));
