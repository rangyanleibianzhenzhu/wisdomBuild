# 日期选择器（只PC端可用）
#### 属性
##### 1. value
* 当前日期值
* 值为字符串(默认“yyyy-MM-dd”格式)、时间戳数字(1970 年 1 月 1 日至今的毫秒数)或者Date类型
##### 2. valueType
* 当前值类型
* 值为字符串, 必须是"string"、 "timestamp" 、 "date"其中一个
  * string: 日期字符串，默认“yyyy-MM-dd”格式
  * timestamp: 时间戳数字，1970 年 1 月 1 日至今的毫秒数
  * date: Date类型的对象
##### 3. format
* 日期格式（用于字符串类型的值、可选日期的最小值、可选日期的最大值和input输入框） 
* 值为字符串，默认值为："yyyy-MM-dd"
##### 4. disabledDate
* 判断不可用日期的方法
* 值为Function类型
  * 参数：val {Date} Date类型日期值
  * 返回：isDisabled {Boolean} 是否为不可用日期
##### 5. minValue
* 可选日期的最小值
* 值为字符串，日期格式为format指定的格式，格式默认为：yyyy-MM-dd
##### 6. maxValue
* 可选日期的最大值
* 值为字符串，日期格式为format指定的格式，格式默认为：yyyy-MM-dd
##### 7. showToday
* 是否显示“今天”按钮
* 值为布尔类型，默认为：false
##### 8. showClear
* 是否显示“清空”按钮
* 值为布尔类型，默认为：false
##### 9. defaultMonth
* 当值为空时，日历默认展示的月份
* 值为字符串，月份值的格式为“yyyy-MM”或者“yyyy-MM-dd”

### 示例
```vue
<template>
  <ul>
    <li>
        <p>值为：{{value1}}</p>
        <BaseDatePicker v-model="value1" @change="doChange"></BaseDatePicker>
        <p>无默认值</p>
      </li>
      <li>
        <p>值为：{{value2}}</p>
        <BaseDatePicker v-model="value2" @change="doChange"></BaseDatePicker>
        <p>有默认值</p>
      </li>
      <li>
        <p>值为：{{value3}}</p>
        <BaseDatePicker v-model="value3" :showClear="true" @change="doChange"></BaseDatePicker>
        <p>带“清除”按钮</p>
      </li>
      <li>
        <p>值为：{{value4}}</p>
        <BaseDatePicker v-model="value4" :showToday="true" @change="doChange"></BaseDatePicker>
        <p>带“今天”按钮</p>
      </li>
      <li>
        <p>值为：{{value5}}</p>
        <BaseDatePicker v-model="value5" minValue="2020-06-01" @change="doChange"></BaseDatePicker>
        <p>minValue='2020-06-01'</p>
      </li>
      <li>
        <p>值为：{{value6}}</p>
        <BaseDatePicker v-model="value6" maxValue="2020-06-30" @change="doChange"></BaseDatePicker>
        <p>maxValue='2020-06-30'</p>
      </li>
      <li>
        <p>值为：{{value7}}</p>
        <BaseDatePicker v-model="value7" minValue="2020-06-01" maxValue="2020-06-30" @change="doChange"></BaseDatePicker>
        <p>minValue='2020-06-01' 并且 maxValue='2020-06-30'</p>
      </li>
      <li>
        <p>值为：{{value8}}</p>
        <BaseDatePicker v-model="value8" defaultMonth="1990-06" @change="doChange"></BaseDatePicker>
        <p>设置日历默认月份为1990年6月</p>
      </li>
      <li>
        <p>值为：{{value9}}</p>
        <BaseDatePicker v-model="value9" format="yyyy/MM/dd" @change="doChange"></BaseDatePicker>
        <p>日期值格式设置为：yyyy/MM/dd</p>
      </li>
      <li>
        <p>值为：{{value11}}</p>
        <BaseDatePicker v-model="value11" valueType="string" @change="doChange"></BaseDatePicker>
        <p>valueType="string"(默认值)</p>
      </li>
      <li>
        <p>值为：{{value12}}</p>
        <BaseDatePicker v-model="value12" valueType="timestamp" @change="doChange"></BaseDatePicker>
        <p>valueType="timestamp"</p>
      </li>
      <li :style="{marginTop: '-21px'}">
        <p>值为：{{value13}}</p>
        <BaseDatePicker v-model="value13" valueType="date" @change="doChange"></BaseDatePicker>
        <p>valueType="date"</p>
      </li>
  </ul>
</template>
<script>
import BaseDatePicker from '@/components/pc/datePicker/datePicker.vue'
export default {
  name: 'DatePickerDemoPC',
  components: {
    BaseDatePicker
  },
  data () {
    return {
      value1: null,
      value2: '2019-07-28',
      value3: '2020-02-28',
      value4: '',
      value5: '2020-06-11',
      value6: '2020-06-11',
      value7: '2020-06-11',
      value8: null,
      value9: '2020/09/01',

      value11: '2019-09-01',
      value12: 1598889600000,
      value13: new Date('2020/09/01')
    }
  },
  methods: {
    doChange (val) {
      console.log('触发change事件，value = ', val)
    }
  }
}
</script>
```
