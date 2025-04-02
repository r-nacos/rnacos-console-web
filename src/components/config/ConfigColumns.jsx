import { NButton, NPopconfirm } from 'naive-ui';
import { toDatetime } from '@/utils/date';
import { useI18n } from 'vue-i18n';
import template from 'template_js';

export const createColumns = function (
  detail,
  showHistory,
  showUpdate,
  showClone,
  remove,
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
      title: t('config.config') + ' ID',
      key: 'dataId'
    },
    {
      title: t('config.config_group'),
      key: 'group'
    },
    {
      title: t('config.desc'),
      key: 'desc'
    },
    {
      title: t('common.operation'),
      key: 'type',
      fixed: 'right',
      width: 120,
      render(row) {
        let editButton;
        let removePopconfirm;
        let cloneButton;
        if (webResources.canUpdateConfig) {
          editButton = (
            <NButton
              size="tiny"
              text
              type="info"
              onClick={() => showUpdate(row)}
            >
              {t('common.edit')}
            </NButton>
          );
          cloneButton = (
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() => showClone(row)}
            >
              {t('common.clone')}
            </NButton>
          );
          removePopconfirm = (
            <NPopconfirm
              onPositiveClick={() => remove(row)}
              v-slots={removeConfirmSlots}
            >
              <span>
                {template(t('config.confirm_delete_config_action'), {
                  group: row.group,
                  dataId: row.dataId
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
              onClick={() => detail(row)}
            >
              {t('common.detail')}
            </NButton>
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() => showHistory(row)}
            >
              {t('common.history')}
            </NButton>
            {editButton}
            {cloneButton}
            {removePopconfirm}
            </div>
        );
      }
    }
  ];
  return columns;
};

export const createHistoryColumns = function (detail, rollback, webResources) {
  const { t } = useI18n();
  const rollbackConfirmSlots = {
    trigger: () => {
      return <NButton size="tiny">{t('common.recover')}</NButton>;
    }
  };

  const columns = [
    {
      title: 'ID',
      key: 'id'
    },
    {
      title: t('config.config') + ' ID',
      key: 'dataId'
    },
    {
      title: t('config.config_group'),
      key: 'group'
    },
    {
      title: t('common.updatedtime'),
      key: 'modifiedTime',
      render(row) {
        var value = '';
        if (row.modifiedTime) {
          var date = new Date(row.modifiedTime);
          value = toDatetime(date);
        }
        return <span>{value}</span>;
      }
    },
    {
      title: t('common.operation'),
      key: 'type',
      fixed: 'right',
      /*
                  <NPopconfirm onPositiveClick={()=>rollback(row)} v-slots={rollbackConfirmSlots} >
                      <span>{template(t("config.confirm_recover_config_action"),{id:row.id})}</span>
                  </NPopconfirm>
      */
      render(row) {
        let rollbackButton;
        if (webResources.canUpdateConfig) {
          rollbackButton = (
            <NButton
              size="tiny"
              quaternary
              type="primary"
              onClick={() => rollback(row)}
            >
              {t('common.recover')}
            </NButton>
          );
        } else {
          rollbackButton = <span></span>;
        }
        return (
          <div class="flex flex-col gap-1">
            <div class="flex gap-2">
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() => detail(row)}
            >
              {t('common.detail')}
            </NButton>
            {rollbackButton}
            </div>
          </div>
        );
      }
    }
  ];
  return columns;
};
