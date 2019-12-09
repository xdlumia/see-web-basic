/*
 * @Author: web.王晓冬
 * @Date: 2019-08-01 11:54:35
 * @LastEditors: 赵伦
 * @LastEditTime: 2019-12-09 09:14:41
 * @Description: file content
 */
import moment from 'moment' // 日期格式化
import axios from 'axios'
import Vue from 'vue'

let baseURL = window.g && window.g.ApiUrl ? window.g.ApiUrl : {}

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
 * @desc 千位分隔符转换并保留两位小数  100,000.00
 * @date 2019年11月10日  后期项目使用的时候使用这个
 * @示例 {{ number | milliFormat(2))}}
 * @示例 {{ number | milliFormat)}} 如果fixed不传 默认=2
 **/
var milliFormat = function (num, fixed = 2) {
  num = Number(num || 0)
  return num && num.toFixed(fixed).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
};

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
const pennyToYuan = (val) => {
  let value = Number(val) || 0
  return value.toFixed(2)
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
      if (!id) return
      Vue.util.defineReactive(userCache, id, '')
      let success = false

      // TODO 1.system-service 独立 2. system-service,bizSystemService属于basic还是system？然后相应有涉及这些接口的文件也应当换位置
      axios.get(baseURL.systemService + '/rmUser/userInfo', { params: { id } })
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

/**
 * @desc 人员头像显示
 * @date 2018年7月10日
 * @示例 {{ userId | userAvatar)}}
 **/
const userInfo = (() => {
  let userCache = {}

  return (id,prop='userName') => {
    if (!userCache.hasOwnProperty(id)) {
      if (!id) return
      Vue.util.defineReactive(userCache, id, {})
      let success = false

      // TODO 1.system-service 独立 2. system-service,bizSystemService属于basic还是system？然后相应有涉及这些接口的文件也应当换位置
      document.getElementById('app').__vue__.$api.bizSystemService.rmemployeeInfo(id)
        .then(res => {
          success = true
          userCache[id] = res.data
        }).finally(() => {
          !success && (delete userCache[id])
        })
    }
    return userCache[id][prop]
  }
})()


export default {
  timeToStr,
  thousandBitSeparator,
  milliFormat,
  filterHtml,
  userName,
  userInfo,
  pennyToYuan
}
