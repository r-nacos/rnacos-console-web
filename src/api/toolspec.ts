import { AxiosResponse } from 'axios';
import request, {
  handleApiResult,
  printApiError,
  printApiSuccess
} from '../utils/request';
import { IApiResult, IPageResult } from '@/types/base';

const axios = request;

// JSON Schema 类型定义
export type JsonType =
  | 'object'
  | 'array'
  | 'string'
  | 'integer'
  | 'number'
  | 'boolean'
  | 'null';

// JSON Schema 接口定义
export interface IJsonSchema {
  type: JsonType;
  properties?: Record<string, IJsonSchema>;
  items?: IJsonSchema;
  required?: string[];
  description?: string;
  format?: string;
  minItems?: number;
  maxItems?: number;
}

// 工具函数值定义
export interface IToolFunctionValue {
  name: string;
  description: string;
  inputSchema: Record<string, IJsonSchema>;
}

// ToolSpec DTO 接口定义
export interface IToolSpec {
  namespace: string;
  group: string;
  toolName: string;
  version: number;
  name: string;
  description: string;
  createTime: number;
  lastModifiedMillis: number;
  function: IToolFunctionValue;
}

// ToolSpec 查询参数接口
export interface IToolSpecQueryParam {
  pageNo: number;
  pageSize: number;
  namespaceId?: string;
  groupFilter?: string;
  toolNameFilter?: string;
}

// ToolSpec 操作参数接口
export interface IToolSpecParams {
  namespace: string;
  group: string;
  toolName: string;
  function?: IToolFunctionValue;
}

// ToolSpec 键值接口（用于删除和获取详情）
export interface IToolSpecKey {
  namespace: string;
  group: string;
  toolName: string;
}

/**
 * ToolSpec API 类
 * 提供 MCP 工具规范的 CRUD 操作接口
 */
class ToolSpecApi {
  /**
   * 查询 ToolSpec 分页列表
   * @param queryParam 查询参数
   * @returns Promise<AxiosResponse<IApiResult<IPageResult<IToolSpec>>>>
   */
  queryToolSpecPage(
    queryParam: IToolSpecQueryParam
  ): Promise<AxiosResponse<IApiResult<IPageResult<IToolSpec>>>> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/v2/mcp/toolspec/list',
      params: {
        ...queryParam
      }
    });
  }

  /**
   * 获取单个 ToolSpec 详情
   * @param toolSpecKey ToolSpec 键值
   * @returns Promise<AxiosResponse<IApiResult<IToolSpec>>>
   */
  getToolSpec(
    toolSpecKey: IToolSpecKey
  ): Promise<AxiosResponse<IApiResult<IToolSpec>>> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/v2/mcp/toolspec/info',
      params: {
        ...toolSpecKey
      }
    });
  }

  /**
   * 创建或更新 ToolSpec
   * @param toolSpecParams ToolSpec 参数，包含 function 字段定义工具函数
   * @returns Promise<AxiosResponse<IApiResult<boolean>>>
   */
  addOrUpdateToolSpec(
    toolSpecParams: IToolSpecParams
  ): Promise<AxiosResponse<IApiResult<boolean>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/mcp/toolspec/update',
      data: JSON.stringify(toolSpecParams)
    });
  }

  /**
   * 删除 ToolSpec
   * @param toolSpecKey ToolSpec 键值
   * @returns Promise<AxiosResponse<IApiResult<boolean>>>
   */
  removeToolSpec(
    toolSpecKey: IToolSpecKey
  ): Promise<AxiosResponse<IApiResult<boolean>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/mcp/toolspec/remove',
      data: JSON.stringify(toolSpecKey)
    });
  }

  // 便捷方法：带错误处理的查询列表
  async queryToolSpecPageWithErrorHandling(
    queryParam: IToolSpecQueryParam
  ): Promise<IPageResult<IToolSpec> | null> {
    try {
      const response = await this.queryToolSpecPage(queryParam);
      return handleApiResult(response);
    } catch (error) {
      printApiError(error);
      return null;
    }
  }

  // 便捷方法：带错误处理的获取详情
  async getToolSpecWithErrorHandling(
    toolSpecKey: IToolSpecKey
  ): Promise<IToolSpec | null> {
    try {
      const response = await this.getToolSpec(toolSpecKey);
      return handleApiResult(response);
    } catch (error) {
      printApiError(error);
      return null;
    }
  }

  // 便捷方法：带错误处理的创建或更新
  async addOrUpdateToolSpecWithErrorHandling(
    toolSpecParams: IToolSpecParams
  ): Promise<boolean> {
    try {
      const response = await this.addOrUpdateToolSpec(toolSpecParams);
      const result = handleApiResult(response);
      return result || false;
    } catch (error) {
      printApiError(error);
      return false;
    }
  }

  // 便捷方法：带错误处理的删除
  async removeToolSpecWithErrorHandling(
    toolSpecKey: IToolSpecKey
  ): Promise<boolean> {
    try {
      const response = await this.removeToolSpec(toolSpecKey);
      const result = handleApiResult(response);
      return result || false;
    } catch (error) {
      printApiError(error);
      return false;
    }
  }
}

export const toolSpecApi = new ToolSpecApi();

// 工具函数：验证 ToolSpec 参数
export const validateToolSpecParams = (params: IToolSpecParams): string[] => {
  const errors: string[] = [];

  if (!params.namespace?.trim()) {
    errors.push('Namespace cannot be empty');
  }

  if (!params.group?.trim()) {
    errors.push('Group cannot be empty');
  }

  if (!params.toolName?.trim()) {
    errors.push('Tool name cannot be empty');
  }

  if (params.function) {
    if (!params.function.name?.trim()) {
      errors.push('Function name cannot be empty');
    }

    if (!params.function.description?.trim()) {
      errors.push('Function description cannot be empty');
    }
  }

  return errors;
};

// 工具函数：验证查询参数
export const validateQueryParams = (params: IToolSpecQueryParam): string[] => {
  const errors: string[] = [];

  if (params.pageNo <= 0) {
    errors.push('Page number must be greater than 0');
  }

  if (params.pageSize <= 0) {
    errors.push('Page size must be greater than 0');
  }

  if (params.pageSize > 1000) {
    errors.push('Page size cannot exceed 1000');
  }

  return errors;
};

// 工具函数：转换 ToolSpec 为显示格式
export const formatToolSpecForDisplay = (toolSpec: IToolSpec) => {
  return {
    ...toolSpec,
    createTimeFormatted: new Date(toolSpec.createTime).toLocaleString(),
    lastModifiedFormatted: new Date(
      toolSpec.lastModifiedMillis
    ).toLocaleString(),
    functionParametersJson: JSON.stringify(
      toolSpec.function.inputSchema,
      null,
      2
    )
  };
};

// 工具函数：从 JSON 字符串解析函数参数
export const parseFunctionParametersFromJson = (
  jsonString: string
): Record<string, IJsonSchema> | null => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse function parameters JSON:', error);
    return null;
  }
};

// 工具函数：将函数参数转换为 JSON 字符串
export const stringifyFunctionParameters = (
  inputSchema: Record<string, IJsonSchema>
): string => {
  try {
    return JSON.stringify(inputSchema, null, 2);
  } catch (error) {
    console.error('Failed to stringify function parameters:', error);
    return '{}';
  }
};

// 向后兼容：保留旧的函数名作为别名
export const parseParametersFromJson = parseFunctionParametersFromJson;
export const stringifyParameters = stringifyFunctionParameters;

// 工具函数：标准化 ToolSpec 参数（向后兼容性处理）
export const normalizeToolSpecParams = (params: any): IToolSpecParams => {
  // 如果存在旧的 parameters 字段，将其映射到 function.inputSchema
  if (
    params.function &&
    params.function.parameters &&
    !params.function.inputSchema
  ) {
    return {
      ...params,
      function: {
        ...params.function,
        inputSchema: params.function.parameters,
        parameters: undefined
      }
    };
  }
  return params;
};
