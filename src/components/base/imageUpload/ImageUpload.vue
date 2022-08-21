<template>
  <div class="image-upload clearfix">
    <!-- 上传按钮卡片 -->
    <div v-if="(multiple || imageList.length === 0)" class="upload-card" :class="{disabled}" :style="sizeStyle">
      <BaseIcon name="pluse" class="upload-icon"></BaseIcon>
      <input v-if="mountFileInput && !this.disabled" ref="fileInput" type="file"
             :multiple="multiple" accept="image/*"
             class="upload-input" @change="handleUpload">
    </div>

    <!-- 图片卡片 -->
    <div class="image-card-wrap" v-for="(item, index) in imageList" :key="item.uuid">
      <transition name="card">
      <div class="image-card" :class="item.status" :style="sizeStyle">
        <!-- 已上传状态的卡片内容 -->
        <template v-if="item.status==='uploaded'">
          <img class="image" :src="item.src || item.url">
          <!-- 移动端 -->
          <div v-if="isMobile" class="image-cover mobile transparent" @click="handleView(item, index)">
            <div v-if="!disabled" class="delete-button-wrapper" @click.stop="handleDelete(item, index)">
              <BaseIcon name="close"></BaseIcon>
            </div>
          </div>
          <!-- PC端 -->
          <div v-else class="image-cover pc">
            <div class="button-wrapper" title="预览" @click="handleView(item, index)">
              <BaseIcon name="eye"></BaseIcon>
            </div>
            <div v-if="!disabled" class="button-wrapper" title="删除" @click="handleDelete(item, index)">
              <BaseIcon name="delete"></BaseIcon>
            </div>
          </div>
        </template>
        <!-- 上传中状态的卡片内容 -->
        <template v-if="item.status==='uploading'">
          <img v-if="item.src" class="image" :src="item.src">
          <div class="image-cover">
            <div class="process-info">上传中</div>
            <div class="process">
              <div class="fill" :style="{width:`${item.process * 100}%`}"></div>
            </div>
          </div>
        </template>
        <!-- 上传失败状态的卡片内容 -->
        <template v-if="item.status==='failed'">
          <img v-if="item.src" class="image" :src="item.src">
          <div class="image-cover">
            <div class="failed-info">上传失败</div>
            <div style="text-align: center">
            <span class="button-wrapper" title="重新上传" @click="handleReupload(item)">
              <BaseIcon name="upload"></BaseIcon>
            </span>
            <span v-if="!disabled" class="button-wrapper" title="删除" @click="handleDelete(item, index)">
              <BaseIcon name="delete"></BaseIcon>
            </span>
            </div>
          </div>
        </template>
      </div>
      </transition>
    </div>
  </div>
</template>
<script>
import Compressor from 'compressorjs'
import { generateUUID } from '@/assets/js/utils.js'
// 接口根地址（由webpack的插件DefinePlugin注入）
/* eslint-disable no-undef */
const baseUrl = API_BASE_URL

export default {
  name: 'ImageUpload',
  props: {
    // 值
    value: {
      type: [String, Number, Object, Array]
    },
    // 每个图片对应的值类型："url"、"id"、"object"
    valueItemType: {
      type: String,
      default: 'id',
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['url', 'id', 'object'].indexOf(value) !== -1
      }
    },
    // 值映射，valueItemType 为 'object' 且 convertor 为空 时有效（key 组件图片对象的属性，value 对应值数组中对象的属性）
    valueMap: {
      type: Object,
      default: () => {
        return { id: 'id', name: 'name' }
      }
    },
    // 当没有url映射时，url的生成规则（baseUrl是接口请求根路径，id是文件id）
    urlRule: {
      type: String,
      default: '{baseUrl}/api/file/download/{id}'
    },
    // 是否可以上传多张图片
    multiple: {
      type: Boolean,
      default: false
    },
    // 值转换器 { from: function (valueItem) {}, to: function (imageItem) {} }
    convertor: {
      type: Object,
      validator: function (value) {
        if (value) {
          if (value.from && typeof value.from !== 'function') {
            console.warn('ImageUpload 组件的 props.valueConvertor 对象的 form 必须是方法 ')
            return false
          }
          if (value.to && typeof value.to !== 'function') {
            console.warn('ImageUpload 组件的 props.valueConvertor 对象的 to 必须是方法 ')
            return false
          }
        }
        return true
      }
    },
    // 文件大小限制（单位：K）
    maxSize: {
      type: Number
    },
    // 是否压缩图片
    compress: {
      type: Boolean,
      default: true
    },
    // 压缩质量
    compressQuality: {
      type: Number,
      default: 0.8
    },
    // 需压缩图片大小下限，小于此值的图片不压缩（单位：K）
    compressMinSize: {
      type: Number,
      default: 200
    },
    // 预览图宽度
    width: {
      type: [Number, String],
      default: 120
    },
    // 预览图高度
    height: {
      type: [Number, String],
      default: 120
    },
    // 上传接口地址
    apiUrl: {
      type: String,
      default: '/api/file/upload'
    },
    // 上传接口的文件字段名
    fileProperty: {
      type: String,
      default: 'file'
    },
    // 上传接口扩展参数
    data: Object,
    // 是否可编辑
    disabled: {
      type: Boolean,
      default: false
    },
    // 上传前钩子方法(参数：file, imageList)
    beforeUpload: Function,
    // 删除前钩子方法(参数：imageItem, imageList)
    beforeDelete: Function
  },
  data () {
    return {
      // 图片数组
      imageList: [],
      // 是否渲染文件选择控件（上传成功后通过短时置为false再设为true，来达到重新渲染的效果）
      mountFileInput: true,
      // 是否在移动端
      isMobile: window.lib && window.lib.flexible && window.lib.flexible.isMobile ? true : false
    }
  },
  computed: {
    // 大小相关样式
    sizeStyle () {
      let width = this.width
      let height = this.height
      if (typeof width === 'string'  && /^\d+px$/.test(width)) {
        width = Number(width.replace('px', ''))
      }
      if (typeof height === 'string'  && /^\d+px$/.test(height)) {
        height = Number(height.replace('px', ''))
      }
      if (window.lib && window.lib.flexible && window.lib.flexible.isMobile) {
        let flexible = window.lib.flexible
        if (typeof width === 'number') {
          width = flexible.rem2px(width / 75)
        }
        if (typeof height === 'number') {
          height = flexible.rem2px(height / 75)
        }
      }
      return {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height
      }
    },
    // 当前值
    currentValue () {
      let curVal
      if (this.multiple) {
        curVal = []
        this.imageList.forEach((item) => {
          if (item.status === 'uploaded') {
            let valueItem = this.imageItemToValueItem(item)
            curVal.push(valueItem)
          }
        })
      } else {
        if (this.imageList.length > 0 && this.imageList[0].status === 'uploaded') {
          let item = this.imageList[0]
          curVal = this.imageItemToValueItem(item)
        } else {
          curVal = this.imageItemToValueItem(null)
        }
      }
      if (curVal) {
        if (curVal === this.value ||
          (typeof curVal === 'object' && typeof this.value === 'object' && JSON.stringify(curVal) === JSON.stringify(this.value))) {
          return this.value
        }
      }
      return curVal
    }
  },
  watch: {
    value (val) {
      if (val !== this.currentValue) {
        this.initImageList()
      }
    }
  },
  created () {
    this.initImageList()
  },
  methods: {
    // 获取图片地址
    getImageUrl (imageItem) {
      let imageUrl = this.urlRule
      imageUrl = imageUrl.replace('{baseUrl}', baseUrl)
      imageUrl = imageUrl.replace(/{(\w+)}/, ($0, $1) => imageItem[$1] || '')
      return imageUrl
    },
    // 值转化为图片对象
    valueItemToImageItem (valueItem) {
      let imageItem
      if (this.convertor && this.convertor.from) {
        imageItem = this.convertor.from(valueItem)
      } else if (this.valueItemType === 'object') {
        if (this.valueMap) {
          imageItem = {}
          for (let imageItemKey in this.valueMap) {
            let valueItemKey = this.valueMap[imageItemKey]
            imageItem[imageItemKey] = valueItem[valueItemKey]
          }
        } else {
          throw new Error('ImageUpload 组件 valueMap 参数不能为空')
        }
      } else if (this.valueItemType === 'url') {
        imageItem = { url: valueItem }
      } else {
        imageItem = { id: valueItem }
      }

      if (imageItem && !imageItem.url) {
        imageItem.url = this.getImageUrl(imageItem)
      }

      if (imageItem) {
        imageItem.rawValue = valueItem
        imageItem.uuid = generateUUID()
        imageItem.status = 'uploaded'
      }
      return imageItem
    },
    // 图片对象转化为值
    imageItemToValueItem (imageItem) {
      if (this.convertor && this.convertor.to) {
        return this.convertor.to(imageItem)
      } else if (this.valueItemType === 'object') {
        if (imageItem && this.valueMap) {
          let valueItem = {}
          for (let imageItemKey in this.valueMap) {
            let valueItemKey = this.valueMap[imageItemKey]
            valueItem[valueItemKey] = imageItem[imageItemKey]
          }
          return valueItem
        } else if (!imageItem) {
          return null
        } else {
          throw new Error('ImageUpload 组件 valueMap 参数不能为空')
        }
      } else if (this.valueItemType === 'url') {
        return imageItem ? imageItem.url : null
      } else {
        return imageItem ? imageItem.id : null
      }
    },
    // 初始化图片数组
    initImageList () {
      let list = []
      if (this.value) {
        if (this.value instanceof Array) {
          this.value.forEach((valueItem) => {
            let imageItem = this.valueItemToImageItem(valueItem)
            if (imageItem) {
              list.push(imageItem)
            }
          })
        } else {
          let imageItem = this.valueItemToImageItem(this.value)
          if (imageItem) {
            list.push(imageItem)
          }
        }
      }
      this.imageList = list
    },
    // 上传操作
    handleUpload (event) {
      let files = event.target.files // 获取文件对象
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          this.compressImage(files[i]).then((file) => {
            this.uploadFile(file)
          })
        }
      }
      this.mountFileInput = false
      setTimeout(() => {
        this.mountFileInput = true
      }, 10)
    },
    // 上传单个文件
    uploadFile (file) {
      if (this.maxSize && file.size > this.maxSize * 1024) {
        this.$toast(`[${file.name}] 压缩后仍超出大小限制 ${this.maxSize}k`)
        return
      }
      let canUpload = true
      if (this.beforeUpload) {
        canUpload = this.beforeUpload(file, this.imageList) !== false
      }
      if (canUpload) {
        let imageItem = {
          uuid: generateUUID(),
          file, // 图片文件
          url: null, // 图片url地址
          src: null, // data URL
          status: 'uploading',
          process: 0
        }
        this.imageList.unshift(imageItem)
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function (event) {
          imageItem.src = event.target.result
        }
        this.doUpload(imageItem)
      }
    },
    // 压缩图片
    compressImage (file) {
      let fileSize = file.size
      return new Promise((resolve) => {
        if (this.compress && (!this.compressMinSize || fileSize > this.compressMinSize * 1024)) {
          console.log(`${file.name} 压缩前大小 ${Math.round(fileSize / 1024)}k`)
          new Compressor(file, {
            quality: this.compressQuality,
            success (result) {
              console.log(`${result.name} 压缩后大小 ${Math.round(result.size / 1024)}k`)
              resolve(result)
            },
            error (err) {
              console.error('图片压缩失败！', err)
            }
          })
        } else {
          resolve(file)
        }
      })
    },
    // 调用后台接口上传
    doUpload (item) {
      let file = item.file
      let formData = new FormData()
      if (this.data) {
        for (let key in this.data) {
          formData.append(key, this.data[key])
        }
      }
      formData.append(this.fileProperty, file, file.name)

      this.$apiUpload({
        url: this.apiUrl,
        data: formData,
        timeout: 20000, // 设置20秒超时
        onUploadProgress: (progressEvent) => {
          item.process = progressEvent.total ? (progressEvent.loaded / progressEvent.total) : 0
        }
      }, this).then((resData) => {
        item.url = resData.url
        item.name = resData.name
        item.id = resData.id
        item.status = 'uploaded'
        item.data = resData
        this.$emit('uploaded', item, this.imageList)
        this.$emit('input', this.currentValue)
      }, () => {
        item.status = 'failed'
      })
    },
    // 查看图片
    handleView (item) {
      this.$popupImage(item)
    },
    // 删除
    handleDelete (item, index) {
      if (this.imageList.length > index) {
        let canDelete = true
        if (this.beforeDelete) {
          canDelete = this.beforeDelete(item, this.imageList) !== false
        }
        if (canDelete) {
          this.imageList.splice(index, 1)
          this.$emit('delete', item, this.imageList)
          this.$emit('input', this.currentValue)
        }
      }
    },
    // 重新上传
    handleReupload (item) {
      item.status = 'uploading'
      this.doUpload(item)
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
$process-height: 4px;

.image-upload {
  .upload-card {
    float: left;
    margin: 0 5px 5px 0;
    border: 1px dashed $border-color-base;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .upload-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 28px;
      color: $border-color-base;
    }
    .upload-input {
      opacity: 0;
      width: 100%;
      height: 100%;
    }
    &.disabled {
      background-color: $color-info;
      cursor: not-allowed;
      .upload-icon {
        color: $color-text-placeholder;
      }
    }
  }
  .image-card-wrap {
    float: left;
    .image-card {
      position: relative;
      margin: 0 5px 5px 0;
      border: 1px solid $border-color-base;
      border-radius: 6px;
      overflow: hidden;
      .image {
        width: 100%;
        height: 100%;
      }
      .image-cover {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, .5);
        color: #FFF;
        &.transparent {
          background-color: transparent;
        }

        .button-wrapper {
          color: #FFF;
          font-size: 18px;
          padding: 3px;
          cursor: pointer;
          margin-right: 8px;
          &:last-of-type {
            margin-right: 0;
          }
        }
      }
      &.uploading {
        .process {
          position: absolute;
          bottom: 2px;
          left: 4px;
          right: 4px;
          height: $process-height;
          border-radius: $process-height / 2;
          background-color: (255, 255, 255, .5);
          overflow: hidden;
          .fill {
            height: 100%;
            background-color: $color-primary;
          }
        }
      }
      &.uploaded {
        .pc {
          display: none;
        }
        &:hover {
          .pc {
            display: flex;
          }
        }
      }
      &.failed {
        .image-cover {
          flex-direction: column;
        }
        .failed-info {
          color: $color-danger;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
// 下面注释勿删，用于根据配置文件 isMobile 配置项判断是否支持移动端，如果不支持，注释掉该样式
/* [auto html command START {isMobile=false}] */
<style lang="scss" scoped>
@media (max-width: $max-mobile-width) {
  .image-upload {
    .upload-card {
      border-radius: 0;
    }
    .image-card-wrap {
      .image-card {
        border-radius: 0;
        .image-cover {
          .delete-button-wrapper {
            position: absolute;
            top: 0;
            right: 0;
            width: 2.4em;
            height: 2.4em;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 0 0 0 2.4em;
            text-align: right;
            line-height: 1;
            vertical-align: middle;
            font-size: 16px; /*yes*/
            svg {
              margin-right: .4em;
              margin-top: .4em;
            }
          }
        }
      }
    }
  }
}
</style>
/* [auto html command END {isMobile=false}] */
