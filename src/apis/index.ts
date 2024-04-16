import { postJSON, getJSON, putJSON, deleteJSON, request } from '@/config/axios'

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
  // 命名空间列表
  namespacesList: `${apiBasePath}/namespaces/list`,
  // 命名空间新增
  namespacesAdd: `${apiBasePath}/namespaces/add`,
  //  命名空间更新
  namespacesUpdate: `${apiBasePath}/namespaces/update`,
  // 命名空间 删除
  namespacesRemove: `${apiBasePath}/namespaces/remove`,
  // 配置列表
  configs: `${apiBasePath}/configs`,
  // 保存配置
  crudConfigs: `${apiBasePath}/cs/configs`,
  // 集群列表
  clusterNodeList: `${apiBasePath}/cluster/cluster_node_list`,
  // 用户相关
  userList: `${apiBasePath}/user/list`, // 用户列表
  userAdd: `${apiBasePath}/user/add`, // 用户新增
  userUpdate: `${apiBasePath}/user/update`, // 用户新增
  userRemove: `${apiBasePath}/user/remove`, // 用户删除

  // 配置相关
  configList: `${apiBasePath}/config/list`, // 配置列表
  configDownload: `${apiBasePath}/config/download`, // 下载配置
  configInfo: `${apiBasePath}/config/info`, // 配置详情
  configHistory: `${apiBasePath}/config/history`, // 配置历史
  configImport: `${apiBasePath}/config/import`, // 导入配置
  configAdd: `${apiBasePath}/config/add`, // 新增配置
  configUpdate: `${apiBasePath}/config/update`, // 更新配置
  configRemove: `${apiBasePath}/config/remove`, // 删除配置

  // 服务相关
  serviceList: `${apiBasePath}/service/list`, // 服务列表
  serviceAdd: `${apiBasePath}/service/add`, // 新增服务信息
  serviceUpdate: `${apiBasePath}/service/update`, // 更新服务信息
  serviceDelete: `${apiBasePath}/service/remove`, // 删除服务信息

  // 实列
  instanceList: `${apiBasePath}/instance/list`,
  instanceAdd: `${apiBasePath}/instance/add`,
  instanceUpdate: `${apiBasePath}/instance/update`,
  instanceDelete: `${apiBasePath}/instance/remove`,

  // 通用请求封装
  postJSON,
  getJSON,
  putJSON,
  deleteJSON,
  request,
}
