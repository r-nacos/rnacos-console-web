import { NButton } from "naive-ui"

export const createColumns = function (showUpdate, remove) {
    const columns = [
        {
            title: '命名空间名称',
            key: 'namespaceName'
        },
        {
            title: '命名空间ID',
            key: 'namespaceId'
        },
        {
            title: '操作',
            key: 'type',
            render(row) {
                if(row.namespaceId===''){
                    return <div>保留空间</div>
                }
                return (
                    <div>
                        <NButton size="tiny" onClick={()=>showUpdate(row)}>编辑</NButton>
                        <NButton size="tiny" onClick={()=>remove(row)}>删除</NButton>
                    </div>
                )
            }
        },
    ]
    return columns
}