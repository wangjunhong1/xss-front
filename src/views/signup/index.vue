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
          <el-input size="large"
                    class="input"
                    v-model="check_code">
            <template #append>
              <check-code @change="val=>real_check_code=val" style="width: 100%;margin: 0;padding: 0"></check-code>
            </template>
          </el-input>
          <div class="input input-div">
            <div>保存登录状态
              <el-switch v-model="remember" style="margin-left: 5px"/>
            </div>
          </div>
          <el-button type="primary" size="large" style="width: 100%" class="input"
                     @click="login(user.username,user.password)" :loading="logining">登录
          </el-button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import CheckCode from "@/components/login/CheckCode.vue"
import {ref, reactive} from 'vue'
import eventBus from "@/utils/eventBus";
import {login as loginAPI} from "@/api/userAPI";
import swal from 'sweetalert'
import {useUserStore, userLocalStorage} from "@/stores/user";
import {useRouter} from "vue-router";

const user = reactive({
  username: '',
  password: '',
})

const is_show = ref(false)
const remember = ref(true)
const check_code = ref('')
const real_check_code = ref('')
const logining = ref(false)
const store = useUserStore()
const router = useRouter()

function login() {
  logining.value = true
  if (user.username === "" || user.password === "") {
    logining.value = false
    swal({
      title: "用户名密码不完整",
      text: "请重新输入",
      icon: "warning",
      button: "确定",
    });
    return;
  }
  if (check_code.value.toUpperCase() === real_check_code.value.toUpperCase()) {
    loginAPI(user.username, user.password).then((data) => {
      logining.value = false
      const res = data.data
      if (res.state === 200) {
        // 登陆成功，存储Store并跳转
        store.login(user.username)
        userLocalStorage().logout()
        if (remember) {
          userLocalStorage().login(user.username)
        }
        router.push("/")
        console.log("登陆成功" + store.username)
      } else if (res.state === 300) {
        swal({
          title: "账号或密码错误>_<",
          text: "请检查账号密码是否正确",
          icon: "warning",
          button: "确定",
        })
      } else {
        swal({
          title: "服务器罢工了>_<",
          text: "请稍后再试",
          icon: "error",
          button: "确定",
        })
      }
    }).catch(() => {
      logining.value = false
      swal({
        title: "服务器罢工了>_<",
        text: "请稍后再试",
        icon: "error",
        button: "确定",
      })
    })
  } else {
    logining.value = false
    swal({
      title: "验证码错误",
      text: "请重新输入",
      icon: "warning",
      button: "确定",
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