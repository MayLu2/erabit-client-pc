<template>
  <div class='home-skeleton'>
    <div class="item" v-for="i in 4" :key="i" :style="{backgroundColor:bg}">
      <XtxSkeleton bg="#e4e4e4" width="306px" height="306px" animated />
      <XtxSkeleton bg="#e4e4e4" width="160px" height="24px" animated />
      <XtxSkeleton bg="#e4e4e4" width="120px" height="24px" animated />
    </div>
  </div>
</template>

<script>
/**
 * 先在区域准备一个骨架屏，等数据加载上之后，再把骨架屏移走，并且添加动画
 * 当vue中，显示隐藏，创建移除，一个元素或者一个组件的时候，可以通过transition实现动画。
 *进入（显示，创建）
    * v-enter 进入前 （vue3.0 v-enter-from）
    * v-enter-active 进入中
    * v-enter-to 进入后
    * 离开（隐藏，移除）
    * v-leave 进入前 （vue3.0 v-leave-from）
    * v-leave-active 进入中
    * v-leave-to 进入后
    * 多个transition使用不同动画，可以添加nam属性，name属性的值替换v即可。
 */
export default {
  name: 'HomeSkeleton',
  props: {
    bg: {
      type: String,
      default: '#fff'
    }
  }
}
</script>

<style scoped lang='less'>
.home-skeleton {
  width: 1240px;
  height: 406px;
  display: flex;
  justify-content: space-between;
  .item {
    width: 306px;
    .xtx-skeleton ~ .xtx-skeleton{
      display: block;
      margin: 16px auto 0;
    }
  }
}
</style>
