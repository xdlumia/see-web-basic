/** 前台字典表缓存
 * @author web-闫超
 * @date 2018年7月26日
 *
 *  提供一个获取字典表的方法和字典表过滤器
 * 1、字典表方法
 *  v-for="(item,index) of dictionaryOptions('FM_CONGSHI_HANGYE')"
 * 2、 字典表过滤器
 *  v-model="form.tenantCertificatesTypeCode | dictionary('FM_HT_ZJLX')"
 **/

import api from '../api'
import Vue from 'vue'

let dictionaryCache = {}
let getDictionaryArr = function (dicName) {
  let dictionaryArr = dictionaryCache[dicName]

  if (!dictionaryArr) {
    Vue.util.defineReactive(dictionaryCache, dicName, [])
    dictionaryArr = dictionaryCache[dicName]

    let success = false

    api.seeDictionaryService.getDicCommonValueList(dicName).then(
      res => {
        dictionaryCache[dicName] = res.data || []
        success = true
      }
    ).finally(() => {
      // 简单处理下，如果没加载成功，下次重新加载
      !success && (delete dictionaryCache[dicName])
    })
  }

  return dictionaryArr
}
let findInArr = function (arr, key, idKey, valueKey) {
  if (key && arr && arr.length) {
    for (let item of arr) {
      if (item[idKey] === key) {
        return item[valueKey]
      }
    }
  }

  return ''
}

export default {
  methods: {
    dictionaryOptions (dicName) {
      if (typeof dicName !== 'string') {
        console.error('The param [key] of method [dictionaryOptions]  must be string!')
        return []
      }

      return getDictionaryArr(dicName)
    }
  },
  filters: {
    dictionary:function (key, dicName, idKey = 'code', valueKey = 'content') {
      let dictionaryArr

      if (typeof dicName === 'string') {
        dictionaryArr = getDictionaryArr(dicName)
      } else {
        if (Array.isArray(dicName)) {
          dictionaryArr = dicName
        } else {
          console.error('The param [key] of filter [dictionary]  must be string!')
          return
        }
      }

      return findInArr(dictionaryArr, key, idKey, valueKey)
    }
  },
  // 供外部直接调用的
  defineDictionary (dicName, arr) {
    Vue.util.defineReactive(dictionaryCache, dicName, arr)
  }
}
