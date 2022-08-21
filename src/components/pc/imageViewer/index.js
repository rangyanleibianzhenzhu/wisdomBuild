/**
 * 图片查看器组件
 * 
 * @date 2021/11/18
 */
import Vue from 'vue'
import ImageViewer from './ImageViewer.vue'

// 构造函数
const Constructor = Vue.extend({ extends: ImageViewer })

function popupImage (options = {}) {
  options = typeof options === 'string' || options instanceof Array ? { url: options } : options

  let instance = new Constructor({
    el: document.createElement('div'),
    propsData: {
      url: options.url || '',
      alt: options.alt || ''
    }
  })

  // 父节点
  let parentElement = options.parentElement || document.body
  // 关闭时移除
  instance.$on('close', visible => {
    if (!visible) {
      setTimeout(() => {
        parentElement.removeChild(instance.$el)
        instance.$destroy()
      }, 2000)
    }
  })
  // console.log('instance.$el=', instance.$el)
  // 将节点添加到文档
  parentElement.appendChild(instance.$el)
  instance.visible = true
  instance.closed = false
  return instance
}
export default popupImage
