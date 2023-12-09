import { NButton, NSwitch, NTag, NPopconfirm } from 'naive-ui';

import { toDatetime } from '@/utils/date';
import { getRoleNameByCode } from '@/data/role';

export const createColumns = function (showDetail, showUpdate, remove) {
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
      title: '用户',
      key: 'username'
    },
    {
      title: '用户昵称',
      key: 'nickname'
    },
    {
      title: '创建时间',
      key: 'gmtCreate',
      render(row) {
        var value = '';
        if (row.gmtCreate) {
          var date = new Date(row.gmtCreate);
          value = toDatetime(date);
        }
        return <span>{value}</span>;
      }
    },
    {
      title: '更新时间',
      key: 'gmtModified',
      render(row) {
        var value = '';
        if (row.gmtModified) {
          var date = new Date(row.gmtModified);
          value = toDatetime(date);
        }
        return <span>{value}</span>;
      }
    },
    {
      title: '角色',
      key: 'roles',
      render(row) {
        const roleItems = row.roles.map((item) => (
          <NTag type="success">{getRoleNameByCode(item)}</NTag>
        ));
        return <>{roleItems}</>;
      }
    },
    {
      title: '是否启用',
      key: 'enable',
      render(row) {
        var v = '是';
        if (!row.enable) {
          v = '否';
        }
        return <span>{v}</span>;
      }
    },
    {
      title: '操作',
      key: 'actions',
      render(row) {
        /*
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() => showDetail(row)}
            >
              详情
            </NButton>
        */
        return (
          <>
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
              <span>确认要删服务名称为:{row.username} 的用户吗？</span>
            </NPopconfirm>
          </>
        );
      }
    }
  ];
  return columns;
};
