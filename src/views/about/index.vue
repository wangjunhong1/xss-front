<template>
  <div class="about">
    <div class="info">
      <div class="avatar">
        <img src="https://avatars.githubusercontent.com/u/65681015?v=4" alt="avatar">
      </div>
      <div class="name">跨站脚本攻击检测系统</div>
      <div class="description" style="font-size: 20px">
        基于 VAR-CHI-TF-IDF 的跨站脚本攻击检测算法，设计并实现了一个跨站
        脚本攻击检测系统，主要功能涵盖注册登录、文件检测、文本检测等。测试表明，
        系统能够正确对用户上传的文件及文本进行跨站脚本攻击检测，检测准确率高，
        速度快，能够满足实际应用需求
      </div>
    </div>
    <div class="skills">
      <h3>相关信息</h3>
      <el-card>
        <div class="card-content">
          <el-row>
            <el-col :span="12">
              <div class="card-content-item">
                <div class="card-content-item-label">系统版本：</div>
                <div class="card-content-item-value">{{ app_info.version }}</div>
              </div>
              <div class="card-content-item">
                <div class="card-content-item-label">开发日期：</div>
                <div class="card-content-item-value">{{ app_info.start_time }}</div>
              </div>
              <div class="card-content-item">
                <div class="card-content-item-label">完成日期：</div>
                <div class="card-content-item-value">{{ app_info.finish_time }}</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="card-content-item">
                <div class="card-content-item-label">开发者：</div>
                <div class="card-content-item-value">{{ app_info.developer }}</div>
              </div>
              <div class="card-content-item">
                <div class="card-content-item-label">电子邮箱：</div>
                <div class="card-content-item-value">
                  <el-link type="warning"
                           :href="'mailto:'+app_info.email">
                    {{ app_info.email }}
                  </el-link>
                </div>
              </div>
              <div class="card-content-item">
                <div class="card-content-item-label">项目地址：</div>
                <div class="card-content-item-value">
                  <el-link target="_blank" style="margin: 0 10px" :href="app_info.address.front">前端</el-link>
                  <el-link target="_blank" style="margin: 0 10px" :href="app_info.address.back">后端</el-link>
                  <el-link target="_blank" style="margin: 0 10px" :href="app_info.address.model">模型</el-link>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div style="font-size: larger;font-weight: bold;color: #777777;">
                关键技术：
                <el-tag style="margin: 0 10px">机器学习</el-tag>
                <el-tag style="margin: 0 10px">文本表示</el-tag>
                <el-tag style="margin: 0 10px">SpringBoot</el-tag>
                <el-tag style="margin: 0 10px">Kafka</el-tag>
                <el-tag style="margin: 0 10px">MVC</el-tag>
                <el-tag style="margin: 0 10px">MySQL</el-tag>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ElCard, ElTag, ElLink, ElRow, ElCol, ElButton} from 'element-plus'
import {ref} from "vue";

const app_info = ref({
  version: 'V1.0',
  start_time: '2022年12月01日',
  finish_time: '2023年05月02日',
  developer: '王俊洪',
  email: 'wangjunhong@email.ncu.edu.cn',
  address: {
    front: "https://github.com/wangjunhong1/xss-front.git",
    back: "https://github.com/wangjunhong1/xss-back.git",
    model: "https://github.com/wangjunhong1/xss-model.git"
  },
})
</script>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
}

.avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.description {
  font-size: 16px;
  margin-bottom: 20px;
  text-align: center;
}

.social-links el-link {
  margin: 0 10px;
}

.skills {
  width: 1000px;
  text-align: center;
  margin-bottom: 50px;
}

.footer {
  text-align: center;
  font-size: 12px;
  color: #999;
}

.card-content {
  padding: 20px;
}

.card-content-item {
  display: flex;
  margin-bottom: 20px;
  font-size: 20px;
}

.card-content-item-label {
  width: 120px;
  font-weight: bold;
  color: #777;
}

.card-content-item-value {
  flex: 1;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
}
</style>