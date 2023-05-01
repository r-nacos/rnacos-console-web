import { NButton } from "naive-ui"

export const createColumns = function (showUpdate,onLine,offLine ) {

  const columns = [
    {
      title: 'IP',
      key: 'ip'
    },
    {
      title: '端口',
      key: 'port'
    },
    {
      title: '是否临时实例',
      key: 'ephemeral',
      render(row){
        return (
          <span>{row.ephemeral.toString()}</span>
        )
      }
    },
    {
      title: '权重',
      key: 'weight'
    },
    {
      title: '建康状态',
      key: 'healthy',
      render(row){
        return (
          <span>{row.healthy.toString()}</span>
        )
      }
    },
    {
      title: '元数据',
      key: 'metadata',
      render(row){
        return (
          <span>{JSON.stringify(row.metadata)}</span>
        )
      }
    },
    {
      title: '操作',
      key: '_type',
      render(row) {
        const onOffLine= ()=> {
          if(row.enabled){
            return <NButton size="tiny" onClick={() => offLine(row)}>下线</NButton>
          }
          else{
            <NButton size="tiny" onClick={() => onLine(row)}>上线</NButton>
          }
        }
        return (
          <div>
            <NButton size="tiny" onClick={() => showUpdate(row)}>编辑</NButton>
            {onOffLine()}
          </div>
        )
      }
    },
  ]
  return columns
}