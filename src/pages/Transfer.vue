<template>
  <div class="wrap">
    <div class="header">
      <div class="title">
        <span>{{ this.$t('menu.data_transfer') }}</span>
      </div>
    </div>
    <div class="content-wrap">
      <n-space vertical class="inner_wrap">
        <n-card :title="this.$t('transfer.export_title')" size="medium">
          <p>{{ this.$t('transfer.export_p01') }}</p>
          <br />
          <a ref="downloadEle" @click="download"
            ><n-button type="info">{{
              this.$t('transfer.export_button')
            }}</n-button></a
          >
        </n-card>
        <n-card :title="this.$t('transfer.import_title')" size="medium">
          <p>{{ this.$t('transfer.import_p01') }}</p>
          <br />
          <n-upload
            action="/rnacos/api/console/transfer/import"
            :headers="uploadHeader"
            :show-file-list="false"
            @before-upload="doBeforeUpload"
            @finish="handlerUploadFinish"
          >
            <n-button type="info">{{
              this.$t('transfer.import_button')
            }}</n-button>
          </n-upload>
        </n-card>

        <n-card :title="this.$t('transfer.data_manage_title')" size="medium">
          <p>{{ this.$t('transfer.data_manage_p01') }}</p>
          <br />
          <p>{{ this.$t('transfer.data_manage_p02') }}</p>
          <br />
          <p>{{ this.$t('transfer.data_manage_p03') }}</p>
        </n-card>

        <n-card :title="this.$t('transfer.from_nacos_title')" size="medium">
          <p>{{ this.$t('transfer.from_nacos_p01') }}</p>
          <br />
          <p>{{ this.$t('transfer.from_nacos_p02') }}</p>
          <br />
          <p>{{ this.$t('transfer.from_nacos_p03') }}</p>
        </n-card>
      </n-space>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, ref } from 'vue';
import qs from 'qs';

const uploadHeader = ref({});
const downParams = ref({});
const downloadEle = ref();

const download = () => {
  var paramStr = qs.stringify(downParams.value);
  var url = '/rnacos/api/console/transfer/export?' + paramStr;
  downloadEle.value.setAttribute('href', url);
  return true;
};

const doBeforeUpload = () => {
  uploadHeader.value['import-config'] = '1';
  uploadHeader.value['import-user'] = '1';
  uploadHeader.value['import-cache'] = '0';
};

const handlerUploadFinish = ({ event }) => {
  if (event.target.status == 200) {
    window.$message.info('上传成功');
  } else {
    window.$message.error('上传处理失败');
  }
};
</script>

<style scoped>
.wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: #efefef;
}

.content-wrap {
  padding: 10px 10px 10px 10px;
  background: #efefef;
}

.form-container {
  display: flex;
  flex-direction: column;
  position: relative;
  background: #ffffff;
  border-radius: 8px;
  padding: 8px;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  border-bottom: #ccc 1px solid;
  background: #fff;
}

.title {
  flex: 1 1 auto;
  font: 14/1.25;
  line-height: 30px;
  padding-left: 15px;
}

.inner_wrap {
  width: 100%;
  flex: 1 1 auto;
}
</style>
