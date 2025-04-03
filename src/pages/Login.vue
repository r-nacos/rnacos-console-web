<template>
  <div class="min-h-screen w-full bg-gray-100 flex items-center justify-center">
    <div class="w-full max-w-md mx-4">
      <div
        class="h-[52px] leading-[52px] text-center rounded-t-lg bg-blue-500 text-white"
      >
        <span>R-NACOS {{ this.$t('login.login') }}</span>
      </div>
      <n-form
        class="border border-gray-300 p-5 pb-6 bg-white rounded-b-lg shadow-lg"
        ref="formRef"
        :model="model"
        :rules="rules"
      >
        <n-form-item path="username" :label="this.$t('user.username')">
          <n-input
            :placeholder="this.$t('user.username')"
            v-model:value="model.username"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item path="password" :label="this.$t('login.password')">
          <n-input
            :placeholder="this.$t('login.password')"
            type="password"
            v-model:value="model.password"
            @keydown.enter="captcha_visible ? $event.preventDefault() : null"
            @keyup.enter="!captcha_visible ? submit() : null"
          />
        </n-form-item>
        <div v-if="captcha_visible" class="w-full inline-flex flex-row">
          <div class="flex-1">
            <n-form-item path="captcha" :label="this.$t('login.captcha')">
              <n-input
                :placeholder="this.$t('login.captcha')"
                type="captcha"
                v-model:value="model.captcha"
                @keydown.enter.prevent
                @keyup.enter="submit"
              />
            </n-form-item>
          </div>
          <div class="flex-none pl-0.5">
            <img
              :src="captcha_img"
              height="60"
              class="m-0 p-0 cursor-pointer h-20"
              @click="gen_captcha"
            />
          </div>
        </div>
        <div>
          <button
            class="h-[34px] w-full text-sm leading-[14px] bg-blue-500 text-white border-0 rounded cursor-pointer hover:bg-blue-600 transition-colors duration-200"
            @click="submit"
          >
            {{ this.$t('login.login') }}
          </button>
        </div>
      </n-form>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { useWebResources } from '@/data/resources';
import { useMessage } from 'naive-ui';
import { userApi } from '@/api/user';
import { useRoute } from 'vue-router';
import { encryptAes } from '@/utils/CryptoUtils';
import router from '@/route/router.js';
import { useI18n } from 'vue-i18n';
export default defineComponent({
  setup() {
    const { t } = useI18n();
    const webResources = useWebResources();
    window.$message = useMessage();
    let route = useRoute();
    let query = route.query;
    let redirect_url = query.redirect_url || '/';
    let captcha_img = ref('');
    let captcha_visible = ref(false);

    var modelRef = reactive({
      username: null,
      password: null,
      captcha: null,
      token: ''
    });
    const rules = {
      username: [
        {
          required: true,
          validator(rule, value) {
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
          validator(rule, value) {
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
          validator(rule, value) {
            if (!value) {
              return new Error(t('login.need_captcha'));
            }
            return true;
          },
          trigger: ['input', 'blur']
        }
      ]
    };
    var gen_captcha = function () {
      userApi.genCaptcha().then((res) => {
        if (res.status == 200 && res.data && res.data.success) {
          captcha_img.value = 'data:image/png;base64,' + res.data.data;
          captcha_visible.value = res.data.data != null;
          let token =
            res.headers['Captcha-Token'] || res.headers['captcha-token'] || '';
          modelRef.token = token;
          return;
        }
        window.$message.error(t('login.get_captcha_fail'));
      });
    };
    var submit = function () {
      var password = modelRef.password;
      if (modelRef.token.length >= 32) {
        password = encryptAes(
          modelRef.token.substring(0, 16),
          modelRef.token.substring(16, 32),
          modelRef.password
        );
      }
      const param = {
        username: modelRef.username,
        password: password,
        captcha: modelRef.captcha
      };
      userApi
        .login(param)
        .then((res) => {
          if (res.status == 200) {
            if (res.data.success) {
              userApi.getUserWebResources().then((res) => {
                if (res.status == 200) {
                  if (res.data.success) {
                    webResources.update(res.data.data);
                    if (redirect_url == '/') {
                      router.push(redirect_url);
                    } else {
                      location.href = redirect_url;
                    }
                  }
                }
              });
              return;
            } else {
              gen_captcha();
              if (res.data.code === 'USER_CHECK_ERROR') {
                window.$message.error(t('login.USER_CHECK_ERROR'));
              } else if (res.data.code === 'CAPTCHA_CHECK_ERROR') {
                window.$message.error(t('login.CAPTCHA_CHECK_ERROR'));
              } else if (res.data.code === 'LOGIN_LIMITE_ERROR') {
                window.$message.error(t('login.LOGIN_LIMITE_ERROR'));
              } else {
                window.$message.error(t('login.LOGIN_UNKNOWN_ERROR'));
              }
            }
          } else {
            gen_captcha();
            window.$message.error(
              t('common.request_fail') + '，response code' + res.status
            );
          }
        })
        .catch((err) => {
          gen_captcha();
          window.$message.error(t('common.request_fail') + '，' + err.message);
        });
    };
    gen_captcha();
    return {
      model: modelRef,
      captcha_img,
      rules,
      gen_captcha,
      submit,
      captcha_visible
    };
  }
});
</script>
