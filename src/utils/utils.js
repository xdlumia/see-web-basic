/*
 * @Author: web.王晓冬
 * @Date: 2019-10-15 10:28:51
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2019-11-07 18:51:27
 * @Description: 工具集
 */

const utils = {
  // 判断是否是空对象
  isEmptyObject(obj) {
    for (var name in obj) {
      return false;
    }
    return true
  },
  // 判断是否是window对象
  isWindow(obj) {
    return obj != null && obj === obj.window;
  },
  // 判断数据类型
  type(obj) {
    let class2type = {};
    // 生成class2type映射
    "Boolean Number String Function Array Date RegExp Object Error".split(' ').map(function (item, index) {
      class2type["[object " + item + "]"] = item.toLowerCase()
    })
    if (obj == null) {
      return obj + "";
    }
    return typeof obj === 'object' || typeof obj === 'function' ? class2type[Object.prototype.toString.call(obj)] || 'object' : typeof obj;
  },
  // 判断是不是 DOM 元素
  isElement(obj) {
    return !!(obj && obj.nodeType === 1);
  },
  // 对象深拷贝
  deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
      }
    }
    return newObj
  }
}




export default utils