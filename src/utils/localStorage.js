/**
* @desc 用来获取和设置localStorage存储
* @author web-吴森
* @date 2018年7月10日
**/
let local = {
  save (key = '', value = '') {
    localStorage.setItem(key, JSON.stringify(value))
  },
  fetch (key = null) {
    return JSON.parse(localStorage.getItem(key) || null) || ''
  },
  clear () {
    localStorage.clear()
  },
  keys () {
    return localStorage.keys()
  },
  removeItem (key = '') {
    return localStorage.removeItem(key)
  }
}

export default local
