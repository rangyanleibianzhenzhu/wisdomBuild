# 图片上传组件【不支持IE9】
#### 属性
##### 1. value 值
* 值为字符串、数值、对象或者数组类型

##### 2. valueItemType 每个图片对应的值类型
* 值为字符串类型("url"、"id"、"object")
* 默认值: "id"
* 说明：
  * id: 每个图片对应的值为图片的id
  * url: 每个图片对应的值为图片的url
  * object: 每个图片对应的值为一个对象，例：
    ```js
    {
      id: '1638860971429-17921558',
      name: 'banner1.png'
    }
    ```

##### 3. valueMap 值映射(valueItemType 为 'object' 且 convertor 为空 时有效)
* 值为 Object 类型
* 主键为组件中 imageItem 的属性，对应的值为 value 对象的属性
* imageItem 属性：
  * id: 图片id
  * url: 图片地址
  * name: 图片名称
* id 和 url 至少需要映射其中一个
* 默认值：{ id: 'id', name: 'name' }

##### 4. urlRule 图片地址 url 的生成规则（valueItemType 为 id 或者 valueItemType 为 object 但没有 url 映射时生效）
* 值为 String 类型
* 默认值：'{baseUrl}/api/file/download/{id}'
* 规则中变量说明：
  * baseUrl：后台接口请求的根路径
  * id：图片id

##### 5. multiple 是否可以上传多张图片
* 值为 Boolean 类型
* 默认值：false

##### 6. convertor 值转换器
* 值为 Object 类型
* 非必填
* 说明：convertor 有 from 和 to 两个属性，属性值为 Function 类型
  * form 将值转化为图片对象的方法，参数：valueItem (图片对应的值对象)
  * to 将图片对象转化为值的方法，参数：valueItem (图片对应的值对象，注意：当为单张图片上传时，删除时传入的 valueItem 为 null)

##### 7. maxSize 文件大小限制（单位：K）
* 值为 Number 类型
* 非必填

##### 8. compress 是否压缩图片
* 值为 Boolean 类型
* 默认值：true

##### 9. compressQuality 压缩质量
* 值为 Number 类型
* 默认值：0.8

##### 10. compressMinSize 需压缩图片大小下限，小于此值的图片不压缩（单位：K）
* 值为 Number 类型
* 默认值：200

##### 11. width 预览图宽度
* 值为数值或者字符串类型
* 默认值：120

##### 12. height 预览图高度
* 值为数值或者字符串类型
* 默认值：120

##### 13. apiUrl 上传接口地址
* 值为字符串类型
* 默认值：'/api/file/upload'

##### 14. fileProperty 上传接口的文件字段名
* 值为字符串类型
* 默认值：'file'

##### 15. data 上传接口扩展参数
* 值为 Object 类型
* 非必填

##### 16. disabled 是否可编辑
* 值为 Boolean 类型
* 默认值为： false

##### 17. beforeUpload 上传前钩子方法
* 值为 Function 类型
* 非必填
* 说明：
  * 参数：file 待上传的图片文件
  * 参数：imageList 图片对象数组
  * 返回值：canUpload 是否可上传（为 false 时不上传）

##### 18. beforeDelete 删除前钩子方法
* 值为 Function 类型
* 非必填
* 说明：
  * 参数：imageItem 待删除图片的信息
  * 参数：imageList 图片对象数组
  * 返回值：canDelete 是否可删除（为 false 时不删除）

#### 事件
##### 1. uploaded 图片上传完成事件
* 参数：
  * imageItem 上传图片的信息对象
  * imageList 所有图片信息数组

##### 2. delete 图片删除事件
* 参数：
  * imageItem 删除图片的信息对象
  * imageList 所有图片信息数组

### 示例：
##### 1. 单图片上传示例
```vue
<template>
  <div class="item">
    <ImageUpload v-model="value"></ImageUpload>
  </div>
</template>

<script>
import ImageUpload from '@/components/base/imageUpload'
export default {
  components: {
    ImageUpload
  },
  data () {
    return {
      value: ''
    }
  }
}
</script>
```

##### 2. 多图片上传示例
```vue
<template>
  <ImageUpload v-model="value" multiple></ImageUpload>
</template>

<script>
import ImageUpload from '@/components/base/imageUpload'
export default {
  components: {
    ImageUpload
  },
  data () {
    return {
      value: ['1638860971429-17921558', '1638866190262-675348414']
    }
  }
}
</script>
```

##### 3. valueItemType 为 'url'
```vue
<template>
  <ImageUpload v-model="value" valueItemType="url"></ImageUpload>
</template>

<script>
import ImageUpload from '@/components/base/imageUpload'
export default {
  components: {
    ImageUpload
  },
  data () {
    return {
      value: '/api/file/download/1638860971429-17921558'
    }
  }
}
</script>

```

##### 4. valueItemType 为 'object'
```vue
<template>
  <ImageUpload v-model="value" valueItemType="object"></ImageUpload>
</template>

<script>
import ImageUpload from '@/components/base/imageUpload'
export default {
  components: {
    ImageUpload
  },
  data () {
    return {
      value: {
        id: '1638860971429-17921558',
        name: 'banner1.png'
      }
    }
  }
}
</script>
```
##### 4. 自定义值映射 valueMap
```vue
<template>
  <ImageUpload v-model="value" valueItemType="object" :valueMap="{url:'fileUrl',name:'fileName'}"></ImageUpload>
</template>

<script>
import ImageUpload from '@/components/base/imageUpload'
export default {
  components: {
    ImageUpload
  },
  data () {
    return {
      value: {
        fileUrl: '/api/file/download/1638860971429-17921558',
        fileName: 'banner1.png'
      }
    }
  }
}
</script>
```

##### 5. 自定义 urlRule
```vue
<template>
  <ImageUpload v-model="value" urlRule="{baseUrl}/api/file/download/{id}"></ImageUpload>
</template>

<script>
import ImageUpload from '@/components/base/imageUpload'
export default {
  components: {
    ImageUpload
  },
  data () {
    return {
      value: '1638860971429-17921558'
    }
  }
}
</script>
```

##### 6. 钩子方法 beforeUpload 和 beforeDelete
```vue
<template>
  <ImageUpload v-model="value" multiple :beforeUpload="handleBeforeUpload" :beforeDelete="handleBeforeDelete"></ImageUpload>
</template>

<script>
import ImageUpload from '@/components/base/imageUpload'
export default {
  components: {
    ImageUpload
  },
  data () {
    return {
      value: ['1638860971429-17921558', '1638866190262-675348414']
    }
  },
  methods: {
    handleBeforeUpload (file, imageList) {
      if (imageList.length >= 2) {
        this.$toast('最多可上传2张图片')
        return false
      }
    },
    handleBeforeDelete (imageItem, imageList) {
      if (imageList.length <= 1) {
        this.$toast('至少上传1张图片')
        return false
      }
    }
  }
}
</script>
```

##### 7. 自定义图片上传地址和参数
```vue
<template>
  <ImageUpload v-model="value" apiUrl="/api/file/upload" fileProperty="file" :data="{bizType:'01'}"></ImageUpload>
</template>

<script>
import ImageUpload from '@/components/base/imageUpload'
export default {
  components: {
    ImageUpload
  },
  data () {
    return {
      value: null
    }
  }
}
</script>

```

##### 8. 使用 convertor
```vue
<template>
  <ImageUpload :value="value" valueItemType="object" :convertor="getConvertor(value)"></ImageUpload>
</template>

<script>
import ImageUpload from '@/components/base/imageUpload'
export default {
  components: {
    ImageUpload
  },
  data () {
    return {
      value: {
        fileUrl: null,
        fileName: null,
        other: '01'
      }
    }
  },
  methods: {
    getConvertor (obj) {
      return {
        from: (valueItem) => {
          if ( valueItem.fileUrl) {
            return {
              url: valueItem.fileUrl,
              name: valueItem.fileName
            }
          } else {
            return null
          }
        },
        to: (imageItem) => {
          if (imageItem) {
            obj.fileUrl = imageItem.url
            obj.fileName = imageItem.name
          } else {
            obj.fileUrl = null
            obj.fileName = null
          }
          return obj
        }
      }
    }
  }
}
</script>
```

