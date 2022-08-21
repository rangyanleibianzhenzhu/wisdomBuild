# 右下角通知浮窗（只PC端可用）
#### 属性
##### 1. content
* 通知内容
* 值为字符串类型
##### 2. type
* 通知类型：normal、success、info、warn、error
* 值为字符串，默认为“normal”


### 示例
```vue
import notify from '@/components/pc/notification/index.js'

export default {
  methods: {
    // 简单通知
    simpleHandle (event) {
      notify('保存成功！')
    },
    // success类型通知
    successHandle (event) {
      notify({
        type: 'success',
        content: '保存成功！'
      })
    },
    // info类型通知
    infoHandle (event) {
      notify({
        type: 'info',
        content: '文章已发布。'
      })
    },
    // warn类型通知
    warnHandle (event) {
      notify({
        type: 'warn',
        content: '今日操作次数超过阈值。'
      })
    },
    // error类型通知
    errorHandle (event) {
      notify({
        type: 'error',
        content: '删除失败！'
      })
    }
  }
}
```

### 使用插件
* 在入口文件引用插件并使用
```vue
import NotificationPlugin from './plugins/notificationPlugin.js'

Vue.use(NotificationPlugin)
```
* 在自定义组件中使用 $notify 全局方法
```vue
methods: {
  // 简单通知
  simpleHandle (event) {
    this.$notify('保存成功！')
  }
}
```
