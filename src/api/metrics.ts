import { AxiosResponse } from 'axios';
import request from '../utils/request';
import { IApiResult } from '@/types/base';
import { TimelineQueryParam, TimelineQueryResponse } from '@/types/metrics';
let axios = request;

/*
export const ALL_KEYS = [
  'sys_total_memory',
  'app_rss_memory',
  'app_vms_memory',
  'app_memory_usage',
  'app_cpu_usage',
  'config_data_size',
  'config_listener_client_size',
  'config_listener_key_size',
  'config_subscriber_listener_key_size',
  'config_subscriber_listener_value_size',
  'config_subscriber_client_size',
  'config_subscriber_client_value_size',
  'config_index_tenant_size',
  'config_index_config_size',
  'naming_service_size',
  'naming_instance_size',
  'naming_subscriber_listener_key_size',
  'naming_subscriber_listener_value_size',
  'naming_subscriber_client_size',
  'naming_subscriber_client_value_size',
  'naming_empty_service_set_size',
  'naming_empty_service_set_item_size',
  'naming_instance_meta_set_size',
  'naming_instance_meta_set_item_size',
  'naming_healthy_timeout_set_size',
  'naming_healthy_timeout_set_item_size',
  'naming_unhealthy_timeout_set_size',
  'naming_unhealthy_timeout_set_item_size',
  'naming_client_instance_set_key_size',
  'naming_client_instance_set_value_size',
  'naming_index_tenant_size',
  'naming_index_group_size',
  'naming_index_service_size',
  'grpc_conn_size',
  'grpc_conn_active_timeout_set_item_size',
  'grpc_conn_response_timeout_set_item_size',
  'grpc_request_handle_rt_histogram',
  'grpc_request_handle_rt_summary',
  'grpc_request_total_count',
  'http_request_handle_rt_histogram',
  'http_request_handle_rt_summary',
  'http_request_total_count'
];

//keys cpu使用率、内存使用量、内存使用率、配置数量、服务数量、实例数量、请求rt百分位、请求qps、请求平均rt
export const DEFAULT_KEYS = [
  'app_cpu_usage',
  'app_memory_usage',
  'app_rss_memory',
  'config_data_size',
  'naming_service_size',
  'naming_instance_size',
  'grpc_request_handle_rt_summary',
  'http_request_handle_rt_summary'
];
*/

class MetricsApi {
  queryTimeLine(
    param: TimelineQueryParam
  ): Promise<AxiosResponse<IApiResult<TimelineQueryResponse>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/metrics/timeline',
      data: JSON.stringify(param)
    });
  }
}
export const metricsApi = new MetricsApi();
