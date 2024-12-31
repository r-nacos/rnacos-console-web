import { AxiosResponse } from 'axios';
import request from '../utils/request';
import { IServiceInfo, IServiceInstance, IServiceKey } from '@/types/service';
let axios = request;

export interface IServiceQueryPageParam {
  namespaceId: string;
  serviceNameParam: string;
  groupNameParam: string;
  pageNo: Number;
  pageSize: Number;
  accessToken?: string;
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
  ): Promise<AxiosResponse<IServiceQueryPageResult<IServiceQueryItem>>> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/ns/services',
      params: param
    });
  }
  querySubscriberPage(
    param: IServiceQueryPageParam
  ): Promise<AxiosResponse<IServiceQueryPageResult<IServiceQueryItem>>> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/ns/service/subscribers',
      params: param
    });
  }
  createService(info: IServiceInfo): Promise<AxiosResponse> {
    return axios.request({
      method: 'post',
      url: '/rnacos/api/console/ns/service',
      data: info
    });
  }
  updateService(info: IServiceInfo): Promise<AxiosResponse> {
    return axios.request({
      method: 'put',
      url: '/rnacos/api/console/ns/service',
      data: info
    });
  }
  removeService(key: IServiceKey): Promise<AxiosResponse> {
    return axios.request({
      method: 'delete',
      url: '/rnacos/api/console/ns/service',
      data: key
    });
  }
  queryServiceInstances(key: IServiceKey): Promise<AxiosResponse> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/instances',
      params: key
    });
  }

  updateInstance(instance: IServiceInstance): Promise<AxiosResponse> {
    return axios.request({
      method: 'put',
      url: '/rnacos/api/console/ns/instance',
      data: instance
    });
  }
}
export const namingApi = new NamingApi();
