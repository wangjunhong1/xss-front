<template>
  <div class="file-detect-container">
    <div class="left">
      <div class="left-top">
        <el-upload
            drag
            ref="uploadRef"
            :action="upload_url"
            :on-error="on_error"
            :on-success="on_success"
            :on-remove="on_remove"
            :before-upload="before_upload"
            :auto-upload="false"
            @change="handleChange"
        >
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              csv file with a size less than 500kB
            </div>
          </template>
        </el-upload>
      </div>
      <div style="margin: 0 30px;text-align: center;">
        <el-select v-model="model" placeholder="请选择模型" style="width: 50%;margin: 0 10px">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-button type="primary" style="width: 30%;margin: 0 10px" @click="predict">
          检&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp测
        </el-button>
      </div>
      <div class="left-bottom">
        <strong>操作步骤</strong><br/><br/>
        1. 上传csv/excel文件，文件内容为1列，其中每行是待检测的URL或者脚本。<br/>
        2. 选择使用的模型。<br/>
        3. 点击检测按钮，开始检测，等待系统进行检测。<br/>
        4. 检测结束，表格中可以查看检测结果。<br/>
        5. 可以选择点击导出检测结果，将检测结果进行导出。
      </div>
    </div>
    <div class="right">
      <div class="title">
        <div class="block">检测结果</div>
        <div style="position: absolute;right: 100px">
          <el-button type="primary" @click="download">导出表格</el-button>
        </div>
      </div>
      <el-table :data="table_data"
                border
                style="width: 1371px"
                v-loading="loading"
                element-loading-text="检测中..."
                max-height="697">
        <el-table-column prop="index" label="编号" width="100"/>
        <el-table-column prop="url" label="网址" min-width="220"/>
        <el-table-column prop="keyword" label="关键词"/>
        <el-table-column prop="model" label="使用模型"/>
        <el-table-column prop="date" label="检测日期"/>
        <el-table-column prop="label" label="是否为XSS攻击"
                         :filters="[
                             {text:'是',value:'攻击样本'},
                             {text:'否',value: '正常样本'}
                             ]"
                         :filter-method="filterLabel"/>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import type {UploadInstance, UploadRawFile} from "element-plus";
import swal from 'sweetalert'
import {predict as file_predict} from "@/api/fileAPI";
import {exportJsonToExcel} from "@/utils/exportExcel";

const upload_url = ref('http://127.0.0.1:8081/file/upload')
const model = ref('')
const options = [
  {
    value: 'random_forest',
    label: '随机森林',
  },
  {
    value: 'decision_tree',
    label: '决策树',
  },
  {
    value: 'svm',
    label: '支持向量机',
  },
  {
    value: 'k-means',
    label: 'K-Means聚类',
  }
]
const is_selected_file = ref(false)
const uploadRef = ref<UploadInstance>()
const file = ref()
var table_data = ref([])
const loading = ref(false)

const handleChange = (rawFile: File) => {
  if (rawFile) {
    is_selected_file.value = true
  } else {
    is_selected_file.value = false
  }
}
const on_success = () => {
  loading.value = true
  file_predict(model.value).then((val) => {
    let data = val.data
    table_data.value = data
    console.log(data)
    loading.value = false
  })
  uploadRef.value!.clearFiles()
  uploadRef.value!.handleStart(file.value)
}

const on_remove = () => {
  is_selected_file.value = false
}

const on_error = () => {
  swal({
    title: "服务器罢工了>_<",
    text: "请稍后再试",
    icon: "error",
    buttons: {
      confirm: {
        text: '确定',
        value: true,
      },
    },
  })
}

const before_upload = (uploadRawFile: UploadRawFile) => {
  console.log("开始上传")
  const size = uploadRawFile.size
  file.value = uploadRawFile
  if (size > 500 * 1024) {
    swal({
      title: "文件大小超过限制>_<",
      text: "请压缩文件再试",
      icon: "warning",
      buttons: {
        confirm: {
          text: '确定',
          value: true,
        },
      },
    })
    loading.value = false
    return false
  }

  if(!uploadRawFile.name.endsWith(".csv")){
    swal({
      title: "文件格式有误>_<",
      text: "仅支持csv文件格式",
      icon: "warning",
      buttons: {
        confirm: {
          text: '确定',
          value: true,
        },
      },
    })
    loading.value = false
    return false
  }
}

const predict = () => {
  if (model.value == null || model.value === "") {
    swal({
      title: "没有选择模型>_<",
      text: "请选择合适的模型",
      icon: "warning",
      buttons: {
        confirm: {
          text: '确定',
          value: true,
        },
      },
    })
    return
  }
  if (is_selected_file.value) {
    uploadRef.value!.submit()
  } else {
    swal({
      title: "没有选择文件>_<",
      text: "请先选择文件",
      icon: "warning",
      buttons: {
        confirm: {
          text: '确定',
          value: true,
        },
      },
    })
  }
}

function download() {
  exportJsonToExcel(table_data.value)
}

interface TableData {
  index: number,
  url: string,
  keyword: string,
  model: string,
  date: string,
  label: string
}

const filterLabel = (value: string, row: TableData) => {
  return row.label === value
}

</script>

<style scoped>
.file-detect-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.left {
  height: 755px;
  flex: 2;
  margin: 10px;
}

.left-top {
  height: 300px;
  text-align: center;
}

.left-bottom {
  margin: 30px 10px;
  padding: 10px;
}

.right {
  margin: 10px;
  height: 700px;
  flex: 8;
}

.title {
  position: relative;
  height: 40px;
  margin: 10px;
  line-height: 40px;
  font-size: 18px;
  color: #2c3e50;
}

.block {
  height: 40px;
  position: absolute;
  left: 0px;
  text-indent: 30px;
  border-left: #ae8b9c solid 15px;
}
</style>