import { AxiosResponse } from 'axios';
import request from '../utils/request';
import { IServiceInfo, IServiceInstance, IServiceKey } from '@/types/service';
import { IApiResult, IPageResult } from '@/types/base';
let axios = request;

export interface IServiceQueryPageParam {
  namespaceId: string;
  serviceNameParam: string;
  groupNameParam: string;
  pageNo: Number;
  pageSize: Number;
}

export interface IServiceQueryItem {
  name: string;
  groupName: string;
  clusterCount: Number;
  ip_count: Number;
  healthy_instance_count: Number;
  trigger_flag: Boolean;
  metadata?: string;
  protect_threshold?: Number;
}

export interface IServiceQueryPageResult<T> {
  count: Number;
  service_list: Array<T>;
}

class NamingApi {
  queryServicePage(
    param: IServiceQueryPageParam
  ): Promise<AxiosResponse<IApiResult<IPageResult<IServiceQueryItem>>>> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/v2/service/list',
      params: param
    });
  }

  createService(info: IServiceInfo): Promise<AxiosResponse<IApiResult<any>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/service/add',
      data: JSON.stringify(info)
    });
  }
  updateService(info: IServiceInfo): Promise<AxiosResponse<IApiResult<any>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/service/update',
      data: JSON.stringify(info)
    });
  }
  removeService(key: IServiceKey): Promise<AxiosResponse<IApiResult<any>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/service/remove',
      data: JSON.stringify(key)
    });
  }
  queryServiceInstances(
    key: IServiceKey
  ): Promise<AxiosResponse<IApiResult<IPageResult<any>>>> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/v2/instance/list',
      params: key
    });
  }
  updateInstance(
    instance: IServiceInstance
  ): Promise<AxiosResponse<IApiResult<any>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/instance/update',
      data: instance
    });
  }
}
export const namingApi = new NamingApi();
