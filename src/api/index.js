import ApiEmitter from './ApiEmitter'

let createRequestWrap = function (service) {
  let temp = {};

  for (let key in service) {
    if (!service.hasOwnProperty(key)) {
      return
    }

    temp[key] = (function () {
      return this.apply(null, arguments).then((res) => {
        return {data: res, status: 200}
      })
    }).bind(service[key])
  }

  return temp
}

class APIConfig {
  // 基础包API返回res.data，租住，装修平台返回res，为了兼容俩种方式，接口提供compatible方法，如果true，代表历史用法，需要处理下。
  registry(apis, compatible) {
    for (let name in apis) {
      if (apis.hasOwnProperty(name)) {
        this[name] = compatible ? createRequestWrap(apis[name]) : apis[name]
      }
    }
  }

  registryConfig(config) {
    Object.assign(this, ApiEmitter(config))
  }
}

let apiConfig = new APIConfig()

export default apiConfig