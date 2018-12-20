import Api from './request'

let baseURL = window.g.ApiUrl;
let reg = /\{[\S]*?\}/g;
let mockKey = '__mockAddress';

const createApi = (config, serviceName) => {
    let result = {};
    let mockAddress = config[mockKey]

    delete config[mockKey]

    let generateApiFunction = function (url, method, useMock, config) {
        let userUrlParam = false;
        let urls = url.split(reg)

        if (urls.length !== 1) {
            userUrlParam = true
        }

        return function (params, ...urlParams) {
            let serviceUrl = ''

            if (!useMock) {
                if (!serviceUrl) {
                    throw new Error(`serviceUrl ${serviceName} 不存在!`)
                }

                if (userUrlParam) {
                    if ((urlParams.length + 1) !== urls.length) {
                        throw new Error(`url: ${url} 需要 ${urls.length - 1} 个参数，实际有${urlParams.length}个`)
                    }
                }
            }

            return Api[method](serviceUrl + (userUrlParam ? urls.reduce((previousValue, currentValue, currentIndex) => {
                return currentIndex === 0 ? currentValue : previousValue + urlParams.shift() + currentValue
            }, null) : url), params, config)
        }
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
