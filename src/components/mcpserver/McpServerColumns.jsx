import { NButton, NPopconfirm } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import template from 'template_js';

export const createMcpServerColumns = function (
  detailItem,
  updateItem,
  removeItem,
  webResources
) {
  const { t } = useI18n();

  const removeConfirmSlots = {
    trigger: () => {
      return (
        <NButton size="tiny" quaternary type="error">
          {t('common.delete')}
        </NButton>
      );
    }
  };

  const columns = [
    {
      title: t('mcpserver.server_id'),
      key: 'id',
      width: 80,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: t('mcpserver.unique_key'),
      key: 'uniqueKey',
      width: 120,
      ellipsis: {
        tooltip: true
      },
      render(row) {
        return row.uniqueKey || '-';
      }
    },
    {
      title: t('mcpserver.server_name'),
      key: 'name',
      width: 150,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: t('namespace.namespace'),
      key: 'namespace',
      width: 120,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: t('mcpserver.server_description'),
      key: 'description',
      width: 200,
      ellipsis: {
        tooltip: true
      },
      render(row) {
        return row.description || '-';
      }
    },
    /*
    {
      title: t('mcpserver.auth_keys'),
      key: 'authKeysDisplay',
      width: 150,
      ellipsis: {
        tooltip: true
      }
    },
    */
    {
      title: t('mcpserver.tools'),
      key: 'toolsCount',
      width: 80,
      render(row) {
        return row.toolsCount || 0;
      }
    },
    {
      title: t('mcpserver.create_time'),
      key: 'createTimeFormatted',
      width: 160,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: t('mcpserver.update_time'),
      key: 'updateTimeFormatted',
      width: 160,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: t('common.operation'),
      key: 'actions',
      width: 180,
      render(row) {
        let editButton;
        let removePopconfirm;
        if (webResources.canUpdateMcpServer) {
          editButton = (
            <NButton
              size="tiny"
              text
              type="info"
              onClick={() => updateItem(row)}
            >
              {t('common.edit')}
            </NButton>
          );
          removePopconfirm = (
            <NPopconfirm
              onPositiveClick={() => removeItem(row)}
              v-slots={removeConfirmSlots}
            >
              <span>
                {template(t('mcpserver.confirm_delete_server_action'), {
                  name: row.name,
                  id: row.id
                })}
              </span>
            </NPopconfirm>
          );
        } else {
          editButton = <span></span>;
          removePopconfirm = editButton;
        }
        return (
          <div class="flex gap-1">
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() => detailItem(row)}
            >
              {t('common.detail')}
            </NButton>
            {editButton}
            {removePopconfirm}
          </div>
        );
      }
    }
  ];
  return columns;
};
