import { NButton, NPopconfirm } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import template from 'template_js';

export const createColumns = function (
  detailItem,
  updateItem,
  removeItem,
  webResources
) {
  const { t } = useI18n();

  const columns = [
    {
      title: t('toolspec.namespace'),
      key: 'namespace',
      width: 120,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: t('toolspec.group'),
      key: 'group',
      width: 150,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: t('toolspec.tool_name'),
      key: 'toolName',
      width: 180,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: t('toolspec.description'),
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
      title: t('toolspec.version'),
      key: 'version',
      width: 80,
      render(row) {
        return row.version !== undefined ? row.version : '-';
      }
    },
    {
      title: t('toolspec.create_time'),
      key: 'createTime',
      width: 160,
      render(row) {
        return row.createTime ? new Date(row.createTime).toLocaleString() : '-';
      }
    },
    {
      title: t('toolspec.last_modified'),
      key: 'lastModifiedMillis',
      width: 160,
      render(row) {
        return row.lastModifiedMillis
          ? new Date(row.lastModifiedMillis).toLocaleString()
          : '-';
      }
    },
    {
      title: t('toolspec.actions'),
      key: 'actions',
      width: 180,
      render(row) {
        let editButton;
        let removePopconfirm;
        if (webResources.canUpdateMcpToolSpec) {
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
              v-slots={{
                trigger: () => (
                  <NButton size="tiny" quaternary type="error">
                    {t('common.delete')}
                  </NButton>
                )
              }}
            >
              <span>
                {template(t('toolspec.confirm_delete_toolspec'), {
                  toolName: row.toolName,
                  group: row.group
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
