<template>
  <BasePopup v-model="visible" ref="basePop" class="alert-popup" :message="message" :title="title"
             :showClose="showClose" :width="width" :height="height" :scroll="scroll" :cover="cover"
             :contentWrapperStyle="contentWrapperStyle"
             :content="content" :contentProps="contentProps" :contentEvents="contentEvents"
             @close="doClose">
    <div slot="bottom" class="buttons">
      <BaseButton @click="doOK" type="primary" :text="btnText"></BaseButton>
    </div>
  </BasePopup>
</template>
<script>
import BasePopup from './Popup.vue'
import BaseButton from '../../base/button/index.vue'
export default {
  name: 'PopupAlertPC',
  components: {
    BasePopup,
    BaseButton
  },
  props: {
    // 是否显示弹框
    value: {
      type: Boolean,
      default: false
    },
    // 标题
    title: String,
    // 是否显示关闭按钮
    showClose: {
      type: Boolean,
      default: false
    },
    // 消息内容
    message: String,
    // 弹窗内容组件
    content: Object,
    // 弹窗内容组件的props
    contentProps: Object,
    // 弹窗内容组件的事件
    contentEvents: Object,
    // 内容包裹器样式
    contentWrapperStyle: Object,
    // 弹框宽度
    width: {
      type: Number,
      default: 300
    },
    // 弹框高度
    height: {
      type: Number,
      default: 220
    },
    // 内容区域是否需要滚动条
    scroll: {
      type: Boolean,
      default: false
    },
    // 遮罩层覆盖范围(full: 覆盖整个页面， tab: 覆盖当前tab页功能区域)
    cover: {
      type: String,
      default: 'full'
    },
    // 按钮文字
    btnText: {
      type: String,
      default: '确定'
    }
  },
  data () {
    return {
      // 是否显示
      visible: this.value
    }
  },
  watch: {
    value (val) {
      this.visible = val
    }
  },
  methods: {
    doClose () {
      this.visible = false
      this.$emit('input', this.visible)
      this.$emit('close')
    },
    doOK () {
      this.visible = false
      this.$emit('input', this.visible)
      this.$emit('ok')
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
$content-padding: 24px;
$bottom-height: 54px;
$bottom-height: 54px;
.alert-popup {
  .buttons{
    padding: (($bottom-height - 32px) / 2) $content-padding;
  }

  ::v-deep .popup-box {
    .popup-pane {
      .content-wrap {
        bottom: $bottom-height;
      }
      .bottom {
        border-top: solid 1px $border-color-light;
      }
    }
  }
}
</style>
