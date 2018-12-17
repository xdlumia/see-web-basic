import axios from 'axios'
import { Message } from 'element-ui'
import QS from 'querystring'

// GET 请求 params 序列化
axios.defaults.paramsSerializer = function (params) {
  return QS.stringify(params)
}
axios.interceptors.request.use(config => {
  if (window.router && window.router.currentRoute && window.router.currentRoute.query && window.router.currentRoute.query.token) {
    config.headers.finger = window.router.currentRoute.query.finger;
    config.headers.token = window.router.currentRoute.query.token;
  } else {
    config.headers.finger = window.localStorage.getItem('finger') || '';
    config.headers.token = window.localStorage.getItem('token') || '';
  }
  return config;
}, error => {
  Promise.reject(error)
})

axios.interceptors.response.use(response => {
  const res = response.data;
  if (res.code == 402) {
    // TODO: 换个方式
    window.router && router.push({
      path: '/login'
    })
    return Promise.reject(res.msg);
  }

  if (res.code != 200) {
    Message.error({
      message: res.msg,
      dangerouslyUseHTMLString: true,
      duration: 3000,
      showClose: true
    })
    return Promise.reject(res.msg);
  }

  if (['post', 'put', 'delete'].includes(response.config.method) && res.code == 200) {
    Message.success({
      message: res.msg,
      duration: 3000,
      dangerouslyUseHTMLString: true,
      showClose: true
    })
  }

  // 成功返回数据
  return res;
}, error => {
  Message.error({
    message: error.message,
    duration: 3000,
    dangerouslyUseHTMLString: true,
    showClose: true
  })
  return Promise.reject(error)
})


let api = {};
const methods = {
  get: {
    isParams: true
  },
  delete: {
    isParams: true
  },
  post: {
    isParams: false
  },
  put: {
    isParams: false
  },
  patch: {
    isParams: false
  }
};

Object.keys(methods).forEach(item => {
  api[item] = function(url, params, config) {
    let data = methods[item].isParams ? { params: params } : params;
    return axios[item](url, data, config);
  }
})

api.del = api.delete

export default api;
