import moment from 'moment' // 日期格式化
import axios from 'axios'
import Vue from 'vue'

let baseURL = window.g.ApiUrl

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

/**
 * @desc 人员名称显示
 * @date 2018年7月10日
 * @示例 {{ userId | userName)}}
 **/
const userName = (() => {
  let userCache = {}

  return (id) => {
    if (!userCache.hasOwnProperty(id)) {
      Vue.util.defineReactive(userCache, id, '')
      let success = false

      // TODO 1.system-service 独立 2. system-service,bizSystemService属于basic还是system？然后相应有涉及这些接口的文件也应当换位置
      axios.get(baseURL.login + '/rmUser/userInfo', {params: {id}})
        .then(res => {
          success = true
          userCache[id] = res.data.name
        }).finally(() => {
        !success && (delete userCache[id])
      })
    }

    return userCache[id]
  }
})()


export default {
  timeToStr,
  thousandBitSeparator,
  filterHtml,
  userName
}
