<template>
  <div class="container">
    <div class="wrap">
      <div class="header">
        <span>R-NACOS 登录</span>
      </div>
      <n-form
        class="login_form"
        ref="formRef"
        :model="modelRef"
        :rules="rules"
      >
        <n-form-item
          path="username"
          label="用户名"
        >
          <n-input
            placeholder="用户名"
            v-model:value="modelRef.username"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item
          path="password"
          label="密码"
        >
          <n-input
            placeholder="密码"
            type="password"
            v-model:value="modelRef.password"
            @keydown.enter.prevent
          />
        </n-form-item>
        <div class="captcha">
          <div class="captcha_code">
            <n-form-item
              path="captcha"
              label="验证码"
            >
              <n-input
                placeholder="验证码"
                v-model:value="modelRef.captcha"
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
        <div>
          <button
            class="login_btn"
            @click="submit"
          >
            登录
          </button>
        </div>
      </n-form>
    </div>
  </div>
</template>

<script setup lang="ts" title="rnacos-登录">
import { useWebResources } from '@/data/resources'
import { userApi } from '@/apis/user'
import { encryptAes } from '@/utils/CryptoUtils'
import { useMessage, NForm, NFormItem, NInput } from 'naive-ui'
const message = useMessage()
const basePath = import.meta.env.VITE_APP_WEB_ROOT_PATH
const webResources = useWebResources()
let route = useRoute()
let router = useRouter()
let query = route.query
let redirect_url = query.redirect_url || '/manage/about'
let captcha_img = ref('')
let modelRef = reactive<any>({
  username: null,
  password: null,
  captcha: null,
  token: '',
})
const rules = {
  username: [
    {
      required: true,
      validator(rule: any, value: any) {
        if (!value) {
          return new Error('需要输入用户名')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],

  password: [
    {
      required: true,
      validator(rule: any, value: any) {
        if (!value) {
          return new Error('需要输入密码')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  captcha: [
    {
      required: true,
      validator(rule: any, value: any) {
        if (!value) {
          return new Error('需要输入验证码')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
}
let gen_captcha = function () {
  userApi.genCaptcha().then(res => {
    if (res.status == 200 && res.data && res.data.success) {
      captcha_img.value = 'data:image/png;base64,' + res.data.data
      let token = res.headers['Captcha-Token'] || res.headers['captcha-token'] || ''
      modelRef.token = token
      return
    }
    message.error('获取验证码失败')
  })
}

let submit = function () {
  let password = modelRef.password
  if (modelRef.token.length >= 32) {
    password = encryptAes(modelRef.token.substring(0, 16), modelRef.token.substring(16, 32), modelRef.password)
  }
  const param = {
    username: modelRef.username,
    password: password,
    captcha: modelRef.captcha,
  }
  userApi
    .login(param)
    .then(res => {
      if (res.status == 200) {
        if (res.data.success) {
          //message.info('登录成功!');
          userApi.getUserWebResources().then(res => {
            if (res.status == 200) {
              if (res.data.success) {
                webResources.update(res?.data?.data as any)
                const url = `${redirect_url}`.replace(basePath, '')
                router.push(`${url}`)
              }
            }
          })
          return
        } else {
          gen_captcha()
          //console.log(res.data);
          if (res.data.code === 'USER_CHECK_ERROR') {
            message.error('登录失败，用户名或密码错误!')
          } else if (res.data.code === 'CAPTCHA_CHECK_ERROR') {
            message.error('验证码校验不通过!')
          } else if (res.data.code === 'LOGIN_LIMITE_ERROR') {
            message.error('登录校验太频繁，稍后再试!')
          } else {
            message.error('登录失败,未知错误')
          }
        }
      } else {
        gen_captcha()
        message.error('请求失败，response code' + res.status)
      }
    })
    .catch(err => {
      gen_captcha()
      message.error('请求失败,' + err.message)
    })
}
gen_captcha()
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: #efefef;
  justify-content: center;
  align-items: center;
}

.wrap {
  height: 360;
  width: 300;
}

.header {
  height: 52px;
  line-height: 52px;
  text-align: center;
  border-radius: 10px 10px 0 0;
  background: #2f6cf7;
  color: #fff;
}

.login_form {
  border: 1px solid #ccc;
  padding: 10px 20px 20px;
  background: #fff;
  border-radius: 0 0 10px 10px;
}

.login_btn {
  height: 34px;
  width: 100%;
  font-size: 14px;
  line-height: 14px;
  background: #2f6cf7;
  color: #fff;
  border: 0px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
}

.captcha {
  width: 100%;
  display: inline-flex;
  flex-direction: row;
}

.captcha_code {
  flex: 1;
}

.captcha_img {
  flex: 0;
  padding-left: 2px;
}
</style>
