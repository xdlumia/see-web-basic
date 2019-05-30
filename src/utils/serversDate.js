/** 获取服务时间
 * @author web-王晓冬
 * @date 2019年5月30日
 *
 *  提供一个获取服务器时间的方法
 *  let nowDate = Date.serversDate()
 **/

import axios from 'axios';

let apiUrl = window.g.ApiUrl
function getServersDate(){
  axios.get(apiUrl.bizSystemService + '/serve/getServerTime').then(res=>{
    Date.serversDate = function () { return new Date(res.data || new Date()) }
  })
}
// 获取服务器时间
getServersDate()
// 给服务器时间每隔1秒递增1秒时间
let timer = setInterval(function(){
  let newDate = Date.serversDate()
  Date.serversDate = function () {
    return new Date(newDate.valueOf() + 1000)
  }
},1000)
// 每隔30秒重新获取一次服务器时间
let serverTimer = setInterval(function(){
  getServersDate()
},30000)
