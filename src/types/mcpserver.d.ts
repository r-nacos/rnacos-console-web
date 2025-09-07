// McpServer相关类型定义

// MCP 服务器值
export interface McpServerValue {
  id: number;
  description: string;
  tools: McpTool[];
  opUser: string;
  updateTime: number;
  createTime?: number;
  isRelease?: boolean;
}

// McpServer基础信息DTO
export interface McpServerDto {
  id: number;
  namespace: string;
  name: string;
  description: string;
  authKeys: string[];
  createTime: number;
  lastModifiedMillis: number;
  updateTime?: number; // 添加 updateTime 属性用于兼容
  tools?: McpTool[]; // 添加 tools 属性用于兼容
  currentValue?: McpServerValue;
  releaseValue?: McpServerValue;
  histories?: McpServerValue[];
}

// MCP 工具
export interface McpTool {
  id: number;
  toolName: string;
  toolKey: ToolKey;
  toolVersion: number;
  spec: ToolFunctionValue;
  routeRule: ToolRouteRule;
}

// 工具键
export interface ToolKey {
  namespace: string;
  group: string;
  toolName: string;
}

// 工具路由规则
export interface ToolRouteRule {
  protocol: string;
  url: string;
  method: string;
  additionHeaders: Record<string, string>;
  convertType: 'NONE' | 'FORM_TO_JSON' | 'CUSTOM';
  serviceNamespace: string;
  serviceGroup: string;
  serviceName: string;
  ruleType?: string; // 添加 ruleType 属性用于兼容
  config?: any; // 添加 config 属性用于兼容
}

// McpServer查询参数
export interface McpServerQueryParams {
  pageNo: number;
  pageSize: number;
  namespaceId?: string;
  nameFilter?: string;
}

// McpServer操作参数
export interface McpServerParams {
  id?: number;
  namespace?: string;
  name?: string;
  description?: string;
  authKeys?: string[];
  tools?: McpSimpleToolParams[];
}

// 简化的工具参数
export interface McpSimpleToolParams {
  id?: number;
  toolName: string;
  namespace: string;
  group: string;
  toolVersion?: number;
  routeRule?: ToolRouteRule;
}

// JSON Schema类型
export interface JsonSchema {
  type?: string;
  description?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  [key: string]: any;
}

// ToolSpec信息（用于选择器）
export interface ToolSpecInfo {
  namespace: string;
  group: string;
  toolName: string;
  name: string;
  description: string;
  version: number;
  function: ToolFunctionValue;
}

// 工具函数定义
export interface ToolFunctionValue {
  name: string;
  description: string;
  inputSchema: JsonSchema;
}

// 分页结果
export interface PageResult<T> {
  total: number;
  pageNo: number;
  pageSize: number;
  data: T[];
}

// McpServer历史版本查询参数
export interface McpServerHistoryQueryParams {
  id: number;
  pageNo?: number;
  pageSize?: number;
  startTime?: number;
  endTime?: number;
}

// McpServer历史版本发布参数
export interface McpServerHistoryPublishParams {
  id: number;
  historyValueId: number;
}

// McpServer值DTO（用于历史版本展示）
export interface McpServerValueDto {
  id: number;
  description: string;
  tools: McpTool[];
  opUser: string;
  updateTime: number;
  isRelease?: boolean; // 是否为发布版本
  createTime?: number; // 创建时间，用于历史版本显示
}

// 工具组件Props接口
export interface McpToolComponentProps {
  tool: McpTool;
  disabled?: boolean;
  showActions?: boolean;
}

// 工具编辑表单模型
export interface McpToolEditModel {
  id?: number;
  toolName: string;
  toolKey: ToolKey;
  toolVersion: number;
  routeRule?: ToolRouteRule;
  spec?: ToolFunctionValue;
}
