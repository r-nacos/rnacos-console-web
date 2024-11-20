import { NButton, NSwitch } from 'naive-ui';
import { useI18n } from 'vue-i18n'
/*
let slots ={
  "checked":()=> {
    return <span>上线</span>
  },
  "unchecked":()=> {
    return <span>下线</span>
  },
};
*/

export const createColumns = function (
  showUpdate,
  onLine,
  offLine,
  webResources
) {
  const { t } = useI18n()
  const columns = [
    {
      title: 'IP',
      key: 'ip'
    },
    {
      title: t("instance.port"),
      key: 'port'
    },
    {
      title: t("instance.ephemeral"),
      key: 'ephemeral',
      render(row) {
        return <span>{row.ephemeral.toString()}</span>;
      }
    },
    {
      title: t("instance.weight"),
      key: 'weight'
    },
    {
      title: t("instance.healthy"),
      key: 'healthy',
      render(row) {
        return <span>{row.healthy.toString()}</span>;
      }
    },
    {
      title: t("instance.metadata"),
      key: 'metadata',
      width: 200,
      render(row) {
        return <span>{JSON.stringify(row.metadata)}</span>;
      }
    }
  ];
  let optColumn = {
    title: t("common.operation"),
    key: '_type',
    fixed: 'right',
    render(row) {
      const onOffLine = () => {
        // v-slots={slots}
        return (
          <NSwitch
            size="small"
            default-value={row.enabled}
            onUpdateValue={(enabled) => {
              if (enabled == row.enabled) {
                //操作中
                return;
              }
              if (enabled) {
                onLine(row);
              } else {
                offLine(row);
              }
            }}
          />
        );
      };
      return (
        <div>
          <span style={{ 'padding-right': '5px' }}>{onOffLine()}</span>
          <NButton
            size="tiny"
            type="info"
            quaternary
            onClick={() => showUpdate(row)}
          >
            {t("common.edit")}
          </NButton>
        </div>
      );
    }
  };
  if (webResources.canUpdateService) {
    columns.push(optColumn);
  }
  return columns;
};
