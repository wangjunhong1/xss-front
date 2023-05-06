<template>
  <div class="item-container" :style="{backgroundColor:backgroundColor}">
    <div class="name">
      {{ name }}
    </div>
    <div class="value">
      {{ value }}
    </div>
    <div class="description">
      {{ description }}
    </div>
    <div class="icon">
      <img :src="icon">
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, withDefaults} from 'vue'

interface InfoItemModel {
  name?: string,
  value?: number,
  icon?: string,
  description: string,
  backgroundColor: string
}

const props = withDefaults(defineProps<InfoItemModel>(), {
  name: 'NAME',
  value: 100,
  icon: '',
  description: 'This is description.',
  backgroundColor: "#91cc75"
})

</script>

<style scoped>
.item-container {
  position: relative;
  height: 150px;
}

.name {
  position: absolute;
  top: 15px;
  left: 20px;
  font-family: 华文楷体;
  font-size: 28px;
  color: #F5F5F5
}

.value {
  position: absolute;
  top: 55px;
  left: 40px;
  font-size: 40px;
  color: white;
  font-family: Consolas;
}

.description {
  position: absolute;
  bottom: 10px;
  left: 20px;
  font-size: 18px;
  color: #f2f2f2;
}

.icon {
  width: 64px;
  height: 64px;
  position: absolute;
  top: 30px;
  right: 30px;
  border-radius: 32px;
  background-color: #F6F5F566;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>