<template>
  <div class="relative">
    <div class="flex flex-row items-center border-b h-[40px] border-gray-300 bg-white pr-3">
      <div class="flex-1 text-sm leading-[30px] pl-4 truncate">
        <span>{{ this.$t('namespace.namespace') }}</span>
      </div>
      <div class="flex items-center gap-4">
        <n-button
            v-if="webResources.canUpdateNamespace"
            type="info"
            @click="showCreate"
          >
            {{ $t('namespace.new_namespace') }}
          </n-button>
          <n-button tertiary @click="doLoadNamespace">
            {{ $t('common.refresh') }}
          </n-button>
      </div>
    </div>

    <div class="m-2">
      <div class="flex flex-col relative bg-white rounded-lg p-4">
        <n-data-table
          remote
          ref="table"
          :scroll-x="600"
          :bordered="false"
          :columns="columns"
          :data="data"
          :loading="loading"
          :row-key="rowKey"
        />
      </div>
    </div>
    <n-drawer
      :block-scroll="false"
      :trap-focus="false"
      v-model:show="useForm"
      :width="isMobile ? '100%' : 600"
      placement="right"
      :show-mask="true"
      :mask-closable="true"
      :close-on-esc="true"
      resizable
    >
      <n-drawer-content :title="getDetailTitle" closable>
        <n-form
          :model="model"
          :rules="rules"
          label-placement="left"
          label-width="90"
        >
          <n-form-item :label="$t('namespace.namespaceId')" path="namespaceId">
            <n-input
              v-model:value="model.namespaceId"
              :placeholder="$t('namespace.namespaceId_or')"
              :disabled="model.mode === 'update'"
            />
          </n-form-item>
          <n-form-item
            :label="$t('namespace.namespaceName')"
            path="namespaceName"
          >
            <n-input v-model:value="model.namespaceName" />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space align="baseline">
            <n-button text @click="closeForm">{{
              $t('common.return')
            }}</n-button>
            <n-button type="primary" @click="submit">{{
              $t('common.confirm')
            }}</n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
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
import { useWebResources } from '@/data/resources';
import { namespaceStore } from '@/data/namespace';
import { template } from '@/utils/utils';
import { useI18n } from 'vue-i18n';
import { useProjectSettingStore } from '@/store/modules/projectSetting';
import {
  handleApiResult,
  printApiError,
  printApiSuccess
} from '@/utils/request';

const { t } = useI18n();
const projectSettingStore = useProjectSettingStore();
const webResources = useWebResources();
const data = ref([]);
const loading = ref(false);
const useForm = ref(false);
const model = ref({
  namespaceId: '',
  namespaceName: '',
  mode: ''
});

const isMobile = computed(() => {
  return projectSettingStore.isMobile;
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
      validator(rule, value) {
        if (!value) {
          return new Error(t('namespace.required_name'));
        }
        return true;
      },
      trigger: ['input', 'blur']
    }
  ]
};

const showUpdate = (row) => {
  model.value = {
    namespaceId: row.namespaceId,
    namespaceName: row.namespaceName,
    mode: 'update'
  };
  useForm.value = true;
};

const doLoadNamespace = () => {
  loading.value = true;
  namespaceApi
    .queryList()
    .then(handleApiResult)
    .then((list) => {
      const value = list || [];
      data.value = value;
      namespaceStore.setLastList(value);
    })
    .catch(printApiError)
    .finally(() => {
      loading.value = false;
    });
};

const removeItem = (row) => {
  namespaceApi
    .delete(row)
    .then(handleApiResult)
    .then(() => {
      doLoadNamespace();
    })
    .catch(printApiError);
};

const columns = [
  {
    title: t('namespace.namespaceName'),
    key: 'namespaceName'
  },
  {
    title: t('namespace.namespaceId'),
    key: 'namespaceId'
  },
  {
    title: t('common.operation'),
    key: 'type',
    fixed: 'right',
    render(row) {
      if (row.namespaceId === '') {
        return h(NTag, { size: 'small', type: 'info' }, () =>
          t('namespace.retain_space')
        );
      }
      return h('div', null, [
        h(
          NButton,
          {
            size: 'tiny',
            quaternary: true,
            type: 'info',
            onClick: () => showUpdate(row)
          },
          () => t('common.edit')
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => removeItem(row)
          },
          {
            trigger: () =>
              h(
                NButton,
                {
                  size: 'tiny',
                  quaternary: true,
                  type: 'error'
                },
                () => t('common.delete')
              ),
            default: () =>
              template(t('namespace.confirm_delete_info'), {
                name: row.namespaceName,
                id: row.namespaceId
              })
          }
        )
      ]);
    }
  }
];

const showCreate = () => {
  model.value = {
    namespaceId: '',
    namespaceName: '',
    mode: 'add'
  };
  useForm.value = true;
};

const closeForm = () => {
  useForm.value = false;
};

const doCreate = () => {
  namespaceApi
    .add(model.value)
    .then(handleApiResult)
    .then(printApiSuccess)
    .then(() => {
      closeForm();
      doLoadNamespace();
    })
    .catch(printApiError);
};

const doUpdate = () => {
  namespaceApi
    .update(model.value)
    .then(handleApiResult)
    .then(printApiSuccess)
    .then(() => {
      closeForm();
      doLoadNamespace();
    })
    .catch(printApiError);
};

const submit = () => {
  if (model.value.mode === 'add') {
    doCreate();
  } else {
    doUpdate();
  }
};

const getDetailTitle = computed(() => {
  if (model.value.mode === 'add') {
    return t('namespace.add_namespace');
  } else {
    return t('namespace.edit_namespace');
  }
});

const rowKey = (rowData) => {
  return rowData.namespaceId;
};

// 初始化加载
doLoadNamespace();
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .n-drawer {
    width: 100% !important;
  }

  .n-drawer-content {
    padding: 16px;
  }

  .n-form-item {
    margin-bottom: 16px;
  }

  .n-form-item-label {
    width: 100% !important;
    text-align: left;
  }
}
</style>
