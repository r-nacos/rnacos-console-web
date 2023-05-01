<template>
  <div class="wrap">
    <div class="header">
      <div class="title">
        <span>服务实例列表</span>
      </div>
      <div class="header-button"></div>
      <div class="namespace">
      </div>
    </div>
    <div class="content-wrap">
      <div class="form-container">
        <div class="query-params">
          <div class="paramWrap">
            <n-form inline :label-width="80">
              <n-form-item size="tiny" label="服务名称" path="param.serviceParam">
                <n-input
                  size="tiny"
                  :disabled="true"
                  v-model:value="param.serviceName"
                  placeholder="输入服务名称"
                />
              </n-form-item>
              <n-form-item size="tiny" label="服务组" path="param.groupParam">
                <n-input
                  size="tiny"
                  :disabled="true"
                  v-model:value="param.groupName"
                  placeholder=""
                />
              </n-form-item>
            </n-form>
          </div>
          <div class="queryButton">
            <span class="query-button-item">
              <n-button @click="reloadData">刷新</n-button>
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
      subpage
    </SubContentPage>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { namingApi } from "@/api/naming";
//import { namespaceStore } from "@/data/namespace";
import {createColumns} from "@/components/naming/InstanceListColumns"
import SubContentPage from '@/components/common/SubContentPage'
import * as constant from '@/types/constant'

export default defineComponent({
  components: {
    SubContentPage,
  },
  setup() {
    const dataRef = ref([]);
    const sourceDataRef = ref([]);
    const loadedRef=ref(false);
    const loadingRef = ref(false);
    const paramRef = ref({
      serviceName: "",
      groupName: "",
      namespaceId: "",
    });
    const paginationReactive = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      itemCount: 0,
      prefix({ itemCount }) {
        return `总行数: ${itemCount}`;
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
    const updateParam=(param)=> {
      paramRef.value = param
    }
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
    const onLine= (row) => {
    };
    const offLine= (row) => {
    };

    const doQueryList = () => {
      return namingApi.queryServiceInstances({
        serviceName: paramRef.value.serviceName,
        groupName: paramRef.value.groupName,
        namespaceId: paramRef.value.namespaceId,
      });
    };

    const setCurrentPageData=(currentPage) => {
      let pageSize = paginationReactive.pageSize;
        let offset = (currentPage-1)*pageSize;
        let endIndex = Math.min(offset+pageSize, sourceDataRef.value.length)
        let data=[];
        for(var i=offset;i<endIndex;i++){
          data.push(sourceDataRef.value[i]);
        }
        dataRef.value = data;

    }

    const reloadData=()=>{
      loadedRef.value=false;
      doHandlePageChange(paginationReactive.page || 1);
    }
    const doHandlePageChange = (currentPage) => {
      paginationReactive.page = currentPage;
      if(loadedRef.value){
        setCurrentPageData(currentPage);
        return
      }
      if (!loadingRef.value) {
        loadingRef.value = true;
        doQueryList()
          .then((res) => {
            loadingRef.value = false;
            if (res.status == 200) {
              let count = res.data.count;
              let pageSize = paginationReactive.pageSize;
              paginationReactive.itemCount = count;
              paginationReactive.pageCount = Math.round(
                (count + pageSize - 1) / pageSize
              );
              loadedRef.value=true;
              sourceDataRef.value = res.data.list || [];
              setCurrentPageData(currentPage);
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

    let columns = createColumns(showUpdate, onLine,offLine);
    return {
      columns,
      data: dataRef,
      sourceData:sourceDataRef,
      pagination: paginationReactive,
      loading: loadingRef,
      loaded: loadedRef,
      param: paramRef,
      useForm: useFormRef,
      model: modelRef,
      updateParam,
      rowKey(rowData) {
        return rowData.ip+ "_" + rowData.port;
      },
      doHandlePageChange,
      reloadData,
    };
  },
  computed:{
    getDetailTitle(){
      return "编辑实例";
    }
  },
  data() {
    return {
    };
  },
  mounted() {
    let query = this.$route.query;
    let param = {
      serviceName:query.serviceName,
      groupName:query.groupName ||"",
      namespaceId:query.namespaceId ||"",
    }
    this.updateParam(param);
    this.queryList();
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
      this.useForm = false;
    },
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
  line-height: 40px;
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
