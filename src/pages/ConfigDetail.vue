<template>
  <div class="detailWrap">
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-grid :cols="3" :x-gap="12">
        <n-gi>
          <n-form-item path="dataId" label="配置ID">
            <n-input
              :disabled="isReadonly || isUpdate"
              placeholder="输入配置ID"
              v-model:value="model.dataId"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item path="group" label="配置组">
            <n-input
              :disabled="isReadonly || isUpdate"
              placeholder="输入配置组"
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
      <n-form-item v-show="!isHistory" path="desc" label="描述">
        <n-input
          :disabled="isReadonly"
          placeholder="输入描述备注信息"
          v-model:value="model.desc"
          type="textarea"
          :autosize="{ minRows: 2 }"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item v-show="!isHistory" path="configType" label="配置格式">
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
      <n-form-item path="content" label="配置内容">
        <!--

        <n-input
          :disabled="isReadonly"
          type="textarea"
          placeholder="输入配置内容"
          :autosize="{ minRows: 5 }"
          v-model:value="model.content"
        />
        -->
        <div class="code-container" @click="focusEvent">
          <code-mirror
            :disabled="isReadonly"
            v-model="model.content"
            :foucsValue="focusValue"
            :lang="lang"
            :basic="true"
            :tab="true"
            :extensions="extensions"
          />
        </div>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup>
import CodeMirror from '@/components/config/CodeMirror';
import { solarizedDark } from '@/components/config/cm6theme';
import { json } from '@codemirror/lang-json';
import { xml } from '@codemirror/lang-xml';
import { html } from '@codemirror/lang-html';
import { yaml } from '@codemirror/lang-yaml';
import * as constant from '@/types/constant';
import { ref, defineExpose, onMounted, onBeforeUnmount } from 'vue';

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
const focusEvent = function (e) {
  focusValue.value += 1;
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
          return new Error('需要输入配置ID');
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
      window.$message.error('检验不通过:' + errors[0][0].message);
    } else {
      callback();
    }
  });
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
  const codeContainer = document.querySelector('.code-container');
  if (codeContainer) {
    codeContainer.style.height = `${window.innerHeight - 480}px`;
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
  height: 300px;
  width: 100%;
  border: 1px solid #ccc;
  position: relative;
  overflow: scroll;
  background-color: #002b36;
  resize: both;
  /* 添加此行 */
  overflow: auto;
  /* 确保内容溢出时可以滚动 */
}
</style>
