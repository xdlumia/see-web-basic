
import moment from 'moment' // 日期格式化
/**
* @desc 时间方法
* @author web-王晓冬
* @date 2018年10月11日
* @example 调用示例
*   管道符调用 timeStamp | timeToStr
**/
const timeToStr = (value, formatString = 'YYYY-MM-DD') => {
  if (typeof value !== 'number') {
    return ''
  }
  return moment(value).format(formatString)
}



/**
 * @desc 千位分隔符转换  1,000,000
 * @date 2018年7月10日
 * @示例 {{ number | thousandBitSeparator)}}
 **/
const thousandBitSeparator = (num) => {
  return num && num
    .toString()
    .replace(/^\d+/, (m) => m.replace(/(?=(?!^)(\d{3})+$)/g, ','))
}

/**
 * @desc 过滤字符串html标签
 * @date 2018年7月10日
 * @示例 {{ htmlstr | filterHtml)}}
 **/
const filterHtml = (num) => {
  return num && num
    .toString()
    .replace(/^\d+/, (m) => m.replace(/(?=(?!^)(\d{3})+$)/g, ','))
}


export default {
  timeToStr,
  thousandBitSeparator,
  filterHtml
}
