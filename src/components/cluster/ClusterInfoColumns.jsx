import { NButton } from 'naive-ui';
import { useI18n } from 'vue-i18n';

export const createColumns = function () {
  const { t } = useI18n();
  const columns = [
    {
      title: t('cluster.node') + 'Id',
      key: 'nodeId',
      render(row) {
        if (row.currentNode) {
          return (
            <span>
              <span style="padding:0 10px 0 0;">{row.nodeId}</span>
              <NButton size="tiny" strong secondary type="primary">
                【{t('common.query')} {t('cluster.node')}】
              </NButton>
            </span>
          );
        }
        return row.nodeId;
      }
    },
    {
      title: t('cluster.node') + ' ' + t('cluster.address') + '(grpc)',
      key: 'addr'
    },
    {
      title: 'raft' + t('cluster.masternode'),
      key: 'raftLeader',
      render(row) {
        if (row.raftLeader) {
          return (
            <NButton size="tiny" strong secondary type="primary">
              {t('common.yes')}
            </NButton>
          );
        } else {
          return (
            <NButton size="tiny" strong secondary>
              {t('common.no')}
            </NButton>
          );
        }
      }
    },
    {
      title: t('cluster.node') + ' ' + t('common.status'),
      key: 'distroValid',
      render(row) {
        if (row.distroValid) {
          return (
            <NButton size="tiny" strong secondary type="success">
              {t('common.enabled')}
            </NButton>
          );
        } else {
          return (
            <NButton size="tiny" strong secondary type="warning">
              {t('common.disabled')}
            </NButton>
          );
        }
      }
    }
  ];
  return columns;
};
