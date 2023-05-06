<template>
  <el-container id="home-container">
    <el-aside width="auto">
      <el-menu
          active-text-color="#1F3C88"
          background-color="#F6F5F5"
          class="menu"
          mode="vertical"
          default-active="1"
          router
          :collapse="collapse"
      >
        <el-menu-item index="statistics" @click="title='数据统计'">
          <el-icon>
            <pie-chart/>
          </el-icon>
          <span>数据统计</span>
        </el-menu-item>
        <el-menu-item index="file-detect" @click="title='文件检测'">
          <el-icon>
            <files/>
          </el-icon>
          <span>文件检测</span>
        </el-menu-item>
        <el-menu-item index="text-detect" @click="title='文本检测'">
          <el-icon>
            <document/>
          </el-icon>
          <span>文本检测</span>
        </el-menu-item>
        <el-menu-item index="detect-list" @click="title='XSS列表'">
          <el-icon>
            <list/>
          </el-icon>
          <span>检测列表</span>
        </el-menu-item>
        <el-menu-item index="about">
          <el-icon>
            <info-filled/>
          </el-icon>
          <span>关于</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="margin: 0;padding: 10px;line-height: 100%">
        <el-row justify="space-between">
          <el-col :span="8">
            <el-icon size="35" @click="collapse = !collapse" color="#EE6F57">
              <Menu/>
            </el-icon>
          </el-col>
          <el-col :span="8">
            <h1 class="title">{{ title }}</h1>
          </el-col>
          <el-col :span="8" style="display: flex;justify-content: flex-end">
            <el-dropdown trigger="click" style="margin-right: 20px">
              <el-avatar :size="50" :src="headSrc"/>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <img src="@/assets/fullscreen.svg"
                 @click="toggleFullScreen"
                 style="margin-right: 20px" v-if="!isfull">
            <img src="@/assets/exitfullscreen.svg"
                 @click="toggleFullScreen"
                 style="margin-right: 20px" v-else>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="border"></div>
          </el-col>
        </el-row>
      </el-header>
      <el-main id="main">
        <keep-alive>
          <router-view/>
        </keep-alive>
      </el-main>
      <el-footer>
        <div style="text-align: center;font-size: 14px;margin-top: 20px">
          Copyright © 2023 基于改进TF-IDF的跨站脚本攻击检测系统 All Rights Reserved.
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {ref, onMounted, onUpdated, computed} from 'vue'
import {RouterView, useRoute, useRouter} from 'vue-router'
import {InfoFilled} from "@element-plus/icons-vue"
import screenfull from 'screenfull'
import {useUserStore, userLocalStorage} from "@/stores/user";

const router_map = ref(new Map<string, string>)
router_map.value.set('about', '关于页面')
router_map.value.set('statistics', '数据统计')
router_map.value.set('file-detect', '文件检测')
router_map.value.set('text-detect', '文本检测')
router_map.value.set('detect-list', '检测列表')
router_map.value.set('userinfo', '用户信息')
const router = useRouter()

const logout = () => {
  useUserStore().logout()
  userLocalStorage().logout()
  router.push("/login")
}

const title = ref()

const collapse = ref(false)

const isfull = ref(screenfull.isFullscreen)

function toggleFullScreen() {
  if(screenfull.isEnabled){
    screenfull.toggle()
  }
}

screenfull.on('change', () => {
  isfull.value = screenfull.isFullscreen;
})

const headSrc = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

onMounted(() => {
  const route = useRoute()
  title.value = router_map.value.get(<string>route.matched[1].name)
})

onUpdated(() => {
  const route = useRoute()
  title.value = router_map.value.get(<string>route.matched[1].name)
})


</script>

<style scoped>
.menu {
  height: 100vh;
  user-select: none;
}

.title {
  height: 37px;
  line-height: 37px;
  margin: 0;
  text-align: center;
  font-weight: normal;
  font-size: 24px;
}

.border {
  padding: 5px;
  border-bottom: 2px solid lightgray;
}
</style>
