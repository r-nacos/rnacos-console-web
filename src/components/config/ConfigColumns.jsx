import { NButton,NPopconfirm } from "naive-ui"

export const createColumns = function (detail,showUpdate, remove) {

    const removeConfirmSlots = {
        trigger: ()=> {
            return <NButton size="tiny">删除</NButton>
        }
    }

    const columns = [
        {
            title: '配置ID',
            key: 'dataId'
        },
        {
            title: '配置组',
            key: 'group'
        },
        {
            title: '操作',
            key: 'type',
            render(row) {
                return (
                    <div>
                        <NButton size="tiny" onClick={()=>detail(row)}>详情</NButton>
                        <NButton size="tiny" onClick={()=>showUpdate(row)}>编辑</NButton>
                        <NPopconfirm onPositiveClick={()=>remove(row)} v-slots={removeConfirmSlots} >
                            <span>确认要删配置组为:{row.group},ID为:{row.dataId}的配置吗？</span>
                        </NPopconfirm>
                    </div>
                )
            }
        },
    ]
    return columns
}