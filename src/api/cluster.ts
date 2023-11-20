import { AxiosResponse } from 'axios';
import request from '../utils/request';
import { IClusterNode } from '@/types/cluster';
import { IConsoleResult } from '@/types/base';
let axios = request;

class ClusterApi {
  queryNodeList(): Promise<AxiosResponse<IConsoleResult<Array<IClusterNode>>>> {
    return axios.request({
      method: 'get',
      url: '/nacos/v1/console/cluster/cluster_node_list'
    });
  }
}
export const clusterApi = new ClusterApi();
