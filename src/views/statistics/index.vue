<template>
  <el-row :gutter="12">
    <el-col :span="6" v-for="item in card_data" :key="item.name">
      <el-card shadow="always" body-style="padding:0;" style="margin:30px;border-radius: 15px">
        <info-item :name="item.name" :value="item.value" :icon="item.icon"
                   :description="item.description" :background-color="item.backgroundColor"></info-item>
      </el-card>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="12">
      <div class="title">
        <div class="block"></div>
        近一周检测次数
      </div>
      <div class="chart" id="bar-chart"></div>
    </el-col>
    <el-col :span="12">
      <div class="title">
        <div class="block"></div>
        XSS识别关键字
      </div>
      <div class="chart" id="pie-chart"></div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">

import InfoItem from "@/components/statistics/InfoItem.vue";
import {reactive, onMounted, onBeforeMount} from "vue";
import icon1 from '@/assets/statistics/layers.svg'
import icon2 from '@/assets/statistics/files.svg'
import icon3 from '@/assets/statistics/attack.svg'
import icon4 from '@/assets/statistics/normal.svg'
import {get_card_data, get_bar_data, get_pie_data} from '@/api/statisticsAPI'

import * as echarts from 'echarts/core';
import {
  GridComponent,
  GridComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption
} from 'echarts/components';
import {
  BarChart,
  BarSeriesOption,
  PieChart,
  PieSeriesOption
} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';
import {LabelLayout} from 'echarts/features';
import swal from "sweetalert";

echarts.use([
  GridComponent,
  BarChart,
  CanvasRenderer,
  TooltipComponent,
  LegendComponent,
  PieChart,
  LabelLayout
]);
type EChartsOption = echarts.ComposeOption<
    GridComponentOption
    | BarSeriesOption
    | TooltipComponentOption
    | LegendComponentOption
    | PieSeriesOption
>;

const bar_option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '恶意样本',
      type: 'bar',
      stack: 'Ad',
      color: 'red',
      emphasis: {
        focus: 'series'
      },
      data: [0, 0, 0, 0, 0, 0, 0]
    },
    {
      name: '正常样本',
      type: 'bar',
      stack: 'Ad',
      color: 'skyblue',
      emphasis: {
        focus: 'series'
      },
      data: [0, 0, 0, 0, 0, 0, 0]
    },
  ]
};

const pie_option = {
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
      data: [
        {value: 1048, name: 'Search Engine'},
        {value: 735, name: 'Direct'},
        {value: 580, name: 'Email'},
        {value: 484, name: 'Union Ads'},
        {value: 300, name: 'Video Ads'}
      ]
    }
  ]
};

interface StatisticsModel {
  name: string,
  value: number,
  icon: string,
  description: string,
  backgroundColor: string
}

const card_data = reactive<Array<StatisticsModel>>([
  {
    name: '文件检测数',
    value: 123,
    icon: icon1,
    description: '统计文件检测次数',
    backgroundColor: "#91cc75"
  },
  {
    name: '文本检测数',
    value: 423,
    icon: icon2,
    description: '统计文本检测次数',
    backgroundColor: "#ee6666"
  },
  {
    name: 'XSS攻击',
    value: 6234,
    icon: icon3,
    description: '目前已经检测出的XSS攻击数量',
    backgroundColor: "#73c0de"
  },
  {
    name: '正常样本',
    value: 8567,
    icon: icon4,
    description: '目前检测出的正常样本数量',
    backgroundColor: "#5470c6"
  }
])

onMounted(() => {
  get_card_data().then((val) => {
    console.log(val.data)
    for (let i = 0; i < 4; i++) {
      card_data[i].value = val.data[i]
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
  get_bar_data().then((val) => {
    for (let i = 0; i < 2; i++) {
      bar_option.series[i].data = val.data[i]
      let bar_chart_dom = document.getElementById('bar-chart')!;
      let bar_chart = echarts.init(bar_chart_dom);
      console.log(bar_option)
      bar_chart.setOption(bar_option)
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
  get_pie_data().then((val) => {
    pie_option.series[0].data = val.data
    let pie_chart_dom = document.getElementById('pie-chart')!;
    let pie_chart = echarts.init(pie_chart_dom);
    pie_option && pie_chart.setOption(pie_option)
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
})
</script>

<style scoped>
.chart {
  padding: 20px;
  height: 415px;
}

.title {
  position: relative;
  height: 50px;
  margin-top: 45px;
  text-indent: 150px;
  line-height: 50px;
  font-size: 24px;
  color: #2c3e50;
}

.block {
  width: 20px;
  height: 50px;
  position: absolute;
  left: 100px;
  background-color: #ae8b9c;
}
</style>