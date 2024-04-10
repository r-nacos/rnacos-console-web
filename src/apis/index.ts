import { postJSON, getJSON, putJSON, deleteJSON, request } from '@/config/axios'

const commonPath = `/rnacos/api/console`

export default {
  // 命名空间列表
  namespaces: `${commonPath}/namespaces`,
  // 配置列表
  configs: `${commonPath}/configs`,
  // 保存配置
  crudConfigs: `${commonPath}/cs/configs`,
  // 集群列表
  clusterNodeList: `${commonPath}/cluster/cluster_node_list`,
  // 用户列表
  userList: `${commonPath}/user/list`,
  // 上传文件
  configImport: `${commonPath}/config/import`,
  // 下载配置
  configDownload: `${commonPath}/config/download`,
  // 获取配置
  getConfig: `${commonPath}/cs/configs`,
  // 服务列表
  services: `${commonPath}/ns/services`,
  postJSON,
  getJSON,
  putJSON,
  deleteJSON,
  request,
}
