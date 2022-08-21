<template>
  <li class="timeline-item">
    <div class="timeline-item__tail"></div>
    <div :class="['timeline-item__node', 'timeline-item__node--'+size, type ? 'timeline-item__node--'+type : 'timeline-item__node--']" :style="{backgroundColor:color}">
      <BaseIcon :name="icon"></BaseIcon>
    </div>
    <div class="timeline-item__wrapper">
      <div class="timeline-item__timestamp is-top" v-if="placement == 'top'">{{timestamp}}</div>
      <div class="timeline-item__content"><slot></slot></div>
      <div class="timeline-item__timestamp is-bottom" v-if="placement == 'bottom'">{{timestamp}}</div>
    </div>
  </li>
</template>
<script>
export default {
  name: "TimelineItem",
  components: {},
	props: {
		// 时间戳
		timestamp: String,
    // 节点类型 primary / success / warning / danger / info
		type: String, 
    // 节点颜色
		color: String, 
    // 节点图标 
		icon: String, 
    // 时间戳位置 top / bottom
    placement: {
      type: String,
      default: 'bottom'
    },
    // 节点尺寸 normal / large
    size: {
      type: String,
      default: 'normal'
    },
	},
  data() {
    return {};
  },
  methods: {
  },
};
</script>
<style lang="scss" scoped px2rem="false">
.timeline-item {
  position: relative;
  padding-bottom: 20px;
  &:last-child {
    .timeline-item__tail {
      display: none;
    }
  }
  .timeline-item__tail {
    position: absolute;
    left: 4px;
    height: 100%;
    border-left: 2px solid #e4e7ed;
  }
  .timeline-item__node {
    position: absolute;
    background-color: #e4e7ed;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .timeline-item__node--normal {
    left: -1px;
    width: 12px;
    height: 12px;
  }
  .timeline-item__node--large{
    left: -2px;
    width: 14px;
    height: 14px;
  }
  .timeline-item__node--primary{
    background-color: #409eff;
  }
  .el-timeline-item__node--success{
    background-color: #67c23a;
  }
  .el-timeline-item__node--warning{
    background-color: #e6a23c;
  }
  .el-timeline-item__node--danger{
    background-color: #f56c6c;
  }
  .el-timeline-item__node--info{
    background-color: #909399;
  }
  
  .timeline-item__wrapper {
    position: relative;
    padding-left: 28px;
    top: -3px;
    .timeline-item__content {
      color: #303133;
    }
    .timeline-item__timestamp {
      color: #909399;
      line-height: 1;
      font-size: 13px;
      &.is-top{
        margin-bottom: 8px;
        padding-top: 4px;
      }
      &.is-bottom {
        margin-top: 8px;
      }
    }
  }
}
</style>
