/// 扩展vue的原有功能：全局组件，自定义指令，挂载原型方法，注意：vue3中没有全局过滤器
/// 插件
/// vue2.0 插件写法：导出一个对象，有install函数，默认传入vue构造函数，vue基础之上扩展
/// vue3.0 插件写法：导出一个对象，有install函数，默认传入了app引用实例，app基础之上扩展
import defaultImg from '@/assets/images/200.png'
import XtxSkeleton from './xtx-skeleton.vue'
import xtxCarousel from './xtx-carousel.vue'
import XtxMore from './xtx-more.vue'

import Message from './Message'
import Confirm from './Confirm'
export default {
  install (app) {
    /// app上进行扩展，app提供component directive函数
    // 如果要挂载原型app.config.globalProperties方法
    app.component(XtxSkeleton.name, XtxSkeleton)/// vue3中挂载全局组件
    app.component(xtxCarousel.name, xtxCarousel)
    app.component(XtxMore.name, XtxMore)

    // 定义数据懒加载指令
    defineDirective(app)

    // 定义一个原型函数
    app.config.globalProperties.$message = Message
    app.config.globalProperties.$confirm = Confirm
  }
}

const defineDirective = (app) => {
  // 1. 图片懒加载指令 v-lazy
  // 原理：先存储图片地址不能在src上，当图片进入可视区，将你存储图片地址设置给图片元素即可。
  app.directive('lazy', {
    // vue2.0 监听使用指令的DOM是否创建好，钩子函数：inserted
    // vue3.0 的指令拥有的钩子函数和组件的一样，使用指令的DOM是否创建好，钩子函数：mounted
    mounted (el, binding) {
      // 2. 创建一个观察对象，来观察当前使用指令的元素
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) { /// 进入可视区
          // 停止观察----一次加载就够了
          observe.unobserve(el)

          // 4. 处理图片加载失败 error 图片加载失败的事件 load 图片加载成功
          el.onerror = () => {
            // 加载失败，设置默认图
            el.src = defaultImg
          }
          // 3. 把指令的值设置给el的src属性 binding.value就是指令的值
          el.src = binding.value
        }
      }, {
        threshold: 0
      })
      // 开启观察
      observe.observe(el)
    }
  })
}
