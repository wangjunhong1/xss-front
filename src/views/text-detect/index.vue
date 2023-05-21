<template>
  <div class="text-detect-container">
    <div class="top">
      <div>
        <el-input
            v-model="text"
            :autosize="{ minRows: 1, maxRows: 5 }"
            type="textarea"
            placeholder="请输入待检测的URL或者脚本"
            size="large"
        />
      </div>
      <div style="margin: 10px;float: right">
        <el-button @click="text=''" type="primary" style="width: 100px;">清空</el-button>
        <el-button type="primary" style="width: 100px;" @click="predict">检测</el-button>
      </div>
    </div>

    <div class="bottom" v-loading="loading" element-loading-text="检测中...">
      <div class="bottom-left">
        <ul>
          <li>
            <div class="title">
              <div class="block"></div>
              检测日期：{{ data_model.detect_result.date }}
            </div>
          </li>
          <li>
            <div class="title">
              <div class="block"></div>
              检测用时：{{ data_model.detect_result.use_time }}
            </div>
          </li>
          <div class="title">
            <div class="block"></div>
            检测结果
          </div>

          <div>
            <el-table :data="data_model.detect_result.model_res" border style="width:400px;margin-left: 80px">
              <el-table-column prop="model_name" label="模型名称" width="200"/>
              <el-table-column prop="result" label="模型结果" width="200"/>
            </el-table>
          </div>

          <li>
            <div class="title">
              <div class="block"></div>
              危险等级：
              <el-rate style="text-indent: 5px"
                       disabled
                       v-model="rate"
                       :icons="[safe,warning,danger]"
                       :disabled-void-icon="normal"
              />
            </div>
          </li>
        </ul>
      </div>
      <div class="bottom-right">
        <div id="chart"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive, computed, onMounted} from "vue";
import safe from "@/components/text-detect/safe.vue";
import normal from "@/components/text-detect/normal.vue";
import warning from "@/components/text-detect/warning.vue";
import danger from "@/components/text-detect/danger.vue";
import {predict as textPredict} from "@/api/textAPI";

import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption
} from 'echarts/components';
import {PieChart, PieSeriesOption} from 'echarts/charts';
import {LabelLayout} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

const option = {
      title: {
        text: '关键词分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '出现次数',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b} : {d}%',
            fontSize: 16
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: []
        }
      ]
    }
;

const echarts_ = () => {
  let chartDom = document.getElementById('chart')!;
  let myChart = echarts.init(chartDom);
  myChart.setOption(option);
}

onMounted(() => {
  echarts_()
})

const text = ref('')
const loading = ref(false)

interface res {
  model_name: string,
  result: string,
}

const predict = () => {
  loading.value = true
  data_model.sample = text.value
  textPredict(text.value).then((value) => {
    data_model.detect_result = value.data.detectResult
    option.series[0].data = value.data.keywordCounts
    echarts_()
    console.log(value.data)
    loading.value = false
  })
}

const data_model = reactive(
    {
      sample: '',
      detect_result: {
        date: '',
        use_time: '',
        model_res: [
          {
            model_name: "",
            result: '',
          }
        ],
      }
    }
)

const rate = computed(() => {
  return data_model.detect_result.model_res.filter((value) => {
    return value.result === '攻击样本';
  }).length;
})

</script>

<style scoped>
.text-detect-container {
  height: 750px;
  margin: 10px;
}

.top {
  padding: 45px;
  height: 100px;
}

.bottom {
  margin: 30px;
  height: 550px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom-left {
  flex: 4;
  height: 550px;
}

.bottom-right {
  width: 1065px;
  height: 550px;
  flex: 7;
}

.title {
  position: relative;
  height: 40px;
  text-indent: 50px;
  line-height: 40px;
  font-size: 18px;
  margin: 20px;
  color: #2c3e50;
}

.block {
  width: 15px;
  height: 40px;
  position: absolute;
  left: 10px;
  background-color: #ae8b9c;
}

ul li {
  list-style: none;
}

#chart {
  height: 550px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
</style>