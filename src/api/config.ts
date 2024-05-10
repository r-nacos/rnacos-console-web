import { AxiosResponse } from 'axios';
import request from '../utils/request';
import { IApiResult } from '@/types/base';
let axios = request;

export interface IConfig {
  tenant?: string;
  group: string;
  dataId: string;
  content?: string;
  md5?: string;
  modifiedTime?: number;
  desc?: string;
  configType?: string;
}

export interface IConfigKey {
  tenant?: string;
  group: string;
  dataId: string;
}

export interface IConfigQueryParam {
  tenant: string;
  groupParam: string;
  dataParam: string;
  pageNo: Number;
  pageSize: Number;
}

export interface IConfigQueryHistoryParam {
  tenant: string;
  group: string;
  dataId: string;
  pageNo: Number;
  pageSize: Number;
}

class ConfigApi {
  setConfig(config: IConfig): Promise<AxiosResponse> {
    return axios.request({
      method: 'post',
      url: '/rnacos/api/console/cs/configs',
      data: {
        ...config
      }
    });
  }

  setConfigV2(config: IConfig): Promise<AxiosResponse> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/config/update',
      data: JSON.stringify(config)
    });
  }

  getConfig(
    configKey: IConfigKey
  ): Promise<AxiosResponse<IApiResult<IConfig>>> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/cs/configs',
      params: {
        ...configKey
      }
    });
  }

  getConfigV2(configKey: IConfigKey): Promise<AxiosResponse> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/v2/config/info',
      params: {
        ...configKey
      }
    });
  }

  removeConfig(configKey: IConfigKey): Promise<AxiosResponse> {
    return axios.request({
      method: 'delete',
      url: '/rnacos/api/console/cs/configs',
      data: {
        ...configKey
      }
    });
  }

  removeConfigV2(configKey: IConfigKey): Promise<AxiosResponse> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/config/remove',
      data: JSON.stringify(configKey)
    });
  }

  queryConfigPage(queryParam: IConfigQueryParam): Promise<AxiosResponse> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/configs',
      params: {
        ...queryParam
      }
    });
  }

  queryConfigHistoryPage(
    queryParam: IConfigQueryHistoryParam
  ): Promise<AxiosResponse> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/config/history',
      params: {
        ...queryParam
      }
    });
  }
}
export const configApi = new ConfigApi();
