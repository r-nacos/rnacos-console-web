import { postJSON, getJSON, putJSON, deleteJSON, request } from '@/config/axios'

// v1
const commonPath = `/rnacos/api/console`
// v2
const apiBasePath = '/rnacos/api/console/v2'

export default {
  // v2
  // 获取验证码
  captcha: `${apiBasePath}/login/captcha`,
  // 登录
  login: `${apiBasePath}/login/login`,
  // 退出登录
  logout: `${apiBasePath}/login/logout`,
  // 获取资源
  userWebResources: `${apiBasePath}/user/web_resources`,
  // 重置密码
  userResetPassword: `${apiBasePath}/user/reset_password`,

  // v1
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
  // 用户新增
  userAdd: `${commonPath}/user/add`,
  // 用户新增
  userUpdate: `${commonPath}/user/update`,
  // 用户删除
  userRemove: `${commonPath}/user/remove`,
  // 上传文件
  configImport: `${commonPath}/config/import`,
  // 下载配置
  configDownload: `${commonPath}/config/download`,
  // 获取配置
  getConfig: `${commonPath}/cs/configs`,
  // 服务列表
  services: `${commonPath}/ns/services`,
  // 通用请求封装
  postJSON,
  getJSON,
  putJSON,
  deleteJSON,
  request,
}
