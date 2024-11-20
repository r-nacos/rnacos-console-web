<template>
  <div class="detailWrap">
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-grid :cols="isHistory ? 2 : 3" :x-gap="12">
        <n-gi>
          <n-form-item path="dataId" :label="this.$t('config.dataId')">
            <n-input
              :disabled="isReadonly || isUpdate"
              :placeholder="this.$t('config.input_dataId')"
              v-model:value="model.dataId"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item path="group" :label="this.$t('config.config_group')">
            <n-input
              :disabled="isReadonly || isUpdate"
              :placeholder="this.$t('config.input_config_group')"
              v-model:value="model.group"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item v-show="!isHistory" path="md5" label="MD5">
            <n-input
              :disabled="true"
              placeholder=""
              v-model:value="model.md5"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
      </n-grid>
      <n-form-item v-show="!isHistory" path="desc" :label="this.$t('config.desc')">
        <n-input
          :disabled="isReadonly"
          :placeholder="this.$t('config.input_desc')"
          v-model:value="model.desc"
          type="textarea"
          :autosize="{ minRows: 2 }"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item v-show="!isHistory" path="configType" :label="this.$t('config.configType')">
        <!--
        <n-radio-group v-model:value="langType"  name="configType">
        -->
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
      <n-form-item path="content" :label="this.$t('config.content')">
        <!--

        <n-input
          :disabled="isReadonly"
          type="textarea"
          :placeholder="this.$t('config.input_content')"
          :autosize="{ minRows: 5 }"
          v-model:value="model.content"
        />
        -->
        <div class="code-container" ref="editorMainRef">
          <div class="size_icon" @click="toggleFullScreen">
            <n-icon size="20" color="#fff">
              <Resize />
            </n-icon>
          </div>
          <div class="code_warp" ref="editorRef" @click="focusEvent">
            <div @click="stopPropagation">
              <code-mirror
                :readonly="isReadonly"
                v-model="model.content"
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
import { xml } from '@codemirror/lang-xml';
import { html } from '@codemirror/lang-html';
import { yaml } from '@codemirror/lang-yaml';
import * as constant from '@/types/constant';
import { ref, defineExpose, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
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
          return new Error(t("config.need_input_dataId"));
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
const submitValidate = function (callback) {
  formRef.value?.validate((errors) => {
    if (errors) {
      console.log(errors);
      window.$message.error(t("config.check_fail")+':' + errors[0][0].message);
    } else {
      callback();
    }
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
    editorHeight.value = Math.max(300, window.innerHeight - 315);
  } else {
    editorHeight.value = Math.max(300, window.innerHeight - 490);
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
</script>

<style scoped>
.detailWrap {
  background: #fff;
  padding: 3px;
  border-radius: 5px;
  min-width: 500px;
}

.code-container {
  border: 1px solid #ccc;
  width: 100%;
  position: relative;
  background-color: #002b36;
  resize: both;
}

.code_warp {
  width: 100%;
  position: relative;
  overflow: scroll;
  background-color: #002b36;
  resize: both;
}

.size_icon {
  height: 40px;
  width: 40x;
  position: absolute;
  right: 0;
  background: #103b46;
  opacity: 0.7;
  z-index: 10;
  padding: 10px;
  cursor: pointer;
}

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
