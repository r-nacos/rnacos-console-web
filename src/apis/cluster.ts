import type { AxiosResponse } from 'axios'
import request from '@/utils/request'
import type { IClusterNode } from '@/types/cluster'
import type { IConsoleResult } from '@/types/base'
let axios = request

class ClusterApi {
  queryNodeList(): Promise<AxiosResponse<IConsoleResult<Array<IClusterNode>>>> {
    return axios.request({
      method: 'get',
      url: '/nacos/v1/console/cluster/cluster_node_list',
    })
  }
}
export const clusterApi = new ClusterApi()
