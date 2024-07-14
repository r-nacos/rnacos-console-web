import { AxiosResponse } from 'axios';
import request from '../utils/request';
import { IConsoleResult } from '@/types/base';
import { TimelineQueryParam, TimelineQueryResponse } from '@/types/metrics';
let axios = request;

class MetricsApi {
  queryTimeLine(
    param: TimelineQueryParam
  ): Promise<AxiosResponse<IConsoleResult<TimelineQueryResponse>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/metrics/timeline',
      data: JSON.stringify(param)
    });
  }
}
export const metricsApi = new MetricsApi();
