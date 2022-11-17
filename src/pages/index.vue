<script setup lang="ts">
import axios from 'axios'
import { ElImageViewer } from 'element-plus'
import type { UploadRawFile, UploadUserFile } from 'element-plus'
import { encryptBASE64AsBasicAuth } from '~/utils'

interface ThinyDataInput {
  type: string
  size: number
}

interface ThinyDataOutput {
  height: number
  width: number
  size: number
  type: string
  url: string
  ratio: number
}

interface ThinyData {
  input: ThinyDataInput
  output: ThinyDataOutput
}

const API_KEY = import.meta.env.VITE_THINY_KEY
// 未压缩的图片信息
const imageSource = ref<UploadRawFile>({} as UploadRawFile)
const imageSrc = ref<string>('')
const imageSize = ref<number>(0)

// 压缩的图片信息
const imageThiny = ref<ThinyDataOutput>()
const imageThinySrc = ref<string>('')

const loading = ref<boolean>(false)
const showPreview = ref<boolean>(false)
const fileList = ref<UploadUserFile[]>([])
const previewList = ref<string[]>([])
const elImageRef = ref<InstanceType<typeof ElImageViewer> | null>(null)

function clearImageInfo() {
  imageSource.value = {} as UploadRawFile
  imageSrc.value = ''
  imageSize.value = 0

  imageThiny.value = {} as ThinyDataOutput
  imageThinySrc.value = ''
}

const beforeUpload = async (rawFile: UploadRawFile) => {
  clearImageInfo()

  const blob = new Blob([await rawFile.arrayBuffer()], { type: rawFile.type })
  imageSrc.value = URL.createObjectURL(blob)
  imageSize.value = rawFile.size
  imageSource.value = rawFile
  // 不上传
  return false
}

const thinyImgClick = async () => {
  loading.value = true
  axios.post<ThinyData>('/thiny/shrink', imageSource.value, {
    headers: {
      Authorization: `Basic ${encryptBASE64AsBasicAuth('api', API_KEY)} `,
    },
  }).then(({ data: { output } }) => {
    imageThiny.value = output
    imageThinySrc.value = output.url
  }).finally(() => {
    loading.value = false
  })
}

const saveImge = () => {
  if (imageThiny.value?.url) {
    const url = imageThiny.value.url.replace('https://api.tinify.com', '/thiny')
    fetch(url).then(res => res.blob().then((blob) => {
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = imageSource.value.name
      a.click()
      window.URL.revokeObjectURL(url)
    }))
  }
}

const watchImage = () => {
  showPreview.value = true
  previewList.value = []
  previewList.value.push(imageThiny.value?.url || '')

  nextTick(() => {
    elImageRef.value?.setActiveItem(0)
  })
}
</script>

<template>
  <div class="content">
    <div
      v-loading="loading"
      element-loading-text="正在压缩图片"
      class="p-8 border-2 border-dashed border-gray-400"
    >
      <span v-if="imageSrc" class="relative">
        <span class="absolute bottom-2 right-2 text-sm text-gray-200">
          图片大小: <span class="text-red-600">{{ imageSize }}</span> B
        </span>
        <img width="480" class="border border-gray-300 rounded-md" :src="imageSrc">
      </span>

      <el-upload
        v-model:file-list="fileList"
        :before-upload="beforeUpload"
      >
        <span class="mt-4">
          <el-button type="primary">
            {{ imageSrc ? '重新上传' : '上传图片' }}
          </el-button>
          <el-button :disabled="!imageSrc" @click.stop="thinyImgClick">
            压缩图片
          </el-button>
        </span>
      </el-upload>
    </div>

    <div v-if="imageThinySrc" class="py-8 h-36">
      <el-card style="width: 300px" :body-style="{ padding: 0 }">
        <div class="flex flex-col">
          <div class="flex">
            <div class="p-2">
              <img width="120" class="border border-gray-300 rounded-md" :src="imageSrc">
              <div class="text-xs text-zinc-400 truncate" :title="imageSource?.name" style="width: 120px">
                {{ imageSource?.name }}
              </div>
            </div>
            <div class="flex-1 text-left ml-2 mt-4 text-xs text-zinc-400">
              <el-space alignment="start" direction="vertical" class="w-full">
                <div>
                  <label class="w-6">源文件: </label>
                  <span class="ml-2">{{ imageSource?.size }}</span>
                </div>
                <div>
                  <label class="w-6">压缩后: </label>
                  <span class="ml-2 text-emerald-500">{{ imageThiny?.size }}</span>
                </div>
                <div>
                  <label class="w-6">压缩比: </label>
                  <span class="ml-2 text-cyan-500">{{ (imageThiny?.ratio || 0) * 100 }} %</span>
                </div>
              </el-space>
            </div>
          </div>
          <div class="flex items-center mt-2 p-2 border-t-1 border-zinc-300">
            <div class="flex-1 cursor-pointer text-center text-zinc-600 text-xs hover:text-blue-400" @click="saveImge">
              保存图片
            </div>
            <el-divider direction="vertical" />
            <div class="flex-1 cursor-pointer text-center text-zinc-600 text-xs hover:text-blue-400" @click="watchImage">
              查看图片
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>

  <ElImageViewer
    v-if="showPreview"
    ref="elImageRef"
    :infinite="false"
    :url-list="previewList"
    :hide-on-click-modal="false"
    @close="showPreview = false"
  />
</template>
