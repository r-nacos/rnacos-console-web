<template>
  <div class="wrap">
    <div class="header">
      <div class="title">
        <span> 配置列表 </span>
      </div>
      <div class="namespace">
        <NamespacePopSelect @change="queryList" />
      </div>
    </div>
    <div class="content-wrap">
      <div class="form-container">
        <div class="query-params">
          <n-form label-placement="left" label-width="auto">
            <div class="paramWrap">
              <n-form-item label="配置" path="param.dataParam">
                <n-input
                  v-model:value="param.dataParam"
                  placeholder="输入配置ID"
                  clearable
                />
              </n-form-item>
              <n-form-item label="配置组" path="param.groupParam">
                <n-input
                  v-model:value="param.groupParam"
                  placeholder="输入配置组"
                  clearable
                />
              </n-form-item>
            </div>
          </n-form>
          <div class="queryButton">
            <span class="query-button-item">
              <n-button tertiary @click="queryList">查询</n-button>
            </span>
            <span v-if="webResources.canUpdateConfig" class="query-button-item">
              <n-button type="info" @click="showCreate">新建</n-button>
            </span>
            <span class="query-button-item">
              <a ref="download" @click="download"
                ><n-button type="info">下载</n-button></a
              >
            </span>
            <span v-if="webResources.canUpdateConfig" class="query-button-item">
              <n-upload
                action="/rnacos/api/console/config/import"
                :headers="uploadHeader"
                :show-file-list="false"
                @before-upload="doBeforeUpload"
                @finish="handlerUploadFinish"
              >
                <n-button type="info">上传文件</n-button>
              </n-upload>
            </span>
          </div>
        </div>
        <n-data-table
          remote
          ref="table"
          :scroll-x="600"
          :bordered="false"
          :columns="columns"
          :data="data"
          :loading="loading"
          :pagination="pagination"
          :row-key="rowKey"
          @update:page="handlePageChange"
        />
      </div>
    </div>
    <Transition name="slide-fade">
      <SubContentFullPage
        v-show="useForm"
        :title="getDetailTitle"
        @close="closeForm"
        @submit="submitForm"
      >
        <ConfigDetail :model="model" :fromHistory="false" />
      </SubContentFullPage>
    </Transition>
    <Transition name="slide-fade">
      <SubContentFullPage
        v-if="useDiffForm"
        title="配置内容比较"
        submitName="确认变更"
        @close="closeDiffForm"
        @submit="submitDiffForm"
      >
        <DiffComponent :src="model.sourceContent" :dst="model.content" />
      </SubContentFullPage>
    </Transition>
  </div>
</template>

<script>
import { ref, reactive, defineComponent } from 'vue';
import { configApi } from '@/api/config';
import { namespaceStore } from '@/data/namespace';
import { useWebResources } from '@/data/resources';
import { createColumns } from '@/components/config/ConfigColumns';
import NamespacePopSelect from '@/components/namespace/NamespacePopSelect.vue';
import SubContentFullPage from '@/components/common/SubContentFullPage';
import DiffComponent from '@/components/config/DiffComponent.vue';
import ConfigDetail from './ConfigDetail.vue';
import { useRouter } from 'vue-router';
import { Close } from '@vicons/ionicons5';
import * as constant from '@/types/constant';
import qs from 'qs';

export default defineComponent({
  components: {
    NamespacePopSelect,
    Close,
    SubContentFullPage,
    ConfigDetail,
    DiffComponent
  },
  setup(self) {
    //window.$message = useMessage();
    let router = useRouter();
    let webResources = useWebResources();
    const dataRef = ref([]);
    const useFormRef = ref(false);
    const useDiffFormRef = ref(false);
    const loadingRef = ref(false);
    const paramRef = ref({
      dataParam: '',
      groupParam: '',
      tenant: '',
      pageNo: 1,
      pageSize: 20
    });
    const uploadHeaderRef = ref({
      tenant: namespaceStore.current.value.namespaceId
    });
    const modelRef = ref({
      dataId: '',
      group: '',
      md5: '',
      showMd5: true,
      sourceContent: '',
      content: '',
      configType: 'text',
      mode: ''
    });
    const paginationReactive = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      itemCount: 0,
      prefix({ itemCount }) {
        return `总行数: ${itemCount}`;
      }
    });
    const doBeforeUpload = () => {
      uploadHeaderRef.value = {
        tenant: namespaceStore.current.value.namespaceId
      };
    };
    const doQueryList = () => {
      return configApi.queryConfigPage({
        tenant: namespaceStore.current.value.namespaceId,
        dataParam: paramRef.value.dataParam,
        groupParam: paramRef.value.groupParam,
        pageNo: paginationReactive.page,
        pageSize: paginationReactive.pageSize
      });
    };
    const doHandlePageChange = (currentPage) => {
      paginationReactive.page = currentPage;
      if (!loadingRef.value) {
        loadingRef.value = true;
        doQueryList()
          .then((res) => {
            loadingRef.value = false;
            if (res.status == 200) {
              let count = res.data.count;
              let pageSize = paginationReactive.pageSize;
              dataRef.value = res.data.list;
              paginationReactive.itemCount = count;
              paginationReactive.pageCount = Math.round(
                (count + pageSize - 1) / pageSize
              );
            } else {
              window.$message.error('request err,status code:' + res.status);
              dataRef.value = [];
            }
          })
          .catch((err) => {
            window.$message.error('request err,message' + err.message);
            dataRef.value = [];
            loadingRef.value = false;
          });
      }
    };
    const doShowConfigDetail = (row, mode) => {
      let config = {
        tenant: row.tenant,
        group: row.group,
        dataId: row.dataId
      };
      configApi
        .getConfigV2(config)
        .then((res) => {
          console.log(res.data);
          if (res.status == 200 && res.data.success) {
            modelRef.value = {
              mode: mode,
              showMd5: true,
              content: res.data.data.value,
              sourceContent: res.data.data.value,
              md5: res.data.data.md5 || '',
              desc: res.data.data.desc,
              configType: res.data.data.configType || 'text',
              ...config
            };
            useFormRef.value = true;
          } else {
            window.$message.error('查询配置报错,response code:' + res.status);
          }
        })
        .catch((err) => {
          window.$message.error('查询配置报错,' + err.message);
        });
    };
    const updateItem = (row) => {
      doShowConfigDetail(row, constant.FORM_MODE_UPDATE);
    };
    const detailItem = (row) => {
      doShowConfigDetail(row, constant.FORM_MODE_DETAIL);
    };
    const showCreate = () => {
      modelRef.value = {
        dataId: '',
        group: 'DEFAULT_GROUP',
        md5: '',
        showMd5: true,
        content: '',
        configType: 'text',
        sourceContent: '',
        mode: constant.FORM_MODE_CREATE
      };
      useFormRef.value = true;
    };
    const removeItem = (row) => {
      let config = {
        tenant: row.tenant,
        group: row.group,
        dataId: row.dataId
      };
      configApi
        .removeConfig(config)
        .then((res) => {
          if (res.status == 200) {
            window.$message.info('删除配置成功');
            doHandlePageChange(1);
          } else {
            window.$message.error('删除配置报错,response code:' + res.status);
          }
        })
        .catch((err) => {
          window.$message.error('删除配置报错,' + err.message);
        });
    };
    const showHistory = (row) => {
      router.push({
        path: '/manage/config/history',
        query: {
          tenant: row.tenant,
          group: row.group,
          dataId: row.dataId
        }
      });
    };

    const columns = createColumns(
      detailItem,
      showHistory,
      updateItem,
      removeItem,
      webResources
    );
    return {
      columns,
      webResources,
      data: dataRef,
      useForm: useFormRef,
      useDiffForm: useDiffFormRef,
      pagination: paginationReactive,
      loading: loadingRef,
      model: modelRef,
      uploadHeader: uploadHeaderRef,
      doBeforeUpload,
      showCreate,
      param: paramRef,
      namespaceId: '',
      rowKey(rowData) {
        return rowData.group + '@@' + rowData.dataId;
      },
      doQueryList,
      doHandlePageChange,
      handlerUploadFinish({ event }) {
        if (event.target.status == 200) {
          window.$message.info('上传成功');
          doHandlePageChange(1);
        } else {
          window.$message.error('上传处理失败');
        }
      }
    };
  },
  computed: {
    getTenant() {
      return namespaceStore.current.value.namespaceId;
    },
    getDetailTitle() {
      if (this.model.mode === constant.FORM_MODE_UPDATE) {
        return '编辑配置';
      } else if (this.model.mode === constant.FORM_MODE_CREATE) {
        return '新增配置';
      }
      return '编辑详情';
    }
  },

  methods: {
    handlePageChange(page) {
      this.doHandlePageChange(page);
    },
    queryList() {
      this.doHandlePageChange(1);
    },
    closeForm() {
      this.useForm = false;
    },
    closeDiffForm() {
      //this.useForm = false;
      this.useDiffForm = false;
    },
    submitDiffForm() {
      let config = {
        dataId: this.model.dataId,
        group: this.model.group,
        tenant: this.getTenant,
        content: this.model.content,
        configType: this.model.configType,
        desc: this.model.desc
      };
      configApi
        .setConfigV2(config)
        .then((res) => {
          if (res.status == 200) {
            window.$message.info('设置成功!');
            this.useForm = false;
            this.useDiffForm = false;
            this.queryList();
            return;
          }
          window.$message.error('设置失败，response code' + res.status);
        })
        .catch((err) => {
          window.$message.error('设置失败，' + err.message);
        });
    },
    submitForm() {
      if (this.model.mode === constant.FORM_MODE_DETAIL) {
        this.useForm = false;
        return;
      } else {
        //this.useForm = false;
        this.useDiffForm = true;
      }
    },
    download() {
      this.param.tenant = namespaceStore.current.value.namespaceId;
      var params = qs.stringify(this.param);
      var url = '/rnacos/api/console/config/download?' + params;
      this.$refs.download.setAttribute('href', url);
      return true;
    }
  },
  created() {
    this.queryList();
  }
});
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
  padding: 16px 8px;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  border-bottom: #ccc 1px solid;
  background: #fff;
  padding-right: 3px;
}

.title {
  flex: 1 1 auto;
  font: 14/1.25;
  line-height: 30px;
  padding-left: 15px;
}

.header-button {
  flex: 0 0 auto;
}

.namespace {
  flex: 0 0 auto;
}

.query-params {
  flex: 0 0 auto;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-direction: row;
}

.paramWrap {
  display: flex;
  gap: 8px;
  flex-direction: row;
  flex-wrap: wrap;
}

.queryButton {
  display: flex;
  align-items: center;
}

.query-button-item {
  margin-left: 10px;
}
</style>
