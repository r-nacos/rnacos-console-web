<template>
  <div class="bg-white rounded w-full">
    <n-form ref="formRef" :model="model" :rules="rules" class="w-full">
      <n-grid
        :cols="
          !isCreate && !isHistory
          ? '1 s:1 m:2 l:3 xl:3 2xl:4'
          : '1 s:1 m:2 l:2 xl:2 2xl:2'
        "
        :x-gap="12"
        responsive="screen"
      >
        <n-gi>
          <n-form-item path="dataId" :label="t('config.dataId')">
            <n-input
              :disabled="isReadonly || isUpdate"
              :placeholder="t('config.input_dataId')"
              v-model:value="model.dataId"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item path="group" :label="t('config.config_group')">
            <n-input
              :disabled="isReadonly || isUpdate"
              :placeholder="t('config.input_config_group')"
              v-model:value="model.group"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
        <n-gi v-if="!isCreate && !isHistory">
          <n-form-item path="md5" label="MD5">
            <n-input
              :disabled="true"
              placeholder=""
              v-model:value="model.md5"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
      </n-grid>
      <n-form-item v-show="!isHistory" path="desc" :label="t('config.desc')">
        <n-input
          :disabled="isReadonly"
          :placeholder="t('config.input_desc')"
          v-model:value="model.desc"
          type="textarea"
          :autosize="{ minRows: 2 }"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item
        v-show="!isHistory"
        path="configType"
        :label="t('config.configType')"
      >
        <n-radio-group
          :disabled="isReadonly"
          v-model:value="model.configType"
          name="configType"
        >
          <n-space>
            <n-radio
              v-for="item in langs"
              :key="item.value"
              :value="item.value"
              @change="langChange"
            >
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item path="content" :label="t('config.content')">
        
        <div
          class="border border-gray-300 w-full relative bg-[#002b36]"
          ref="editorMainRef"
        >
        <n-button
          text
          style="
            position: absolute;
            bottom: 20px;
            right: 20px;
            z-index: 10;
            color: white;
            font-weight: 700;
            padding: 0;
            min-width: auto;
          "
          @click="() => model.content = formatContent(model.content, model.configType)"
        >
          {{ t('config.format') }}
        </n-button>
          <div
            class="h-10 w-10 absolute right-0 bg-[#103b46] bg-opacity-70 z-10 p-2.5 cursor-pointer"
            @click="toggleFullScreen"
          >
            <n-icon size="20" color="#fff">
              <Resize />
            </n-icon>
          </div>
          <div
            class="relative overflow-scroll bg-[#002b36] resize"
            ref="editorRef"
            @click="focusEvent"
            style="height: 838px"
          >
            <div @click="stopPropagation">
              <code-mirror ref="codeMirrorRef"
                :readonly="isReadonly" v-model="model.content" :foucsValue="focusValue" :lang="lang"
                :basic="true" :tab="true" :extensions="extensions" :linter="getLinterByLang(model.configType)"
                :gutter="!!getLinterByLang(model.configType)" />
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
import { xml } from '@codemirror/lang-xml';
import { html } from '@codemirror/lang-html';
import { yaml } from '@codemirror/lang-yaml';
import * as constant from '@/types/constant';
import { ref, defineExpose, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import jsonlint from "jsonlint-mod";
import jsYaml from "js-yaml";
import propertiesParser from 'properties-parser';
import { HTMLHint } from 'htmlhint';
import toml from 'toml';
import { parse as tomlParse, stringify as tomlStringify } from '@ltd/j-toml';
import vkbeautify from 'vkbeautify';
import { XMLValidator } from 'fast-xml-parser';

const { t } = useI18n();
const props = defineProps(['model', 'fromHistory']);
const extensions = [solarizedDark];

const langs = [
  {
    value: 'text',
    label: 'TEXT'
  },
  {
    value: 'json',
    label: 'JSON'
  },
  {
    value: 'xml',
    label: 'XML'
  },
  {
    value: 'yaml',
    label: 'YAML'
  },
  {
    value: 'html',
    label: 'HTML'
  },
  {
    value: 'properties',
    label: 'Properties'
  },
  {
    value: 'toml',
    label: 'TOML'
  }
];
const yamlLang = yaml();
const langMap = {
  json: json(),
  xml: xml(),
  yaml: yamlLang,
  html: html(),
  toml: yamlLang,
  properties: yamlLang
};
//let model = props.model;
//console.log("model configType:",model.configType.value);

const lang = ref();
//const langType = ref();
//const doc = ref("123434324")
//doc.value = model.content;
const focusValue = ref(0);
const doChangeLang = function (v) {
  if (v) {
    lang.value = langMap[v];
    props.model.configType = v;
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
const isHistory = computed(() => props.fromHistory);
const rules = {
  group: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('需要输入配置组');
        }
        return true;
      },
      trigger: ['input', 'blur']
    }
  ],

  dataId: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error(t('config.need_input_dataId'));
        }
        return true;
      },
      trigger: ['input', 'blur']
    }
  ]
};
const langChange = function (e) {
  let v = e.target.value;
  doChangeLang(v);
};

const formRef = ref();
const codeMirrorRef = ref();
const submitValidate = function (callback) {
  formRef.value?.validate((errors) => {
    if (errors) {
      console.log(errors);
      window.$message.error(
        t('config.check_fail') + ':' + errors[0][0].message
      );
      return;
    }

    if (codeMirrorRef.value) {
      codeMirrorRef.value.lint();
      if (codeMirrorRef.value.diagnosticCount > 0) {
        window.$message.error(t('config.lint_error'));
        return;
      }
    }

    callback();
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

      /* empty */
    } else {
      fullStatue.value = false;
      editorMain.style.height = '';
      editor.style.height = `${editorHeight.value}px`;
    }
  }
};

defineExpose({
  submitValidate
});

watch(
  () => props.model.configType,
  (nv, ov) => {
    doChangeLang(props.model.configType);
  }
);

const adjustCodeContainerHeight = () => {
  if (props.fromHistory) {
    editorHeight.value = Math.max(500, window.innerHeight - 315);
  } else {
    editorHeight.value = Math.max(500, window.innerHeight - 490);
  }
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


const jsonLinter = (view) => {
  const diagnostics = [];
  try {
    jsonlint.parse(view.state.doc.toString());
  } catch (e) {
    diagnostics.push({
      from: e.location?.first_column ?? 0,
      to: e.location?.last_column ?? 0,
      severity: "error",
      message: e.message
    });
  }
  return diagnostics;
};

const yamlLinter = (view) => {
  const diagnostics = [];
  try {
    jsYaml.load(view.state.doc.toString());
  } catch (e) {
    diagnostics.push({
      from: 0,
      to: 0,
      severity: "error",
      message: e.message
    });
  }
  return diagnostics;
};

const xmlLinter = (view) => {
  const diagnostics = [];
  const xmlText = view.state.doc.toString();
  const validationResult = XMLValidator.validate(xmlText);
  if (validationResult !== true) {
    diagnostics.push({
      from: 0,
      to: 0,
      severity: "error",
      message: `Line ${validationResult.err.line}: ${validationResult.err.msg}`
    });
  }
  return diagnostics;
};

const tomlLinter = (view) => {
  const diagnostics = [];
  try {
    toml.parse(view.state.doc.toString());
  } catch (e) {
    diagnostics.push({
      from: 0,
      to: 0,
      severity: "error",
      message: e.message
    });
  }
  return diagnostics;
};

const propertiesLinter = (view) => {
  const diagnostics = [];
  try {
    propertiesParser.parse(view.state.doc.toString());
  } catch (e) {
    diagnostics.push({
      from: 0,
      to: 0,
      severity: "error",
      message: e.message
    });
  }
  return diagnostics;
};

const htmlLinter = (view) => {
  const diagnostics = [];
  const content = view.state.doc.toString();
  const messages = HTMLHint.verify(content, {
    'tag-pair': true,
    'attr-no-duplication': true,
    'doctype-first': true,
  });
  for (const msg of messages) {
    diagnostics.push({
      from: msg.col - 1,
      to: msg.col,
      severity: msg.type === 'error' ? 'error' : 'warning',
      message: msg.message
    });
  }
  return diagnostics;
};

const emptyLinter = () => [];

const getLinterByLang = (type) => {
  switch (type) {
    case "json":
      return jsonLinter;
    case "yaml":
      return yamlLinter;
    case "xml":
      return xmlLinter;
    case "html":
      return htmlLinter;
    case "toml":
      return tomlLinter;
    case "properties":
      return propertiesLinter;
    default:
      return emptyLinter;
  }
};

const formatContent = (content, lang) => {
  try {
    console.log("formatContent:", content, lang);
    switch (lang) {
      case "html":
      case "xml":
        return vkbeautify.xml(content, 2);

      case "json":
        return JSON.stringify(JSON.parse(content), null, 2);

      case "yaml":
        const yamlObj = jsYaml.load(content);
        return jsYaml.dump(yamlObj, { indent: 2 });

      case "toml":
        const tomObj = tomlParse(content);
        return tomlStringify(tomObj, { newline: "\n", indent: 2 }).trim();

      case "properties":
        return content
          .split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#'))
          .sort()
          .join('\n');

      default:
        return content;
    }
  } catch (error) {
    return content;
  }
};


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
