# 表单项组件
#### 属性
##### 1. columns 总分栏数
* 值为数值类型
* 默认值: 12
##### 2. size 表单项大小，即表单项所占的分栏数
* 值为数值类型(数值范围：1 到 columns 的值)
* 默认值: 4
* 说明：
  当 columns 为 12 时，size值范围：1 到 12；当 columns 为24时，size值范围：1 到 24；
  当 columns 为 12 时，size为 12，表示该表单项占一整行；当 columns 为 24 时，size为 24，表示该表单项占一整行；
  当 columns 为 12 时，如果想要一行布局 3 项， 则 size 应设置为 4 ( 12 / 3 = 4 )
##### 3. required 表单项标签是否显示必填样式
* 值为布尔类型
* 默认值：false

##### 4. label 表单项标签名称
* 值为字符串类型
* 默认值：""
* 说明：当有label类型的插槽时忽略此设置

##### 5. labelSize 表单项标签长度
* 值为数值类型
* 默认值：5，表示5个字符的长度

##### 6. labelColon 表单项标签名称后是否加冒号
* 值为布尔类型
* 默认值：true

##### 7. error 错误信息数组
* 值为字符串数组类型
* 示例：["{{label}}不能为空", "手机号码格式错误"]
* 说明：当错误信息不为空时，表单项右侧会出现错误图标，鼠标悬浮在错误图标上时会显示错误信息

#### 插槽
##### 1. 默认插槽
* 默认插槽用于插入表单项输入框、下拉框、日期选择器等组件
示例：
```vue
<FormItem label="地址">
  <input v-model="bill.address">
</FormItem>
```
##### 2. label插槽
* label 插槽用于自定义表单项标签
示例：
```vue
<FormItem label="地址">
  <template slot="label">
    <BaseIcon name="address"></BaseIcon>
    <span>地址：</span>
  </template>
  <input v-model="bill.address">
</FormItem>
```
