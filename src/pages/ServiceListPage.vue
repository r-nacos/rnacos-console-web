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
              <n-form-item label="服务名称" path="param.serviceParam">
                <n-input
                  v-model:value="param.serviceParam"
                  placeholder="输入服务名"
                  clearable
                />
              </n-form-item>
              <n-form-item label="服务组" path="param.groupParam">
                <n-input
                  v-model:value="param.groupParam"
                  placeholder="输入服务组"
                  clearable
                />
              </n-form-item>
            </div>
          </n-form>
          <div class="queryButton">
            <span class="query-button-item">
              <n-button tertiary @click="queryList">查询</n-button>
            </span>
            <span
              v-if="webResources.canUpdateService"
              class="query-button-item"
            >
              <n-button type="info" @click="showCreate">新建</n-button>
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
    <n-drawer
      to="#main_content"
      :block-scroll="false"
      :trap-focus="false"
      v-model:show="useForm"
      default-width="600"
      resizable
    >
      <n-drawer-content :title="getDetailTitle" closable>
        <ServiceDetail :model="model" />
        <template #footer>
          <n-space align="baseline">
            <n-button text @click="closeForm">返回</n-button>
            <n-button type="primary" @click="submitForm">确认</n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script>
import { ref, reactive, defineComponent } from 'vue';
import { namingApi } from '@/api/naming';
import { namespaceStore } from '@/data/namespace';
import { useWebResources } from '@/data/resources';
import { createColumns } from '@/components/naming/ServiceListColumns.jsx';
import NamespacePopSelect from '@/components/namespace/NamespacePopSelect.vue';
import ServiceDetail from './ServiceDetail.vue';
import * as constant from '@/types/constant';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    NamespacePopSelect,
    ServiceDetail
  },
  setup() {
    let router = useRouter();
    let webResources = useWebResources();
    const dataRef = ref([]);
    const loadingRef = ref(false);
    const paramRef = ref({
      serviceParam: '',
      groupParam: '',
      namespaceId: '',
      pageNo: 1,
      pageSize: 20
    });
    const paginationReactive = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      itemCount: 0,
      showSizePicker: true,
      pageSizes: [10, 20, 50, 100],
      onUpdatePageSize: (pageSize) => {
        paginationReactive.pageSize = pageSize;
        paginationReactive.page = 1;
        doHandlePageChange(1);
      },
      prefix({ itemCount }) {
        return `总行数: ${itemCount}`;
      }
    });
    const useFormRef = ref(false);
    const modelRef = ref({
      groupName: '',
      serviceName: '',
      protectThreshold: '0',
      metadata: '',
      selector: '',
      mode: ''
    });
    const showUpdate = (row) => {
      let protectThreshold = '0';
      if (row.protectThreshold) {
        protectThreshold = row.protectThreshold.toString();
      }
      modelRef.value = {
        groupName: row.groupName,
        serviceName: row.name,
        protectThreshold: protectThreshold,
        metadata: row.metadata,
        selector: '',
        mode: constant.FORM_MODE_UPDATE
      };
      useFormRef.value = true;
    };
    const showInstances = (row) => {
      router.push({
        path: '/manage/service/instance',
        query: {
          groupName: row.groupName,
          serviceName: row.name,
          namespaceId: namespaceStore.current.value.namespaceId
        }
      });
    };
    const showDetail = (row) => {
      let protectThreshold = '0';
      if (row.protectThreshold) {
        protectThreshold = row.protectThreshold.toString();
      }
      modelRef.value = {
        groupName: row.groupName,
        serviceName: row.name,
        protectThreshold: protectThreshold,
        metadata: row.metadata,
        selector: '',
        mode: constant.FORM_MODE_DETAIL
      };
      useFormRef.value = true;
    };
    const removeItem = (row) => {
      let serviceKey = {
        namespaceId: namespaceStore.current.value.namespaceId,
        groupName: row.groupName,
        serviceName: row.name
      };
      namingApi
        .removeService(serviceKey)
        .then((res) => {
          if (res.status == 200) {
            window.$message.info('删除服务成功!');
            doHandlePageChange(paginationReactive.page || 1);
            return;
          }
          window.$message.error('删除服务报错,' + res.data);
        })
        .catch((err) => {
          //window.$message.error("删除服务报错," + err.message);
          window.$message.error('删除服务报错,' + err.response.data);
        });
    };
    const showCreate = () => {
      modelRef.value = {
        groupName: '',
        serviceName: '',
        protectThreshold: '0',
        metadata: '',
        selector: '',
        mode: constant.FORM_MODE_CREATE
      };
      useFormRef.value = true;
    };

    const doQueryList = () => {
      return namingApi.queryServicePage({
        namespaceId: namespaceStore.current.value.namespaceId,
        accessToken: null,
        serviceNameParam: paramRef.value.serviceParam,
        groupNameParam: paramRef.value.groupParam,
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
              dataRef.value = res.data.serviceList;
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

    let columns = createColumns(
      showInstances,
      showDetail,
      showUpdate,
      removeItem,
      webResources
    );
    return {
      columns,
      webResources,
      data: dataRef,
      pagination: paginationReactive,
      loading: loadingRef,
      param: paramRef,
      useForm: useFormRef,
      model: modelRef,
      rowKey(rowData) {
        return rowData.groupName + '@@' + rowData.name;
      },
      doHandlePageChange,
      showCreate
    };
  },

  computed: {
    namespaceId() {
      return namespaceStore.current.value.namespaceId;
    },
    getDetailTitle() {
      if (this.model.mode === constant.FORM_MODE_UPDATE) {
        return '编辑服务';
      } else if (this.model.mode === constant.FORM_MODE_CREATE) {
        return '新增服务';
      }
      return '服务详情';
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
    submitForm() {
      if (this.model.mode === constant.FORM_MODE_DETAIL) {
        this.useForm = false;
        return;
      }
      let serviceInfo = {
        namespaceId: this.namespaceId,
        groupName: this.model.groupName,
        serviceName: this.model.serviceName,
        protectThreshold: this.model.protectThreshold,
        metadata: this.model.metadata,
        tenant: this.getTenant
      };
      if (this.model.mode === constant.FORM_MODE_CREATE) {
        namingApi
          .createService(serviceInfo)
          .then((res) => {
            if (res.status == 200) {
              window.$message.info('设置成功!');
              this.useForm = false;
              this.queryList();
              return;
            }
            window.$message.error('设置失败，response code' + res.status);
          })
          .catch((err) => {
            window.$message.error('设置失败，' + err.message);
          });
      } else {
        namingApi
          .updateService(serviceInfo)
          .then((res) => {
            if (res.status == 200) {
              window.$message.info('设置成功!');
              this.useForm = false;
              this.queryList();
              return;
            }
            window.$message.error('设置失败，response code' + res.status);
          })
          .catch((err) => {
            window.$message.error('设置失败，' + err.message);
          });
      }
    }
  },
  mounted() {
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
