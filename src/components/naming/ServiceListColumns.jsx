import { NButton, NPopconfirm } from "naive-ui"

export const createColumns = function (detail, showUpdate, remove) {

  const removeConfirmSlots = {
    trigger: () => {
      return <NButton size="tiny">删除</NButton>
    }
  }

  const columns = [
    {
      title: '服务',
      key: 'name'
    },
    {
      title: '服务组',
      key: 'groupName'
    },
    {
      title: '实例数',
      key: 'ipCount'
    },
    {
      title: '健康实例数',
      key: 'healthyInstanceCount'
    },
    {
      title: '操作',
      key: 'type',
      render(row) {
        return (
          <div>
            <NButton size="tiny" onClick={() => detail(row)}>详情</NButton>
            <NButton size="tiny" onClick={() => showUpdate(row)}>编辑</NButton>
            <NPopconfirm onPositiveClick={() => remove(row)} v-slots={removeConfirmSlots} >
              <span>确认要删配置组为:{row.group},ID为{row.dataId}的配置吗？</span>
            </NPopconfirm>
          </div>
        )
      }
    },
  ]
  return columns
}