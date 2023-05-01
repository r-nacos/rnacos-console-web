<template>
  <div class="wrap">
    <div class="header">
      <div class="title">
        <span> 配置列表 </span>
      </div>
      <div class="header-button"></div>
      <div class="namespace">
        <NamespacePopSelect @change="queryList" />
      </div>
    </div>
    <div class="content-wrap">
      <div class="form-container">
        <div class="query-params">
          <div class="paramWrap">
            <n-form inline :label-width="80">
              <n-form-item size="tiny" label="服务名" path="param.serviceParam">
                <n-input
                  size="tiny"
                  v-model:value="param.serviceParam"
                  placeholder="输入服务名"
                />
              </n-form-item>
              <n-form-item size="tiny" label="服务组" path="param.groupParam">
                <n-input
                  size="tiny"
                  v-model:value="param.groupParam"
                  placeholder="输入服务组"
                />
              </n-form-item>
            </n-form>
          </div>
          <div class="queryButton">
            <span class="query-button-item">
              <n-button @click="queryList">查询</n-button>
            </span>
            <span class="query-button-item">
              <n-button type="primary" @click="showCreate">新建</n-button>
            </span>
          </div>
        </div>
        <div class="table-data">
          <n-data-table
            remote
            ref="table"
            :columns="columns"
            :data="data"
            :loading="loading"
            :pagination="pagination"
            :row-key="rowKey"
            @update:page="handlePageChange"
          />
        </div>
      </div>
    </div>
    <SubContentPage
      v-show="useForm"
      :title="getDetailTitle"
      @close="closeForm"
      @submit="submitForm"
    >
      <ServiceDetail :model="model" />
    </SubContentPage>
  </div>
</template>

<script>
import { ref, reactive, defineComponent } from "vue";
import { namingApi } from "@/api/naming";
import { namespaceStore } from "@/data/namespace";
import { createColumns } from "@/components/naming/ServiceListColumns.jsx";
import NamespacePopSelect from "@/components/namespace/NamespacePopSelect.vue";
import SubContentPage from "@/components/common/SubContentPage";
import ServiceDetail from "./ServiceDetail.vue";
import * as constant from '@/types/constant'

export default defineComponent({
  components: {
    NamespacePopSelect,
    SubContentPage,
    ServiceDetail,
  },
  setup() {
    const dataRef = ref([]);
    const loadingRef = ref(false);
    const paramRef = ref({
      serviceParam: "",
      groupParam: "",
      namespaceId: "",
      pageNo: 1,
      pageSize: 20,
    });
    const paginationReactive = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      itemCount: 0,
      prefix({ itemCount }) {
        return `Total is ${itemCount}.`;
      },
    });
    const useFormRef = ref(false);
    const modelRef = ref({
      groupName:"",
      serviceName:"",
      protectThreshold:"0",
      metadata:"",
      selector:"",
      mode:"",
    });
    const showUpdate = (row) => {
      let protectThreshold = "0";
      if(row.protectThreshold){
        protectThreshold = row.protectThreshold.toString();
      }
      modelRef.value = {
        groupName:row.groupName,
        serviceName:row.name,
        protectThreshold:protectThreshold,
        metadata:row.metadata,
        selector:"",
        mode:constant.FORM_MODE_UPDATE,
      };
      useFormRef.value = true;
    };
    const showDetail = (row) => {
      let protectThreshold = "0";
      if(row.protectThreshold){
        protectThreshold = row.protectThreshold.toString();
      }
      modelRef.value = {
        groupName:row.groupName,
        serviceName:row.name,
        protectThreshold:protectThreshold,
        metadata:row.metadata,
        selector:"",
        mode:constant.FORM_MODE_DETAIL,
      };
      useFormRef.value = true;
    };
    const removeItem = (row) => {
      useFormRef.value = true;
    };
    const showCreate = () => {
      modelRef.value = {
        groupName:"",
        serviceName:"",
        protectThreshold:"0",
        metadata:"",
        selector:"",
        mode:constant.FORM_MODE_CREATE,
      };
      useFormRef.value = true;
    };

    const doQueryList = () => {
      return namingApi.queryServicePage({
        namespaceId: namespaceStore.current.value.namespaceId,
        accessToken: null,
        serviceNameParam: paramRef.serviceParam,
        groupNameParam: paramRef.groupParam,
        pageNo: paginationReactive.page,
        pageSize: paginationReactive.pageSize,
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
              window.$message.error("request err,status code:" + res.status);
              dataRef.value = [];
            }
          })
          .catch((err) => {
            window.$message.error("request err,message" + err.message);
            dataRef.value = [];
            loadingRef.value = false;
          });
      }
    };

    let columns = createColumns(showDetail, showUpdate, removeItem);
    return {
      columns,
      data: dataRef,
      pagination: paginationReactive,
      loading: loadingRef,
      param: paramRef,
      useForm: useFormRef,
      model: modelRef,
      rowKey(rowData) {
        return rowData.groupName + "@@" + rowData.name;
      },
      doHandlePageChange,
      showCreate,
    };
  },

  computed: {
    namespaceId(){
      return namespaceStore.current.value.namespaceId;
    },
    getDetailTitle(){
      if(this.model.mode===constant.FORM_MODE_UPDATE){
        return "编辑服务";
      }
      else if(this.model.mode===constant.FORM_MODE_CREATE){
        return "新增服务";
      }
      return "服务详情";
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
        namespaceId:this.namespaceId,
        groupName:this.model.groupName,
        serviceName:this.model.serviceName,
        protectThreshold:this.model.protectThreshold,
        metadata:this.model.metadata,
        tenant: this.getTenant,
      };
      if(this.model.mode=== constant.FORM_MODE_CREATE){
        namingApi.createService(serviceInfo)
          .then((res) => {
            if (res.status == 200) {
              window.$message.info("设置成功!");
              this.useForm = false;
              this.queryList();
              return;
            }
            window.$message.error("设置失败，response code" + res.status);
          })
          .catch((err) => {
            window.$message.error("设置失败，" + err.message);
          });
      }
      else{
        namingApi.updateService(serviceInfo)
          .then((res) => {
            if (res.status == 200) {
              window.$message.info("设置成功!");
              this.useForm = false;
              this.queryList();
              return;
            }
            window.$message.error("设置失败，response code" + res.status);
          })
          .catch((err) => {
            window.$message.error("设置失败，" + err.message);
          });
      }
    },
  },
  mounted() {
    this.queryList();
  },
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
  padding: 3px;
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

.header-button {
  flex: 0 0 auto;
}
.namespace {
  flex: 0 0 auto;
}

.query-params {
  flex: 0 0 auto;
  height: 60px;
  display: flex;
  flex-direction: row;
}

.queryButton {
  display: flex;
  align-items: center;
}

.query-button-item {
  margin-left: 10px;
}

.table-data {
  flex-grow: 1 1 auto;
  position: relative;
  overflow: scroll;
  height: 100%;
  width: 100%;
}
</style>
