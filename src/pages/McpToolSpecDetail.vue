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
              <n-radio value="yaml" @change="formatChange">
                YAML
              </n-radio>
              <n-radio value="json" @change="formatChange">
                JSON
              </n-radio>
            </n-space>
          </n-radio-group>
          <n-tag
            v-if="model.function && model.function.trim()"
            :type="isValidFormat ? 'success' : 'error'"
            size="small"
          >
            {{ isValidFormat ? t('toolspec.format_valid') : t('toolspec.format_invalid') }}
          </n-tag>
        </n-space>
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
                  <path d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z"/>
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
import { ref, defineExpose, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { toolSpecApi } from '@/api/toolspec';

const { t } = useI18n();
const props = defineProps(['model']);
const emit = defineEmits(['cancel', 'close', 'submit-success', 'update-function', 'update-format', 'reset-form']);
const extensions = [solarizedDark];

const yamlLang = yaml();
const langMap = {
  json: json(),
  yaml: yamlLang
};

const lang = ref();
const focusValue = ref(0);

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
    if (obj.includes('\n') || obj.includes(':') || obj.includes('#') || obj.includes('[') || obj.includes(']')) {
      return `"${obj.replace(/"/g, '\\"')}"`;
    }
    return obj;
  }
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return obj.map(item => `${spaces}- ${jsonToYaml(item, indent + 1)}`).join('\n');
  }
  
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';
    return keys.map(key => {
      const value = obj[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
      } else if (Array.isArray(value) && value.length > 0) {
        return `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
      } else {
        return `${spaces}${key}: ${jsonToYaml(value, indent)}`;
      }
    }).join('\n');
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
    // Only support JSON to YAML conversion, YAML to JSON is complex and not implemented yet
    if (fromFormat === 'json' && toFormat === 'yaml') {
      const parsedData = JSON.parse(content);
      return jsonToYaml(parsedData);
    }
    
    // Return original content for other cases
    return content;
  } catch (error) {
    console.warn('Format conversion failed:', error);
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
    if (format === 'json') {
      JSON.parse(content);
      return true;
    } else {
      // For YAML, perform basic syntax checking
      // Check if it has basic YAML structure features
      const lines = content.split('\n');
      let hasValidStructure = false;
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === '' || trimmed.startsWith('#')) continue; // Skip empty lines and comments
        
        // Check key-value pair format: key: value
        if (trimmed.includes(':') && !trimmed.startsWith('-')) {
          hasValidStructure = true;
        }
        // Check array format: - item
        if (trimmed.startsWith('- ')) {
          hasValidStructure = true;
        }
        // Check basic values
        if (!trimmed.includes(':') && !trimmed.startsWith('-') && trimmed.length > 0) {
          hasValidStructure = true;
        }
      }
      
      return hasValidStructure;
    }
  } catch (error) {
    return false;
  }
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
  return validateFunctionFormat(props.model.functionFormat, props.model.function);
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
        
        // Use enhanced format validation function
        if (!validateFunctionFormat(props.model.functionFormat, value)) {
          return new Error(t('toolspec.invalid_parameters_format'));
        }
        
        return true;
      },
      trigger: ['input', 'blur']
    }
  ]
};

const formatChange = function (event) {
  let newFormat = event.target.value;
  let oldFormat = props.model.functionFormat;
  
  // If there's content and format changes, try to convert format (only JSON to YAML supported)
  if (props.model.function && oldFormat !== newFormat && oldFormat === 'json' && newFormat === 'yaml') {
    const convertedContent = convertFunctionFormat(
      oldFormat, 
      newFormat, 
      props.model.function
    );
    if (convertedContent !== props.model.function) {
      // Emit event to parent to update the model instead of direct mutation
      emit('update-function', convertedContent);
      window.$message.success(t('toolspec.format_converted_successfully'));
    }
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
 * 验证并转换函数数据
 * @returns {Object|null} 转换后的函数对象，失败返回null
 */
const validateAndParseFunction = function () {
  if (!props.model.function || props.model.function.trim() === '') {
    window.$message.error(t('toolspec.need_input_parameters'));
    return null;
  }
  
  try {
    let functionObj;
    
    if (props.model.functionFormat === 'json') {
      functionObj = JSON.parse(props.model.function);
    } else {
      // For YAML format, try parsing as JSON first (simplified handling)
      // In actual projects, might need to introduce YAML parsing library
      try {
        functionObj = JSON.parse(props.model.function);
      } catch (jsonError) {
        window.$message.error(t('toolspec.yaml_parse_not_supported'));
        return null;
      }
    }
    
    // Validate basic structure of function object
    if (typeof functionObj !== 'object' || functionObj === null) {
      window.$message.error(t('toolspec.invalid_parameters_structure'));
      return null;
    }
    
    return functionObj;
  } catch (error) {
    console.error('Function parsing error:', error);
    window.$message.error(t('toolspec.invalid_parameters_format'));
    return null;
  }
};

/**
 * 构建提交数据
 * @returns {Object|null} 提交数据对象，失败返回null
 */
const buildSubmitData = function () {
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
  
  // Validate and parse function
  const functionObj = validateAndParseFunction();
  if (!functionObj) {
    return null;
  }
  
  // Build submission data
  const submitData = {
    namespace: props.model.namespace.trim(),
    group: props.model.group.trim(),
    toolName: props.model.toolName.trim(),
    function: {
      name: props.model.name.trim(),
      description: props.model.description?.trim() || '',
      parameters: functionObj
    }
  };
  
  return submitData;
};

/**
 * 提交表单数据
 * @returns {Promise<boolean>} 提交是否成功
 */
const submitFormData = async function () {
  try {
    // Build submission data
    const submitData = buildSubmitData();
    if (!submitData) {
      return false;
    }
    
    console.log('Submitting ToolSpec data:', submitData);
    
    // Call API to submit data
    const success = await toolSpecApi.addOrUpdateToolSpecWithErrorHandling(submitData);
    
    if (success) {
      const actionText = props.model.mode === constant.FORM_MODE_CREATE 
        ? t('toolspec.create_success') 
        : t('toolspec.update_success');
      window.$message.success(actionText);
      return true;
    } else {
      const actionText = props.model.mode === constant.FORM_MODE_CREATE 
        ? t('toolspec.create_failed') 
        : t('toolspec.update_failed');
      window.$message.error(actionText);
      return false;
    }
  } catch (error) {
    console.error('Form submission error:', error);
    const actionText = props.model.mode === constant.FORM_MODE_CREATE 
      ? t('toolspec.create_failed') 
      : t('toolspec.update_failed');
    window.$message.error(actionText);
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