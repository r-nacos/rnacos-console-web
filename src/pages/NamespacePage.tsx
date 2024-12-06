import { ref, defineComponent } from 'vue';
import {
  NButton,
  NDataTable,
  NForm,
  NFormItem,
  NInput,
  NSpace,
  NDrawer,
  NDrawerContent,
  NTag,
  NPopconfirm
} from 'naive-ui';
import { Close } from '@vicons/ionicons5';
import namespaceApi from '@/api/namespace';
//import {createColumns} from '../components/namespace/NamespaceColumns'
//import NamespacePopSelect from '../components/namespace/NamespacePopSelect.vue';
import { useWebResources } from '@/data/resources';
import { namespaceStore } from '../data/namespace';
import { IHandeNamespace, INamespace } from '@/types/namespace';
import styles from './NamespacePage.module.css';
import template from 'template_js';

import type { FormItemRule } from 'naive-ui';
import type { IColumn, MyWindow } from '@/types/base';
import { useI18n } from 'vue-i18n';

declare var window: MyWindow;

const removeConfirmSlots = {
  trigger: () => {
    const { t } = useI18n();
    return (
      <NButton size="tiny" quaternary type="error">
        {t('common.delete')}
      </NButton>
    );
  }
};

export const createColumns = function (
  showUpdate: IHandeNamespace,
  remove: IHandeNamespace,
  webResources: { canUpdateNamespace: boolean }
): IColumn[] {
  const { t } = useI18n();
  const columns = [
    {
      title: t('namespace.namespaceName'),
      key: 'namespaceName'
    },
    {
      title: t('namespace.namespaceId'),
      key: 'namespaceId'
    }
  ];
  let optColumn = {
    title: t('common.operation'),
    key: 'type',
    fixed: 'right',
    render(row: INamespace) {
      const { t } = useI18n();
      if (row.namespaceId === '') {
        return (
          <NTag size="small" type="info">
            {t('namespace.retain_space')}
          </NTag>
        );
      }
      return (
        <div>
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
              {template(t('namespace.confirm_delete_info'), {
                name: row.namespaceName,
                id: row.namespaceId
              })}
            </span>
          </NPopconfirm>
        </div>
      );
    }
  };
  if (webResources.canUpdateNamespace) {
    columns.push(optColumn);
  }
  return columns;
};

/*
const columns = [
    {
        title:'命名空间名称',
        key:'namespaceName'
    },
    {
        title:'命名空间ID',
        key:'namespaceId'
    },
    {
        title:'操作',
        key:'type',
        render (row) {
            return h(
            NButton,
            {
                strong: true,
                tertiary: true,
                size: 'small',
                onClick: () => window.$message.info(row.namespaceName)
            },
            { default: () => 'Play' }
            )
        }
    },
]
*/

export default defineComponent({
  name: 'NamespacePage',
  components: {
    Close
    //NamespacePopSelect,
  },
  setup() {
    let webResources = useWebResources();
    const dataRef = ref([
      {
        namespaceId: '',
        namespaceName: 'public',
        type: '0'
      }
    ]);
    const loadingRef = ref(false);
    const useFormRef = ref(false);
    const modelRef = ref({
      namespaceId: '',
      namespaceName: '',
      mode: ''
    });
    const rules = {
      namespaceId: [
        {
          required: false,
          trigger: ['input', 'blur']
        }
      ],

      namespaceName: [
        {
          required: true,
          validator(rule: FormItemRule, value: string) {
            if (!value) {
              return new Error('需要输入名称');
            }
            return true;
          },
          trigger: ['input', 'blur']
        }
      ]
    };
    const showUpdate = function (row: INamespace) {
      modelRef.value = {
        namespaceId: row.namespaceId,
        namespaceName: row.namespaceName,
        mode: 'update'
      };
      useFormRef.value = true;
    };
    const doLoadNamespace = function () {
      namespaceApi
        .queryList()
        .then((res) => {
          if (res.status == 200) {
            dataRef.value = res.data.data;
            namespaceStore.setLastList(res.data.data);
          } else {
            window.$message.error('request err,status code:' + res.status);
          }
        })
        .catch((err) => {
          window.$message.error(err.message);
        });
    };
    const removeItem = function (row: INamespace) {
      namespaceApi
        .delete(row)
        .then((res) => {
          if (res.status == 200) {
            if (res.data.code == 200) {
              doLoadNamespace();
            } else {
              window.$message.error('操作失败: ' + res.data.message);
            }
          } else {
            window.$message.error('操作失败，response code: ' + res.status);
          }
        })
        .catch((err) => {
          window.$message.error('操作失败: ' + err.message);
        });
    };
    const columns: IColumn[] = createColumns(
      showUpdate,
      removeItem,
      webResources
    );
    return {
      useForm: useFormRef,
      columns,
      webResources,
      data: dataRef,
      model: modelRef,
      pagination: {
        pageSize: 20
      },
      loading: loadingRef,
      rules,
      rowKey(rowData: INamespace) {
        return rowData.namespaceId;
      },
      doLoadNamespace,
      showCreate() {
        modelRef.value = {
          namespaceId: '',
          namespaceName: '',
          mode: 'add'
        };
        useFormRef.value = true;
      },
      closeForm() {
        useFormRef.value = false;
      }
    };
  },
  methods: {
    loadNamespace() {
      this.doLoadNamespace();
    },
    create() {
      this.doCreate();
    },
    submit() {
      if (this.model.mode === 'add') {
        this.doCreate();
      } else {
        this.doUpdate();
      }
    },
    doCreate() {
      namespaceApi
        .add(this.model)
        .then((res) => {
          if (res.status == 200) {
            if (res.data.code == 200) {
              this.closeForm();
              this.doLoadNamespace();
            } else {
              window.$message.error(res.data.message);
            }
          } else {
            window.$message.error('request err,status code:' + res.status);
          }
        })
        .catch((err) => {
          window.$message.error(err.message);
        });
    },
    doUpdate() {
      namespaceApi
        .update(this.model)
        .then((res) => {
          if (res.status == 200) {
            if (res.data.code == 200) {
              this.closeForm();
              this.doLoadNamespace();
            } else {
              window.$message.error(res.data.message);
            }
          } else {
            window.$message.error('request err,status code:' + res.status);
          }
        })
        .catch((err) => {
          window.$message.error(err.message);
        });
    }
  },
  created() {
    this.loadNamespace();
  },
  render() {
    const { t } = useI18n();
    let createButton;
    if (this.webResources.canUpdateNamespace) {
      createButton = (
        <NButton
          onClick={() => {
            this.showCreate();
          }}
        >
          {t('namespace.new_namespace')}
        </NButton>
      );
    } else {
      createButton = <span></span>;
    }
    return (
      <div id="wrap" class="wrap">
        <div class={styles.ops}>
          <div class={styles.opsTitle}>
            <span>{t('namespace.namespace')}</span>
          </div>
          <NSpace class={styles.opsButton} size={3}>
            {createButton}
            <NButton
              onClick={() => {
                this.loadNamespace();
              }}
            >
              {t('common.refresh')}
            </NButton>
          </NSpace>
        </div>
        <div class={styles.container}>
          <div class={styles.innerContainer}>
            <div class="data clear">
              <NDataTable
                remote
                ref="table"
                scrollX={600}
                bordered={false}
                columns={this.columns}
                data={this.data}
                loading={this.loading}
                //pagination={this.pagination}
                row-key={this.rowKey}
              />
            </div>
          </div>
        </div>
        <NDrawer
          to="#main_content"
          trapFocus={false}
          blockScroll={false}
          v-model:show={this.useForm}
          defaultWidth={600}
          resizable
        >
          <NDrawerContent
            title={
              this.model.mode == 'add'
                ? t('namespace.add_namespace')
                : t('namespace.edit_namespace')
            }
            closable
          >
            {{
              default: () => (
                <div class={styles.subContent}>
                  <NForm model={this.model} rules={this.rules}>
                    <NFormItem
                      path="namespaceId"
                      label={t('namespace.namespaceId')}
                    >
                      <NInput
                        value={this.model.namespaceId}
                        placeholder={t('namespace.namespaceId_or')}
                        disabled={this.model.mode == 'update'}
                        onUpdateValue={(v) => (this.model.namespaceId = v)}
                      />
                    </NFormItem>
                    <NFormItem
                      path="namespaceName"
                      label={t('namespace.namespaceName')}
                    >
                      <NInput
                        value={this.model.namespaceName}
                        onUpdateValue={(v) => (this.model.namespaceName = v)}
                      />
                    </NFormItem>
                  </NForm>
                </div>
              ),
              footer: () => (
                <NSpace align="baseline">
                  <NButton text onClick={() => this.closeForm()}>
                    {t('common.return')}
                  </NButton>
                  <NButton type="primary" onClick={() => this.submit()}>
                    {t('common.confirm')}
                  </NButton>
                </NSpace>
              )
            }}
          </NDrawerContent>
        </NDrawer>
      </div>
    );
  }
});
