import { h } from 'vue';
import { NButton } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import template from 'template_js';

export const createMcpServerColumns = function (
  detailItem,
  updateItem,
  removeItem,
  webResources
) {
  const { t } = useI18n();

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
    {
      title: t('mcpserver.auth_keys'),
      key: 'authKeysDisplay',
      width: 150,
      ellipsis: {
        tooltip: true
      }
    },
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
        return [
          h(
            NButton,
            {
              size: 'small',
              type: 'info',
              style: { marginRight: '8px' },
              onClick: () => detailItem(row)
            },
            { default: () => t('common.detail') }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              style: { marginRight: '8px' },
              onClick: () => updateItem(row),
              disabled: !webResources.canUpdateConfig
            },
            { default: () => t('common.edit') }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => removeItem(row),
              disabled: !webResources.canUpdateConfig
            },
            { default: () => t('common.delete') }
          )
        ];
      }
    }
  ];
  return columns;
};