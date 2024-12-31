import { AxiosResponse } from 'axios';
import request from '../utils/request';
import { IClusterNode } from '@/types/cluster';
import { IApiResult, IConsoleResult } from '@/types/base';
let axios = request;

class ClusterApi {
  queryNodeList(): Promise<AxiosResponse<IApiResult<Array<IClusterNode>>>> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/v2/cluster/cluster_node_list'
    });
  }
}
export const clusterApi = new ClusterApi();
