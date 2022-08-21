# 一、弹出窗口组件（只PC端可用）
## 1. Popup 组件
### Popup 属性
##### 1. value
* 是否显示弹框
* 值为布尔类型
* 默认值：false
##### 2. showClose
* 是否显示关闭按钮
* 值为布尔类型
* 默认值为true
##### 3. title
* 弹出窗口标题
* 值为字符串
* Popup 默认为'提示'，Alert 和Confirm 默认为空
##### 4. showClose
* 是否显示右上角关闭按钮
* 值为布尔类型
* Popup 默认为true，Alert 和Confirm 默认为false
##### 5. message
* 信息内容
* 值为字符串
> 如果有默认插槽则该配置无效
##### 6. html
* html内容
* 值为字符串
> 如果有默认插槽则该配置无效
> 如果message有值则该配置无效
##### 7. content
* 弹框内容组件
* 值为Vue组件
> 如果有默认插槽则该配置无效
> 如果message或者html有值则该配置无效
##### 8. contentProps
* 弹窗内容组件的props
* 值为Object类型，属性名为组件的props的属性
> content 有值时该配置才有效
##### 9. contentEvents
* 弹窗内容组件的事件
* 值为Object类型，属性名为组件事件名，属性值为事件回调方法
> content 有值时该配置才有效
##### 10. contentWrapperStyle
* 内容包裹器样式
* 值为Object类型，属性名为样式
```vue
<BasePopup v-model="isShow" message="保存成功!"
  :contentWrapperStyle="{ fontWeight: 'bold' }"></BasePopup>
```
##### 11. width
* 弹出窗口宽度
* 值为数值类型
* 默认值：500，单位为像素
##### 12. height
* 弹出窗口宽度
* 值为数值类型
* 默认值：300，单位为像素
##### 13. className
* 弹框自定义样式名
* 值为字符串
##### 14. scroll
* 内容区域是否需要滚动条(scroll为false时如果内容溢出会自动显示滚动条)
* 值为布尔类型
* 默认值：false
##### 15. cover
* 遮罩层覆盖范围
* 值为字符串
* 默认值：“full”
  * full 覆盖整个屏幕
  * tab  覆盖tab页功能区域，左侧菜单栏、顶部区域、tab页签选择区域不会被覆盖

## 插槽
##### 1. default
* 默认插槽为弹框内容
##### 2. bottom
* 弹框底部插槽，一般用于放操作按钮

## 脚本调用特有属性
##### 1.store
* Vuex 的 store 对象，当弹窗中需要使用 Vuex 的全局数据时设置
> 当使用 `vm.$popup()` 或者 `vm.$popupAlert()` 或者 `vm.$popupConfirm()` 时会默认设置为当前 Vue 实例的 $store

##### 2.router
* Vue Router 的 router 对象，当弹窗中需要使用路由时设置
> 当使用 `vm.$popup()` 或者 `vm.$popupAlert()` 或者 `vm.$popupConfirm()` 时会默认设置为当前 Vue 实例的 $router

## Alert 组件特有属性
##### 1.btnText
* 按钮文字
* 值为字符串
* 默认值：'确定'

## Alert 组件特有事件
##### 1.ok
* 点击按钮后触发的事件
* 无参数

## Confirm 组件特有属性
##### 1.okBtnText
* “确定”按钮文字
* 值为字符串
* 默认值：'确定'
##### 2.cancelBtnText
* “取消”按钮文字
* 值为字符串
* 默认值：'取消'

#### Confirm 组件特有事件
##### 1.ok
* 点击“确定”按钮后触发的事件
* 无参数

##### 2.cancel
* 点击“取消”按钮后触发的事件
* 无参数

# 二、弹出窗口示例
## 1. Popup 示例

#### 简单示例
```vue
<template>
  <div>
    <BaseButton @click="doOpen()">简单弹窗</BaseButton>

    <!-- 简单弹框 -->
    <BasePopup v-model="isShow" title="提示信息" message="已修改成功!"></BasePopup>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'
import BasePopup from '@/components/pc/popup/Popup.vue'

export default {
  name: 'PcPopupSimpleDemo',
  components: {
    BaseButton,
    BasePopup
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    doOpen () {
      this.isShow = true
    }
  }
}
</script>
```

#### 自定义内容示例
```vue
<template>
  <div>
    <BaseButton @click="doOpen()">自定义内容</BaseButton>

    <!-- 自定义内容的弹框 -->
    <BasePopup v-model="isShow" title="提示信息" :width="300" :height="280">
      <div class="info-content">
        <p><BaseIcon name="cry" class="info-icon"></BaseIcon></p>
        <p>修改失败了</p>
      </div>
    </BasePopup>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'
import BasePopup from '@/components/pc/popup/Popup.vue'

export default {
  name: 'PcPopupDemo',
  components: {
    BaseButton,
    BasePopup
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    doOpen () {
      this.isShow = true
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
.info-content{
  padding: 50px 24px;
  font-size: 16px;
  text-align: center;
  .info-icon{
    font-size: 84px;
    @include primary-font-color();
    margin-bottom: 10px;
  }
}
</style>
```

#### 带滚动条示例
```vue
<template>
  <div>
    <BaseButton @click="doOpen()">带滚动条</BaseButton>

    <!-- 带滚动条的自定义内容的弹框 -->
    <BasePopup v-model="isShow" title="银行列表" :width="260" :height="320" :scroll="true">
      <div class="info-content">
        <ul>
          <li>中国建设银行</li>
          <li>中国工商银行</li>
          <li>中国农业银行</li>
          <li>中国交通银行</li>
          <li>中国银行</li>
          <li>中国招商银行</li>
          <li>邮政储蓄银行</li>
        </ul>
      </div>
    </BasePopup>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'
import BasePopup from '@/components/pc/popup/Popup.vue'

export default {
  name: 'PcPopupScrollDemo',
  components: {
    BaseButton,
    BasePopup
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    doOpen () {
      this.isShow = true
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
.info-content{
  padding: 24px;
  font-size: 16px;
  line-height: 50px;
  ul {
    list-style: none;
  }
}
</style>
```

#### 动态指定组件作为内容示例
```vue
<template>
  <div>
    <BaseButton @click="doOpen()">动态指定组件作为内容</BaseButton>

    <!-- 动态指定组件作为内容的弹框 -->
    <BasePopup v-model="isShow" title="用户信息" :width="300" :height="200" :scroll="true"
               :content="contentComponent" :contentProps="contentProps"
               :contentEvents="contentEvents" :contentWrapperStyle="contentWrapperStyle"></BasePopup>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'
import BasePopup from '@/components/pc/popup/Popup.vue'
import Content from './Content.vue'

export default {
  name: 'PcPopupDynamicDemo',
  components: {
    BaseButton,
    BasePopup
  },
  data () {
    return {
      isShow: false,
      contentComponent: Content,
      contentProps: {
        name: 'Tom',
        phone: 18399998888
      },
      contentEvents: {
        click () {
          console.log('点击了用户信息')
        }
      },
      contentWrapperStyle: {
        padding: '30px 20px 30px 50px',
        textAlign: 'left'
      }
    }
  },
  methods: {
    doOpen () {
      this.isShow = true
    }
  }
}
</script>
```

## 2. Alert 示例
#### 简单带一个按钮示例
```vue
<template>
  <div>
    <BaseButton @click="doOpen()">带一个按钮</BaseButton>

    <!-- 带一个按钮的警告弹框 -->
    <BaseAlert v-model="isShow" message="保存成功!" btnText="继续" @ok="doOK"></BaseAlert>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'
import BaseAlert from '@/components/pc/popup/Alert.vue'

export default {
  name: 'PcAlertDemo',
  components: {
    BaseButton,
    BaseAlert
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    doOpen () {
      this.isShow = true
    },
    doOK () {
      console.log('触发ok事件')
    }
  }
}
</script>
```

#### 带一个按钮（有标题、可关闭）示例
```vue
<template>
  <div>
    <BaseButton @click="doOpen()">带一个按钮（有标题、可关闭）</BaseButton>

    <!-- 带一个按钮（有标题、可关闭）的警告弹框 -->
    <BaseAlert v-model="isShow" message="保存成功!" title="提示" :showClose="true" btnText="确定" @ok="doOK"></BaseAlert>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'
import BaseAlert from '@/components/pc/popup/Alert.vue'

export default {
  name: 'PcAlertHeaderDemo',
  components: {
    BaseButton,
    BaseAlert
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    doOpen () {
      this.isShow = true
    },
    doOK () {
      console.log('触发ok事件')
    }
  }
}
</script>
```

## 3. Confirm 示例
#### 带确认、取消按钮示例
```vue
<template>
  <div>
    <BaseButton @click="doOpen()">带确认、取消按钮</BaseButton>

    <!-- 带确定和取消按钮的确认弹框 -->
    <BaseConfirm v-model="isShow" message="确定删除订单？" @ok="doOK" @cancel="doCancel"></BaseConfirm>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'
import BaseConfirm from '@/components/pc/popup/Confirm.vue'

export default {
  name: 'PcConfirmDemo',
  components: {
    BaseButton,
    BaseConfirm
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    doOpen () {
      this.isShow = true
    },
    doOK () {
      console.log('触发ok事件')
    },
    doCancel () {
      console.log('触发cancel事件')
    }
  }
}
</script>
```

#### 带确认、取消按钮（有标题、可关闭）示例
```vue
<template>
  <div>
    <BaseButton @click="doOpen()">带确认、取消按钮（有标题、可关闭）</BaseButton>

    <!-- 带确定和取消按钮（有标题、可关闭）的确认弹框 -->
    <BaseConfirm v-model="isShow" message="确定删除订单？" title="提示" :showClose="true" @ok="doOK" @cancel="doCancel"></BaseConfirm>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'
import BaseConfirm from '@/components/pc/popup/Confirm.vue'

export default {
  name: 'PcConfirmHeaderDemo',
  components: {
    BaseButton,
    BaseConfirm
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    doOpen () {
      this.isShow = true
    },
    doOK () {
      console.log('触发ok事件')
    },
    doCancel () {
      console.log('触发cancel事件')
    }
  }
}
</script>
```

# 三、脚本方式调用示例
## 1. Popup 示例

#### 简单弹窗示例
```vue
<template>
  <div>
    <BaseButton @click="doOpen()">简单弹窗</BaseButton>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'
import { popup } from '@/components/pc/popup/index.js'

export default {
  name: 'PcJsPopupSimpleDemo',
  components: {
    BaseButton
  },
  methods: {
    doOpen () {
      popup('保存成功！')
    }
  }
}
</script>
```

#### 设置弹窗参数示例
```vue
<template>
  <div>
    <BaseButton @click="doOpen()">设置弹窗参数</BaseButton>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'
import { popup } from '@/components/pc/popup/index.js'

export default {
  name: 'PcJsPopupDemo',
  components: {
    BaseButton
  },
  methods: {
    doOpen () {
      popup({
        title: '提示信息',
        message: '保存成功！',
        width: 250,
        height: 200
      })
    }
  }
}
</script>
```

#### html作为内容示例
```vue
<template>
  <div>
    <BaseButton @click="doOpen()">html作为内容</BaseButton>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'
import { popup } from '@/components/pc/popup/index.js'

export default {
  name: 'PcJsHtmlPopupDemo',
  components: {
    BaseButton
  },
  methods: {
    doOpen () {
      popup({ html: `<div class="message">
                      <p style="color: red;font-size: 30px;margin-bottom: 20px">导入失败！</p>
                      <p>第1行：身份证号不能为空！</p>
                      <p>第3行：手机号码不能为空！</p>
                    </div>` })
    }
  }
}
</script>
```

#### 组件作为内容示例
```vue
<template>
  <div>
    <BaseButton @click="doOpen()">组件作为内容</BaseButton>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'
import { popup } from '@/components/pc/popup/index.js'
import Content from './Content.vue'

export default {
  name: 'PcJsPopupDynamicDemo',
  components: {
    BaseButton
  },
  methods: {
    doOpen () {
      popup({
        title: '用户信息',
        content: Content,
        contentProps: {
          name: 'Tom',
          phone: 18399998888
        },
        contentEvents: {
          click () {
            console.log('触发click事件')
          }
        },
        contentWrapperStyle: {
          padding: '30px 20px 30px 50px',
          textAlign: 'left'
        },
        width: 300,
        height: 200
      })
    }
  }
}
</script>
```

## 2. Alert 示例
#### 简单带一个按钮示例
```vue
<template>
  <div>
    <BaseButton @click="doOpen()">带一个按钮</BaseButton>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'
import { popupAlert } from '@/components/pc/popup/index.js'

export default {
  name: 'PcJsAlertDemo',
  components: {
    BaseButton
  },
  methods: {
    doOpen () {
      popupAlert({
        message: '确定要删除？',
        btnText: '确认',
        onOK () {
          console.log('触发ok事件')
        }
      })
    }
  }
}
</script>
```

#### 带一个按钮（有标题、可关闭）示例
```vue
<template>
  <div>
    <BaseButton @click="doOpen()">带一个按钮（有标题、可关闭）</BaseButton>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'
import { popupAlert } from '@/components/pc/popup/index.js'

export default {
  name: 'PcJsAlertHeaderDemo',
  components: {
    BaseButton
  },
  methods: {
    doOpen () {
      popupAlert({
        title: '提示',
        showClose: true,
        message: '确定要删除？',
        btnText: '确认',
        onOK () {
          console.log('触发ok事件')
        }
      })
    }
  }
}
</script>
```

## 3. Confirm 示例
#### 带确认、取消按钮示例
```vue
<template>
  <div>
    <BaseButton @click="doOpen()">带确认、取消按钮</BaseButton>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'
import { popupConfirm } from '@/components/pc/popup/index.js'

export default {
  name: 'PcJsConfirmDemo',
  components: {
    BaseButton
  },
  methods: {
    doOpen () {
      popupConfirm({
        message: '是否继续？',
        okBtnText: '继续',
        cancelBtnText: '不了',
        onOK: () => {
          console.log('触发ok事件')
        },
        onCancel: () => {
          console.log('触发cancel事件')
        }
      })
    }
  }
}
</script>
```

#### 带确认、取消按钮（有标题、可关闭）示例
```vue
<template>
  <div>
    <BaseButton @click="doOpen()">带确认、取消按钮（有标题、可关闭）</BaseButton>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'
import { popupConfirm } from '@/components/pc/popup/index.js'

export default {
  name: 'PcJsConfirmHeaderDemo',
  components: {
    BaseButton
  },
  methods: {
    doOpen () {
      popupConfirm({
        title: '提示',
        showClose: true,
        message: '是否继续？',
        okBtnText: '继续',
        cancelBtnText: '不了',
        onOK: () => {
          console.log('触发ok事件')
        },
        onCancel: () => {
          console.log('触发cancel事件')
        }
      })
    }
  }
}
</script>
```

#### tab页内弹窗示例
```vue
<template>
  <div>
    <BaseButton @click="doOpen()">tab页内弹窗</BaseButton>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'

export default {
  name: 'PcJsPopupSimpleDemo',
  components: {
    BaseButton
  },
  methods: {
    doOpen () {
      this.$popup({ message: '保存成功！', cover: 'tab' })
    }
  }
}
</script>
```

