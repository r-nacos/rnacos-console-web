import request from '../utils/request';
let axios = request;

export interface  IConfig{
    tenant ?: string,
    group :string,
    dataId :string,
    content ?:string,
}

export interface  IConfigKey{
    tenant ?: string,
    group :string,
    dataId :string,
}

export interface IConfigQueryParam{
    tenant :string,
    groupParam :string,
    dataParam :string,
    pageNo:Number,
    pageSize:Number,
}

class ConfigApi {
    setConfig(config:IConfig) {
        return axios.request({
            method: "post",
            url: '/nacos/v1/cs/configs',
            data: {
                ...config
            }
        });
    }

    getConfig(configKey:IConfigKey) {
        return axios.request({
            method: "get",
            url: '/nacos/v1/cs/configs',
            params: {
                ...configKey
            }
        });
    }

    queryConfigPage(queryParam:IConfigQueryParam) {
        return axios.request({
            method: "get",
            url: '/nacos/v1/console/configs',
            params: {
                ...queryParam
            }
        });
    }
}
export const configApi=new ConfigApi()