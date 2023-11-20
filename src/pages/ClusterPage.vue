<template>
  <div class="wrap">
    <div class="header">
      <div class="title">
        <span> 集群信息</span>
      </div>
    </div>
    <div class="content-wrap">
      <div class="form-container">
        <n-data-table
          remote
          ref="table"
          :bordered="false"
          :columns="columns"
          :data="data"
          :row-key="rowKey"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { clusterApi } from "@/api/cluster";
import { createColumns } from "@/components/cluster/ClusterInfoColumns";

export default defineComponent({
  setup() {
    let columns = createColumns();
    const dataRef = ref([]);
    const doLoadData = function () {
      clusterApi
        .queryNodeList()
        .then((res) => {
          if (res.status == 200) {
            dataRef.value = res.data.data;
          } else {
            window.$message.error("request err,status code:" + res.status);
          }
        })
        .catch((err) => {
          window.$message.error(err.message);
        });
    };
    return {
      columns,
      data: dataRef,
      doLoadData,
      rowKey(rowData) {
        return rowData.nodeId;
      }
    };
  },
  mounted() {
    this.doLoadData();
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
</style>
