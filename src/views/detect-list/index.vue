<template>
  <div class="xss-list-container">
    <div class="top">
      <el-date-picker
          v-model="date_range"
          type="datetimerange"
          :shortcuts="date_shortcuts"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
      />
      <el-button @click="filter_list" :icon="Search" size="large" style="margin: 0 20px">
        {{ is_filter ? "清空" : "过滤" }}
      </el-button>

      <el-button type="primary" size="large" @click="download">导出文档</el-button>
    </div>
    <div class="bottom">
      <div style="margin: 10px">
        <el-table :data="tableData" border style="width: 1771px;height: 635px;text-align: center" max-height="635">
          <el-table-column align="center" label="序号" width="80" type="index"
                           :index="get_index"></el-table-column>
          <el-table-column align="left" prop="url" label="检测文本" width="700"/>
          <el-table-column align="center" prop="startDate" label="开始时间"/>
          <el-table-column align="center" prop="finishDate" label="结束时间"/>
          <el-table-column align="center" prop="useModel" label="检测模型"/>
          <el-table-column align="center" prop="result" label="检测结果"
                           :filters="[
                             {text:'正常样本',value:'正常样本'},
                             {text:'攻击样本',value: '攻击样本'},
                             ]"
                           :filter-method="filterModel"/>
          <el-table-column align="center" prop="keyword" label="关键字"/>
        </el-table>
      </div>
      <div style="display: flex;justify-content: center;margin: 10px">
        <el-pagination
            v-model:current-page="current_page"
            v-model:page-size="page_size"
            :page-sizes="[15, 50, 150, 500,1500]"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalSize"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Search} from '@element-plus/icons-vue'
import {ref} from 'vue'
import {DetectResultItem} from "@/interfaces/detectResultItem";
import {page_list, page_filter_list, list} from "@/api/detectListAPI";
import swal from "sweetalert";
import {exportJsonToExcel} from "@/utils/exportExcel";

const current_page = ref(1)
const page_size = ref(15)
const totalSize = ref(0)
const date_range = ref([null, null])
const is_filter = ref(false)

function filter_list() {
  if (is_filter.value) {
    date_range.value = [null, null]
    current_page.value = 1
    get_page()
    return
  }
  if (date_range.value == undefined) {
    swal({
      title: "日期范围未选择",
      text: "请选择日期范围",
      icon: "warning",
      buttons: {
        confirm: {
          text: '确定',
          value: true,
        },
      }
    })
    return
  }
  current_page.value = 1
  get_filter_page()
}

const date_shortcuts = [
  {
    text: 'Today',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setHours(0)
      start.setMinutes(0)
      start.setSeconds(0)
      end.setHours(23)
      end.setMinutes(59)
      end.setSeconds(59)
      return [start, end]
    }
  },
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  }
]

const filterModel = (value: string, row: any) => {
  return row.result === value
}

function get_index(index: number) {
  return (current_page.value - 1) * page_size.value + index + 1
}

function download() {
  list(date_range.value[0], date_range.value[1]).then(
      (val) => {
        exportJsonToExcel(val.data)
      }
  ).catch(
      () => {
        swal({
          title: "导出失败>_<",
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
  )
}

function get_page() {
  page_list(current_page.value, page_size.value).then((val) => {
    totalSize.value = val.data.total
    tableData.value = val.data.records
    is_filter.value = false
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
}

function get_filter_page() {
  page_filter_list(date_range.value[0], date_range.value[1], current_page.value, page_size.value).then((val) => {
    console.log(val.data)
    totalSize.value = val.data.total
    tableData.value = val.data.records
    is_filter.value = true
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
}

let tableData = ref<Array<DetectResultItem>>([])
get_page()

const handleSizeChange = (val: number) => {
  if (!is_filter.value) {
    get_page()
  } else {
    get_filter_page()
  }
}
const handleCurrentChange = (val: number) => {
  if (!is_filter.value) {
    get_page()
  } else {
    get_filter_page()
  }
}
</script>

<style scoped>
.top {
  height: 50px;
  padding: 10px;
  margin: 10px 500px;
  text-align: center;
  line-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>