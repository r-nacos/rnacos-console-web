import { postJSON, getJSON, putJSON, deleteJSON, request } from '@/config/axios'

const commonPath = `/nacos/v1`
const rnacosPath = '/rnacos/api/console'

export default {
  // 命名空间列表
  namespaces: `${commonPath}/console/namespaces`,
  // 配置列表
  configs: `${rnacosPath}/configs`,
  // 集群列表
  clusterNodeList: `${rnacosPath}/cluster/cluster_node_list`,
  // 用户列表
  userList: `${rnacosPath}/user/list`,
  // 上传文件
  configImport: `${commonPath}/console/config/import`,
  // 获取配置
  getConfig: `${rnacosPath}/cs/configs`,
  postJSON,
  getJSON,
  putJSON,
  deleteJSON,
  request,
}
