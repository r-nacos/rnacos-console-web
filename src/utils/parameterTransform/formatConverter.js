import { YamlParser } from './yamlParser.js';

/**
 * 参数格式转换工具
 * 提供对象与字符串之间的格式转换功能，支持 JSON 和 YAML 格式
 */
export class ParameterFormatConverter {
  constructor() {
    this.yamlParser = new YamlParser();
  }

  /**
   * 将对象转换为指定格式的字符串
   * @param {Object} obj - 参数对象
   * @param {string} format - 目标格式 ('json' | 'yaml')
   * @returns {string} 格式化字符串
   */
  objectToString(obj, format = 'json') {
    try {
      // 处理边缘情况
      if (obj === null || obj === undefined) {
        obj = {};
      }

      // 确保是对象类型
      if (typeof obj !== 'object') {
        throw new Error('Input must be an object');
      }

      switch (format.toLowerCase()) {
        case 'json':
          return JSON.stringify(obj, null, 2);
        case 'yaml':
          return this.yamlParser.stringify(obj);
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      console.error('Error converting object to string:', error);
      // 回退到空对象的字符串表示
      if (format.toLowerCase() === 'yaml') {
        return '{}';
      }
      return '{}';
    }
  }

  /**
   * 将字符串转换为对象
   * @param {string} str - 格式化字符串
   * @param {string} format - 源格式 ('json' | 'yaml')
   * @returns {Object} 解析后的对象
   */
  stringToObject(str, format = 'json') {
    try {
      // 处理边缘情况
      if (!str || typeof str !== 'string') {
        throw new Error('Content cannot be empty');
      }

      // 去除首尾空白
      str = str.trim();
      if (!str) {
        throw new Error('Content cannot be empty');
      }

      switch (format.toLowerCase()) {
        case 'json':
          return JSON.parse(str);
        case 'yaml':
          return this.yamlParser.parse(str);
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      console.error('Error converting string to object:', error);
      throw error; // 重新抛出错误，让调用者处理
    }
  }

  /**
   * 格式间转换
   * @param {string} content - 源内容
   * @param {string} fromFormat - 源格式
   * @param {string} toFormat - 目标格式
   * @returns {string} 转换后的内容
   */
  convertFormat(content, fromFormat, toFormat) {
    try {
      // 如果格式相同，直接返回
      if (fromFormat.toLowerCase() === toFormat.toLowerCase()) {
        return content;
      }

      // 先转换为对象，再转换为目标格式
      const obj = this.stringToObject(content, fromFormat);
      return this.objectToString(obj, toFormat);
    } catch (error) {
      console.error('Error converting between formats:', error);
      throw error;
    }
  }

  /**
   * 检查字符串是否为有效的指定格式
   * @param {string} content - 待检查的内容
   * @param {string} format - 格式类型
   * @returns {boolean} 是否有效
   */
  isValidFormat(content, format) {
    try {
      this.stringToObject(content, format);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 格式化字符串（美化输出）
   * @param {string} content - 源内容
   * @param {string} format - 格式类型
   * @returns {string} 格式化后的内容
   */
  formatString(content, format) {
    try {
      const obj = this.stringToObject(content, format);
      return this.objectToString(obj, format);
    } catch (error) {
      console.error('Error formatting string:', error);
      return content; // 格式化失败时返回原内容
    }
  }
}

// 创建默认实例
export const formatConverter = new ParameterFormatConverter();
