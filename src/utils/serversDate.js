/*
 * @Author: web.王晓冬
 * @Date: 2019-06-14 18:34:55
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2019-10-24 17:51:48
 * @Description: 提供一个获取服务器时间的方法  let nowDate = Date.serversDate()
 */

import axios from 'axios';


let baseURL = window.g && window.g.ApiUrl?window.g.ApiUrl : {}

if(!baseURL.bizSystemService){
    try{
        baseURL.bizSystemService = apisUrl + 'biz-system-service'
    }
    catch(err){
        baseURL.bizSystemService = '/apis/' + 'biz-system-service'
    }
}
var t = new Date();
function getServersDate() {
  axios.get(baseURL.bizSystemService + '/serve/getServerTime').then(function (res) {
    t = res.data || new Date();
  });
}
// Date.serversDate = async function () {
//   await axios.get(baseURL.bizSystemService + '/serve/getServerTime').then(function (res) {
//     t = res.data || new Date(); 
//   });
//   return new Date(t);
// };
Date.serversDate = function () {
  return new Date(t)
};
if(apiUrl.bizSystemService){
  // 获取服务器时间
  getServersDate();
  // 给服务器时间每隔1秒递增1秒时间
  var timer = setInterval(function () {
    t += 1000;
  }, 1000);
  // 每隔30秒重新获取一次服务器时间
  var serverTimer = setInterval(function () {
    getServersDate();
  }, 30000);
}
