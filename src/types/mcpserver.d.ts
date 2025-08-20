// McpServer相关类型定义

// McpServer基础信息DTO
export interface McpServerDto {
  id: number;
  namespace: string;
  name: string;
  description?: string;
  authKeys: string[];
  tools: McpToolInfo[];
  createTime: number;
  updateTime: number;
}

// 工具信息
export interface McpToolInfo {
  id: number;
  toolName: string;
  namespace: string;
  group: string;
  toolVersion: number;
  routeRule?: ToolRouteRule;
}

// 工具路由规则
export interface ToolRouteRule {
  ruleType: 'direct' | 'weighted' | 'conditional';
  config: Record<string, any>;
}

// McpServer查询参数
export interface McpServerQueryParams {
  pageNo: number;
  pageSize: number;
  namespaceFilter?: string;
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

// 表单模型
export interface McpServerFormModel {
  id?: number;
  namespace: string;
  name: string;
  description: string;
  authKeys: string[];
  tools: McpSimpleToolParams[];
  mode: 'create' | 'edit' | 'detail';
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
  parameters: Record<string, JsonSchema>;
}

// JSON Schema类型
export interface JsonSchema {
  type?: string;
  description?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  [key: string]: any;
}

// 分页结果
export interface PageResult<T> {
  total: number;
  pageNo: number;
  pageSize: number;
  data: T[];
}