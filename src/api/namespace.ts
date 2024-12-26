import { AxiosResponse } from 'axios';
import request from '../utils/request';
import { INamespace } from '@/types/namespace';
let axios = request;

class NamespaceApi {
  queryList(): Promise<AxiosResponse> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/v2/namespaces/list'
    });
  }
  add(namespace: INamespace): Promise<AxiosResponse> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/namespaces/add',
      data: {
        ...namespace
      }
    });
  }
  update(namespace: INamespace): Promise<AxiosResponse> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/namespaces/update',
      data: {
        ...namespace
      }
    });
  }
  delete(namespace: INamespace): Promise<AxiosResponse> {
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
