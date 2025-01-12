import { NButton, NPopconfirm } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import template from 'template_js';
export const createColumns = function (
  showInstances,
  detail,
  showUpdate,
  remove,
  showSubscribers,
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
      title: t('service.name'),
      key: 'name'
    },
    {
      title: t('service.groupName'),
      key: 'groupName'
    },
    {
      title: t('service.ipCount'),
      key: 'ipCount'
    },
    {
      title: t('service.healthyInstanceCount'),
      key: 'healthyInstanceCount'
    },
    {
      title: t('common.operation'),
      key: 'type',
      render(row) {
        let editButton;
        let removePopconfirm;
        if (webResources.canUpdateService) {
          editButton = (
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() => showUpdate(row)}
            >
              {t('common.edit')}
            </NButton>
          );
          removePopconfirm = (
            <NPopconfirm
              onPositiveClick={() => remove(row)}
              v-slots={removeConfirmSlots}
            >
              <span>
                {template(t('service.confirm_delete_service_action'), {
                  name: row.name,
                  groupName: row.groupName
                })}
              </span>
            </NPopconfirm>
          );
        } else {
          editButton = <span></span>;
          removePopconfirm = editButton;
        }
        return (
          <div>
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() => showInstances(row)}
            >
              {t('service.instance')}
            </NButton>
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() => detail(row)}
            >
              {t('common.detail')}
            </NButton>
            {editButton}
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() => showSubscribers(row)}
            >
              {t('service.subscriber')}
            </NButton>
            {removePopconfirm}
          </div>
        );
      }
    }
  ];
  return columns;
};
