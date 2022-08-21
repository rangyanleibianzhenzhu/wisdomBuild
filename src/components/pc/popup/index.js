/**
 * 弹出窗口组件
 * 
 */
import Vue from 'vue'
import Popup from './Popup.vue'
import Alert from './Alert.vue'
import Confirm from './Confirm.vue'

// Popup构造函数
const PopupConstructor = Vue.extend({
  extends: Popup
})

// Alert构造函数
const AlertConstructor = Vue.extend({
  extends: Alert
})

// Confirm构造函数
const ConfirmConstructor = Vue.extend({
  extends: Confirm
})

// 获取tab页弹窗的父节点
function getTabPopupParentElement () {
  let tabContentElement = window.document.getElementById('tabsViewContent')
  if (tabContentElement) {
    let tabArray = tabContentElement.childNodes
    if (tabArray.length > 0) {
      return tabArray[0]
    }
  }
  return document.body
}

function initInstance (instance, options) {
  // 显示内容
  instance.message = typeof options === 'string' ? options : options.message
  // html内容
  instance.html = typeof options === 'object' ? options.html : null
  // 弹窗内容组件
  instance.content = typeof options === 'object' && options._isVue ? options : options.content
  // 弹窗内容组件参数
  instance.contentProps = typeof options.contentProps === 'object' ? options.contentProps : {}
  // 弹窗内容组件事件
  instance.contentEvents = typeof options.contentEvents === 'object' ? options.contentEvents : {}
  // 内容包裹器样式
  instance.contentWrapperStyle = options.contentWrapperStyle
  // 窗口宽度
  instance.width = typeof options.width === 'number' ? options.width : 300
  // 窗口高度
  instance.height = typeof options.height === 'number' ? options.height : 220
  // 自定义样式名
  instance.className = options.className || ''
  // 是否显示滚动条
  instance.scroll = options.scroll
  // 遮罩层覆盖范围(full: 覆盖整个页面， tab: 覆盖当前tab页功能区域，只显示tab页时可用)
  instance.cover = options.cover || 'full'
  // 父节点
  let parentElement = options.parentElement || (options.cover === 'tab' ? getTabPopupParentElement() : document.body)

  // 关闭时移除
  instance.$on('input', visible => {
    if (!visible) {
      setTimeout(() => {
        parentElement.removeChild(instance.$el)
        instance.$destroy()
      }, 2000)
      /* // 获取popBox元素，如果Popop组件从refs中获取，如果Alert或Confirm组件，先获取Popop，在从Popop组件refs中获取
        let popBox = instance.$refs.popBox || (instance.$refs.basePop && instance.$refs.basePop.$refs.popBox)
        popBox.addEventListener('transitionend', event => {
        // 动画完成后移除DOM节点
        // parentElement.removeChild(instance.$el)
        if (event.target.parentNode && event.target.parentNode.parentNode) {
          event.target.parentNode.parentNode.removeChild(event.target.parentNode)
        }
        // 销毁组件
        instance.$destroy()
      }) */
    }
  })
  // console.log('instance.$el=', instance.$el)
  // 将节点添加到文档
  parentElement.appendChild(instance.$el)

  instance.visible = true
  instance.closed = false
}

// 显示弹出窗口
export function popup (options = {}) {
  let instance = new PopupConstructor({
    el: document.createElement('div'),
    store: options.store || (this && this.$store),
    router: options.router || (this && this.$router)
  })
  initInstance(instance, options)
  // 弹窗标题
  instance.title = options.title || '提示'
  // 是否显示关闭按钮
  instance.showClose = typeof options.showClose === 'boolean' ? options.showClose : true
  return instance
}

// 显示提示框（底部有确定按钮）
export function popupAlert (options = {}) {
  let instance = new AlertConstructor({
    el: document.createElement('div'),
    store: options.store || (this && this.$store),
    router: options.router || (this && this.$router)
  })
  initInstance(instance, options)
  // 弹窗标题
  instance.title = options.title || '提示'
  // 是否显示关闭按钮
  instance.showClose = typeof options.showClose === 'boolean' ? options.showClose : false
  // 按钮文字
  instance.btnText = options.btnText || '确定'
  // 点击确定按钮时调用options.onOK方法
  instance.$on('ok', () => {
    options.onOK && options.onOK()
  })
  instance.$on('input', visible => {})
  return instance
}

export function popupConfirm (options = {}) {
  let instance = new ConfirmConstructor({
    el: document.createElement('div'),
    store: options.store || (this && this.$store),
    router: options.router || (this && this.$router)
  })
  initInstance(instance, options)
  // 弹窗标题
  instance.title = options.title || ''
  // 是否显示关闭按钮
  instance.showClose = typeof options.showClose === 'boolean' ? options.showClose : false
  // 确定按钮文字
  instance.okBtnText = options.okBtnText || '确定'
  // 取消按钮文字
  instance.cancelBtnText = options.cancelBtnText || '取消'
  // 点击确定按钮时调用options.onOK方法
  instance.$on('ok', visible => {
    options.onOK && options.onOK()
  })
  // 点击确定按钮时调用options.onOK方法
  instance.$on('cancel', visible => {
    options.onCancel && options.onCancel()
  })
  return instance
}

export default {
  popup,
  popupAlert,
  popupConfirm
}
