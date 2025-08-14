import * as yaml from 'js-yaml';

/**
 * YAML 解析工具
 * 基于 js-yaml 库实现 YAML 解析和序列化功能
 */
export class YamlParser {
  constructor() {
    // YAML 解析选项
    this.parseOptions = {
      // 允许重复的键
      allowDuplicateKeys: false,
      // 最大文档长度
      maxAliasCount: 100,
      // 文件名（用于错误报告）
      filename: 'parameter.yaml'
    };

    // YAML 序列化选项
    this.stringifyOptions = {
      // 缩进空格数
      indent: 2,
      // 不使用引用
      noRefs: true,
      // 不使用兼容模式
      noCompatMode: true,
      // 条件引用
      condenseFlow: false,
      // 默认样式
      defaultStyle: null,
      // 默认流样式
      defaultFlowStyle: false,
      // 排序键
      sortKeys: false,
      // 行宽
      lineWidth: 80,
      // 不转义 Unicode
      noArrayIndent: false
    };
  }

  /**
   * 解析 YAML 字符串为对象
   * @param {string} yamlStr - YAML 字符串
   * @returns {Object} 解析后的对象
   * @throws {Error} 解析失败时抛出错误
   */
  parse(yamlStr) {
    try {
      if (!yamlStr || typeof yamlStr !== 'string') {
        throw new Error('YAML string cannot be empty or non-string');
      }

      const trimmedStr = yamlStr.trim();
      if (!trimmedStr) {
        return {};
      }

      // 使用 js-yaml 解析
      const result = yaml.load(trimmedStr, this.parseOptions);

      // 处理解析结果
      if (result === null || result === undefined) {
        return {};
      }

      // 确保返回对象类型
      if (typeof result !== 'object') {
        throw new Error('YAML content must represent an object');
      }

      return result;
    } catch (error) {
      // 增强错误信息
      throw new Error(this._enhanceYamlError(error, 'parse'));
    }
  }

  /**
   * 将对象转换为 YAML 字符串
   * @param {Object} obj - 对象
   * @returns {string} YAML 字符串
   * @throws {Error} 序列化失败时抛出错误
   */
  stringify(obj) {
    try {
      if (obj === null || obj === undefined) {
        obj = {};
      }

      if (typeof obj !== 'object') {
        throw new Error('Input must be an object');
      }

      // 使用 js-yaml 序列化
      const result = yaml.dump(obj, this.stringifyOptions);

      // 处理空对象的情况
      if (result.trim() === '{}') {
        return '{}';
      }

      return result;
    } catch (error) {
      throw new Error(this._enhanceYamlError(error, 'stringify'));
    }
  }

  /**
   * 验证 YAML 语法
   * @param {string} yamlStr - YAML 字符串
   * @returns {boolean} 是否有效
   */
  isValid(yamlStr) {
    try {
      this.parse(yamlStr);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 解析 YAML 并返回详细结果
   * @param {string} yamlStr - YAML 字符串
   * @returns {Object} 包含解析结果和元信息的对象
   */
  parseWithDetails(yamlStr) {
    const result = {
      success: false,
      data: null,
      error: null,
      warnings: []
    };

    try {
      result.data = this.parse(yamlStr);
      result.success = true;

      // 添加警告信息
      this._addParseWarnings(result, yamlStr);
    } catch (error) {
      result.error = error.message;
    }

    return result;
  }

  /**
   * 格式化 YAML 字符串（美化）
   * @param {string} yamlStr - 原始 YAML 字符串
   * @returns {string} 格式化后的 YAML 字符串
   */
  format(yamlStr) {
    try {
      const obj = this.parse(yamlStr);
      return this.stringify(obj);
    } catch (error) {
      throw new Error(`Failed to format YAML: ${error.message}`);
    }
  }

  /**
   * 检查 YAML 字符串是否包含特定特性
   * @param {string} yamlStr - YAML 字符串
   * @returns {Object} 特性检查结果
   */
  analyzeFeatures(yamlStr) {
    const features = {
      hasComments: false,
      hasMultilineStrings: false,
      hasArrays: false,
      hasNestedObjects: false,
      hasSpecialCharacters: false,
      estimatedComplexity: 'simple'
    };

    try {
      // 检查注释
      features.hasComments = yamlStr.includes('#');

      // 检查多行字符串
      features.hasMultilineStrings =
        yamlStr.includes('|') || yamlStr.includes('>');

      // 检查数组
      features.hasArrays = yamlStr.includes('-') || yamlStr.includes('[');

      // 检查特殊字符
      features.hasSpecialCharacters = /[!@#$%^&*()+={}[\]|\\:";'<>?,./]/.test(
        yamlStr
      );

      // 解析并检查嵌套
      const parsed = this.parse(yamlStr);
      features.hasNestedObjects = this._hasNestedObjects(parsed);

      // 评估复杂度
      features.estimatedComplexity = this._estimateComplexity(yamlStr, parsed);
    } catch {
      // 解析失败时的默认值
      features.estimatedComplexity = 'invalid';
    }

    return features;
  }

  /**
   * 增强 YAML 错误信息
   * @private
   * @param {Error} error - 原始错误
   * @param {string} operation - 操作类型
   * @returns {string} 增强后的错误信息
   */
  _enhanceYamlError(error, operation) {
    let message = error.message;

    // 常见错误的友好提示
    if (message.includes('duplicated mapping key')) {
      return 'YAML contains duplicate keys, each key must be unique';
    }

    if (message.includes('bad indentation')) {
      return 'YAML indentation error, please check spaces and alignment';
    }

    if (message.includes('unexpected end of the stream')) {
      return 'YAML syntax error: unexpected end of content';
    }

    if (message.includes('cannot read a block mapping entry')) {
      return 'YAML syntax error: invalid block mapping structure';
    }

    // 添加操作上下文
    return `YAML ${operation} error: ${message}`;
  }

  /**
   * 添加解析警告
   * @private
   * @param {Object} result - 解析结果对象
   * @param {string} yamlStr - 原始 YAML 字符串
   */
  _addParseWarnings(result, yamlStr) {
    // 检查制表符
    if (yamlStr.includes('\t')) {
      result.warnings.push(
        'YAML contains tabs, spaces are recommended for indentation'
      );
    }

    // 检查行尾空格
    const lines = yamlStr.split('\n');
    const hasTrailingSpaces = lines.some((line) => line.endsWith(' '));
    if (hasTrailingSpaces) {
      result.warnings.push('YAML contains trailing spaces');
    }

    // 检查空行过多
    const emptyLines = lines.filter((line) => line.trim() === '').length;
    if (emptyLines > lines.length * 0.3) {
      result.warnings.push('YAML contains many empty lines');
    }
  }

  /**
   * 检查对象是否有嵌套结构
   * @private
   * @param {Object} obj - 对象
   * @returns {boolean} 是否有嵌套
   */
  _hasNestedObjects(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 评估 YAML 复杂度
   * @private
   * @param {string} yamlStr - YAML 字符串
   * @param {Object} parsed - 解析后的对象
   * @returns {string} 复杂度等级
   */
  _estimateComplexity(yamlStr, parsed) {
    const lineCount = yamlStr.split('\n').length;
    const keyCount = this._countKeys(parsed);

    if (lineCount <= 5 && keyCount <= 3) {
      return 'simple';
    } else if (lineCount <= 20 && keyCount <= 10) {
      return 'moderate';
    } else {
      return 'complex';
    }
  }

  /**
   * 计算对象中的键数量
   * @private
   * @param {Object} obj - 对象
   * @returns {number} 键的总数
   */
  _countKeys(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return 0;
    }

    let count = 0;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        count++;
        count += this._countKeys(obj[key]);
      }
    }

    return count;
  }
}

// 创建默认实例
export const yamlParser = new YamlParser();
