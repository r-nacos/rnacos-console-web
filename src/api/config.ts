import { AxiosResponse } from "axios";
import request from "../utils/request";
let axios = request;

export interface IConfig {
  tenant?: string;
  group: string;
  dataId: string;
  content?: string;
  md5?: string;
  modifiedTime?: number;
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
      method: "post",
      url: "/nacos/v1/cs/configs",
      data: {
        ...config
      }
    });
  }

  getConfig(configKey: IConfigKey): Promise<AxiosResponse> {
    return axios.request({
      method: "get",
      url: "/nacos/v1/cs/configs",
      params: {
        ...configKey
      }
    });
  }

  removeConfig(configKey: IConfigKey): Promise<AxiosResponse> {
    return axios.request({
      method: "delete",
      url: "/nacos/v1/cs/configs",
      data: {
        ...configKey
      }
    });
  }

  queryConfigPage(queryParam: IConfigQueryParam): Promise<AxiosResponse> {
    return axios.request({
      method: "get",
      url: "/nacos/v1/console/configs",
      params: {
        ...queryParam
      }
    });
  }

  queryConfigHistoryPage(
    queryParam: IConfigQueryHistoryParam
  ): Promise<AxiosResponse> {
    return axios.request({
      method: "get",
      url: "/nacos/v1/console/config/history",
      params: {
        ...queryParam
      }
    });
  }
}
export const configApi = new ConfigApi();
