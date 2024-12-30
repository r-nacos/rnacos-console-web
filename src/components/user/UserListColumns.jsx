import { NButton, NSwitch, NTag, NPopconfirm } from 'naive-ui';

import { toDatetime } from '@/utils/date';
import { arrayCount } from '@/utils/utils.js';
import { getRoleNameByCode } from '@/data/role';
import { useI18n } from 'vue-i18n';
import template from 'template_js';
export const defaultNamespacePrivilege = {
  enabled: true,
  whitelistIsAll: true,
  whitelist: null,
  blacklistIsAll: false,
  blacklist: null
};

export const createColumns = function (showDetail, showUpdate, remove) {
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
        var v = t('common.yes');
        if (!row.enable) {
          v = t('common.no');
        }
        return <span>{v}</span>;
      }
    },
    {
      title: t('menu.namespace') + t('common.join') + t('common.whitelist'),
      key: 'namespaceWhitelist',
      render(row) {
        let namespacePrivilege =
          row.namespacePrivilege || defaultNamespacePrivilege;
        let v = t('common.all');
        if (namespacePrivilege.enabled && !namespacePrivilege.whitelistIsAll) {
          v =
            t('common.part') +
            '(' +
            arrayCount(namespacePrivilege.whitelist) +
            ')';
        }
        return <span>{v}</span>;
      }
    },
    {
      title: t('menu.namespace') + t('common.join') + t('common.blacklist'),
      key: 'namespaceBlacklist',
      render(row) {
        let namespacePrivilege =
          row.namespacePrivilege || defaultNamespacePrivilege;
        var v =
          t('common.part') +
          '(' +
          arrayCount(namespacePrivilege.blacklist) +
          ')';
        if (namespacePrivilege.enabled && namespacePrivilege.blacklistIsAll) {
          v = t('common.all');
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
              <span>
                {template(t('user.confirm_delete_user_action'), {
                  username: row.username
                })}
              </span>
            </NPopconfirm>
          </>
        );
      }
    }
  ];
  return columns;
};
