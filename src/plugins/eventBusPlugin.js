/**
 * 全局事件总线
 * 1. 事件类型分为普通事件和ready事件
 *    普通事件：使用$on和$emit进行事件的监听和触发
 *    ready事件：使用$onReady和$emitReady进行事件的监听和触发
 * 2. 普通事件
 *  普通事件使用vue的默认事件处理逻辑，需要先添加监听再触发事件，事件触发后添加的监听无法执行
 *  1) 监听事件
 *    vm.$eventBus.$on('myEvent', () => {}) // 添加事件监听
 *    vm.$eventBus.$once('myEvent', () => {}) // 添加事件监听，并且该监听只执行一次
 *  2) 触发事件
 *    vm.$eventBus.$emit('myEvent', myArgument) // 触发事件，并且可以给监听器传递参数
 *  3) 移除监听
 *    vm.$eventBus.$off('myEvent') // 移除事件的所有监听
 *    vm.$eventBus.$off('myEvent', myEventHandler) // 移除指定的事件监听
 * 3. ready事件
 *  ready事件适用于事件触发时机不确定，但是事件监听必须执行的场景，事件触发前添加的监听和事件触发后添加的监听都会执行
 *  1) 监听事件
 *    vm.$eventBus.$onReady('myEvent', () => {}) // 添加事件监听，并且该监听只执行一次
 *    vm.$eventBus.$onReady('myEvent', () => {}, true) // 添加事件监听，并且该监听只执行一次
 *    vm.$eventBus.$onReady('myEvent', () => {}, false) // 添加事件监听，并且该监听可以被多次触发
 *  2) 触发事件
 *    vm.$eventBus.$emitReady('myEvent', myArgument) // 触发事件，并且可以给监听器传递参数
 *  3) 移除监听
 *    // 移除指定的事件监听
 *    vm.$eventBus.$removeReadyEventListener('myEvent', myEventHandler)
 *  4) 清除事件
 *    // 清除指定的事件
 *    vm.$eventBus.$clearReadyEvent('myEvent')
 * 
 * @date 2020/12/10
 */
import Vue from 'vue'

export default {
  install () {
    // 事件总线
    const eventBus = new Vue()
    /**
     * ready事件监听
     * @type {Object.<string, Array[Object.<string, any>]>}
     * @desc 主键为事件名，值为事件监听对象数组
     *       监听对象：
     *        1) isOnce：表示该监听处理方法是否只执行一次，如果只执行一次，则执行后会从监听数组中移除
     *        2) eventHandler：该监听处理方法
     *        示例：{ isOnce: true, eventHandler: function (payload) { ... } }
     */
    const readyListeners = {}

    /**
     * ready事件状态
     * @type {Object.<string, Object.<string, any>>}
     * @desc 主键为事件名，值为对象类型，表示当前的状态的对象
     *       状态对象:
     *       1) isReady: 改事件是否已触发
     *       2) payload: 事件触发时的参数
     *       示例：{ isReady: true, payload: {id: 12} }
     */
    const readyStatus = {}

    /**
     * 添加ready事件监听方法(如果事件已触发过则直接执行)
     * @param eventName 事件名
     * @param eventHandler 事件监听执行方法，例：function (payload) { ... }
     * @param isOnce 是否只执行一次（默认为true）
     */
    function onReady (eventName, eventHandler, isOnce = true) {
      // 事件状态
      let status = readyStatus[eventName]
      // 如果事件已触发过，则直接执行监听方法
      if (status && status.isReady) {
        // console.log('########### 直接执行了监听处理方法', eventHandler)
        eventHandler(status.payload)
        if (isOnce) { // 如果此监听只执行一次则不再添加到监听器数组中
          return
        }
      }

      /* 将监听对象添加到监听数组 */
      let listeners = readyListeners[eventName]
      if (!listeners) {
        listeners = []
        readyListeners[eventName] = listeners
      }
      listeners.push({
        isOnce, // 是否只执行一次
        eventHandler // 事件处理方法
      })
    }

    /**
     * 触发ready事件
     * @param eventName 事件名
     * @param payload 事件负载数据
     */
    function emitReady (eventName, payload) {
      // 设置事件状态
      readyStatus[eventName] = { isReady: true, payload }
      // 事件的监听数组
      let listeners = readyListeners[eventName]
      // 新监听数组（如果有只执行一次的监听器，执行后就移除）
      let newListener = []
      // 执行监听数组中的监听事件
      if (listeners && listeners.length > 0) {
        listeners.forEach((listener) => {
          try {
            if (!listener.isOnce) {
              newListener.push(listener)
            }
            listener.eventHandler(payload)
          } catch (e) {
            console.error(`eventBus 的 ready 事件：${eventName}，执行监听方法失败！`, e)
          }
        })
      }
      readyListeners[eventName] = newListener
    }

    /**
     * 移除ready事件中的某一个监听方法
     * @param eventName 事件名
     * @param listener 事件监听方法
     */
    function removeReadyEventListener (eventName, listener) {
      if (eventName && listener) {
        let eventListeners = readyListeners[eventName]
        if (eventListeners) {
          let index = -1
          for (let i = 0; i < eventListeners.length; i++) {
            let item = eventListeners[i]
            if (item.eventHandler === listener) {
              index = i
              break
            }
          }
          if (index !== -1) {
            eventListeners.splice(index, 1)
          }
        }
      }
    }

    /**
     * 清除指定ready事件
     * @param eventName 事件名
     */
    function clearReadyEvent (eventName) {
      delete readyListeners[eventName]
      delete readyStatus[eventName]
    }

    eventBus.$readyListeners = readyListeners
    eventBus.$readyStatus = readyStatus
    eventBus.$onReady = onReady
    eventBus.$emitReady = emitReady
    eventBus.$removeReadyEventListener = removeReadyEventListener
    eventBus.$clearReadyEvent = clearReadyEvent
    Vue.prototype.$eventBus = eventBus
  }
}
