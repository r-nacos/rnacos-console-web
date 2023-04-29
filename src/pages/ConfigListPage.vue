<template>
  <div class="header">
    <div class="title">
      <span> 配置列表 </span>
    </div>
    <div class="namespace">
      <NamespacePopSelect @change="queryList" />
    </div>
  </div>
  <div class="wrap">
    <div class="form-container">
      <div class="query-params">
        <n-form inline :label-width="80">
          <n-form-item label="配置" path="param.dataParam">
            <n-input v-model:value="param.dataParam" placeholder="输入配置ID" />
          </n-form-item>
          <n-form-item label="配置组" path="param.groupParam">
            <n-input
              v-model:value="param.groupParam"
              placeholder=" 输入配置组"
            />
          </n-form-item>
          <n-form-item>
            <n-button attr-type="button" @click="queryList"> 查询 </n-button>
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
</template>

<script>
import { ref, reactive, defineComponent } from "vue";
import { configApi } from "@/api/config";
import { namespaceStore } from "@/data/namespace";
import { createColumns } from "@/components/config/ConfigColumns";
import NamespacePopSelect from "../components/namespace/NamespacePopSelect.vue";
import { Close } from "@vicons/ionicons5";

export default defineComponent({
  components: {
    NamespacePopSelect,
    Close,
  },
  setup(self) {
    //window.$message = useMessage();
    const dataRef = ref([]);
    const useFormRef = ref(false);
    const loadingRef = ref(false);
    const paginationReactive = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      itemCount: 0,
      prefix({ itemCount }) {
        return `Total is ${itemCount}.`;
      },
    });
    const updateItem = (row) => {};
    const detailItem = (row) => {};
    const removeItem = (row) => {};
    const columns = createColumns(detailItem, updateItem, removeItem);
    return {
      columns,
      data: dataRef,
      useForm: useFormRef,
      pagination: paginationReactive,
      loading: loadingRef,
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
      useFormRef.value = false;
    },
  },
  created() {
    this.queryList();
  },
});
</script>

<style scoped>

.wrap{
  padding: 10px;
  background: #efefef;
}

.form-container {
  display: flex;
  flex-direction: column;
  position: relative;
  background: #ffffff;
  border-radius: 1%;
  padding: 3px;
}

.header {
  display: flex;
  flex-direction: row;
  height: 34px;
  border-bottom: #ccc 1px solid;
}

.title {
  flex: 1 1 auto;
  font: 14/1.25;
  line-height: 30px;
  padding-left: 15px;
}
.namespace {
  flex: 0 0 auto;
}

.query-params {
  flex: 0 0 auto;
}

.table-data {
  flex-grow: 1 1 auto;
  position: relative;
  overflow: scroll;
  height: 100%;
  width: 100%;
}
</style>
