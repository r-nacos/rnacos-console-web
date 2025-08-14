/**
 * Parameter Transform Utils
 * 参数转换工具模块
 *
 * 提供 MCP ToolSpec 参数字段的格式转换、验证和解析功能
 * 支持 JSON 和 YAML 格式之间的双向转换
 */

// 导入核心类
import {
  ParameterFormatConverter,
  formatConverter
} from './formatConverter.js';
import {
  ParameterFormatValidator,
  formatValidator
} from './formatValidator.js';
import { YamlParser, yamlParser } from './yamlParser.js';

// 导出类和默认实例
export {
  // 类导出
  ParameterFormatConverter,
  ParameterFormatValidator,
  YamlParser,

  // 默认实例导出
  formatConverter,
  formatValidator,
  yamlParser
};

/**
 * 工具函数：快速格式转换
 * @param {Object} obj - 对象
 * @param {string} format - 目标格式
 * @returns {string} 转换后的字符串
 */
export const objectToString = (obj, format = 'json') => {
  try {
    return formatConverter.objectToString(obj, format);
  } catch (error) {
    console.error('Quick objectToString conversion failed:', error);
    return format === 'yaml' ? '{}' : '{}';
  }
};

/**
 * 工具函数：快速字符串解析
 * @param {string} str - 字符串
 * @param {string} format - 源格式
 * @returns {Object} 解析后的对象
 */
export const stringToObject = (str, format = 'json') => {
  try {
    return formatConverter.stringToObject(str, format);
  } catch (error) {
    console.error('Quick stringToObject conversion failed:', error);
    throw error; // 重新抛出，让调用者处理
  }
};

/**
 * 工具函数：快速格式验证
 * @param {string} content - 内容
 * @param {string} format - 格式
 * @returns {boolean} 是否有效
 */
export const isValidFormat = (content, format = 'json') => {
  try {
    return formatValidator.validate(content, format).isValid;
  } catch (error) {
    console.error('Quick format validation failed:', error);
    return false;
  }
};

/**
 * 工具函数：格式转换
 * @param {string} content - 内容
 * @param {string} fromFormat - 源格式
 * @param {string} toFormat - 目标格式
 * @returns {string} 转换后的内容
 */
export const convertFormat = (content, fromFormat, toFormat) => {
  try {
    return formatConverter.convertFormat(content, fromFormat, toFormat);
  } catch (error) {
    console.error('Quick format conversion failed:', error);
    throw error;
  }
};

/**
 * 工具函数：创建空的格式化字符串
 * @param {string} format - 格式类型
 * @returns {string} 空的格式化字符串
 */
export const createEmptyFormatString = (format = 'json') => {
  return objectToString({}, format);
};

/**
 * 支持的格式列表
 */
export const SUPPORTED_FORMATS = ['json', 'yaml'];

/**
 * 格式显示名称映射
 */
export const FORMAT_DISPLAY_NAMES = {
  json: 'JSON',
  yaml: 'YAML'
};

/**
 * 默认配置
 */
export const DEFAULT_CONFIG = {
  defaultFormat: 'json',
  validationDelay: 300,
  maxObjectDepth: 10,
  maxContentLength: 50000
};

/**
 * 错误类型常量
 */
export const ERROR_TYPES = {
  SYNTAX_ERROR: 'SYNTAX_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CONVERSION_ERROR: 'CONVERSION_ERROR',
  UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT'
};

/**
 * 模块级错误处理器
 * @param {Error} error - 错误对象
 * @param {string} context - 错误上下文
 * @param {Object} options - 选项
 * @returns {Object} 错误处理结果
 */
export const handleError = (error, context = 'unknown', options = {}) => {
  const errorInfo = {
    type: ERROR_TYPES.VALIDATION_ERROR,
    message: error.message,
    context,
    timestamp: new Date().toISOString(),
    stack: options.includeStack ? error.stack : undefined
  };

  // 根据错误类型分类
  if (error.name === 'SyntaxError') {
    errorInfo.type = ERROR_TYPES.SYNTAX_ERROR;
  } else if (error.message.includes('Unsupported format')) {
    errorInfo.type = ERROR_TYPES.UNSUPPORTED_FORMAT;
  } else if (
    error.message.includes('conversion') ||
    error.message.includes('convert')
  ) {
    errorInfo.type = ERROR_TYPES.CONVERSION_ERROR;
  }

  // 记录错误日志
  if (options.logError !== false) {
    console.error(`[ParameterTransform] ${context}:`, errorInfo);
  }

  return errorInfo;
};

/**
 * 模块初始化函数
 * @param {Object} config - 配置选项
 */
export const initialize = (config = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  console.log(
    '[ParameterTransform] Module initialized with config:',
    finalConfig
  );

  // 可以在这里进行一些初始化操作
  // 比如设置全局配置、验证依赖等

  return finalConfig;
};

/**
 * 模块清理函数
 */
export const cleanup = () => {
  // 清理验证器的防抖定时器
  formatValidator.cleanup();
  console.log('[ParameterTransform] Module cleaned up');
};

/**
 * 获取模块信息
 * @returns {Object} 模块信息
 */
export const getModuleInfo = () => {
  return {
    name: 'ParameterTransform',
    version: '1.0.0',
    description:
      'Parameter format conversion and validation utilities for MCP ToolSpec',
    supportedFormats: SUPPORTED_FORMATS,
    features: [
      'JSON/YAML bidirectional conversion',
      'Real-time format validation',
      'Error handling and recovery',
      'Batch processing support',
      'Format compatibility checking'
    ]
  };
};

// 默认导出主要功能
export default {
  // 核心功能
  objectToString,
  stringToObject,
  isValidFormat,
  convertFormat,

  // 实例
  formatConverter,
  formatValidator,
  yamlParser,

  // 工具函数
  createEmptyFormatString,
  handleError,

  // 常量
  SUPPORTED_FORMATS,
  FORMAT_DISPLAY_NAMES,
  ERROR_TYPES,

  // 模块管理
  initialize,
  cleanup,
  getModuleInfo
};
