# SVG图标组件
#### 一、SVG文件存放目录
SVG图标组件使用的svg文件存放在src/assets/icon目录下

#### 二、属性
##### 1. name: String
* 图标名称
* 值需要与src/assets/icon目录下svg文件的名称一致（name值不含“.svg”后缀）

##### 2. scale: Number | String
* 缩放图标
* 默认为: 1

##### 3. spin: Boolean
* 图标是否有旋转效果
* 默认为：false

##### 4. pulse: Boolean
* 图标是否有脉冲旋转的效果
* 默认为：false

##### 5. flip: String
* 图标如何翻转
* 值为：'horizontal'(水平翻转) 或 'vertical'(垂直翻转)
* 默认为：null

##### 6. class: String
* 自定义类名
* 用于自定义样式改变图标的大小和颜色
```css
font-size: 20px; /* 指定图标的大小 */
color: #fff; /* 指定图标的颜色 */
```

### 三、示例
#### 1. 简单示例
```
<BaseIcon name="tick"></BaseIcon>
```
> icon已定义为全局组件，不需要单独引入

#### 2. 自定义样式示例
```
<BaseIcon name="tick" class="customer-icon"></BaseIcon>
```
CSS:
```
.customer-icon{
  font-size: 24px;
  color: #007bff;
}
```
#### 3. 缩放示例
```
<BaseIcon name="tick" scale="2"></BaseIcon>
```
> 图标放大两倍
#### 4. 旋转效果示例
```
<BaseIcon name="tick" :spin="true"></BaseIcon>
```
#### 5. 脉冲旋转示例
```
<BaseIcon name="tick" :pulse="true"></BaseIcon>
```
#### 6. 水平翻转示例
```
<BaseIcon name="tick" flip="horizontal"></BaseIcon>
```
#### 7. 垂直翻转示例
```
<BaseIcon name="tick" flip="vertical"></BaseIcon>
```

