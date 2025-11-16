import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';
import { userApi } from '@/api/user';
import { useWebResources } from '@/data/resources';
import { encryptAes } from '@/utils/CryptoUtils';

export function useLogin() {
  const { t } = useI18n();
  const router = useRouter();
  const route = useRoute();
  const webResources = useWebResources();
  window.$message = useMessage();

  const redirect_url = ref((route.query.redirect_url as string) || '/');

  const modelRef = reactive({
    username: null as string | null,
    password: null as string | null,
    captcha: null as string | null,
    token: ''
  });

  const rules = {
    username: [
      {
        required: true,
        validator(rule: any, value: string) {
          if (!value) {
            return new Error(t('login.need_username'));
          }
          return true;
        },
        trigger: ['input', 'blur']
      }
    ],
    password: [
      {
        required: true,
        validator(rule: any, value: string) {
          if (!value) {
            return new Error(t('login.need_password'));
          }
          return true;
        },
        trigger: ['input', 'blur']
      }
    ],
    captcha: [
      {
        required: true,
        validator(rule: any, value: string) {
          if (!value) {
            return new Error(t('login.need_captcha'));
          }
          return true;
        },
        trigger: ['input', 'blur']
      }
    ]
  };

  const handleLoginSuccess = () => {
    userApi.getUserWebResources().then((res) => {
      if (res.status == 200 && res.data && res.data.success) {
        if (res.data.data) {
          webResources.update(res.data.data);
        }
        const cleanRedirect = redirect_url.value;
        if (cleanRedirect == '/') {
          router.push(cleanRedirect);
        } else {
          location.href = cleanRedirect;
        }
      }
    });
  };

  const handleLoginError = (res: any, genCaptcha: () => void) => {
    genCaptcha();
    if (res.data.code === 'USER_CHECK_ERROR') {
      window?.$message?.error(t('login.USER_CHECK_ERROR'));
    } else if (res.data.code === 'CAPTCHA_CHECK_ERROR') {
      window?.$message?.error(t('login.CAPTCHA_CHECK_ERROR'));
    } else if (res.data.code === 'LOGIN_LIMITE_ERROR') {
      window?.$message?.error(t('login.LOGIN_LIMITE_ERROR'));
    } else {
      window?.$message?.error(t('login.LOGIN_UNKNOWN_ERROR'));
    }
  };

  const submit = (genCaptcha: () => void) => {
    let password = modelRef.password || '';
    if (modelRef.token.length >= 32) {
      password = encryptAes(
        modelRef.token.substring(0, 16),
        modelRef.token.substring(16, 32),
        modelRef.password || ''
      );
    }
    const param = {
      username: modelRef.username || '',
      password: password,
      captcha: modelRef.captcha || ''
    };
    userApi
      .login(param)
      .then((res) => {
        if (res.status == 200) {
          if (res.data.success) {
            handleLoginSuccess();
            return;
          } else {
            handleLoginError(res, genCaptcha);
          }
        } else {
          genCaptcha();
          window?.$message?.error(
            t('common.request_fail') + '，response code' + res.status
          );
        }
      })
      .catch((err) => {
        genCaptcha();
        window?.$message?.error(t('common.request_fail') + '，' + err.message);
      });
  };

  return {
    modelRef,
    rules,
    submit
  };
}
