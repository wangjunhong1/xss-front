<template>
  <div id="login-container">
    <div class="form-container">
      <div>
        <img src="@/assets/login/bg2.svg">
      </div>
      <div class="form">
        <form>
          <div class="logo">
            <img src="@/assets/login/logo.svg"/>
          </div>
          <h1 class="title">XSS检测系统</h1>
          <el-input
              v-model="user.username"
              autocomplete="false"
              class="input"
              placeholder="请输入用户名"
              size="large">
            <template #prefix>
              <el-icon>
                <User/>
              </el-icon>
            </template>
          </el-input>
          <el-input
              v-model="user.password"
              class="input"
              size="large"
              :type="is_show?'text':'password'"
              placeholder="请输入密码">
            <template #prefix>
              <el-icon>
                <Lock/>
              </el-icon>
            </template>
            <template #append>
              <div class="eye" @click="is_show=!is_show">
                <img src="@/assets/login/eye-show.svg" v-if="is_show">
                <img src="@/assets/login/eye-hide.svg" v-else>
              </div>
            </template>
          </el-input>
          <el-input
              v-model="user.password_again"
              class="input"
              size="large"
              :type="is_show_again?'text':'password'"
              placeholder="请再次输入密码">
            <template #prefix>
              <el-icon>
                <Lock/>
              </el-icon>
            </template>
            <template #append>
              <div class="eye" @click="is_show_again=!is_show_again">
                <img src="@/assets/login/eye-show.svg" v-if="is_show_again">
                <img src="@/assets/login/eye-hide.svg" v-else>
              </div>
            </template>
          </el-input>
          <el-input size="large"
                    class="input"
                    v-model="check_code"
                    placeholder="请输入图片验证码">
            <template #append>
              <check-code @change="val=>real_check_code=val" style="width: 100%;margin: 0;padding: 0"></check-code>
            </template>
          </el-input>
          <el-input size="large"
                    class="input"
                    v-model="phone_sms"
                    :placeholder="sms_code_sending?'请输入手机验证码':'请输入手机号'">
            <template #append>
              <el-button @click="sendCode" ref="sms_button" type="primary" style="width: 200px">
                {{ sms_code_sending ? clock + "s" : "发送验证码" }}
              </el-button>
            </template>
          </el-input>
          <div class="input input-div">
            <div>注册后自动登录
              <el-switch v-model="login_auto" style="margin-left: 5px"/>
            </div>
            <div style="margin: 0 10px">
              <el-link href="/login" type="primary">已有账号？立即登录</el-link>
            </div>
          </div>
          <el-button type="primary" size="large" style="width: 100%" class="input"
                     @click="signup(user.username,user.password)" :loading="signuping">注册
          </el-button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckCode from "@/components/login/CheckCode.vue"
import {ref, reactive} from 'vue'
import eventBus from "@/utils/eventBus";
import {login as loginAPI, signup as signupAPI} from "@/api/userAPI";
import swal from 'sweetalert'
import {useUserStore, userLocalStorage} from "@/stores/user";
import {useRouter} from "vue-router";
import {sms_send} from '@/api/smsAPI';

const user = reactive({
  username: '',
  password: '',
  password_again: ''
})

const is_show = ref(false)
const is_show_again = ref(false)
const login_auto = ref(true)
const check_code = ref('')
const phone_sms = ref('')
const real_check_code = ref('')
const signuping = ref(false)
const store = useUserStore()
const router = useRouter()
const sms_code_sending = ref(false)
const clock = ref(120)
const sms_real_code = ref("------")

function check_password(password: string) {
  return password.match('^(?=.*[_a-zA-Z])(?=.*\\d).{6,}$')
}

function signup() {
  signuping.value = true
  if (phone_sms.value.toUpperCase() === sms_real_code.value.toUpperCase()) {
    signupAPI(user.username, user.password).then((val) => {
      let response = val.data
      if (response.state == 200) {
        if (login_auto.value) {
          loginAPI(user.username, user.password).then((val) => {
            let res = val.data
            if (res.state === 200) {
              // 登陆成功，存储Store并跳转
              store.login(user.username)
              userLocalStorage().login(user.username)
              router.push("/")
              console.log("登陆成功" + store.username)
            } else if (res.state === 300) {
              swal({
                title: "账号或密码错误>_<",
                text: "请检查账号密码是否正确",
                icon: "warning",
                buttons: {
                  confirm: {
                    text: '确定',
                    value: true,
                  },
                }
              })
            } else {
              swal({
                title: "服务器罢工了>_<",
                text: "请稍后再试",
                icon: "error",
                buttons: {
                  confirm: {
                    text: '确定',
                    value: true,
                  },
                }
              })
            }
          }).catch(() => {
            swal({
              title: "服务器罢工了>_<",
              text: "请稍后再试",
              icon: "error",
              buttons: {
                confirm: {
                  text: '确定',
                  value: true,
                },
              }
            })
          })
        } else {

        }
      } else if (response.state == 300) {
        swal({
          title: "注册失败",
          text: "用户名已存在",
          icon: "error",
          buttons: {
            confirm: {
              text: '确定',
              value: true,
            },
          }
        })
      }
      signuping.value = false
    }).catch(() => {
      swal({
        title: "服务器罢工了>_<",
        text: "请稍后再试",
        icon: "error",
        buttons: {
          confirm: {
            text: '确定',
            value: true,
          },
        }
      })
    })
  } else {
    signuping.value = false
    swal({
      title: "验证码错误",
      text: "请重新输入",
      icon: "warning",
      buttons: {
        confirm: {
          text: '确定',
          value: true,
        },
      }
    });
    eventBus.emit("check_fail")
  }
}

function sendCode() {
  sms_code_sending.value = true
  if (user.username === "" || user.password === "") {
    sms_code_sending.value = false
    swal({
      title: "用户账户密码输入不完整",
      text: "请重新输入",
      icon: "warning",
      buttons: {
        confirm: {
          text: '确定',
          value: true,
        },
      }
    });
    return;
  }
  if (!check_password(user.password)) {
    sms_code_sending.value = false
    swal({
      title: "弱密码",
      text: "密码至少需要包含一个字母(或下划线)和一个数字，且至少需要有6个字符长度",
      icon: "warning",
      buttons: {
        confirm: {
          text: '确定',
          value: true,
        },
      }
    });
    return;
  }
  if (user.password != user.password_again) {
    sms_code_sending.value = false
    swal({
      title: "密码输入不一致",
      text: "请重新输入",
      icon: "warning",
      buttons: {
        confirm: {
          text: '确定',
          value: true,
        },
      }
    });
    return;
  }
  if (!phone_sms.value.match(/^1[3456789]\d{9}$/)) {
    sms_code_sending.value = false
    swal({
      title: "手机号为空或格式有误",
      text: "请重新输入",
      icon: "warning",
      buttons: {
        confirm: {
          text: '确定',
          value: true,
        },
      }
    });
    return;
  }
  if (check_code.value.toUpperCase() === real_check_code.value.toUpperCase()) {
    let timer = setInterval(() => {
      clock.value--
      if (clock.value < 0) {
        clock.value = 120
        sms_real_code.value = "------"
        sms_code_sending.value = false
        clearInterval(timer)
      }
    }, 1000)
    sms_send(phone_sms.value).then((val) => {
      console.log(val.data)
      sms_real_code.value = val.data.sms_code
      phone_sms.value = ""
    }).catch(() => {
      sms_code_sending.value = false
      clock.value = 120
      swal({
        title: "服务器罢工了>_<",
        text: "请稍后再试",
        icon: "error",
        buttons: {
          confirm: {
            text: '确定',
            value: true,
          },
        }
      })
    })
  } else {
    sms_code_sending.value = false
    swal({
      title: "图片验证码错误",
      text: "请重新输入",
      icon: "warning",
      buttons: {
        confirm: {
          text: '确定',
          value: true,
        },
      }
    });
    eventBus.emit("check_fail")
  }
}

</script>

<style scoped>
#login-container {
  width: 100vw;
  height: 100vh;
  background-image: url("@/assets/login/bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: -1px -1px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.form {
  width: 400px;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  margin: 20px 20px 20px 300px;
}

.logo {
  margin: 10px auto;
  text-align: center;
}

.title {
  width: 100%;
  height: auto;
  text-align: center;
  padding: 10px;
  font-size: 24px;
  font-family: "华文行楷";
}

.input {
  outline: none;
  margin: 10px 0px;
}

.input-div {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  line-height: 100%;
}

.eye {
  padding: 0 5px;
  text-align: center;
  line-height: 100%;
}

.eye:hover {
  cursor: pointer;
}

:deep(.el-input-group__append) {
  padding: 0;
}

a:hover {
  background-color: transparent;
}
</style>