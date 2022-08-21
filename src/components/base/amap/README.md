# 地图定位组件
#### 属性
##### 1. value
* 位置信息
* 值为对象
* 值示例：
```
{
    address: '北京市朝阳区奥运村街道奥林匹克森林公园奥林匹克森林公园南园',
    lng: 116.389006,
    lat: 40.015535
}
````
##### 2. editable
* 是否可编辑（即修改位置）
* 值为布尔类型
* 默认值为 false

##### 样式要求
* 组件外面需要包裹可以相对定位的元素，增加样式：```position: relative```

### 示例
```vue
<template>
<div class="amap-demo">
  <ul class="form-list">
    <li class="form-item" @click="popupBox1">
      <div class="item-content">
        <label>位置查看：</label>
        <span>{{value1 && value1.address}}</span>
      </div>
      <div class="arrow">
        <BaseIcon name="right-arrow"></BaseIcon>
      </div>
    </li>
    <li class="form-item" @click="popupBox2">
      <div class="item-content">
        <label>位置定位：</label>
        <span>{{value2 && value2.address}}</span>
      </div>
      <div class="arrow">
        <BaseIcon name="right-arrow"></BaseIcon>
      </div>
    </li>
  </ul>
</div>
</template>
<script>
import popupFullBox from '@/components/m/fullBox'
import AMap from '@/components/base/amap/AMap.vue'

export default {
  name: 'AMapDemoM',
  data () {
    return {
      value1: {
        address: '北京市朝阳区奥运村街道奥林匹克森林公园奥林匹克森林公园南园',
        lng: 116.389006,
        lat: 40.015535
      },
      value2: null
    }
  },
  methods: {
    popupBox1 () {
      popupFullBox({
        title: '位置查看',
        scroll: false,
        content: AMap,
        contentProps: {
          value: this.value1
        }
      })
    },
    popupBox2 () {
      popupFullBox({
        title: '地图定位',
        scroll: false,
        content: AMap,
        contentProps: {
          value: this.value2,
          editable: true
        },
        contentEvents: {
          changePosition: (v) => {
            this.value2 = v
          }
        }
      })
    }
  }
}
</script>
```
