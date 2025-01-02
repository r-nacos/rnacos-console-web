import { useI18n } from 'vue-i18n';
export const createColumns = function (
) {
  const { t } = useI18n();

  const columns = [
    {
      title: t('service.name'),
      key: 'serviceName'
    },
    {
      title: t('service.groupName'),
      key: 'groupName'
    },
    {
      title: t('client.address'),
      key: 'address',
      render(row) {
        return `${row.ip}:${row.port}`;
      },
    },
  ];
  return columns;
};
