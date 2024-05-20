import type { AxiosResponse } from 'axios'
import request from '../utils/request'
import type { INamespace } from '@/types/namespace'
const axios = request

class NamespaceApi {
  queryList(): Promise<AxiosResponse> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/namespaces',
    })
  }
  add(namespace: INamespace): Promise<AxiosResponse> {
    return axios.request({
      method: 'post',
      url: '/rnacos/api/console/namespaces',
      data: {
        ...namespace,
      },
    })
  }
  update(namespace: INamespace): Promise<AxiosResponse> {
    return axios.request({
      method: 'put',
      url: '/rnacos/api/console/namespaces',
      data: {
        ...namespace,
      },
    })
  }
  delete(namespace: INamespace): Promise<AxiosResponse> {
    return axios.request({
      method: 'delete',
      url: '/rnacos/api/console/namespaces',
      data: {
        namespaceId: namespace.namespaceId,
      },
    })
  }
}
const namespaceApi = new NamespaceApi()
export default namespaceApi
