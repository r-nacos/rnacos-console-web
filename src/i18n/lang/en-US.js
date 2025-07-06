import enUS from 'naive-ui/lib/locales/common/enUS.js';
const message = {
  common: {
    query: 'Query',
    status: 'Status',
    yes: 'Yes',
    no: 'No',
    enabled: 'Enabled',
    disabled: 'Disabled',
    confirm: 'Confirm',
    title: 'Title',
    return: 'Return',
    back: 'Back',
    confirm_action: 'Do you want to confirm the action?',
    delete: 'Delete',
    edit: 'Edit',
    detail: 'Detail',
    history: 'History',
    operation: 'Operation',
    clone: 'Clone',
    updatedtime: 'Updated Time',
    recover: 'Recover',
    request_fail: 'Request Fail',
    refresh: 'Refresh',
    total: 'Total',
    add: 'Add',
    preInput: 'Input ',
    join: ' ',
    whitelist: 'Whitelist',
    blacklist: 'Blacklist',
    all: 'All',
    part: 'Part',
    permission: 'permission',
    submitSuccess: 'Submit success',
    success: 'Success',
    home: 'Home'
  },
  cluster: {
    node: 'Node',
    address: 'Address',
    masternode: 'Master Node',
    cluster_info: 'Cluster Info'
  },
  config: {
    config: 'Config',
    config_id: 'Config ID',
    config_group: 'Config Group',
    confirm_delete_config_action:
      'Are You Sure to Delete the Config in Group:<%:=group%>,dataID:<%:=dataId%>？',
    confirm_recover_config_action:
      'Are You Sure to Recover the Config ID:<%:=id%>？',
    comparison_of_configuration_changes: 'Comparison of configuration changes',
    current_configuration: 'Current configuration',
    new_configurations_to_be_submitted: 'New configurations to be submitted',
    set: 'set',
    get: 'get',
    dataId: 'dataId',
    input_dataId: 'input dataId',
    need_input_dataId: 'Need to input dataId',
    input_config_group: 'input config group',
    desc: 'Description',
    input_desc: 'Input Description',
    configType: 'config type',
    content: 'Content',
    input_content: 'Input Content',
    check_fail: 'Check Fail',
    config_history: 'Config History',
    confirm_change: 'Confirm Change',
    diff_content: 'Diff Config Content',
    recover_fail: 'Recover Fail',
    recover_success: 'Recover Success',
    history_record_content: 'history reord content',
    recover_history: 'Recover history',
    config_list: 'Config list',
    export_config: 'Export Config',
    import_config: 'Import Config',
    op_user: 'Operator'
  },
  client: {
    address: 'Client Address'
  },
  namespace: {
    namespace: 'Namespace',
    the_namespace_id_has_been_copied: 'The namespace id has been copied!',
    namespaceName: 'Namespace Name',
    namespaceId: 'Namespace Id',
    new_namespace: 'New Namespace',
    add_namespace: 'Add Namespace',
    edit_namespace: 'Edit Namespace',
    retain_space: 'Retain Namespace',
    confirm_delete_info:
      "Are you sure you want to delete the '<%:=name%>'(ID: <%:=id%>) namespace?",
    namespaceId_or: 'Namespace Id,null then auto create',
    no_permission_and_no_namespaces:
      'You have no permission for current namespace, and no available namespaces',
    namespace_permission_switch_notice:
      "You have no permission for current namespace, switched to '<%:=name%>' namespace",
    failed_to_load_namespaces: 'Failed to load namespaces'
  },
  instance: {
    list: 'Service instance list',
    port: 'Port',
    ephemeral: 'Ephemeral',
    weight: 'Weight',
    healthy: 'Healthy',
    online: 'Enable',
    onlineText: 'Online',
    offlineText: 'Offline',
    editTitle: 'Edit instance',
    registerTime: 'Register time',
    metadata: 'Metadata'
  },
  service: {
    name: 'Service Name',
    inputName: 'input service name',
    groupName: 'Group Name',
    inputGroupName: 'input group name',
    protectThreshold: 'Protect threshold',
    metadata: 'Metadata',
    ipCount: 'Instance Count',
    healthyInstanceCount: 'Healthy Instance Count',
    instance: 'Service Instance',
    editTitle: 'Edit Service',
    addTitle: 'New Service',
    detailTitle: 'Service detail',
    confirm_delete_service_action:
      'Are You Sure to Delete the Service :<%:=name%>,in Group:<%:=groupName%>？'
  },
  passwordpanel: {
    input_old_password: 'Input Old Password',
    input_new_password: 'Input New Password',
    old_password: 'Old Password',
    new_password: 'New Password',
    new_password_confirm: 'New Password Confirm',
    input_new_password_confirm: 'Input New Password And Confirm',
    need_input_new_password: 'You need Input New Password',
    need_input_old_password: 'You need Input Old Password',
    you_will_need_to_enter_a_new_password_for_a_second_confirmation:
      'You will need to enter a new password for a second confirmation',
    confirm_that_the_content_does_not_match_the_new_password:
      'Confirm that the content does not match the new password',
    reset_password: 'Modify Password',
    logout: 'Logout',
    logout_success: 'Logout Success',
    reset_password_success: 'Modify Password Success！',
    the_input_cannot_be_empty: 'The input cannot be empty'
  },
  user: {
    name: 'User',
    username: 'Username',
    nickname: 'Nickname',
    password: 'Password',
    resetPassword: 'Reset password',
    list: 'User list',
    gmtCreate: 'CreateTime',
    gmtModified: 'ModifiedTime',
    roles: 'Roles',
    enable: 'Enable',
    confirm_delete_user_action: 'Are you sure to delete user:<%:=username%> ？'
  },
  role: {
    admin: 'Admin',
    developer: 'Developer',
    guest: 'Guest'
  },
  monitor: {
    system_monitor: 'System Monitor',
    service_node: 'Service Node',
    interval_type: 'Interval Type',
    auto_refresh: 'Auto Refresh',
    app_cpu_usage: 'Cpu Usage',
    app_cpu_usage_percent: 'Cpu Usage Percent(%)',
    app_memory_usage: 'Memory Usage',
    app_memory_usage_percent: 'Memory Usage Percent(%)',
    app_rss_memory: 'RSS Memory',
    app_rss_memory_m: 'RSS Memory(M)',
    http_request_rps: 'http request rps',
    http_request_count: 'http request count',
    http_request_rt: 'http request avg time',
    http_request_rt_ms: 'http request avg time(ms)',
    grpc_request_rps: 'grpc request rps',
    grpc_request_count: 'grpc request count',
    grpc_request_rt: 'grpc request rt avg time',
    grpc_request_rt_ms: 'grpc request rt avg time(ms)',
    config_data_size: 'config data size',
    config_data_size_n: 'config data size',
    config_listener_client_size: 'http config listener client size',
    config_listener_client_size_n: 'http config listener client size',
    config_subscriber_client_size: 'grpc config subscriber client size',
    config_subscriber_client_size_n: 'grpc config subscriber client size',
    naming_service_size: 'naming service size',
    naming_service_size_n: 'naming service size',
    naming_instance_size: 'naming instance size',
    naming_instance_size_n: 'naming instance size',
    naming_subscriber_client_size: 'grpc naming subscriber client size',
    naming_subscriber_client_size_n: 'grpc naming subscriber client size',
    http_request_handle_rt_summary: 'http request avg handle time',
    http_request_handle_rt_summary_percent_ms:
      'http request avg handle time percent(ms)',
    grpc_request_handle_rt_summary: 'grpc request avg handle time',
    grpc_request_handle_rt_summary_percent_ms:
      'grpc request avg handle time percent(ms)',
    LEAST: 'LEAST',
    MINUTE: 'MINUTE',
    HOUR: 'HOUR',
    DIRECT_NODE: 'DIRECT NODE'
  },
  login: {
    password: 'Password',
    captcha: 'captcha',
    login: 'Login',
    need_username: 'Need Username',
    need_password: 'Need Password',
    need_captcha: 'Need captcha',
    get_captcha_fail: 'Get captcha fail',
    USER_CHECK_ERROR: 'User or Password Error',
    CAPTCHA_CHECK_ERROR: 'captcha error',
    LOGIN_LIMITE_ERROR: 'login error too more times',
    LOGIN_UNKNOWN_ERROR: 'login fail unknown error'
  },
  about: {
    intro_title: 'System introduction',
    intro_p01:
      'r-nacos is a nacos service implemented in rust. Compared to java nacos, it is a service that provides the same functionality, starts faster, consumes less system resources (initial memory is less than 10M), has higher performance and runs more stable.',
    intro_p02:
      'r-nacos is designed to be fully compatible with the latest versions of the nacos client-side sdk protocols (including 1.x http OpenApi and 2.x grpc), allowing applications using nacos services to migrate to r-nacos.',
    intro_p03:
      'If there are any problems in the usage process, you can open an issue on github.',
    version_title: 'System version',
    user_title: 'Current user'
  },
  transfer: {
    export_title: 'Export',
    export_button: 'Export data',
    export_p01:
      'Export configuration, namespace and user data to files from r-nacos.',
    import_title: 'Import',
    import_button: 'Import data',
    import_p01:
      'Import the data from the migration file into the r-nacos system.',
    data_manage_title: 'Data management',
    data_manage_p01:
      'Exporting data files from r-nacos supports interconversion with sqlite.',
    data_manage_p02:
      'You can use the command `rnacos data-to-sqlite export.data sqlite.db` to convert the exported intermediate data into a sqlite database file for further data processing.',
    data_manage_p03:
      'The processed sqlite data can be converted into a data file in migration format using the command `rnacos sqlite-to-data sqlite.db export.data`, after which the data can be imported into the r-nacos system.',
    from_nacos_title: 'Data migration from nacos',
    from_nacos_p01:
      'To facilitate migration from nacos, r-nacos supports the export of nacos data to r-nacos migration format data files after v0.6.3.',
    from_nacos_p02:
      'Use the command `rnacos openapi-to-data -u nacos -p nacos 127.0.0.1:8848 export.data` to convert the nacos configuration data via openapi into a migration format data file. You can then import the data into the r-nacos system from this page. \n (Replace the 127.0.0.1:8848 information with the actual nacos address; if nacos does not have authentication enabled, the user and password parameters can be left unconfigured.)',
    from_nacos_p03:
      'Use the command `rnacos mysql-to-data mysql://$user:$password@127.0.0.1:3306/nacos export.data` to convert the nacos mysql data into a data file in the migration format. You can then import the data into the r-nacos system on this page.'
  },
  menu: {
    config_management: 'ConfigManagement',
    config_list: 'Config list',
    config_history: 'Config histories',
    service_management: 'ServiceManagement',
    service_list: 'Service list',
    subscriber_list: 'Subscriber list',
    service_instance_list: 'Service instance list',
    system_management: 'System',
    user_management: 'User list',
    namespace: 'Namespace',
    data_transfer: 'Data migration',
    cluster_info: 'Cluster info',
    system_monitor: 'Monitor',
    about: 'About'
  },
  error: {
    NO_PERMISSION: 'NO_PERMISSION',
    NO_NAMESPACE_PERMISSION: 'NO_NAMESPACE_PERMISSION',
    SYSTEM_ERROR: 'SYSTEM_ERROR'
  }
};
export default {
  ...message,
  ...enUS
};
