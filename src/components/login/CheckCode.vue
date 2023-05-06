<template>
  <canvas id="canvas" @click="draw" width="140" height="40" style="cursor: pointer;"></canvas>
</template>
<script setup>
import {reactive, onMounted, watch, defineEmits, computed} from "vue";
import eventBus from "@/utils/eventBus";
const code_data = reactive({
  codes: [],
  ctx: new Object(),
  colors: ["red", "yellow", "blue", "green", "pink", "black"],
  code_Len: 4
})

eventBus.on("check_fail",()=>{
  draw()
})

const generateRandom = () => {
  code_data.codes = [];
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const charsArr = chars.split("");

  for (let i = 0; i < code_data.code_Len; i++) {
    const num = Math.floor(Math.random() * charsArr.length);
    code_data.codes.push(charsArr[num]);
  }
}
const drawLine = () => {
  const lineNumber = 3; // 线条条数
  const lineX = 140;
  const lineY = 30; // 最大线条坐标
  for (let i = 0; i < lineNumber; i++) {
    code_data.ctx.strokeStyle = code_data.colors[Math.floor(Math.random() * 5)];
    code_data.ctx.beginPath();
    code_data.ctx.moveTo(
        Math.floor(Math.random() * lineX),
        Math.floor(Math.random() * lineY)
    );
    code_data.ctx.lineTo(
        Math.floor(Math.random() * lineX),
        Math.floor(Math.random() * lineY)
    );
    code_data.ctx.stroke();
  }
}
const drawText = () => {
  const canvas = document.getElementById("canvas")
  code_data.ctx = canvas.getContext("2d");

  code_data.ctx.fillStyle = "#BFEFFF";
  code_data.ctx.fillRect(0, 0, 140, 40);
  code_data.ctx.font = "20px Verdana";

  let x = 15;

  for (let i = 0; i < code_data.code_Len; i++) {
    code_data.ctx.fillStyle = code_data.colors[Math.floor(Math.random() * 5)];
    code_data.ctx.fillText(code_data.codes[i], x, 25);
    x = x + 30;
  }
  drawLine();
}
const draw = () => {
  generateRandom();
  drawText();
}

onMounted(() => {
  draw();
})

const codeString = computed(() => {
  let result = "";
  for (let i = 0; i < code_data.codes.length; i++) {
    result += code_data.codes[i];
  }
  return result.toUpperCase();
})
const emits = defineEmits(["change"])
watch(codeString, (newValue) => {
  emits("change", newValue)
  console.log("验证码是：" + newValue)
})
</script>