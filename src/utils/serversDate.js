/** 获取服务时间
 * @author web-王晓冬
 * @date 2019年5月30日
 *
 *  提供一个获取服务器时间的方法
 *  let nowDate = Date.serversDate()
 **/

import axios from 'axios';

var apiUrl = window.g.ApiUrl;
var t = new Date();
// function getServersDate() {
//   axios.get(apiUrl.bizSystemService + '/serve/getServerTime').then(function (res) {
//     t = res.data || new Date();
//   });
// }
Date.serversDate = async function () {
  await axios.get(apiUrl.bizSystemService + '/serve/getServerTime').then(function (res) {
    t = res.data || new Date(); 
  });
  return new Date(t);
};
// Date.serversDate = function () {
//   return new Date(t)
// };
// // 获取服务器时间
// getServersDate();
// // 给服务器时间每隔1秒递增1秒时间
// var timer = setInterval(function () {
//   t += 1000;
// }, 1000);
// // 每隔30秒重新获取一次服务器时间
// var serverTimer = setInterval(function () {
//   getServersDate();
// }, 30000);
