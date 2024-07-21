<template>
  <div class="wrap">
    <div class="header">
      <div class="title">
        <span>用户列表</span>
      </div>
    </div>
    <div class="content-wrap">
      <div class="form-container">
        <div class="query-params">
          <n-form label-placement="left" label-width="auto">
            <div class="paramWrap">
              <n-form-item label="用户名" path="param.username">
                <n-input
                  v-model:value="param.username"
                  placeholder="输入用户名"
                  clearable
                />
              </n-form-item>
            </div>
          </n-form>
          <div class="queryButton">
            <span class="query-button-item">
              <n-button tertiary @click="queryList">查询</n-button>
            </span>
            <span class="query-button-item">
              <n-button type="info" @click="showCreate">新建</n-button>
            </span>
          </div>
        </div>
        <n-data-table
          remote
          ref="table"
          :scroll-x="600"
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
      to="#main_content"
      :block-scroll="false"
      :trap-focus="false"
      v-model:show="useForm"
      default-width="600"
      resizable
    >
      <n-drawer-content :title="getDetailTitle" closable>
        <UserDetail :model="model" />
        <template #footer>
          <n-space align="baseline">
            <n-button text @click="closeForm">返回</n-button>
            <n-button type="primary" @click="submitForm">确认</n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script>
import { ref, reactive, defineComponent } from 'vue';
import { userApi } from '@/api/user';
import * as constant from '@/types/constant';
import { NButton } from 'naive-ui';
import { createColumns } from '@/components/user/UserListColumns';
import UserDetail from '@/pages/UserDetail.vue';
import { getRoleNameByCode, roleOptions } from '@/data/role';

export default defineComponent({
  components: {
    UserDetail
  },
  setup() {
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
        return `总行数: ${itemCount}`;
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
        roleOptions
      };
      useFormRef.value = true;
    };
    const removeItem = (row) => {
      userApi
        .removeUser({ username: row.username })
        .then((res) => {
          if (res.status == 200) {
            window.$message.info('删除成功!');
            useFormRef.value = false;
            doHandlePageChange(1);
            return;
          }
          window.$message.error('操作失败，response code' + res.status);
        })
        .catch((err) => {
          window.$message.error('操作失败' + err.message);
        });
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
          .then((res) => {
            loadingRef.value = false;
            if (res.status == 200) {
              let count = res.data.data.size;
              let pageSize = paginationReactive.pageSize;
              dataRef.value = res.data.data.list;
              paginationReactive.itemCount = count;
              paginationReactive.pageCount = Math.round(
                (count + pageSize - 1) / pageSize
              );
            } else {
              window.$message.error('request err,status code:' + res.status);
              dataRef.value = [];
            }
          })
          .catch((err) => {
            window.$message.error('request err,message' + err.message);
            dataRef.value = [];
            loadingRef.value = false;
          });
      }
    };

    let columns = createColumns(showDetail, showUpdate, removeItem);
    //doHandlePageChange(1);
    return {
      columns,
      data: dataRef,
      pagination: paginationReactive,
      loading: loadingRef,
      param: paramRef,
      useForm: useFormRef,
      model: modelRef,
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
          roles: modelRef.value.roles.join(',')
        };
        if (mode === constant.FORM_MODE_CREATE) {
          userApi
            .addUser(userinfo)
            .then((res) => {
              if (res.status == 200) {
                window.$message.info('操作成功!');
                useFormRef.value = false;
                doHandlePageChange(1);
                return;
              }
              window.$message.error('操作失败，response code' + res.status);
            })
            .catch((err) => {
              window.$message.error('操作失败' + err.message);
            });
        } else {
          userApi
            .updateUser(userinfo)
            .then((res) => {
              if (res.status == 200) {
                window.$message.info('操作成功!');
                useFormRef.value = false;
                doHandlePageChange(1);
                return;
              }
              window.$message.error('操作失败，response code' + res.status);
            })
            .catch((err) => {
              window.$message.error('操作失败' + err.message);
            });
        }
      }
    };
  },

  computed: {
    getDetailTitle() {
      if (this.model.mode === constant.FORM_MODE_UPDATE) {
        return '编辑用户';
      } else if (this.model.mode === constant.FORM_MODE_CREATE) {
        return '新增用户';
      }
      return '用户详情';
    }
  },
  mounted() {
    this.queryList();
  }
});
</script>

<style scoped>
.wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: #efefef;
}

.content-wrap {
  padding: 10px 10px 10px 10px;
  background: #efefef;
}

.form-container {
  display: flex;
  flex-direction: column;
  position: relative;
  background: #ffffff;
  border-radius: 8px;
  padding: 16px 8px;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  border-bottom: #ccc 1px solid;
  background: #fff;
  padding-right: 3px;
}

.title {
  flex: 1 1 auto;
  font: 14/1.25;
  line-height: 30px;
  padding-left: 15px;
}

.header-button {
  flex: 0 0 auto;
}

.namespace {
  flex: 0 0 auto;
}

.query-params {
  flex: 0 0 auto;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-direction: row;
}

.paramWrap {
  display: flex;
  gap: 8px;
  flex-direction: row;
  flex-wrap: wrap;
}

.queryButton {
  display: flex;
  align-items: center;
}

.query-button-item {
  margin-left: 10px;
}
</style>
