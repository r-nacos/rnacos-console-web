import { postJSON, getJSON, putJSON, deleteJSON, request } from '@/config/axios'

const commonPath = `/nacos/v1`

export default {
  configs: `${commonPath}/console/configs`,
  namespaces: `${commonPath}/console/namespaces`,
  clusterNodeList: `${commonPath}/console/cluster/cluster_node_list`,
  userList: `${commonPath}/console/user/list`,
  postJSON,
  getJSON,
  putJSON,
  deleteJSON,
  request,
}
