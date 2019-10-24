/*
 * @Author: web.王晓冬
 * @Date: 2019-06-14 18:34:55
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2019-10-24 16:40:26
 * @Description: api配置文件
 */
import Api from './request'
import axios from 'axios';

let baseURL = window.g.ApiUrl;
let reg = /\{[\S]*?\}/g;
let mockKey = '__mockAddress';
let CancelToken = axios.CancelToken;
window.BASE_URL = apis || '/apis/'

const createApi = (config, serviceName) => {
    let result = {};
    let mockAddress = config[mockKey]

    delete config[mockKey]

    let generateApiFunction = function (url, method, useMock, config = {}) {
        let userUrlParam = false;
        let urls = url.split(reg)

        if (urls.length !== 1) {
            userUrlParam = true
        }

        // 支持取消请求
        let supportCancel = false
        let cancelSources

        let fn = function (params, ...urlParams) {
            if (userUrlParam) {
                if ((urlParams.length + 1) !== urls.length) {
                    throw new Error(`url: ${url} 需要 ${urls.length - 1} 个参数，实际有${urlParams.length}个`)
                }
            }

            let source
            if (supportCancel) {
                source = CancelToken.source()
                config.cancelToken = source.token

                cancelSources.push(source)
            }

            let serviceUrl = ''

            if (!useMock) {
                if(baseURL[serviceName]){
                    serviceUrl = baseURL[serviceName]
                }else{
                    serviceUrl = window.BASE_URL + toLine(serviceName)
                }
                if (!serviceUrl) {
                    throw new Error(`serviceUrl ${serviceName} 不存在, 请在ipConfig中添加该项配置。`)
                }
            } else {
                // 不使用mock的时候也检查下地址，提前校验
                if (!baseURL[serviceName]) {
                    console.error(`serviceUrl ${serviceName} 不存在, 请在ipConfig中添加该项配置。`)
                }
            }


            let callAPI = Api[method](serviceUrl + (userUrlParam ? urls.reduce((previousValue, currentValue, currentIndex) => {
                return currentIndex === 0 ? currentValue : previousValue + urlParams.shift() + currentValue
            }, null) : url), params, config)

            if (supportCancel) {
                callAPI.finally(() => {
                    cancelSources.splice(cancelSources.indexOf(source), 1)
                })
            }

            return callAPI
        }

        fn.cancel = function () {
            cancelSources = []
            supportCancel = true

            fn.cancel = function () {
                cancelSources.forEach(source => {
                    source.cancel()
                })
            }
        }

        return fn
    };

    for (let key in config) {
        if (!config.hasOwnProperty(key)) {
            continue
        }

        let option = config[key]
        let methods = option.methods || 'get'
        let url = option.url;
        let useMock = false

        if (process.env.NODE_ENV === 'development') {
            useMock =  mockAddress && option.mock
            useMock = mockAddress && option.mock
            useMock && (url = mockAddress + url)
        }

        if (!(methods instanceof Array)) {
            methods = [methods]
        }

        result[key] = generateApiFunction(url, methods[0].toLowerCase(), useMock, option.config)

        if (methods.length > 1) {
            for (let method of methods) {
                result[key][method.toLowerCase()] = generateApiFunction(url, method, useMock, option.config)
            }
        }
    }

    return result
};

export default (services) => {
    let result = {};

    for (let serviceName in services) {
        if (!services.hasOwnProperty(serviceName)) {
            continue
        }

        result[serviceName] = createApi(services[serviceName], serviceName)
    }

    return result;
};
