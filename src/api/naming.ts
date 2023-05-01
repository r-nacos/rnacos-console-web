import { AxiosResponse } from "axios";
import request from "../utils/request";
import { IServiceInfo, IServiceKey } from "@/types/service";
let axios = request;

export interface IServiceQueryPageParam {
  namespaceId:string,
  serviceNameParam:string,
  groupNameParam:string,
  pageNo:Number,
  pageSize:Number,
  accessToken?:string,
}

export interface IServiceQueryItem {
  name:string,
  groupName:string,
  clusterCount:Number,
  ip_count:Number,
  healthy_instance_count:Number,
  trigger_flag:Boolean,
  metadata?:string,
  protect_threshold?:Number,
}

export interface IServiceQueryPageResult<T>{
  count:Number,
  service_list:Array<T>,
}

class NamingApi {
  queryServicePage(param:IServiceQueryPageParam): Promise<AxiosResponse<IServiceQueryPageResult<IServiceQueryItem>>> {
    return axios.request({
      method: "get",
      url: "/nacos/v1/ns/catalog/services",
      params: {
        ...param
      },
    });
  }
  createService(info:IServiceInfo):Promise<AxiosResponse>{
    return axios.request({
      method: "post",
      url: "/nacos/v1/ns/service",
      data: {
        ...info
      },
    });
  }
  updateService(info:IServiceInfo):Promise<AxiosResponse>{
    return axios.request({
      method: "put",
      url: "/nacos/v1/ns/service",
      data: {
        ...info
      },
    });
  }
  removeService(key:IServiceKey):Promise<AxiosResponse>{
    return axios.request({
      method: "delete",
      url: "/nacos/v1/ns/service",
      data: {
        ...key
      },
    });
  }
  /*
  queryServiceInstances(key:IServiceKey):Promise<AxiosResponse> {
    return axios.request({
      method: "delete",
      url: "/nacos/v1/ns/service",
      data: {
        ...key
      },
    });
  }
  */
}
export const namingApi = new NamingApi();
