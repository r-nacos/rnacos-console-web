<template>
  <div class="container">
    <n-form class="login_form" ref="formRef" :model="model" :rules="rules">
      <n-form-item path="username" label="用户名">
        <n-input
          placeholder="用户名"
          v-model:value="model.username"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="password" label="密码">
        <n-input
          placeholder="密码"
          type="password"
          v-model:value="model.password"
          @keydown.enter.prevent
        />
      </n-form-item>
      <div class="captcha" style="display: inline-flex; flex-direction: row">
        <div class="captcha_code">
          <n-form-item path="captcha" label="验证码">
            <n-input
              placeholder="验证码"
              type="captcha"
              v-model:value="model.captcha"
              @keydown.enter.prevent
            />
          </n-form-item>
        </div>
        <div class="captcha_img">
          <img
            :src="captcha_img"
            height="60"
            style="margin: 0; padding: 0"
            @click="gen_captcha"
          />
        </div>
      </div>
      <div style="display: flex">
        <n-button type="primary" block="true" @click="submit"> 登陆 </n-button>
      </div>
    </n-form>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { useMessage } from 'naive-ui';
import { userApi } from '@/api/user';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    window.$message = useMessage();
    let route = useRoute();
    let query = route.query;
    let redirect_url = query.redirect_url || '/';
    let captcha_img = ref('');
    var modelRef = reactive({
      username: null,
      password: null,
      captcha: null
    });
    const rules = {
      username: [
        {
          required: true,
          validator(rule, value) {
            if (!value) {
              return new Error('需要输入用户名');
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
              return new Error('需要输入密码');
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
              return new Error('需要输入验证码');
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
          return;
        }
        window.$message.error('获取验证码失败');
      });
    };
    var submit = function () {
      const param = {
        username: modelRef.username,
        password: modelRef.password,
        captcha: modelRef.captcha
      };
      userApi
        .login(param)
        .then((res) => {
          if (res.status == 200) {
            if (res.data.success) {
              //window.$message.info('登录成功!');
              location.href = redirect_url;
              return;
            } else {
              //console.log(res.data);
              if (res.data.code === 'SYSTEM_ERROR') {
                window.$message.error('登录失败，用户名或密码错误!');
              } else if (res.data.code === 'CAPTCHA_CHECK_ERROR') {
                window.$message.error('验证码校验不通过!');
              } else {
                window.$message.error('登录失败，' + res.data.message);
              }
            }
          } else {
            window.$message.error('请求失败，response code' + res.status);
          }
        })
        .catch((err) => {
          window.$message.error('请求失败,' + err.message);
        });
    };
    gen_captcha();
    return {
      model: modelRef,
      captcha_img,
      rules: rules,
      gen_captcha,
      submit: submit
    };
  }
});
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 100%;
  background: #efefef;
}

.login_form {
  height: 350;
  width: 300;
  margin: 100px auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  background: #fff;
}
.captcha {
  width: 100%;
}
.captcha_code {
  flex: 1;
}
.captcha_img {
  flex: 0;
  padding-left: 2px;
}
</style>
