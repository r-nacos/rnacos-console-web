<template>
  <div class="detailWrap">
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="dataId" label="配置ID">
        <n-input
          :disabled="isReadonly"
          placeholder="输入配置ID"
          v-model:value="model.dataId"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="group" label="配置组">
        <n-input
          :disabled="isReadonly"
          placeholder="输入配置组"
          v-model:value="model.group"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item v-show="model.showMd5" path="md5" label="MD5">
        <n-input
          :disabled="true"
          placeholder=""
          v-model:value="model.md5"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="desc" label="描述">
        <n-input
          :disabled="isReadonly"
          placeholder="输入描述备注信息"
          v-model:value="model.desc"
          type="textarea"
          :autosize="{ minRows: 2 }"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="configType" label="配置格式">
        <!--
        <n-radio-group v-model:value="langType"  name="configType">
        -->
        <n-radio-group v-model:value="model.configType" name="configType">
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

<script>
import { defineComponent } from 'vue';
import CodeMirror from '@/components/config/CodeMirror';
import { solarizedDark } from 'cm6-theme-solarized-dark';
import { json } from '@codemirror/lang-json';
import { xml } from '@codemirror/lang-xml';
import { html } from '@codemirror/lang-html';
import { yaml } from '@codemirror/lang-yaml';
export default defineComponent({
  components: { CodeMirror },
  props: ['model'],
  setup(props) {
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
    const langMap = {
      json: json(),
      xml: xml(),
      yaml: yaml(),
      html: html()
    };
    //let model = props.model;
    //console.log("model configType:",model.configType.value);

    const lang = ref();
    //lang.value = langMap[model.configType.value];
    const langType = ref();
    //const doc = ref("123434324")
    //doc.value = model.content;
    const focusValue = ref(0);
    const doChangeLang = function(v) {
      lang.value = langMap[v];
    }
    const langChange = function (e) {

      //langType.value = e.target.value;
      //model.configType.value = e.target.value;
      doChangeLang(e.target.value)
    };
    const focusEvent = function (e) {
      focusValue.value += 1;
    };

    return {
      //doc,
      focusValue,
      langs,
      lang,
      langType,
      extensions,
      doChangeLang,
      //langChange,
      focusEvent
    };
  },
  computed: {
    isReadonly() {
      return this.model.mode === 'detail';
    }
  },
  data() {
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
    return {
      rules
    };
  },
  methods: {
    langChange(e) {
      let v = e.target.value;
      this.doChangeLang(v)
      this.props.model.configType = v;
    }
  }
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
}
</style>
