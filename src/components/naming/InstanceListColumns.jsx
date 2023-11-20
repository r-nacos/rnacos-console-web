import { NButton, NSwitch } from "naive-ui";

/*
let slots ={
  "checked":()=> {
    return <span>上线</span>
  },
  "unchecked":()=> {
    return <span>下线</span>
  },
};
*/

export const createColumns = function (showUpdate, onLine, offLine) {
  const columns = [
    {
      title: "IP",
      key: "ip"
    },
    {
      title: "端口",
      key: "port"
    },
    {
      title: "是否临时实例",
      key: "ephemeral",
      render(row) {
        return <span>{row.ephemeral.toString()}</span>;
      }
    },
    {
      title: "权重",
      key: "weight"
    },
    {
      title: "建康状态",
      key: "healthy",
      render(row) {
        return <span>{row.healthy.toString()}</span>;
      }
    },
    {
      title: "元数据",
      key: "metadata",
      width: 200,
      render(row) {
        return <span>{JSON.stringify(row.metadata)}</span>;
      }
    },
    {
      title: "操作",
      key: "_type",
      fixed: "right",
      render(row) {
        const onOffLine = () => {
          // v-slots={slots}
          return (
            <NSwitch
              size="small"
              default-value={row.enabled}
              onUpdateValue={(enabled) => {
                if (enabled == row.enabled) {
                  //操作中
                  return;
                }
                if (enabled) {
                  onLine(row);
                } else {
                  offLine(row);
                }
              }}
            />
          );
        };
        return (
          <div>
            <span style={{ "padding-right": "5px" }}>{onOffLine()}</span>
            <NButton
              size="tiny"
              type="info"
              quaternary
              onClick={() => showUpdate(row)}
            >
              编辑
            </NButton>
          </div>
        );
      }
    }
  ];
  return columns;
};
