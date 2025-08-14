import { ParameterFormatConverter } from './formatConverter.js';

/**
 * 验证结果接口
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - 是否有效
 * @property {string[]} errors - 错误信息列表
 * @property {string[]} warnings - 警告信息列表
 * @property {Object} [parsedObject] - 解析成功时的对象
 */

/**
 * 参数格式验证工具
 * 提供格式验证和实时验证功能
 */
export class ParameterFormatValidator {
  constructor() {
    this.formatConverter = new ParameterFormatConverter();
    this.debounceTimers = new Map(); // 存储防抖定时器
  }

  /**
   * 验证字符串格式
   * @param {string} content - 待验证内容
   * @param {string} format - 格式类型 ('json' | 'yaml')
   * @returns {ValidationResult} 验证结果
   */
  validate(content, format = 'json') {
    const result = {
      isValid: false,
      errors: [],
      warnings: [],
      parsedObject: null
    };

    try {
      // 处理空内容
      if (!content || typeof content !== 'string') {
        result.errors.push('Content cannot be empty');
        return result;
      }

      const trimmedContent = content.trim();
      if (!trimmedContent) {
        result.errors.push('Content cannot be empty');
        return result;
      }

      // 尝试解析内容
      const parsedObject = this.formatConverter.stringToObject(
        trimmedContent,
        format
      );

      // 验证成功
      result.isValid = true;
      result.parsedObject = parsedObject;

      // 添加警告信息
      this._addWarnings(result, parsedObject, format);
    } catch (error) {
      result.isValid = false;
      result.errors.push(this._formatErrorMessage(error, format));
    }

    return result;
  }

  /**
   * 实时验证（防抖处理）
   * @param {string} content - 待验证内容
   * @param {string} format - 格式类型
   * @param {Function} callback - 回调函数，接收 ValidationResult 参数
   * @param {number} delay - 防抖延迟时间（毫秒），默认 300ms
   */
  validateRealtime(content, format, callback, delay = 300) {
    const key = `${format}_${Date.now()}`;

    // 清除之前的定时器
    this.debounceTimers.forEach((timer, timerKey) => {
      if (timerKey.startsWith(format)) {
        clearTimeout(timer);
        this.debounceTimers.delete(timerKey);
      }
    });

    // 设置新的防抖定时器
    const timer = setTimeout(() => {
      const result = this.validate(content, format);
      callback(result);
      this.debounceTimers.delete(key);
    }, delay);

    this.debounceTimers.set(key, timer);
  }

  /**
   * 批量验证多个内容
   * @param {Array<{content: string, format: string}>} items - 待验证项目列表
   * @returns {Array<ValidationResult>} 验证结果列表
   */
  validateBatch(items) {
    return items.map((item) => this.validate(item.content, item.format));
  }

  /**
   * 检查格式转换兼容性
   * @param {string} content - 内容
   * @param {string} fromFormat - 源格式
   * @param {string} toFormat - 目标格式
   * @returns {ValidationResult} 转换兼容性结果
   */
  validateFormatConversion(content, fromFormat, toFormat) {
    const result = {
      isValid: false,
      errors: [],
      warnings: [],
      convertedContent: null
    };

    try {
      // 先验证源格式
      const sourceValidation = this.validate(content, fromFormat);
      if (!sourceValidation.isValid) {
        result.errors.push(
          `Source format validation failed: ${sourceValidation.errors.join(
            ', '
          )}`
        );
        return result;
      }

      // 尝试格式转换
      const convertedContent = this.formatConverter.convertFormat(
        content,
        fromFormat,
        toFormat
      );

      // 验证转换后的格式
      const targetValidation = this.validate(convertedContent, toFormat);
      if (!targetValidation.isValid) {
        result.errors.push(
          `Target format validation failed: ${targetValidation.errors.join(
            ', '
          )}`
        );
        return result;
      }

      result.isValid = true;
      result.convertedContent = convertedContent;

      // 添加转换相关的警告
      if (fromFormat !== toFormat) {
        result.warnings.push(
          `Format converted from ${fromFormat} to ${toFormat}`
        );
      }
    } catch (error) {
      result.errors.push(`Conversion failed: ${error.message}`);
    }

    return result;
  }

  /**
   * 清理所有防抖定时器
   */
  cleanup() {
    this.debounceTimers.forEach((timer) => clearTimeout(timer));
    this.debounceTimers.clear();
  }

  /**
   * 格式化错误消息
   * @private
   * @param {Error} error - 错误对象
   * @param {string} format - 格式类型
   * @returns {string} 格式化的错误消息
   */
  _formatErrorMessage(error, format) {
    const formatName = format.toUpperCase();

    if (error.name === 'SyntaxError') {
      return `${formatName} syntax error: ${error.message}`;
    }

    if (error.message.includes('Unexpected token')) {
      return `${formatName} parsing error: Invalid syntax near "${error.message
        .split(' ')
        .pop()}"`;
    }

    if (error.message.includes('Unexpected end')) {
      return `${formatName} parsing error: Unexpected end of input`;
    }

    return `${formatName} validation error: ${error.message}`;
  }

  /**
   * 添加警告信息
   * @private
   * @param {ValidationResult} result - 验证结果对象
   * @param {Object} parsedObject - 解析后的对象
   * @param {string} format - 格式类型
   */
  _addWarnings(result, parsedObject, format) {
    // 检查空对象
    if (Object.keys(parsedObject).length === 0) {
      result.warnings.push('Object is empty');
    }

    // 检查深度嵌套
    const depth = this._getObjectDepth(parsedObject);
    if (depth > 5) {
      result.warnings.push(`Object has deep nesting (depth: ${depth})`);
    }

    // 检查大型对象
    const stringified = JSON.stringify(parsedObject);
    if (stringified.length > 10000) {
      result.warnings.push('Object is very large, consider simplifying');
    }

    // YAML 特定警告
    if (format === 'yaml') {
      if (stringified.includes('\t')) {
        result.warnings.push(
          'YAML content contains tabs, spaces are recommended'
        );
      }
    }
  }

  /**
   * 获取对象嵌套深度
   * @private
   * @param {Object} obj - 对象
   * @returns {number} 嵌套深度
   */
  _getObjectDepth(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return 0;
    }

    let maxDepth = 0;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const depth = this._getObjectDepth(obj[key]);
        maxDepth = Math.max(maxDepth, depth);
      }
    }

    return maxDepth + 1;
  }
}

// 创建默认实例
export const formatValidator = new ParameterFormatValidator();
