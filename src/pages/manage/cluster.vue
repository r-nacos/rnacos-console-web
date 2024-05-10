<template>
  <PageContainer
    ref="pageContainer"
    :config="{
      columns: columns,
      apis: {
        list: apis.clusterNodeList,
      },
      form: {
        title: '集群信息',
      },
      pagination: paginationReactive,
    }"
  >
    <template #header>集群信息</template>
  </PageContainer>
</template>

<script lang="tsx" setup title="集群信息" layout="nav">
import apis from '@/apis'
import { NButton } from 'naive-ui'
const paginationReactive = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  itemCount: 0,
  prefix({ itemCount }: any) {
    return `总行数: ${itemCount}`
  },
  onChange: (page: number) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  },
})
/**
 * 表格字段
 */
const columns = [
  {
    title: '节点Id',
    key: 'nodeId',
    render(row: any) {
      if (row.currentNode) {
        return (
          <span>
            <span style="padding:0 10px 0 0;">{row.nodeId}</span>
            <NButton
              size="tiny"
              strong
              secondary
              type="primary"
            >
              【查询节点】
            </NButton>
          </span>
        )
      }
      return row.nodeId
    },
  },
  {
    title: '节点地址(grpc)',
    key: 'addr',
  },
  {
    title: 'raft主角点',
    key: 'raftLeader',
    render(row: any) {
      if (row.raftLeader) {
        return (
          <NButton
            size="tiny"
            strong
            secondary
            type="primary"
          >
            是
          </NButton>
        )
      } else {
        return (
          <NButton
            size="tiny"
            strong
            secondary
          >
            否
          </NButton>
        )
      }
    },
  },
  {
    title: '节点状态',
    key: 'distroValid',
    render(row: any) {
      if (row.distroValid) {
        return (
          <NButton
            size="tiny"
            strong
            secondary
            type="success"
          >
            正常
          </NButton>
        )
      } else {
        return (
          <NButton
            size="tiny"
            strong
            secondary
            type="warning"
          >
            失效
          </NButton>
        )
      }
    },
  },
]
</script>
