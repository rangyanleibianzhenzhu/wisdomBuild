# 图片查看器组件
#### 属性
##### 1. url 图片地址
* 值为 String 或者 Array 类型
* 必填

#### 示例
##### 1. 组件示例
* 查看单个图片
```vue
<template>
  <ImageViewer v-model="isShow" url="/focm/file/download/495"></ImageViewer>
</template>
<script>
import ImageViewer from '@/components/pc/imageViewer/ImageViewer.vue'
export default {
  components: {
    ImageViewer
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    showImage () {
      this.isShow = true
    }
  }
}
</script>
```

* 查看多个图片
```vue
<template>
  <ImageViewer v-model="isShow" :url="urls"></ImageViewer>
</template>
<script>
import ImageViewer from '@/components/pc/imageViewer/ImageViewer.vue'
export default {
  components: {
    ImageViewer
  },
  data () {
    return {
      isShow: false,
      urls: [
        '/focm/file/download/495',
        '/focm/file/download/496',
        '/focm/file/download/497'
      ]
    }
  },
  methods: {
    showImage () {
      this.isShow = true
    }
  }
}
</script>
```

##### 2. js调用示例
* 查看单个图片
```js
import popupImage from '@/components/pc/imageViewer/index.js'

popupImage('/focm/file/download/495')
popupImage({ url: '/focm/file/download/495' })
```

* 查看多个图片
```js
import popupImage from '@/components/pc/imageViewer/index.js'

popupImage([
  '/focm/file/download/495',
  '/focm/file/download/496',
  '/focm/file/download/497'
])
```
