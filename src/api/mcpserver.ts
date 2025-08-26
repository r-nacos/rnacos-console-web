import { AxiosResponse } from 'axios';
import request, {
  handleApiResult,
  printApiError,
  printApiSuccess
} from '../utils/request';
import { IApiResult, IPageResult } from '@/types/base';
import {
  McpServerDto,
  McpServerQueryParams,
  McpServerParams,
  ToolSpecInfo,
  PageResult
} from '@/types/mcpserver';

const axios = request;

/**
 * McpServer API 类
 * 提供 MCP 服务器的 CRUD 操作接口
 */
class McpServerApi {
  /**
   * 查询 McpServer 分页列表
   * @param params 查询参数
   * @returns Promise<AxiosResponse<IApiResult<IPageResult<McpServerDto>>>>
   */
  queryMcpServerPage(
    params: McpServerQueryParams
  ): Promise<AxiosResponse<IApiResult<IPageResult<McpServerDto>>>> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/v2/mcp/server/list',
      params: {
        ...params
      }
    });
  }

  /**
   * 获取单个 McpServer 详情
   * @param id McpServer ID
   * @returns Promise<AxiosResponse<IApiResult<McpServerDto>>>
   */
  getMcpServer(id: number): Promise<AxiosResponse<IApiResult<McpServerDto>>> {
    return axios.request({
      method: 'get',
      url: '/rnacos/api/console/v2/mcp/server/info',
      params: {
        id
      }
    });
  }

  /**
   * 创建 McpServer
   * @param params McpServer 参数
   * @returns Promise<AxiosResponse<IApiResult<number>>>
   */
  addMcpServer(
    params: McpServerParams
  ): Promise<AxiosResponse<IApiResult<number>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/mcp/server/add',
      data: JSON.stringify(params)
    });
  }

  /**
   * 更新 McpServer
   * @param params McpServer 参数
   * @returns Promise<AxiosResponse<IApiResult<boolean>>>
   */
  updateMcpServer(
    params: McpServerParams
  ): Promise<AxiosResponse<IApiResult<boolean>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/mcp/server/update',
      data: JSON.stringify(params)
    });
  }

  /**
   * 删除 McpServer
   * @param id McpServer ID
   * @returns Promise<AxiosResponse<IApiResult<boolean>>>
   */
  removeMcpServer(id: number): Promise<AxiosResponse<IApiResult<boolean>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/rnacos/api/console/v2/mcp/server/remove',
      data: JSON.stringify({ id })
    });
  }

  // 便捷方法：带错误处理的查询列表
  async queryMcpServerPageWithErrorHandling(
    params: McpServerQueryParams
  ): Promise<IPageResult<McpServerDto> | null> {
    try {
      const response = await this.queryMcpServerPage(params);
      return handleApiResult(response);
    } catch (error) {
      printApiError(error);
      return null;
    }
  }

  // 便捷方法：带错误处理的获取详情
  async getMcpServerWithErrorHandling(
    id: number
  ): Promise<McpServerDto | null> {
    try {
      const response = await this.getMcpServer(id);
      return handleApiResult(response);
    } catch (error) {
      printApiError(error);
      return null;
    }
  }

  // 便捷方法：带错误处理的创建
  async addMcpServerWithErrorHandling(
    params: McpServerParams
  ): Promise<number | null> {
    try {
      const response = await this.addMcpServer(params);
      const result = handleApiResult(response);
      if (result !== null) {
        printApiSuccess();
      }
      return result;
    } catch (error) {
      printApiError(error);
      return null;
    }
  }

  // 便捷方法：带错误处理的更新
  async updateMcpServerWithErrorHandling(
    params: McpServerParams
  ): Promise<boolean> {
    try {
      const response = await this.updateMcpServer(params);
      const result = handleApiResult(response);
      if (result) {
        printApiSuccess();
      }
      return result || false;
    } catch (error) {
      printApiError(error);
      return false;
    }
  }

  // 便捷方法：带错误处理的删除
  async removeMcpServerWithErrorHandling(id: number): Promise<boolean> {
    try {
      const response = await this.removeMcpServer(id);
      const result = handleApiResult(response);
      if (result) {
        printApiSuccess();
      }
      return result || false;
    } catch (error) {
      printApiError(error);
      return false;
    }
  }
}

export const mcpServerApi = new McpServerApi();

// 工具函数：验证查询参数
export const validateMcpServerQueryParams = (
  params: McpServerQueryParams
): string[] => {
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

// 工具函数：转换 McpServer 为显示格式
export const formatMcpServerForDisplay = (server: McpServerDto) => {
  console.log('Formatting server data:', server); // 添加日志以查看原始数据
  const formatted = {
    ...server,
    createTimeFormatted: server.createTime
      ? new Date(server.createTime).toLocaleString()
      : '-',
    updateTimeFormatted: server.lastModifiedMillis
      ? new Date(server.lastModifiedMillis).toLocaleString()
      : '-',
    authKeysDisplay: Array.isArray(server.authKeys)
      ? server.authKeys.join(', ')
      : '',
    toolsCount: server.currentValue?.tools?.length || 0
  };
  console.log('Formatted server data:', formatted); // 添加日志以查看格式化后的数据
  return formatted;
};
