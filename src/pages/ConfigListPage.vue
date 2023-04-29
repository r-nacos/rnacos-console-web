<template>
  <div class="wrap">
    <div class="header">
      <div class="title">
        <span> 配置列表 </span>
      </div>
      <div class="header-button">
        <n-button @click="showCreate">新建</n-button>
      </div>
      <div class="namespace">
        <NamespacePopSelect @change="queryList" />
      </div>
    </div>
    <div class="content-wrap">
      <div class="form-container">
        <div class="query-params">
          <n-form inline :label-width="80">
            <n-form-item size="tiny" label="配置" path="param.dataParam">
              <n-input size="tiny"
                v-model:value="param.dataParam"
                placeholder="输入配置ID"
              />
            </n-form-item>
            <n-form-item size="tiny" label="配置组" path="param.groupParam">
              <n-input size="tiny"
                v-model:value="param.groupParam"
                placeholder=" 输入配置组"
              />
            </n-form-item>
            <n-form-item size="tiny" label=" ">
              <n-button size="tiny" attr-type="button" @click="queryList"> 查询 </n-button>
            </n-form-item>
          </n-form>
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
    <SubContentFullPage
      v-show="useForm"
      title="empty"
      @close="closeForm"
      @submit="submitForm"
    >
      <ConfigDetail :model="model" />
    </SubContentFullPage>
  </div>
</template>

<script>
import { ref, reactive, defineComponent } from "vue";
import { configApi } from "@/api/config";
import { namespaceStore } from "@/data/namespace";
import { createColumns } from "@/components/config/ConfigColumns";
import NamespacePopSelect from "@/components/namespace/NamespacePopSelect.vue";
import SubContentPage from "@/components/common/SubContentPage";
import SubContentFullPage from "@/components/common/SubContentFullPage";
import ConfigDetail from "./ConfigDetail.vue";
import { Close } from "@vicons/ionicons5";

export default defineComponent({
  components: {
    NamespacePopSelect,
    Close,
    SubContentPage,
    SubContentFullPage,
    ConfigDetail,
  },
  setup(self) {
    let resultObj=null;
    //window.$message = useMessage();
    const dataRef = ref([]);
    const useFormRef = ref(false);
    const loadingRef = ref(false);
    const modelRef = ref({
      dataId: "",
      group: "",
      md5: "",
      content: "",
      mode: "",
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
    const showNewConfigValueDetail = (row, mode) => {
      let config = {
        tenant: row.tenant,
        group: row.group,
        dataId: row.dataId,
      };
      configApi
        .getConfig(config)
        .then((res) => {
          console.log("response", res.request.responseText);
          if (res.status == 200) {
            modelRef.value = {
              mode: mode,
              content: res.request.responseText,
              md5: res.headers["content-md5"] || "",
              ...config,
            };
            useFormRef.value = true;
          } else {
            window.$message.error("查询配置报错,response code:" + res.status);
          }
        })
        .catch((err) => {
          window.$message.error("查询配置报错," + err.message);
        });
    };
    const updateItem = (row) => {
      showNewConfigValueDetail(row, "update");
    };
    const detailItem = (row) => {
      showNewConfigValueDetail(row, "detail");
    };
    const showCreate = () => {
      modelRef.value = {
        dataId: "",
        group: "",
        md5: "",
        content: "",
        mode: "create",
      };
      useFormRef.value = true;
    };
    const removeItem = (row) => {
      let config = {
        tenant: row.tenant,
        group: row.group,
        dataId: row.dataId,
      };
      configApi
        .removeConfig(config)
        .then((res) => {
          console.log("response", res.request.responseText);
          if (res.status == 200) {
            window.$message.info("删除配置成功");
            //resultObj.doHandlePageChange(1);
          } else {
            window.$message.error("删除配置报错,response code:" + res.status);
          }
        })
        .catch((err) => {
          window.$message.error("删除配置报错," + err.message);
        });
    };

    const columns = createColumns(detailItem, updateItem, removeItem);
    resultObj= {
      columns,
      data: dataRef,
      useForm: useFormRef,
      pagination: paginationReactive,
      loading: loadingRef,
      model: modelRef,
      showCreate,
      param: ref({
        dataParam: "",
        groupParam: "",
        tenant: "",
        pageNo: 1,
        pageSize: 20,
      }),
      namespaceId: "",
      rowKey(rowData) {
        return rowData.group + "@@" + rowData.dataId;
      },
      doHandlePageChange(currentPage) {
        paginationReactive.page = currentPage;
        if (!loadingRef.value) {
          loadingRef.value = true;
          this.doQueryList()
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
      },
    };
    return resultObj;
  },

  computed: {
    getTenant() {
      return namespaceStore.current.value.namespaceId;
    },
  },

  methods: {
    handlePageChange(page) {
      this.doHandlePageChange(page);
    },
    queryList() {
      this.doHandlePageChange(1);
    },
    doQueryList() {
      return configApi.queryConfigPage({
        tenant: namespaceStore.current.value.namespaceId,
        dataParam: this.param.dataParam,
        groupParam: this.param.groupParam,
        pageNo: this.pagination.page,
        pageSize: this.pagination.pageSize,
      });
    },
    closeForm() {
      this.useForm = false;
    },
    submitForm() {
      if (this.model.mode === "detail") {
        this.useForm = false;
        return;
      }
      let config = {
        dataId: this.model.dataId,
        group: this.model.group,
        tenant: this.getTenant,
        content: this.model.content,
      };
      configApi
        .setConfig(config)
        .then((res) => {
          console.log("response", res.request.responseText);
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
    },
  },
  created() {
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
  height: 34px;
  border-bottom: #ccc 1px solid;
  background: #fff;
}

.title {
  flex: 1 1 auto;
  font: 14/1.25;
  line-height: 30px;
  padding-left: 15px;
}

.header-button{
  flex: 0 0 auto;
}
.namespace {
  flex: 0 0 auto;
}

.query-params {
  flex: 0 0 auto;
  height: 60px;
}

.table-data {
  flex-grow: 1 1 auto;
  position: relative;
  overflow: scroll;
  height: 100%;
  width: 100%;
}
</style>
