import { NButton, NPopconfirm } from "naive-ui"

export const createColumns = function (showInstances,detail, showUpdate, remove) {

  const removeConfirmSlots = {
    trigger: () => {
      return <NButton size="tiny" quaternary type='error'>删除</NButton>
    }
  }

  const columns = [
    {
      title: '服务名称',
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
            <NButton size="tiny" quaternary onClick={() => showInstances(row)}>服务实例</NButton>
            <NButton size="tiny" quaternary onClick={() => detail(row)}>详情</NButton>
            <NButton size="tiny" quaternary onClick={() => showUpdate(row)}>编辑</NButton>
            <NPopconfirm onPositiveClick={() => remove(row)} v-slots={removeConfirmSlots} >
              <span>确认要删服务名称为:{row.name},服务组为:{row.groupName},的配置吗？</span>
            </NPopconfirm>
          </div>
        )
      }
    },
  ]
  return columns
}
