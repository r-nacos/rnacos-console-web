import { NButton, NPopconfirm } from "naive-ui";
import { toDatetime } from "@/utils/date";

export const createColumns = function (
  detail,
  showHistory,
  showUpdate,
  remove
) {
  const removeConfirmSlots = {
    trigger: () => {
      return (
        <NButton size="tiny" quaternary type="error">
          删除
        </NButton>
      );
    }
  };

  const columns = [
    {
      title: "配置ID",
      key: "dataId"
    },
    {
      title: "配置组",
      key: "group"
    },
    {
      title: "操作",
      key: "type",
      fixed: "right",
      render(row) {
        return (
          <div>
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() => detail(row)}
            >
              详情
            </NButton>
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() => showHistory(row)}
            >
              历史记录
            </NButton>
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() => showUpdate(row)}
            >
              编辑
            </NButton>
            <NPopconfirm
              onPositiveClick={() => remove(row)}
              v-slots={removeConfirmSlots}
            >
              <span>
                确认要删配置组为:{row.group},ID为:{row.dataId}的配置吗？
              </span>
            </NPopconfirm>
          </div>
        );
      }
    }
  ];
  return columns;
};

export const createHistoryColumns = function (detail, rollback) {
  const rollbackConfirmSlots = {
    trigger: () => {
      return <NButton size="tiny">恢复</NButton>;
    }
  };

  const columns = [
    {
      title: "ID",
      key: "id"
    },
    {
      title: "配置ID",
      key: "dataId"
    },
    {
      title: "配置组",
      key: "group"
    },
    {
      title: "更新时间",
      key: "modifiedTime",
      render(row) {
        var value = "";
        if (row.modifiedTime) {
          var date = new Date(row.modifiedTime);
          value = toDatetime(date);
        }
        return <span>{value}</span>;
      }
    },
    {
      title: "操作",
      key: "type",
      fixed: "right",
      /*
                  <NPopconfirm onPositiveClick={()=>rollback(row)} v-slots={rollbackConfirmSlots} >
                      <span>确认要恢复ID为 <b>{row.id}</b> 的历史配置内容吗？</span>
                  </NPopconfirm>
      */
      render(row) {
        return (
          <div>
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() => detail(row)}
            >
              详情
            </NButton>
            <NButton
              size="tiny"
              quaternary
              type="primary"
              onClick={() => rollback(row)}
            >
              恢复
            </NButton>
          </div>
        );
      }
    }
  ];
  return columns;
};
