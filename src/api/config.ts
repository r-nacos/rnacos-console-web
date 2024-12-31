import { AxiosResponse } from 'axios';
import request from '../utils/request';
import { IApiResult, IPageResult } from '@/types/base';
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

export interface IConfigValue {
  value?: string;
  md5?: string;
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
  setConfigV2(config: IConfig): Promise<AxiosResponse<IApiResult<any>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/config/update',
      data: JSON.stringify(config)
    });
  }

  getConfigV2(
    configKey: IConfigKey
  ): Promise<AxiosResponse<IApiResult<IConfigValue>>> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/v2/config/info',
      params: {
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

  queryConfigPage(
    queryParam: IConfigQueryParam
  ): Promise<AxiosResponse<IApiResult<IPageResult<IConfig>>>> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/v2/config/list',
      params: {
        ...queryParam
      }
    });
  }

  queryConfigHistoryPage(
    queryParam: IConfigQueryHistoryParam
  ): Promise<AxiosResponse<IApiResult<IPageResult<IConfig>>>> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/v2/config/history',
      params: {
        ...queryParam
      }
    });
  }
}
export const configApi = new ConfigApi();
