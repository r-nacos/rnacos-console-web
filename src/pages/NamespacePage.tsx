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
  NTag
} from 'naive-ui';
import { Close } from '@vicons/ionicons5';
import namespaceApi from '@/api/namespace';
//import {createColumns} from '../components/namespace/NamespaceColumns'
//import NamespacePopSelect from '../components/namespace/NamespacePopSelect.vue';
import { useWebResources } from '@/data/resources';
import { namespaceStore } from '../data/namespace';
import { IHandeNamespace, INamespace } from '@/types/namespace';
import styles from './NamespacePage.module.css';

import type { FormItemRule } from 'naive-ui';
import type { IColumn, MyWindow } from '@/types/base';

declare var window: MyWindow;

export const createColumns = function (
  showUpdate: IHandeNamespace,
  remove: IHandeNamespace,
  webResources: { canUpdateNamespace: boolean }
): IColumn[] {
  const columns = [
    {
      title: '命名空间名称',
      key: 'namespaceName'
    },
    {
      title: '命名空间ID',
      key: 'namespaceId'
    }
  ];
  let optColumn = {
    title: '操作',
    key: 'type',
    fixed: 'right',
    render(row: INamespace) {
      if (row.namespaceId === '') {
        return (
          <NTag size="small" type="info">
            保留空间
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
            编辑
          </NButton>
          <NButton
            size="tiny"
            quaternary
            type="error"
            onClick={() => remove(row)}
          >
            删除
          </NButton>
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
          required: true,
          validator(rule: FormItemRule, value: string) {
            if (!value) {
              return new Error('需要输入ID');
            }
            return true;
          },
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
              window.$message.error(res.data.message);
            }
          } else {
            window.$message.error('request err,status code:' + res.status);
          }
        })
        .catch((err) => {
          window.$message.error(err.message);
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
        pageSize: 5
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
    let createButton;
    if (this.webResources.canUpdateNamespace) {
      createButton = (
        <NButton
          onClick={() => {
            this.showCreate();
          }}
        >
          创建命名空间
        </NButton>
      );
    } else {
      createButton = <span></span>;
    }
    return (
      <div id="wrap" class="wrap">
        <div class={styles.ops}>
          <div class={styles.opsTitle}>
            <span>命名空间</span>
          </div>
          <NSpace class={styles.opsButton} size={3}>
            {createButton}
            <NButton
              onClick={() => {
                this.loadNamespace();
              }}
            >
              刷新
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
                pagination={this.pagination}
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
            title={this.model.mode == 'add' ? '新增命名空间' : '修改命名空间'}
            closable
          >
            {{
              default: () => (
                <div class={styles.subContent}>
                  <NForm model={this.model} rules={this.rules}>
                    <NFormItem path="namespaceName" label="命名空间名称">
                      <NInput
                        value={this.model.namespaceName}
                        onUpdateValue={(v) => (this.model.namespaceName = v)}
                      />
                    </NFormItem>
                    <NFormItem path="namespaceId" label="命名空间Id">
                      <NInput
                        value={this.model.namespaceId}
                        onUpdateValue={(v) => (this.model.namespaceId = v)}
                      />
                    </NFormItem>
                  </NForm>
                </div>
              ),
              footer: () => (
                <NSpace align="baseline">
                  <NButton text onClick={() => this.closeForm()}>
                    返回
                  </NButton>
                  <NButton type="primary" onClick={() => this.submit()}>
                    确认
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
