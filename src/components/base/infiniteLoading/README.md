# 无限加载组件
#### 属性
##### 1. distance
* 触发加载的临界距离
* 值为数字类型(单位：px)，默认值为100
##### 2. spinner
* 加载器动画类型
* 值为字符串类型，必须是以下值之一
  * default: 默认类型，圆环上有一个旋转球
  * circles: 多个圆点旋转
  * bubbles: 由小到大的气泡旋转
  * spiral: 圆弧旋转
  * wavedots: 圆点波浪
##### 3. direction
* 无限加载的方向
* 值为字符串类型，必须是"bottom" 或者 "top"
  * bottom：到底自动加载（默认）
  * top：到顶自动加载
##### 4. forceUseInfiniteWrapper
* 强制指定滚动目标元素
* 值为布尔类型或者字符串类型，默认为false
  * 值为false(默认)：会寻找最近的具备 overflow-y: auto | scroll CSS 样式的父元素作为滚动容器
  * 值为true：会向上查找最近的具备 infinite-wrapper 属性的父元素作为滚动容器
  * 值为字符串，则会将该值当作 CSS 选择器并使用 querySelector 查找该元素，将其作为滚动容器，例如：'.block-body'
##### 5. identifier
* 无限加载的标识，当值改变时组件重新初始化，可用于列表刷新、切换条件查询等情况
* 类型无限制，一般使用时间戳作为标识，例：
  * +new Date()、Date.now() 或者 new Date().getTime()

#### 事件
##### 1. infinite
* 滚动距离小于 distance 属性时触发的数据加载事件。此事件的监听函数需要请求新的数据，并添加到列表；事件会传递$state 参数，用于设置组件的状态，例如：获取到新数据后需要执行$state.loaded() 将状态设置为已加载，否则加载器动画会不停旋转
* 参数：$state 组件状态对象
    * **$state.loaded**：此次数据加载完成后需要执行的方法，会关闭加载动画并继续监听滚动事件。
    * **$state.complete**：所有数据都加载完成时需要执行的方法。如果调用此方法前没有调用过 $state.loaded，那么 no-results 的内容将会被展示；如果调用此方法前调用过 $state.loaded，那么 no-more 的内容将会被展示。
    * **$state.error**：当此次数据加载失败时需要执行的方法，会显示 error 的内容并显示按钮，点击按钮后会再次请求加载数据。

#### 插槽
##### 1. no-results
在没有加载到任何数据时展示的内容(即没有调用过 $state.loaded 方法就调用了 $state.complete 方法时展示)
##### 2. no-more
所有数据都已经加载完时展示的内容(即调用过 $state.loaded 方法之后调用了 $state.complete 方法时展示)
##### 3. error
加载出现错误时展示的内容(即调用 $state.error 方法时展示)
##### 4. spinner
加载数据时展示的加载动画内容
###### 插槽示例：
```vue
<InfiniteLoading
  @infinite="infiniteHandler"
  :identifier="infiniteId">
  <span class="no-results" slot="no-results">没有查到任何数据~</span>
  <span class="no-more" slot="no-more">没有更多了~</span>
  <span class="error" slot="error">加载失败了~</span>
</InfiniteLoading>
```

### 示例
```vue
<template>
<div class="base-list">
  <div class="block">
    <div class="block-head">
      <h3>
        <div class="header-right" @click="refresh">
          <BaseIcon name="refresh" class="refresh-icon"></BaseIcon>
        </div>
        <span class="header-text">无限加载</span>
      </h3>
    </div>

    <div class="block-body clearfix">
      <table class="table-list">
        <thead class="table-thead">
        <tr>
          <th class="table-align-left">公司名称</th>
          <th class="table-align-left">联络人</th>
          <th class="table-align-left">产品</th>
          <th class="table-align-left">处理状态</th>
          <th class="table-align-left">分配状态</th>
          <th class="table-align-left">更新时间</th>
        </tr>
        </thead>
        <tbody class="table-tbody">
          <tr v-for="item in dataList" class="table-align-center" :key="item.id">
            <td class="table-align-left">{{item.company}}</td>
            <td class="table-align-left">{{item.name}}</td>
            <td class="table-align-left">{{item.product}}</td>
            <td class="table-align-left">{{item.dealStatus}}</td>
            <td class="table-align-left">{{item.assignStatus}}</td>
            <td class="table-align-left">{{item.updateTime}}</td>
          </tr>
        </tbody>
      </table>
      <InfiniteLoading
        @infinite="infiniteHandler"
        :identifier="infiniteId">
      </InfiniteLoading>
    </div>
  </div>
</div>
</template>
<script>
import InfiniteLoading from '@/components/base/InfiniteLoading'

export default {
  name: 'InfiniteLoadingDemo',
  components: {
    InfiniteLoading
  },
  data () {
    return {
      // 是否加载中
      isLoading: false,
      // 无限加载标识，如果发生改变则组件重置
      infiniteId: +new Date(),
      // 列表数据
      dataList: [],
      // 分页页码
      pageNo: 0,
      // 每页条数（即每次加载数据量）
      pageSize: 50
    }
  },
  methods: {
    // 加载时触发的方法
    infiniteHandler ($state) {
      if (!this.isLoading) {
        this.doQuery(this.pageNo + 1).then((result) => {
          if (result && result.length > 0) {
            $state && $state.loaded()
          } else {
            $state && $state.complete()
          }
        }, (err) => {
          console.error('数据加载失败！', err)
          $state && $state.error()
        })
      }
    },
    // 按分页查询方法
    doQuery (pageNo) {
      this.isLoading = true
      return new Promise((resolve, reject) => {
        this.$apiPost({
          url: '/api/basicList/query',
          params: { pageSize: this.pageSize, pageNo }
        }).then(data => {
          this.pageNo = data.page.pageNo
          this.count = data.page.count
          this.dataList.push(...data.page.list)
          // this.dataList.unshift(...data.page.list.reverse()) // 加载方向为top时的数据添加方式
          this.pageNo = data.page.pageNo
          this.pageSize = data.page.pageSize
          this.isLoading = false
          resolve(data.page.list)
        }, e => {
          if (e.name === 'BusinessError' && !e.ignore) {
            this.$toast(e.message)
          }
          this.isLoading = false
          reject(e)
        })
      })
    },
    // 刷新
    refresh () {
      this.dataList = []
      this.pageNo = 0
      this.infiniteId = +new Date()
    }
  }
}
</script>
<style lang="scss" scoped>
.base-list {
  margin: 20px;
  padding: 20px;
  .block {
    margin-bottom: 30px;
    border-radius: 5px;
    background-color: #fff;
    .block-head {
      height: 55px;
      padding: 0 25px;
      vertical-align: middle;
      border-bottom: 1px solid $border-color-light;
      h3 {
        font-size: 17px;
        line-height: 55px;
        .header-text {
          vertical-align: middle;
        }
        .header-right {
          float: right;
          height: 55px;
          padding-top: 7px;
          cursor: pointer;
          .refresh-icon {
            @include primary-font-color();
          }
        }
      }
    }
    .block-body {
      height: 420px;
      overflow-y: auto;
      padding: 25px;
      table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        tr {
          height: 48px;
          background-color: #FFF;
          th, td {
            padding: 0 .5em;
            border-left: 0;
            border-bottom: 1px solid #e8e8e8;
          }
        }
        thead tr {
          background-color: #fafafa;
          th {
            font-weight: bold;
            white-space: nowrap;
          }
        }
        tbody tr {
          &:hover {
            @include primary-background-color(.1);
          }
          td {
            a {
              @include primary-font-color();
            }
          }
        }
        .table-align-left{
          text-align: left;
        }
        .table-align-center{
          text-align: center;
        }
        .table-align-right{
          text-align: right;
        }
      }
    }
  }
}
</style>
```
