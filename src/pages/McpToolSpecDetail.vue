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
              v-if="!isReadonly"
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
  formatValidator,
  objectToString,
  stringToObject,
  isValidFormat as validateFormat,
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
  'reset-form'
]);
const extensions = [solarizedDark];

const lang = json();
const focusValue = ref(0);

// Validation state for real-time feedback
const validationResult = ref({
  isValid: true,
  errors: [],
  warnings: []
});

/**
 * 初始化参数显示
 * 从 IToolSpec.function.inputSchema 转换为显示字符串
 * @param {Object} parametersObj - 参数对象
 * @returns {string} 格式化字符串
 */
const initializeParameterDisplay = function (parametersObj) {
  try {
    // Handle null, undefined, or empty cases
    if (
      !parametersObj ||
      (typeof parametersObj === 'object' &&
        Object.keys(parametersObj).length === 0)
    ) {
      return objectToString({}, 'json');
    }

    // Convert object to formatted string
    return objectToString(parametersObj, 'json');
  } catch (error) {
    console.error('Parameter initialization error:', error);

    // Error fallback - return empty object representation
    const fallbackContent = '{}';

    // Log error for debugging
    handleError(error, 'initializeParameterDisplay', {
      parametersObj,
      format: 'json',
      logError: true
    });

    return fallbackContent;
  }
};

/**
 * 实时验证参数格式（防抖处理）
 * @param {string} content - 待验证内容
 */
const validateParametersRealtime = function (content) {
  try {
    // Use the format validator for detailed validation
    const result = formatValidator.validate(content, 'json');

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
const validateParametersRealtimeDebounced = function (content) {
  if (validationTimeout) {
    clearTimeout(validationTimeout);
  }

  validationTimeout = setTimeout(() => {
    validateParametersRealtime(content);
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
  validateParametersRealtimeDebounced(props.model.function);

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
  description: [
    {
      required: true,
      validator(_, value) {
        if (!value || !value.trim()) {
          return new Error(t('toolspec.need_input_description'));
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
          const validation = formatValidator.validate(value, 'json');
          if (!validation.isValid) {
            return new Error(
              t('toolspec.invalid_parameters_format') +
                ': ' +
                validation.errors.join(', ')
            );
          }

          // Additional check to ensure the result can be converted to object
          const converted = stringToObject(value, 'json');
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
 * 确保转换后的对象正确设置到 IToolSpecParams.function.inputSchema
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

    if (!props.model.description?.trim()) {
      window.$message.error(t('toolspec.need_input_description'));
      return null;
    }

    // Validate function inputSchema field
    if (!props.model.function || props.model.function.trim() === '') {
      window.$message.error(t('toolspec.need_input_parameters'));
      return null;
    }

    // Perform final format validation before conversion
    console.log('Performing final validation before submission...');
    const finalValidation = formatValidator.validate(
      props.model.function,
      'json'
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
    console.log('Converting inputSchema from string to object...');
    let parametersObject;

    try {
      parametersObject = stringToObject(props.model.function, 'json');
    } catch (conversionError) {
      console.error('Input schema conversion error:', conversionError);

      // Handle conversion errors with detailed error information
      const errorInfo = handleError(conversionError, 'buildSubmitData', {
        format: 'json',
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

    // Additional validation for inputSchema structure
    // The inputSchema object should be a valid JSON Schema or parameter definition
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
    console.log('Input schema successfully converted:', {
      format: 'json',
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
        inputSchema: parametersObject // Correctly set converted object to inputSchema
      }
    };

    // Final validation of the complete submission data structure
    if (!submitData.function || !submitData.function.inputSchema) {
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
      parametersKeys: Object.keys(submitData.function.inputSchema)
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
      parametersStructure: typeof submitData.function.inputSchema,
      parametersKeys: Object.keys(submitData.function.inputSchema || {})
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
    const parsed = JSON.parse(props.model.function);
    const formatted = JSON.stringify(parsed, null, 2);
    emit('update-function', formatted);
    window.$message.success(t('toolspec.format_success'));
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

// Watch for function content changes to trigger real-time validation
watch(
  () => props.model.function,
  (newContent) => {
    if (newContent !== undefined && newContent !== null) {
      validateParametersRealtimeDebounced(newContent);
    }
  },
  { immediate: false }
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
