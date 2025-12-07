import enUS from 'naive-ui/lib/locales/common/enUS.js';
const message = {
  common: {
    query: 'Query',
    search: 'Search',
    status: 'Status',
    yes: 'Yes',
    no: 'No',
    enabled: 'Enable',
    disabled: 'Disabled',
    confirm: 'Confirm',
    cancel: 'Cancel',
    exit: 'Exit',
    title: 'Title',
    return: 'Return',
    back: 'Back',
    confirm_action: 'Confirm this action?',
    delete: 'Delete',
    edit: 'Edit',
    detail: 'Detail',
    history: 'History',
    operation: 'Operation',
    clone: 'Clone',
    update: 'Update',
    updatedtime: 'Updated Time',
    recover: 'Recover',
    request_fail: 'Request failed',
    refresh: 'Refresh',
    total: 'Total',
    add: 'Add',
    preInput: 'Input',
    join: '',
    whitelist: 'Whitelist',
    blacklist: 'Blacklist',
    all: 'All',
    part: 'Part',
    permission: 'Permission',
    submitSuccess: 'Submit success',
    success: 'Success',
    home: 'Home',
    batch: 'Batch',
    no_config: 'No Config',
    select: 'Select',
    selected: 'Selected',
    copy: 'Copy',
    copy_success: 'Copy success',
    copy_failed: 'Copy failed',
    update: 'Update',
    update_success: 'Update success',
    update_failed: 'Update failed',
    create: 'Create',
    confirm_delete: 'Confirm Delete',
    confirm_delete_content:
      'Are you sure to delete this instance? This action cannot be undone.',
    import: 'Import',
    save: 'Save'
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
    confirm_batch_delete_config_action:
      'Are you sure you want to delete the selected <%:=count%> items?',
    batch_delete: 'Batch delete',
    batch_delete_success: 'Successfully deleted <%:=count%> items!',
    selected_items: 'Selected <%:=count%> items',
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
    name: 'Service Instance',
    list: 'Service instance list',
    ipOrDomain: 'IP/Domain',
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
    LOGIN_UNKNOWN_ERROR: 'login fail unknown error',
    OAUTH2_AUTH_ERROR: 'OAuth2 login failed',
    oauth2_processing: 'Processing OAuth2 login...',
    please_wait: 'Please wait'
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
  toolspec: {
    toolspec_management: 'ToolSpec Management',
    toolspec_list: 'ToolSpec List',
    toolspec_detail: 'ToolSpec Detail',
    create_toolspec: 'Create ToolSpec',
    edit_toolspec: 'Edit ToolSpec',
    delete_toolspec: 'Delete ToolSpec',
    namespace: 'Namespace',
    group: 'Group',
    tool_name: 'Tool Name',
    description: 'Description',
    version: 'Version',
    parameters: 'Parameters',
    parameters_format: 'Parameters Format',
    create_time: 'Create Time',
    last_modified: 'Last Modified',
    actions: 'Actions',
    input_namespace: 'Please input namespace',
    input_group: 'Please input group',
    input_tool_name: 'Please input tool name',
    input_description: 'Please input description',
    input_parameters: 'Please input parameters',
    need_input_namespace: 'Namespace is required',
    need_input_group: 'Group is required',
    need_input_tool_name: 'Tool name is required',
    need_input_parameters: 'Parameters are required',
    invalid_parameters_format: 'Invalid parameters format',
    check_fail: 'Validation failed',
    format_converted_successfully: 'Format converted successfully',
    format_valid: 'Valid format',
    format_invalid: 'Invalid format',
    format_parameters: 'Format parameters',
    toggle_fullscreen: 'Toggle fullscreen',
    format_success: 'Format success',
    format_failed: 'Format failed',
    confirm_delete_toolspec:
      'Are you sure to delete tool {toolName} (group: {group})?',
    delete_success: 'Delete success',
    create_success: 'Create success',
    update_success: 'Update success',
    create_failed: 'Create failed',
    update_failed: 'Update failed',
    invalid_parameters_structure:
      'Invalid parameters structure, must be an object',
    parameters_should_be_object: 'Parameters should be an object, not an array',
    parameters_syntax_error: 'Parameters syntax error',
    parameters_conversion_error: 'Parameters conversion error',
    unsupported_parameters_format: 'Unsupported parameters format',
    invalid_submission_data: 'Invalid submission data structure',
    submission_data_build_failed: 'Failed to build submission data',
    format_conversion_failed: 'Format conversion failed',
    format_conversion_syntax_error:
      'Format conversion failed due to syntax error',
    format_conversion_unsupported:
      'Format conversion failed: unsupported format',
    format_no_change_needed: 'Format conversion not needed',
    validation_errors: 'Validation Errors',
    validation_warnings: 'Validation Warnings',
    validation_error: 'Validation error occurred',
    converting: 'Converting...',
    yaml_parse_not_supported:
      'YAML parsing not supported yet, please use JSON format',
    detail_page_coming_soon: 'Detail page coming soon',
    edit_page_coming_soon: 'Edit page coming soon',
    create_page_coming_soon: 'Create page coming soon',
    // Import tools related
    import_tools: 'Import Tools List',
    export_tools: 'Export Tools',
    tools_json_list: 'Tools JSON List',
    input_tools_json_placeholder:
      'Please input OpenAI tools JSON list, for example:\n{placeholderExample}',
    tools_json_must_be_array: 'Tools JSON must be an array format',
    tool_type_must_be_function: 'Tool {index} type must be "function"',
    tool_function_incomplete:
      'Tool {index} function information is incomplete, must include name and description',
    invalid_json_format: 'Invalid JSON format',
    import_success: 'Successfully imported {count} tools',
    import_failed: 'Import failed',
    import_zip: 'Import ZIP File',
    zip_file: 'ZIP File',
    select_zip_file: 'Select ZIP File',
    import_zip_success: 'ZIP file imported successfully',
    import_zip_failed: 'ZIP file import failed'
  },
  mcpserver: {
    mcpserver_management: 'MCP Server Management',
    mcpserver_list: 'MCP Server List',
    mcpserver_detail: 'MCP Server Detail',

    // Form fields
    server_name: 'Server Name',
    unique_key: 'Unique Key',
    server_description: 'Server Description',
    auth_keys: 'Auth Keys',
    tools: 'Associated Tools',

    // Action buttons
    create_mcpserver: 'Create MCP Server',
    edit_mcpserver: 'Edit MCP Server',
    delete_mcpserver: 'Delete MCP Server',

    // Form hints
    input_server_name: 'Please input server name',
    input_description: 'Please input server description',
    add_auth_key: 'Add Auth Key',
    add_tool: 'Add Tool',
    select_toolspec: 'Select Tool Spec',

    // Tool configuration
    tool_name: 'Tool Name',
    tool_group: 'Tool Group',
    tool_version: 'Tool Version',
    route_rule: 'Route Rule',
    input_route_rule_config:
      'Please input route rule configuration (JSON format)',

    // Status information
    no_tools: 'No associated tools',
    loading_tools: 'Loading tool information...',

    // Validation information
    name_required: 'Server name cannot be empty',
    auth_keys_required: 'At least one auth key is required',
    auth_key_empty: 'Auth key cannot be empty',
    tool_config_invalid: 'Tool configuration is invalid',

    // Operation confirmation
    confirm_delete_mcpserver:
      'Are you sure to delete MCP server "{name}"? This operation cannot be undone.',
    confirm_delete_server_action: 'Are you sure you want to delete the server?',
    delete_success: 'MCP server deleted successfully',
    create_success: 'MCP server created successfully',
    update_success: 'MCP server updated successfully',

    // Import/Export
    export_servers: 'Export MCP Services',
    import_servers: 'Import MCP Services',
    import_zip_success: 'MCP services imported successfully',
    import_zip_failed: 'MCP services import failed',

    // Detail page
    basic_info: 'Basic Information',
    tool_info: 'Tool Information',
    server_id: 'Server ID',
    create_time: 'Create Time',
    update_time: 'Update Time',
    edit_mode: 'Edit Mode',
    view_mode: 'View Mode',
    save_changes: 'Save Changes',
    cancel_edit: 'Cancel Edit',
    back_to_list: 'Back to List',
    form_validation_error: 'Form validation failed, please check your input',
    create_failed: 'Create failed',

    // Tool component related
    tool_detail: 'Tool Detail',
    edit_tool: 'Edit Tool',
    delete_tool: 'Delete Tool',
    confirm_delete_tool: 'Are you sure to delete tool "{name}"?',
    confirm_delete_tool_title: 'Confirm Delete Tool',
    update_failed: 'Update failed',

    // Edit confirmation
    confirm_cancel_edit_title: 'Confirm Cancel Edit',
    confirm_cancel_edit_content:
      'Canceling edit will lose all unsaved changes. Are you sure you want to cancel?',
    edit_cancelled: 'Edit cancelled',

    // Tool validation messages
    unnamed_tool: 'Unnamed Tool',
    tool_name_required: 'Tool name is required for {name}',
    tool_namespace_required: 'Tool namespace is required for {name}',
    tool_group_required: 'Tool group is required for {name}',
    tool_protocol_required: 'Protocol is required for tool {name}',
    tool_method_required: 'HTTP method is required for tool {name}',
    tool_route_rule_required: 'Route rule is required for tool {name}',
    tool_validation_failed: 'Tool configuration validation failed',

    // Version management related
    current_service_content: 'Current Service Content (currentValue)',
    publish_current_version: 'Publish Current Version',
    view_history: 'View History',
    history_versions: 'History Versions',
    version_content: 'Version Content',
    create_mode: 'Create Mode',
    create_server: 'Create MCP Server',
    server_not_found: 'Server not found or has been deleted',

    // Publish related
    confirm_publish_title: 'Confirm Publish Version',
    confirm_publish_content:
      'Are you sure to publish the current version? It will become the official version after publishing.',
    publish_success: 'Version published successfully',
    publish_failed: 'Version publish failed',
    publish_history_success: 'History version published successfully',
    publish_history_failed: 'History version publish failed',

    // Operation results
    //create_failed: 'MCP server creation failed',
    release_version: 'Release Version',
    draft_version: 'Draft Version',
    operator: 'Operator',
    description: 'Description',
    publish_version: 'Publish Version',
    rollback_version: 'Rollback Version',
    confirm_rollback_title: 'Confirm Rollback Version',
    confirm_rollback_content:
      'Are you sure to rollback to this version? Current version will be replaced.',

    // Tool management related
    configured_tools: 'Configured Tools',
    no_configured_tools: 'No configured tools',
    tool_already_exists: 'Tool already exists',
    tool_added_success: 'Tool added successfully',
    tool_updated_success: 'Tool updated successfully',
    tool_deleted_success: 'Tool deleted successfully',
    tool_not_found: 'Tool not found',
    editing: 'Editing',

    // Tool configuration validation
    tool_config_incomplete:
      'Tool "{name}" configuration is incomplete, please check required fields',
    tool_route_rule_incomplete:
      'Tool "{name}" route rule configuration is incomplete',
    tool_url_required: 'Tool "{name}" requires URL configuration',

    // Tool deletion confirmation
    confirm_delete_tool_content:
      'Are you sure to delete tool "{name}" (group: {group})? This operation cannot be undone.'
  },
  mcpservaluecomponent: {
    tools_list: 'Tools List',
    tools_count: 'Total {count} tools',
    id_label: 'ID:',
    update_label: 'Update:',
    published: 'Published',
    unpublished: 'Unpublished',
    add_tool: 'Add Tool',
    no_tools: 'No tools',
    tool_deleted_success: 'Tool deleted successfully',
    publish_server: 'Publish Server'
  },
  mcpservertollitem: {
    tool_params_info: 'Tool Parameters Info',
    function_name: 'Function Name',
    description: 'Description',
    params: 'Parameters',
    route_tool: 'Route Tool',
    protocol: 'Protocol',
    url: 'URL',
    method: 'Method',
    convert_type: 'Convert Type',
    service_info: 'Service Info',
    service_name: 'Service Name',
    service_group: 'Service Group',
    additional_headers: 'Additional Headers',
    support_template_vars: 'Support template variables:',
    ip_address: 'IP Address of service instance',
    port: 'Port of service instance',
    ip_port: 'IP:Port of service instance',
    dynamic_parameters: 'Dynamic parameters',
    tool_selection: 'Tool Selection',
    select_tool_spec: 'Select Tool Spec',
    selected_tool: 'Selected Tool',
    namespace: 'Namespace',
    group: 'Group',
    tool_name: 'Tool Name',
    version: 'Version',
    route_rule_config: 'Route Rule Configuration',
    select_protocol: 'Please select protocol',
    input_url: 'Please input URL',
    select_http_method: 'Please select HTTP method',
    select_convert_type: 'Please select convert type',
    service_namespace: 'Service Namespace',
    input_service_group: 'Please input service group',
    input_service_name: 'Please input service name',
    header_name: 'Header Name',
    header_value: 'Header Value',
    cancel: 'Cancel',
    save: 'Save',
    create_tool: 'Create Tool',
    edit_tool: 'Edit Tool',
    please_select_tool_spec: 'Please select tool spec first',
    save_success: 'Save success',
    save_failed: 'Save failed, please check form data',
    no_conversion: 'No Conversion',
    json_to_form: 'JSON to Form',
    json_to_url: 'JSON to URL',
    custom: 'Custom'
  },
  mcpserverdetailcomponent: {
    server_info: 'Server Information',
    id: 'ID',
    unique_key: 'Unique Key',
    namespace: 'Namespace',
    name: 'Name',
    description: 'Description',
    auth_keys: 'Auth Keys',
    create_time: 'Create Time',
    last_modified: 'Last Modified',
    current_tools: 'Current Tools',
    release_tools: 'Released Tools',
    history_tools: 'History',
    published: 'Published',
    unpublished: 'Unpublished',
    no_release_version: 'No released version',
    no_current_version: 'No current version',
    no_history_version: 'No history records',
    history_id: 'History ID',
    history_name: 'History Name',
    history_description: 'History Description',
    history_create_time: 'Create Time',
    history_last_modified: 'Last Modified',
    history_tools_count: 'Tools Count',
    view_history_detail: 'View Detail',
    publish_history: 'Republish',
    confirm_publish_history: 'Confirm Republish History Version',
    confirm_publish_history_content:
      'Are you sure to republish this history version? It will replace the current released version after publishing.',
    publish_history_success: 'History version republished successfully',
    publish_history_failed: 'History version republish failed',
    history_detail: 'History Detail',
    close: 'Close',

    // YAML Editor related
    yaml_editor: 'YAML Editor',
    yaml_validation_errors: 'YAML Validation Errors',
    yaml_validation_failed: 'YAML validation failed',
    yaml_parse_error: 'YAML Parse Error',
    yaml_content_empty: 'YAML content cannot be empty',
    yaml_content_invalid: 'YAML content is invalid',
    yaml_content_must_be_object: 'YAML content must be an object',
    yaml_update_success: 'YAML Update Success',
    yaml_update_failed: 'YAML Update Failed',
    unsaved_changes_warning:
      'You have unsaved changes, are you sure you want to cancel?',
    yaml_syntax_error: 'YAML Syntax Error',
    yaml_validation_warnings: 'YAML Validation Warnings',
    yaml_tool_spec_fetch_failed: 'Tool spec fetch failed',
    yaml_tool_spec_not_found: 'Tool spec not found',
    yaml_update_processing: 'Updating...',
    yaml_update_complete: 'Update complete',
    yaml_validation_in_progress: 'Validating...',
    yaml_no_errors: 'No errors found',
    yaml_field_required: 'Field {field} is required',
    yaml_field_type_error: 'Field {field} type error',
    yaml_duplicate_tool: 'Duplicate tool definition',
    yaml_invalid_url: 'Invalid URL format',
    yaml_invalid_method: 'Invalid HTTP method',
    yaml_invalid_protocol: 'Invalid protocol type',
    yaml_tool_update_summary:
      'Tool update summary: updated {updated}, added {added}, removed {removed}',
    yaml_warnings_truncated:
      '{count} more warnings, please check console for details',
    yaml_update_warnings_title: 'Update Warnings',
    yaml_warnings_found: 'Found {count} warnings:',
    yaml_confirm_button: 'OK',
    yaml_auth_keys_warning:
      'It is recommended to configure at least one authentication key',
    yaml_no_tools_warning:
      'No tools are currently configured, it is recommended to configure at least one tool',
    yaml_too_many_tools_warning:
      'Too many tools ({count}), may affect performance',
    yaml_tools_will_be_removed: 'The following tools will be removed: {tools}',
    yaml_unsupported_template_vars:
      'URL contains unsupported template variables: {vars}, supported variables: {supported}',
    yaml_convert_type_warning:
      'convertType value may be incorrect (current value: {value}), recommended: NONE, JSON_TO_FORM, JSON_TO_URL, CUSTOM',
    yaml_error_network_hint:
      'Hint: Please check network connection or server status',
    yaml_error_timeout_hint: 'Hint: Request timeout, please try again later',
    yaml_error_permission_hint:
      'Hint: Insufficient permissions, please contact administrator',
    yaml_error_general: 'Error occurred during tool update: {message}',
    form_validation_error: 'Form validation failed, please check your input',
    // Form placeholders and validation messages
    input_server_name_placeholder: 'Please input server name',
    input_description_placeholder: 'Please input server description',
    unique_key_optional_placeholder:
      'Optional, will be auto-generated by backend if empty',
    // MCP address rules related
    mcp_address_rules_title: 'MCP Service Access Address Rules',
    streamable_http_label: 'Streamable HTTP:',
    sse_label: 'SSE:',
    address_rules_note:
      'Note: Please replace {nacos_api_host} with the actual Nacos API address, {server_unique_key} with the unique identifier above, and {auth_key} with any one of the authentication keys',
    // Message prompts
    no_publishable_version: 'No publishable version available',
    tools_no_change: 'Tools have not changed, no need to publish',
    update_service_failed: 'Failed to update service, unable to publish',
    publish_success: 'Published successfully',
    publish_failed: 'Failed to publish',
    // Field names for validation
    field_server_name: 'Server Name',
    field_namespace: 'Namespace',
    field_description: 'Description',
    field_auth_keys: 'Auth Keys'
  },
  validation: {
    required: '{field} is required'
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
