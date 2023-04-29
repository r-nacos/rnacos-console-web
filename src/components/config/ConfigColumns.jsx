import { NButton } from "naive-ui"

export const createColumns = function (detail,showUpdate, remove) {
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
                        <NButton size="tiny" onClick={()=>remove(row)}>删除</NButton>
                    </div>
                )
            }
        },
    ]
    return columns
}