import { NButton } from "naive-ui";

export const createColumns = function () {
  const columns = [
    {
      title: "节点Id",
      key: "nodeId",
      render(row) {
        if (row.currentNode) {
          return (
            <span>
              <span style="padding:0 10px 0 0;">{row.nodeId}</span>
              <NButton size="tiny" strong secondary type="primary">
                【查询节点】
              </NButton>
            </span>
          );
        }
        return row.nodeId;
      }
    },
    {
      title: "节点地址(grpc)",
      key: "addr"
    },
    {
      title: "raft主角点",
      key: "raftLeader",
      render(row) {
        if (row.raftLeader) {
          return (
            <NButton size="tiny" strong secondary type="primary">
              是
            </NButton>
          );
        } else {
          return (
            <NButton size="tiny" strong secondary>
              否
            </NButton>
          );
        }
      }
    },
    {
      title: "节点状态",
      key: "distroValid",
      render(row) {
        if (row.distroValid) {
          return (
            <NButton size="tiny" strong secondary type="success">
              正常
            </NButton>
          );
        } else {
          return (
            <NButton size="tiny" strong secondary type="warning">
              失效
            </NButton>
          );
        }
      }
    }
  ];
  return columns;
};
