import { NButton, NSwitch, NTag, NPopconfirm } from 'naive-ui';

import { toDatetime } from '@/utils/date';
import { getRoleNameByCode } from '@/data/role';
import { useI18n } from 'vue-i18n'
import template from 'template_js';
export const createColumns = function (showDetail, showUpdate, remove) {
  const { t } = useI18n()
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
      title: t('user.username'),
      key: 'username'
    },
    {
      title: t('user.nickname'),
      key: 'nickname'
    },
    {
      title: t('user.gmtCreate'),
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
      title: t('user.gmtModified'),
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
      title: t('user.roles'),
      key: 'roles',
      render(row) {
        const roleItems = row.roles.map((item) => (
          <NTag type="success">{getRoleNameByCode(item)}</NTag>
        ));
        return <>{roleItems}</>;
      }
    },
    {
      title: t('user.enable'),
      key: 'enable',
      render(row) {
        var v = t("common.yes");
        if (!row.enable) {
          v = t("common.no");
        }
        return <span>{v}</span>;
      }
    },
    {
      title: t('common.operation'),
      key: 'actions',
      render(row) {
        /*
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() => showDetail(row)}
            >
              {t('common.detail')}
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
              {t('common.edit')}
            </NButton>
            <NPopconfirm
              onPositiveClick={() => remove(row)}
              v-slots={removeConfirmSlots}
            >
              <span>{template(t("user.confirm_delete_user_action"),{username:row.username})}</span>
            </NPopconfirm>
          </>
        );
      }
    }
  ];
  return columns;
};
