<template>
  <div class="bg-white rounded w-full">
    <n-form ref="formRef" :model="model" :rules="rules" class="w-full">
      <n-grid
        :cols="'1 s:1 m:2 l:3 xl:3 2xl:4'"
        :x-gap="12"
        responsive="screen"
      >
        <n-gi>
          <n-form-item path="namespace" :label="t('toolspec.namespace')">
            <n-input
              :disabled="isReadonly || isUpdate"
              :placeholder="t('toolspec.input_namespace')"
              v-model:value="model.namespace"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item path="group" :label="t('toolspec.group')">
            <n-input
              :disabled="isReadonly || isUpdate"
              :placeholder="t('toolspec.input_group')"
              v-model:value="model.group"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item path="toolName" :label="t('toolspec.tool_name')">
            <n-input
              :disabled="isReadonly || isUpdate"
              :placeholder="t('toolspec.input_tool_name')"
              v-model:value="model.toolName"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
        <n-gi v-if="!isCreate">
          <n-form-item path="version" :label="t('toolspec.version')">
            <n-input
              :disabled="true"
              v-model:value="model.version"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
      </n-grid>

      <n-form-item path="name" :label="t('toolspec.name')">
        <n-input
          :disabled="isReadonly"
          :placeholder="t('toolspec.input_name')"
          v-model:value="model.name"
          @keydown.enter.prevent
        />
      </n-form-item>

      <n-form-item path="description" :label="t('toolspec.description')">
        <n-input
          :disabled="isReadonly"
          :placeholder="t('toolspec.input_description')"
          v-model:value="model.description"
          type="textarea"
          :autosize="{ minRows: 2 }"
          @keydown.enter.prevent
        />
      </n-form-item>

      <n-form-item
        v-show="!isReadonly"
        path="functionFormat"
        :label="t('toolspec.parameters_format')"
      >
        <n-space align="center">
          <n-radio-group
            :disabled="isReadonly"
            v-model:value="model.functionFormat"
            name="functionFormat"
          >
            <n-space>
              <n-radio value="yaml" @change="formatChange"> YAML </n-radio>
              <n-radio value="json" @change="formatChange"> JSON </n-radio>
            </n-space>
          </n-radio-group>
          <n-tag
            v-if="model.function && model.function.trim()"
            :type="validationResult.isValid ? 'success' : 'error'"
            size="small"
          >
            {{
              validationResult.isValid
                ? t('toolspec.format_valid')
                : t('toolspec.format_invalid')
            }}
          </n-tag>
          <n-tag v-if="isConverting" type="info" size="small">
            {{ t('toolspec.converting') }}
          </n-tag>
        </n-space>
      </n-form-item>

      <!-- Validation error display -->
      <n-form-item v-if="!isReadonly && validationResult.errors.length > 0">
        <n-alert type="error" :show-icon="false" style="margin-bottom: 8px">
          <template #header>
            {{ t('toolspec.validation_errors') }}
          </template>
          <ul style="margin: 0; padding-left: 20px">
            <li v-for="error in validationResult.errors" :key="error">
              {{ error }}
            </li>
          </ul>
        </n-alert>
      </n-form-item>

      <!-- Validation warning display -->
      <n-form-item v-if="!isReadonly && validationResult.warnings.length > 0">
        <n-alert type="warning" :show-icon="false" style="margin-bottom: 8px">
          <template #header>
            {{ t('toolspec.validation_warnings') }}
          </template>
          <ul style="margin: 0; padding-left: 20px">
            <li v-for="warning in validationResult.warnings" :key="warning">
              {{ warning }}
            </li>
          </ul>
        </n-alert>
      </n-form-item>

      <n-form-item path="function" :label="t('toolspec.parameters')">
        <div
          class="border border-gray-300 w-full relative bg-[#002b36]"
          ref="editorMainRef"
        >
          <div class="absolute right-0 top-0 z-10 flex">
            <div
              v-if="!isReadonly && model.functionFormat === 'json'"
              class="h-10 w-10 bg-[#103b46] bg-opacity-70 p-2.5 cursor-pointer"
              @click="formatFunction"
              :title="t('toolspec.format_parameters')"
            >
              <n-icon size="20" color="#fff">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z"
                  />
                </svg>
              </n-icon>
            </div>
            <div
              class="h-10 w-10 bg-[#103b46] bg-opacity-70 p-2.5 cursor-pointer"
              @click="toggleFullScreen"
              :title="t('toolspec.toggle_fullscreen')"
            >
              <n-icon size="20" color="#fff">
                <Resize />
              </n-icon>
            </div>
          </div>
          <div
            class="relative overflow-scroll bg-[#002b36] resize"
            ref="editorRef"
            @click="focusEvent"
            style="height: 400px"
          >
            <div @click="stopPropagation">
              <code-mirror
                :readonly="isReadonly"
                v-model="model.function"
                :foucsValue="focusValue"
                :lang="lang"
                :basic="true"
                :tab="true"
                :extensions="extensions"
              />
            </div>
          </div>
        </div>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup>
import CodeMirror from '@/components/config/CodeMirror';
import { Resize } from '@vicons/ionicons5';
import { solarizedDark } from '@/components/config/cm6theme';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import * as constant from '@/types/constant';
import {
  ref,
  defineExpose,
  onMounted,
  onBeforeUnmount,
  computed,
  watch
} from 'vue';
import { useI18n } from 'vue-i18n';
import { toolSpecApi } from '@/api/toolspec';
import {
  formatConverter,
  formatValidator,
  objectToString,
  stringToObject,
  isValidFormat as validateFormat,
  convertFormat,
  handleError,
  ERROR_TYPES
} from '@/utils/parameterTransform';

const { t } = useI18n();
const props = defineProps(['model']);
const emit = defineEmits([
  'cancel',
  'close',
  'submit-success',
  'update-function',
  'update-format',
  'reset-form'
]);
const extensions = [solarizedDark];

const yamlLang = yaml();
const langMap = {
  json: json(),
  yaml: yamlLang
};

const lang = ref();
const focusValue = ref(0);

// Validation state for real-time feedback
const validationResult = ref({
  isValid: true,
  errors: [],
  warnings: []
});

const isConverting = ref(false); // Format conversion state

const doChangeLang = function (v) {
  if (v) {
    lang.value = langMap[v];
    props.model.functionFormat = v;
  }
};

/**
 * 简单的JSON到YAML转换（基础实现）
 * @param {object} obj - JSON对象
 * @param {number} indent - 缩进级别
 * @returns {string} YAML字符串
 */
const jsonToYaml = function (obj, indent = 0) {
  const spaces = '  '.repeat(indent);

  if (obj === null) return 'null';
  if (typeof obj === 'boolean') return obj.toString();
  if (typeof obj === 'number') return obj.toString();
  if (typeof obj === 'string') {
    // Simple string handling, add quotes if contains special characters
    if (
      obj.includes('\n') ||
      obj.includes(':') ||
      obj.includes('#') ||
      obj.includes('[') ||
      obj.includes(']')
    ) {
      return `"${obj.replace(/"/g, '\\"')}"`;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return obj
      .map((item) => `${spaces}- ${jsonToYaml(item, indent + 1)}`)
      .join('\n');
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';
    return keys
      .map((key) => {
        const value = obj[key];
        if (
          typeof value === 'object' &&
          value !== null &&
          !Array.isArray(value)
        ) {
          return `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
        } else if (Array.isArray(value) && value.length > 0) {
          return `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
        } else {
          return `${spaces}${key}: ${jsonToYaml(value, indent)}`;
        }
      })
      .join('\n');
  }

  return obj.toString();
};

/**
 * 转换函数格式
 * @param {string} fromFormat - 源格式 (yaml/json)
 * @param {string} toFormat - 目标格式 (yaml/json)
 * @param {string} content - 内容
 * @returns {string} 转换后的内容
 */
const convertFunctionFormat = function (fromFormat, toFormat, content) {
  if (!content || content.trim() === '' || fromFormat === toFormat) {
    return content;
  }

  try {
    // Use the new format converter for bidirectional conversion
    return convertFormat(content, fromFormat, toFormat);
  } catch (error) {
    console.warn('Format conversion failed:', error);

    // Log error for debugging
    handleError(error, 'convertFunctionFormat', {
      fromFormat,
      toFormat,
      contentLength: content.length,
      logError: true
    });

    return content; // Return original content when conversion fails
  }
};

/**
 * 验证函数格式
 * @param {string} format - 格式类型 (yaml/json)
 * @param {string} content - 内容
 * @returns {boolean} 是否有效
 */
const validateFunctionFormat = function (format, content) {
  if (!content || content.trim() === '') {
    return false;
  }

  try {
    // Use the new format validator
    return validateFormat(content, format);
  } catch (error) {
    console.error('Format validation error:', error);
    return false;
  }
};

/**
 * 初始化参数显示
 * 从 IToolSpec.function.parameters 转换为显示字符串
 * @param {Object} parametersObj - 参数对象
 * @param {string} format - 目标格式 ('json' | 'yaml')
 * @returns {string} 格式化字符串
 */
const initializeParameterDisplay = function (parametersObj, format = 'json') {
  try {
    // Handle null, undefined, or empty cases
    if (
      !parametersObj ||
      (typeof parametersObj === 'object' &&
        Object.keys(parametersObj).length === 0)
    ) {
      return objectToString({}, format);
    }

    // Convert object to formatted string
    return objectToString(parametersObj, format);
  } catch (error) {
    console.error('Parameter initialization error:', error);

    // Error fallback - return empty object representation
    const fallbackContent = format === 'yaml' ? '{}' : '{}';

    // Log error for debugging
    handleError(error, 'initializeParameterDisplay', {
      parametersObj,
      format,
      logError: true
    });

    return fallbackContent;
  }
};

/**
 * 实时验证参数格式（防抖处理）
 * @param {string} content - 待验证内容
 * @param {string} format - 格式类型
 */
const validateParametersRealtime = function (content, format) {
  try {
    // Use the format validator for detailed validation
    const result = formatValidator.validate(content, format);

    // Update validation result
    validationResult.value = {
      isValid: result.isValid,
      errors: result.errors || [],
      warnings: result.warnings || []
    };

    return result;
  } catch (error) {
    console.error('Real-time validation error:', error);

    // Set error state
    validationResult.value = {
      isValid: false,
      errors: [t('toolspec.validation_error')],
      warnings: []
    };

    return {
      isValid: false,
      errors: [error.message],
      warnings: []
    };
  }
};

// Create debounced version of the validation function
let validationTimeout = null;
const validateParametersRealtimeDebounced = function (content, format) {
  if (validationTimeout) {
    clearTimeout(validationTimeout);
  }

  validationTimeout = setTimeout(() => {
    validateParametersRealtime(content, format);
  }, 300); // 300ms debounce delay
};

/**
 * 点击编辑器父容器时，直接focus到编辑器
 * @param {*} e
 */
const focusEvent = function (e) {
  focusValue.value += 1;
};

/**
 * 如果点击编辑器内容则阻止事件冒泡，避免被父容器收到事件后重新focus到编辑器
 * @param {*} e
 */
const stopPropagation = function (e) {
  e.stopPropagation();
  return false;
};

const isReadonly = computed(
  () => props.model.mode === constant.FORM_MODE_DETAIL
);
const isCreate = computed(() => props.model.mode === constant.FORM_MODE_CREATE);
const isUpdate = computed(() => props.model.mode === constant.FORM_MODE_UPDATE);

// Real-time function format validation
const isValidFormat = computed(() => {
  if (!props.model.function || props.model.function.trim() === '') {
    return true; // Empty content is considered valid
  }

  // Trigger real-time validation
  validateParametersRealtimeDebounced(
    props.model.function,
    props.model.functionFormat
  );

  // Return current validation state
  return validationResult.value.isValid;
});

const rules = {
  namespace: [
    {
      required: true,
      validator(_, value) {
        if (!value) {
          return new Error(t('toolspec.need_input_namespace'));
        }
        return true;
      },
      trigger: ['input', 'blur']
    }
  ],
  group: [
    {
      required: true,
      validator(_, value) {
        if (!value) {
          return new Error(t('toolspec.need_input_group'));
        }
        return true;
      },
      trigger: ['input', 'blur']
    }
  ],
  toolName: [
    {
      required: true,
      validator(_, value) {
        if (!value) {
          return new Error(t('toolspec.need_input_tool_name'));
        }
        return true;
      },
      trigger: ['input', 'blur']
    }
  ],
  name: [
    {
      required: true,
      validator(_, value) {
        if (!value) {
          return new Error(t('toolspec.need_input_name'));
        }
        return true;
      },
      trigger: ['input', 'blur']
    }
  ],
  function: [
    {
      required: true,
      validator(_, value) {
        if (!value || value.trim() === '') {
          return new Error(t('toolspec.need_input_parameters'));
        }

        // Use the format validator for comprehensive validation
        try {
          const validation = formatValidator.validate(
            value,
            props.model.functionFormat
          );
          if (!validation.isValid) {
            return new Error(
              t('toolspec.invalid_parameters_format') +
                ': ' +
                validation.errors.join(', ')
            );
          }

          // Additional check to ensure the result can be converted to object
          const converted = stringToObject(value, props.model.functionFormat);
          if (
            typeof converted !== 'object' ||
            converted === null ||
            Array.isArray(converted)
          ) {
            return new Error(t('toolspec.parameters_should_be_object'));
          }

          return true;
        } catch (error) {
          return new Error(
            t('toolspec.invalid_parameters_format') + ': ' + error.message
          );
        }
      },
      trigger: ['input', 'blur']
    }
  ]
};

/**
 * 处理格式切换
 * 增强现有的 formatChange 方法，支持双向格式转换
 * @param {Event} event - 格式切换事件
 */
const formatChange = function (event) {
  const newFormat = event.target.value;
  const oldFormat = props.model.functionFormat;

  // If no content or same format, just update format
  if (
    !props.model.function ||
    !props.model.function.trim() ||
    oldFormat === newFormat
  ) {
    emit('update-format', newFormat);
    doChangeLang(newFormat);
    return;
  }

  // Set converting state
  isConverting.value = true;

  try {
    // Attempt bidirectional format conversion
    const convertedContent = convertFunctionFormat(
      oldFormat,
      newFormat,
      props.model.function
    );

    if (convertedContent !== props.model.function) {
      // Emit event to parent to update the model instead of direct mutation
      emit('update-function', convertedContent);
      window.$message.success(t('toolspec.format_converted_successfully'));

      // Clear any previous validation errors since we have new content
      validationResult.value = {
        isValid: true,
        errors: [],
        warnings: []
      };

      // Trigger validation for the new content
      setTimeout(() => {
        validateParametersRealtimeDebounced(convertedContent, newFormat);
      }, 100);
    } else {
      // Content didn't change, might be already in correct format or conversion not needed
      window.$message.info(t('toolspec.format_no_change_needed'));
    }
  } catch (error) {
    console.error('Format conversion failed:', error);

    // Handle conversion failure with user-friendly message
    const errorInfo = handleError(error, 'formatChange', {
      oldFormat,
      newFormat,
      contentLength: props.model.function.length,
      logError: true
    });

    let errorMessage = t('toolspec.format_conversion_failed');
    if (errorInfo.type === ERROR_TYPES.SYNTAX_ERROR) {
      errorMessage = t('toolspec.format_conversion_syntax_error');
    } else if (errorInfo.type === ERROR_TYPES.UNSUPPORTED_FORMAT) {
      errorMessage = t('toolspec.format_conversion_unsupported');
    }

    window.$message.error(errorMessage);

    // Don't change format if conversion fails, revert to old format
    // Note: We don't emit update-format here to keep the old format
    return;
  } finally {
    // Clear converting state
    isConverting.value = false;
  }

  // Emit event to parent to update the format
  emit('update-format', newFormat);
  doChangeLang(newFormat);
};

const formRef = ref();

/**
 * 表单验证
 * @param {Function} callback - 验证成功后的回调函数
 */
const submitValidate = function (callback) {
  formRef.value?.validate((errors) => {
    if (errors) {
      console.log(errors);
      window.$message.error(
        t('toolspec.check_fail') + ':' + errors[0][0].message
      );
    } else {
      callback();
    }
  });
};

/**
 * 重置表单数据
 */
const resetForm = function () {
  if (formRef.value) {
    formRef.value.restoreValidation();
  }

  // Emit reset event to parent component
  emit('reset-form');
};

/**
 * 构建提交数据
 * 增强版本，使用 stringToObject 转换用户输入，实现提交前的最终格式验证和错误处理
 * 确保转换后的对象正确设置到 IToolSpecParams.function.parameters
 * @returns {Object|null} 提交数据对象，失败返回null
 */
const buildSubmitData = function () {
  try {
    // Validate required fields
    if (!props.model.namespace?.trim()) {
      window.$message.error(t('toolspec.need_input_namespace'));
      return null;
    }

    if (!props.model.group?.trim()) {
      window.$message.error(t('toolspec.need_input_group'));
      return null;
    }

    if (!props.model.toolName?.trim()) {
      window.$message.error(t('toolspec.need_input_tool_name'));
      return null;
    }

    if (!props.model.name?.trim()) {
      window.$message.error(t('toolspec.need_input_name'));
      return null;
    }

    // Validate function parameters field
    if (!props.model.function || props.model.function.trim() === '') {
      window.$message.error(t('toolspec.need_input_parameters'));
      return null;
    }

    // Perform final format validation before conversion
    console.log('Performing final validation before submission...');
    const finalValidation = formatValidator.validate(
      props.model.function,
      props.model.functionFormat
    );

    if (!finalValidation.isValid) {
      console.error('Final validation failed:', finalValidation.errors);

      // Show detailed validation errors to user
      const errorMessage =
        t('toolspec.invalid_parameters_format') +
        ':\n' +
        finalValidation.errors.join('\n');
      window.$message.error(errorMessage);

      // Update validation result to show errors in UI
      validationResult.value = {
        isValid: false,
        errors: finalValidation.errors,
        warnings: finalValidation.warnings || []
      };

      return null;
    }

    // Use stringToObject to convert user input to object
    console.log('Converting parameters from string to object...');
    let parametersObject;

    try {
      parametersObject = stringToObject(
        props.model.function,
        props.model.functionFormat
      );
    } catch (conversionError) {
      console.error('Parameter conversion error:', conversionError);

      // Handle conversion errors with detailed error information
      const errorInfo = handleError(conversionError, 'buildSubmitData', {
        format: props.model.functionFormat,
        contentLength: props.model.function.length,
        logError: true
      });

      let errorMessage = t('toolspec.invalid_parameters_format');
      if (errorInfo.type === ERROR_TYPES.SYNTAX_ERROR) {
        errorMessage =
          t('toolspec.parameters_syntax_error') +
          ': ' +
          conversionError.message;
      } else if (errorInfo.type === ERROR_TYPES.CONVERSION_ERROR) {
        errorMessage =
          t('toolspec.parameters_conversion_error') +
          ': ' +
          conversionError.message;
      } else if (errorInfo.type === ERROR_TYPES.UNSUPPORTED_FORMAT) {
        errorMessage = t('toolspec.unsupported_parameters_format');
      }

      window.$message.error(errorMessage);

      // Update validation result to show conversion error
      validationResult.value = {
        isValid: false,
        errors: [conversionError.message],
        warnings: []
      };

      return null;
    }

    // Validate the structure of the converted object
    if (typeof parametersObject !== 'object' || parametersObject === null) {
      const errorMessage = t('toolspec.invalid_parameters_structure');
      window.$message.error(errorMessage);

      validationResult.value = {
        isValid: false,
        errors: [errorMessage],
        warnings: []
      };

      return null;
    }

    // Additional validation for parameters structure
    // The parameters object should be a valid JSON Schema or parameter definition
    if (Array.isArray(parametersObject)) {
      const errorMessage = t('toolspec.parameters_should_be_object');
      window.$message.error(errorMessage);

      validationResult.value = {
        isValid: false,
        errors: [errorMessage],
        warnings: []
      };

      return null;
    }

    // Log successful conversion for debugging
    console.log('Parameters successfully converted:', {
      format: props.model.functionFormat,
      originalLength: props.model.function.length,
      convertedKeys: Object.keys(parametersObject),
      hasValidation: finalValidation.isValid
    });

    // Build submission data according to IToolSpecParams interface
    const submitData = {
      namespace: props.model.namespace.trim(),
      group: props.model.group.trim(),
      toolName: props.model.toolName.trim(),
      function: {
        name: props.model.name.trim(),
        description: props.model.description?.trim() || '',
        parameters: parametersObject // Correctly set converted object to parameters
      }
    };

    // Final validation of the complete submission data structure
    if (!submitData.function || !submitData.function.parameters) {
      const errorMessage = t('toolspec.invalid_submission_data');
      window.$message.error(errorMessage);
      return null;
    }

    // Clear any previous validation errors since we have valid data
    validationResult.value = {
      isValid: true,
      errors: [],
      warnings: finalValidation.warnings || []
    };

    console.log('Submit data built successfully:', {
      namespace: submitData.namespace,
      group: submitData.group,
      toolName: submitData.toolName,
      functionName: submitData.function.name,
      parametersKeys: Object.keys(submitData.function.parameters)
    });

    return submitData;
  } catch (error) {
    console.error('Unexpected error in buildSubmitData:', error);

    // Handle unexpected errors
    const errorInfo = handleError(error, 'buildSubmitData', {
      logError: true
    });

    const errorMessage =
      t('toolspec.submission_data_build_failed') + ': ' + error.message;
    window.$message.error(errorMessage);

    validationResult.value = {
      isValid: false,
      errors: [error.message],
      warnings: []
    };

    return null;
  }
};

/**
 * 提交表单数据
 * 使用增强的 buildSubmitData 方法，包含完整的验证和错误处理
 * @returns {Promise<boolean>} 提交是否成功
 */
const submitFormData = async function () {
  try {
    console.log('Starting form submission process...');

    // Build submission data with enhanced validation and conversion
    const submitData = buildSubmitData();
    if (!submitData) {
      console.log('Form submission aborted: buildSubmitData returned null');
      return false;
    }

    console.log('Submitting ToolSpec data:', {
      namespace: submitData.namespace,
      group: submitData.group,
      toolName: submitData.toolName,
      functionName: submitData.function.name,
      parametersStructure: typeof submitData.function.parameters,
      parametersKeys: Object.keys(submitData.function.parameters || {})
    });

    // Call API to submit data
    const success =
      await toolSpecApi.addOrUpdateToolSpecWithErrorHandling(submitData);

    if (success) {
      const actionText =
        props.model.mode === constant.FORM_MODE_CREATE
          ? t('toolspec.create_success')
          : t('toolspec.update_success');
      window.$message.success(actionText);

      console.log('Form submission successful');
      return true;
    } else {
      const actionText =
        props.model.mode === constant.FORM_MODE_CREATE
          ? t('toolspec.create_failed')
          : t('toolspec.update_failed');
      window.$message.error(actionText);

      console.log('Form submission failed: API returned false');
      return false;
    }
  } catch (error) {
    console.error('Form submission error:', error);

    // Handle submission errors with detailed logging
    const errorInfo = handleError(error, 'submitFormData', {
      mode: props.model.mode,
      logError: true
    });

    const actionText =
      props.model.mode === constant.FORM_MODE_CREATE
        ? t('toolspec.create_failed')
        : t('toolspec.update_failed');

    // Show detailed error message if available
    const errorMessage =
      errorInfo.type === ERROR_TYPES.VALIDATION_ERROR
        ? actionText + ': ' + error.message
        : actionText;

    window.$message.error(errorMessage);
    return false;
  }
};

/**
 * 处理表单取消操作
 */
const handleCancel = function () {
  // Reset form validation state
  if (formRef.value) {
    formRef.value.restoreValidation();
  }

  // Emit cancel event to parent component
  emit('cancel');
};

/**
 * 处理表单提交
 */
const handleSubmit = async function () {
  // If in detail mode, return directly
  if (props.model.mode === constant.FORM_MODE_DETAIL) {
    emit('close');
    return;
  }

  // Validate form
  return new Promise((resolve) => {
    submitValidate(async () => {
      const success = await submitFormData();
      if (success) {
        emit('submit-success');
      }
      resolve(success);
    });
  });
};

const editorMainRef = ref();
const editorRef = ref();

const fullStatue = ref(false);
const editorHeight = ref(Math.max(300, window.innerHeight - 490));

const toggleFullScreen = function () {
  const editorMain = editorMainRef.value;
  const editor = editorRef.value;
  if (editorMain && editor) {
    editorMain.classList.toggle('fullscreen');
    if (editorMain.classList.contains('fullscreen')) {
      fullStatue.value = true;
      editor.style.height = '100%';
    } else {
      fullStatue.value = false;
      editorMain.style.height = '';
      editor.style.height = `${editorHeight.value}px`;
    }
  }
};

/**
 * 格式化函数内容
 */
const formatFunction = function () {
  if (!props.model.function || props.model.function.trim() === '') {
    return;
  }

  try {
    if (props.model.functionFormat === 'json') {
      const parsed = JSON.parse(props.model.function);
      const formatted = JSON.stringify(parsed, null, 2);
      emit('update-function', formatted);
      window.$message.success(t('toolspec.format_success'));
    }
  } catch (error) {
    window.$message.error(t('toolspec.format_failed'));
  }
};

defineExpose({
  submitValidate,
  resetForm,
  handleSubmit,
  handleCancel,
  submitFormData
});

watch(
  () => props.model.functionFormat,
  () => {
    doChangeLang(props.model.functionFormat);
  }
);

// Watch for function content changes to trigger real-time validation
watch(
  () => props.model.function,
  (newContent) => {
    if (newContent !== undefined && newContent !== null) {
      validateParametersRealtimeDebounced(
        newContent,
        props.model.functionFormat || 'json'
      );
    }
  },
  { immediate: false }
);

// Watch for format changes to re-validate content
watch(
  () => props.model.functionFormat,
  (newFormat) => {
    if (props.model.function && newFormat) {
      validateParametersRealtimeDebounced(props.model.function, newFormat);
    }
  }
);

const adjustCodeContainerHeight = () => {
  editorHeight.value = Math.max(300, window.innerHeight - 490);
  const editor = editorRef.value;
  if (editor) {
    if (fullStatue.value) {
      return;
    }
    editor.style.height = `${editorHeight.value}px`;
  }
};

onMounted(() => {
  adjustCodeContainerHeight();
  window.addEventListener('resize', adjustCodeContainerHeight);
  // Initialize language
  doChangeLang(props.model.functionFormat || 'yaml');
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', adjustCodeContainerHeight);
});
</script>

<style scoped>
.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh !important;
  overflow: hidden;
  z-index: 9999;
}
</style>
