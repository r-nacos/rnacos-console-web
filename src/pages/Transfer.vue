<template>
  <div class="relative">
    <div class="flex flex-row items-center border-b h-[40px] border-gray-300 bg-white pr-3">
      <div class="flex-1 text-sm leading-[30px] pl-4 truncate">
        <span>{{ this.$t('menu.data_transfer') }}</span>
      </div>
    </div>
    <div class="m-2">
      <n-space vertical class="w-full">
        <n-card :title="t('transfer.export_title')" size="medium">
          <p>{{ t('transfer.export_p01') }}</p>
          <br />
          <a ref="downloadEle" @click="download">
            <n-button type="info">{{ t('transfer.export_button') }}</n-button>
          </a>
        </n-card>
        <n-card :title="t('transfer.import_title')" size="medium">
          <p>{{ t('transfer.import_p01') }}</p>
          <br />
          <n-upload
            action="/rnacos/api/console/transfer/import"
            :headers="uploadHeader"
            :show-file-list="false"
            @before-upload="doBeforeUpload"
            @finish="handlerUploadFinish"
          >
            <n-button type="info">{{ t('transfer.import_button') }}</n-button>
          </n-upload>
        </n-card>

        <n-card :title="t('transfer.data_manage_title')" size="medium">
          <p>{{ t('transfer.data_manage_p01') }}</p>
          <br />
          <p>{{ t('transfer.data_manage_p02') }}</p>
          <br />
          <p>{{ t('transfer.data_manage_p03') }}</p>
        </n-card>

        <n-card :title="t('transfer.from_nacos_title')" size="medium">
          <p>{{ t('transfer.from_nacos_p01') }}</p>
          <br />
          <p>{{ t('transfer.from_nacos_p02') }}</p>
          <br />
          <p>{{ t('transfer.from_nacos_p03') }}</p>
        </n-card>
      </n-space>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import qs from 'qs';
import { getMessage as t } from '@/i18n';

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
