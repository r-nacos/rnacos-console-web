import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';
import { userApi } from '@/api/user';
import { useWebResources } from '@/data/resources';

export function useOAuth2() {
  const { t } = useI18n();
  const router = useRouter();
  const route = useRoute();
  const webResources = useWebResources();
  window.$message = useMessage();

  const oauth2_enable = ref(false);
  const oauth2_button = ref('');
  const oauth2_authorize_url = ref('');
  const oauth2_loading = ref(false);

  const loadLoginConfig = () => {
    userApi.getLoginConfig().then((res) => {
      if (res.status == 200 && res.data && res.data.success && res.data.data) {
        const config = res.data.data;
        oauth2_enable.value = config.oauth2Enable || false;
        oauth2_button.value = config.oauth2Button || 'OAuth2 Login';
        oauth2_authorize_url.value = config.oauth2AuthorizeUrl || '';
      }
    }).catch((e) => {
      console.error(e);
    });
  };

  const handleOAuth2Callback = () => {
    const query = route.query;
    const isOAuth2Callback = !!query.code;
    
    if (isOAuth2Callback) {
      oauth2_loading.value = true;
      userApi.oauth2Login(query.code as string, query.state as string | undefined).then((res) => {
        if (res.status == 200 && res.data && res.data.success) {
          userApi.getUserWebResources().then((res) => {
            if (res.status == 200 && res.data && res.data.success && res.data.data) {
              webResources.update(res.data.data);
              const cleanRedirect = (query.redirect_url as string) || '/';
              if (cleanRedirect == '/') {
                router.push(cleanRedirect);
              } else {
                location.href = cleanRedirect;
              }
            }
          });
        } else {
          oauth2_loading.value = false;
          const errorMsg = res.data?.message || t('login.OAUTH2_AUTH_ERROR');
          if (window.$message) {
            window.$message.error(errorMsg);
          }
        }
      }).catch((err) => {
        oauth2_loading.value = false;
        const errorMsg = err.response?.data?.message || err.message || t('login.OAUTH2_AUTH_ERROR');
        if (window.$message) {
          window.$message.error(errorMsg);
        }
      });
      return true;
    }
    return false;
  };

  return {
    oauth2_enable,
    oauth2_button,
    oauth2_authorize_url,
    oauth2_loading,
    loadLoginConfig,
    handleOAuth2Callback
  };
}

