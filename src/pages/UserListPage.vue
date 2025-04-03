<template>
  <div class="relative w-full h-full bg-gray-100">
    <div
      class="flex flex-row items-center h-10 border-b border-gray-300 bg-white pr-3"
    >
      <div class="flex-1 text-sm leading-[30px] pl-4">
        <span>{{ this.$t('user.list') }}</span>
      </div>
    </div>
    <div class="p-2.5 bg-gray-100">
      <div class="flex flex-col relative bg-white rounded-lg p-4">
        <n-card :bordered="false">
          <n-form label-placement="left" label-width="90">
            <n-grid cols="1 s:1 m:2 l:3 xl:3 2xl:4" responsive="screen">
              <n-gi>
                <n-form-item
                  :label="this.$t('user.username')"
                  path="param.username"
                >
                  <n-input
                    v-model:value="param.username"
                    :placeholder="
                      this.$t('common.preInput') + this.$t('user.username')
                    "
                    clearable
                    @keydown.enter.prevent
                    @keyup.enter="queryList"
                  />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-space justify="end" class="ml-2">
                  <n-button tertiary @click="queryList">{{
                    this.$t('common.query')
                  }}</n-button>
                  <n-button type="info" @click="showCreate">{{
                    this.$t('common.add')
                  }}</n-button>
                </n-space>
              </n-gi>
            </n-grid>
          </n-form>
        </n-card>
        <n-data-table
          remote
          ref="table"
          :scroll-x="1000"
          :bordered="false"
          :columns="columns"
          :data="data"
          :loading="loading"
          :pagination="pagination"
          :row-key="rowKey"
          @update:page="handlePageChange"
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
        <UserDetail :model="model" :namespaceOptions="namespaceOptions" />
        <template #footer>
          <n-space align="baseline">
            <n-button text @click="closeForm">{{
              this.$t('common.return')
            }}</n-button>
            <n-button type="primary" @click="submitForm">{{
              this.$t('common.confirm')
            }}</n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script>
import { ref, reactive, defineComponent, computed } from 'vue';
import { userApi } from '@/api/user';
import * as constant from '@/types/constant';
import { NButton } from 'naive-ui';
import {
  createColumns,
  defaultNamespacePrivilege
} from '@/components/user/UserListColumns';
import UserDetail from '@/pages/UserDetail.vue';
import { roleOptions } from '@/data/role';
import { useI18n } from 'vue-i18n';
import { namespaceStore } from '@/data/namespace';
import {
  handleApiResult,
  printApiError,
  printApiSuccess
} from '@/utils/request';
import { useProjectSettingStore } from '@/store/modules/projectSetting';

export default defineComponent({
  components: {
    UserDetail
  },
  setup() {
    const { t } = useI18n();
    const dataRef = ref([]);
    const loadingRef = ref(false);
    const paramRef = ref({
      username: '',
      pageNo: 1,
      pageSize: 20
    });
    const paginationReactive = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      itemCount: 0,
      showSizePicker: true,
      pageSizes: [10, 20, 50, 100],
      onUpdatePageSize: (pageSize) => {
        paginationReactive.pageSize = pageSize;
        paginationReactive.page = 1;
        doHandlePageChange(1);
      },
      prefix({ itemCount }) {
        return t('common.total') + `: ${itemCount}`;
      }
    });
    const useFormRef = ref(false);
    const modelRef = ref({
      mode: '',
      username: '',
      nickname: '',
      password: null,
      gmtCreate: null,
      gmtModified: null,
      enable: true,
      roles: [],
      namespacePrivilege: { ...defaultNamespacePrivilege },
      roleOptions
    });
    const showUpdate = (row) => {
      //console.log('showUpdate', row);
      modelRef.value = {
        mode: constant.FORM_MODE_UPDATE,
        username: row.username,
        nickname: row.nickname,
        password: null,
        enable: row.enable,
        roles: row.roles,
        namespacePrivilege: row.namespacePrivilege || {
          ...defaultNamespacePrivilege
        },
        roleOptions
      };
      useFormRef.value = true;
    };
    const showDetail = (row) => {
      modelRef.value = {
        mode: constant.FORM_MODE_DETAIL,
        username: row.username,
        nickname: row.nickname,
        password: null,
        enable: row.enable,
        roles: row.roles,
        namespacePrivilege: row.namespacePrivilege || {
          ...defaultNamespacePrivilege
        },
        roleOptions
      };
      useFormRef.value = true;
    };
    const removeItem = (row) => {
      userApi
        .removeUser({ username: row.username })
        .then(handleApiResult)
        .then(printApiSuccess)
        .then(() => {
          useFormRef.value = false;
          doHandlePageChange(1);
        })
        .catch(printApiError);
    };
    const showCreate = () => {
      modelRef.value = {
        mode: constant.FORM_MODE_CREATE,
        username: '',
        nickname: '',
        password: null,
        gmtCreate: null,
        gmtModified: null,
        enable: true,
        roles: [],
        namespacePrivilege: { ...defaultNamespacePrivilege },
        roleOptions
      };
      useFormRef.value = true;
    };

    const doQueryList = () => {
      return userApi.getUserList({
        likeUsername: paramRef.value.username,
        pageNo: paginationReactive.page,
        pageSize: paginationReactive.pageSize
      });
    };

    const doHandlePageChange = (currentPage) => {
      paginationReactive.page = currentPage;
      if (!loadingRef.value) {
        loadingRef.value = true;
        doQueryList()
          .then(handleApiResult)
          .then((page) => {
            loadingRef.value = false;
            let count = page.totalCount;
            let pageSize = paginationReactive.pageSize;
            dataRef.value = page.list;
            paginationReactive.itemCount = count;
            paginationReactive.pageCount = Math.round(
              (count + pageSize - 1) / pageSize
            );
          })
          .catch((err) => {
            printApiError(err);
            dataRef.value = [];
            loadingRef.value = false;
          });
      }
    };

    let columns = createColumns(showDetail, showUpdate, removeItem);
    //doHandlePageChange(1);
    const projectSettingStore = useProjectSettingStore();

    return {
      columns,
      data: dataRef,
      pagination: paginationReactive,
      loading: loadingRef,
      param: paramRef,
      useForm: useFormRef,
      model: modelRef,
      namespaceOptions: namespaceStore.optionList,
      rowKey(rowData) {
        return rowData.groupName + '@@' + rowData.name;
      },
      doHandlePageChange,
      showCreate,
      handlePageChange: doHandlePageChange,
      queryList() {
        doHandlePageChange(1);
      },
      closeForm() {
        useFormRef.value = false;
      },
      submitForm() {
        let mode = modelRef.value.mode;
        if (mode === constant.FORM_MODE_DETAIL) {
          useFormRef.value = false;
          return;
        }
        let userinfo = {
          username: modelRef.value.username,
          nickname: modelRef.value.nickname,
          password: modelRef.value.password,
          enable: modelRef.value.enable,
          namespacePrivilegeParam: modelRef.value.namespacePrivilege,
          roles: modelRef.value.roles.join(',')
        };
        if (mode === constant.FORM_MODE_CREATE) {
          userApi
            .addUser(userinfo)
            .then(handleApiResult)
            .then(printApiSuccess)
            .then(() => {
              useFormRef.value = false;
              doHandlePageChange(1);
            })
            .catch(printApiError);
        } else {
          userApi
            .updateUser(userinfo)
            .then(handleApiResult)
            .then(printApiSuccess)
            .then(() => {
              useFormRef.value = false;
              doHandlePageChange(1);
            })
            .catch(printApiError);
        }
      },
      isMobile: computed(() => projectSettingStore.getIsMobile)
    };
  },

  computed: {
    getDetailTitle() {
      if (this.model.mode === constant.FORM_MODE_UPDATE) {
        return this.$t('common.edit') + this.$t('user.name');
      } else if (this.model.mode === constant.FORM_MODE_CREATE) {
        return this.$t('common.add') + this.$t('user.name');
      }
      return this.$t('user.name');
    }
  },
  mounted() {
    namespaceStore.initLoad();
    this.queryList();
  }
});
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
</style>
