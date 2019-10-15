/*
 * @Author: web.王晓冬
 * @Date: 2019-10-15 10:28:51
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2019-10-15 10:52:49
 * @Description: 工具集
 */

// 判断是否是空对象
const isEmptyObject = (obj) => {
    for(var name in obj){
        return false;
    }
    return true
}
// 判断是否是window对象
const isWindow = (obj)=>{
    return obj != null && obj === obj.window;
}
// 判断数据类型
const type = (obj) => {
    let class2type = {};
    // 生成class2type映射
    "Boolean Number String Function Array Date RegExp Object Error".split(' ').map(function(item,index){
        class2type["[object " + item + "]"] = item.toLowerCase()
    })
    if(obj == null){
        return obj + "";
    }
    return typeof obj === 'object' || typeof obj === 'function' ? class2type[Object.prototype.toString.call(obj)] || 'object' : typeof obj;
}
export default {
    isEmptyObject,
    isWindow,
    type
  }