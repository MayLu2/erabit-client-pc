import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'

// 准备dom容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)

// 定时器
let timer = null

export default ({ type, text }) => {
  // 实现：根据xtx-message.vue渲染消息提示
  // 1.导入组件
  // 2.创建虚拟节点
  const vnode = createVNode(XtxMessage, { type, text })
  // 3.准备一个DOM容器
  // 4.把虚拟节点渲染到DoM容器中
  render(vnode, div)
  // 5. 开启定时，移出DOM容器内容
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
// 提供一个能够显示xtx-message组件的函数
// 这个函数将来：导入直接使用，也可以挂载在vue实例原型上
// import Message from 'Message.js' 使用 Message({type:'error',text:'提示文字'})
// this.$message({type:'error',text:'提示文字'})
