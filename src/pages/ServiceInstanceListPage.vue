<template>
  <div class="wrap">
    <div class="header">
      <div class="title">
        <span>服务实例列表</span>
      </div>
      <div class="header-button">
        <span><n-button @click="routerBack">返回</n-button></span>
      </div>
      <div class="namespace"></div>
    </div>
    <div class="content-wrap">
      <div class="form-container">
        <div class="query-params">
          <n-form label-placement="left" label-width="auto">
            <div class="paramWrap">
              <n-form-item
                label="服务名称"
                path="param.serviceParam">
                <n-input
                  :disabled="true"
                  v-model:value="param.serviceName"
                  placeholder="输入服务名称" />
              </n-form-item>
              <n-form-item label="服务组" path="param.groupParam">
                <n-input
                  :disabled="true"
                  v-model:value="param.groupName"
                  placeholder="" />
              </n-form-item>
            </div>
          </n-form>
          <div class="queryButton">
            <span class="query-button-item">
              <n-button tertiary @click="reloadData">刷新</n-button>
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
          @update:page="handlePageChange" />
      </div>
    </div>
    <n-drawer v-model:show="useForm" default-width="600" resizable>
      <n-drawer-content :title="getDetailTitle" closable>
        <ServiceInstanceDetail :model="model" />
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
import { defineComponent } from "vue"
import { namingApi } from "@/api/naming"
//import { namespaceStore } from "@/data/namespace";
import { createColumns } from "@/components/naming/InstanceListColumns"
import ServiceInstanceDetail from "./ServiceInstanceDetail.vue"
import * as constant from "@/types/constant"
import { useRoute } from "vue-router"

export default defineComponent({
  components: {
    ServiceInstanceDetail,
  },
  setup() {
    let route = useRoute()
    let query = route.query
    let param = {
      serviceName: query.serviceName,
      groupName: query.groupName || "",
      namespaceId: query.namespaceId || "",
    }
    const dataRef = ref([])
    const sourceDataRef = ref([])
    const loadedRef = ref(false)
    const loadingRef = ref(false)
    const paramRef = ref(param)
    const paginationReactive = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      itemCount: 0,
      prefix({ itemCount }) {
        return `总行数: ${itemCount}`
      },
    })
    const useFormRef = ref(false)

    const modelRef = ref({
      ip: "",
      port: "0",
      enabled: true,
      weight: "1",
      metadata: "{}",
      mode: constant.FORM_MODE_DETAIL,
    })
    const updateParam = (param) => {
      paramRef.value = param
    }
    const showUpdate = (row) => {
      modelRef.value = {
        ip: row.ip,
        port: row.port.toString(),
        enabled: row.enabled,
        weight: (row.weight || 1).toString(),
        metadata: JSON.stringify(row.metadata || {}),
        mode: constant.FORM_MODE_UPDATE,
      }
      useFormRef.value = true
    }
    const setRowEnabled = (row, enabled) => {
      let instance = {
        namespaceId: param.namespaceId,
        groupName: param.groupName,
        serviceName: param.serviceName,

        ip: row.ip,
        port: row.port,
        //weight: row.weight,
        enabled: enabled,
        //metadata: row.metadata,
      }
      namingApi
        .updateInstance(instance)
        .then((res) => {
          if (res.status == 200) {
            if (enabled) {
              window.$message.info("上线成功!")
            }
            else {
              window.$message.info("下线成功!")
            }
            row.enabled = enabled
            setCurrentPageData(paginationReactive.page || 1)
            //reloadData()
            return
          }
          window.$message.error("设置失败，response code" + res.status)
        })
        .catch((err) => {
          window.$message.error("设置失败，" + err.message)
        })
    }
    const onLine = (row) => { setRowEnabled(row, true) }
    const offLine = (row) => { setRowEnabled(row, false) }

    const doQueryList = () => {
      return namingApi.queryServiceInstances({
        serviceName: paramRef.value.serviceName,
        groupName: paramRef.value.groupName,
        namespaceId: paramRef.value.namespaceId,
      })
    }

    const setCurrentPageData = (currentPage) => {
      let pageSize = paginationReactive.pageSize
      let offset = (currentPage - 1) * pageSize
      let endIndex = Math.min(offset + pageSize, sourceDataRef.value.length)
      let data = []
      for (var i = offset; i < endIndex; i++) {
        data.push(sourceDataRef.value[i])
      }
      dataRef.value = data
    }

    const reloadData = () => {
      loadedRef.value = false
      doHandlePageChange(paginationReactive.page || 1)
    }
    const doHandlePageChange = (currentPage) => {
      paginationReactive.page = currentPage
      if (loadedRef.value) {
        setCurrentPageData(currentPage)
        return
      }
      if (!loadingRef.value) {
        loadingRef.value = true
        doQueryList()
          .then((res) => {
            loadingRef.value = false
            if (res.status == 200) {
              let count = res.data.count
              let pageSize = paginationReactive.pageSize
              paginationReactive.itemCount = count
              paginationReactive.pageCount = Math.round(
                (count + pageSize - 1) / pageSize
              )
              loadedRef.value = true
              sourceDataRef.value = res.data.list || []
              setCurrentPageData(currentPage)
            } else {
              window.$message.error("request err,status code:" + res.status)
              dataRef.value = []
            }
          })
          .catch((err) => {
            window.$message.error("request err,message" + err.message)
            dataRef.value = []
            loadingRef.value = false
          })
      }
    }

    let columns = createColumns(showUpdate, onLine, offLine)
    return {
      columns,
      data: dataRef,
      sourceData: sourceDataRef,
      pagination: paginationReactive,
      loading: loadingRef,
      loaded: loadedRef,
      param: paramRef,
      useForm: useFormRef,
      model: modelRef,
      updateParam,
      rowKey(rowData) {
        return rowData.ip + "_" + rowData.port
      },
      doHandlePageChange,
      reloadData,
    }
  },
  computed: {
    getDetailTitle() {
      return "编辑实例"
    },
  },
  data() {
    return {}
  },
  mounted() {
    /*
    let query = this.$route.query;
    let param = {
      serviceName: query.serviceName,
      groupName: query.groupName || "",
      namespaceId: query.namespaceId || "",
    };
    this.updateParam(param);
    */
    this.queryList()
  },
  methods: {
    handlePageChange(page) {
      this.doHandlePageChange(page)
    },
    queryList() {
      this.doHandlePageChange(1)
    },
    closeForm() {
      this.useForm = false
    },
    submitForm() {
      if (this.model.mode === constant.FORM_MODE_DETAIL) {
        this.useForm = false
        return
      }
      let instance = {
        namespaceId: this.param.namespaceId,
        groupName: this.param.groupName,
        serviceName: this.param.serviceName,

        ip: this.model.ip,
        port: this.model.port,
        weight: this.model.weight,
        enabled: this.model.enabled,
        metadata: this.model.metadata,
      }
      if (this.model.mode === constant.FORM_MODE_UPDATE) {
        namingApi
          .updateInstance(instance)
          .then((res) => {
            if (res.status == 200) {
              window.$message.info("设置成功!")
              this.useForm = false
              this.reloadData()
              return
            }
            window.$message.error("设置失败，response code" + res.status)
          })
          .catch((err) => {
            window.$message.error("设置失败，" + err.message)
          })
      } else {
        this.useForm = false
      }
    },
    routerBack() {
      this.$router.go(-1)
    },
  },
})
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
