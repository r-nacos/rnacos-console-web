import { AxiosResponse } from 'axios';
import request from '../utils/request';
import { INamespace } from '@/types/namespace';
import { IApiResult } from '@/types/base';
let axios = request;

class NamespaceApi {
  queryList(): Promise<AxiosResponse<IApiResult<Array<INamespace>>>> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/v2/namespaces/list'
    });
  }
  add(namespace: INamespace): Promise<AxiosResponse<IApiResult<any>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/namespaces/add',
      data: {
        ...namespace
      }
    });
  }
  update(namespace: INamespace): Promise<AxiosResponse<IApiResult<any>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/namespaces/update',
      data: {
        ...namespace
      }
    });
  }
  delete(namespace: INamespace): Promise<AxiosResponse<IApiResult<any>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/namespaces/remove',
      data: {
        namespaceId: namespace.namespaceId
      }
    });
  }
}
const namespaceApi = new NamespaceApi();
export default namespaceApi;
