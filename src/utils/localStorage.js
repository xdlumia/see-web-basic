/*
 * @Author: web.王晓冬
 * @Date: 2018年7月10日 17:56:26
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2019-11-07 18:41:13
 * @Description: 用来获取和设置localStorage存储
 */
const local = {
  save(key = '', value = '') {
    localStorage.setItem(key, JSON.stringify(value))
  },
  fetch(key = null) {
    return JSON.parse(localStorage.getItem(key) || null) || ''
  },
  clear() {
    localStorage.clear()
  },
  keys() {
    return localStorage.keys()
  },
  removeItem(key = '') {
    return localStorage.removeItem(key)
  }
}

export default local
