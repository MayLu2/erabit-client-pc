<template>
  <div class='xtx-carousel' @mouseenter="stop()" @mouseleave="start()">
    <!-- 图片容器 -->
    <ul class="carousel-body">
        <!-- fade显示的图片加上 -->
      <li class="carousel-item" v-for="(item,i) in sliders" :key="i" :class="{fade:index===i}">
        <RouterLink to="/" v-if="item.imgUrl">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
      </li>
    </ul>
    <!-- 上一张 -->
    <a href="javascript:;" @click="toggle(-1)"   class="carousel-btn prev"><i class="iconfont icon-angle-left"></i></a>
    <!-- 下一张 -->
    <a href="javascript:;" @click="toggle(1)"  class="carousel-btn next"><i class="iconfont icon-angle-right"></i></a>
    <!-- 激活选择器 -->
    <div class="carousel-indicator">
      <span v-for="(item,i) in sliders" :key="i" :class="{ative:index===i}" @click="index=i"></span>
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    // 轮播图数据
    sliders: {
      type: Array,
      default: () => []
    },
    // 是否自动轮播
    autoPlay: {
      type: Boolean,
      default: false
    },
    // 间隔时长
    duration: {
      type: Number,
      default: 3000
    }
  },
  setup (props) {
    const index = ref(0)/// 默认显示第0张图

    let timer = null
    // 自动轮播
    const autoPlayFn = () => {
      clearInterval(timer)
      timer = setInterval(() => {
        index.value++
        if (index.value >= props.sliders.length) {
          index.value = 0
        }
      }, props.duration)
    }
    // 需要监听sliders数据变化，判断如果有数据且autoPlay是true
    watch(() => props.sliders, (newVal) => {
      if (newVal.length && props.autoPlay) {
        autoPlayFn()
      }
    }, { immediate: true })/// immediate: true如果静态数据时，也可以触发
    // 鼠标进入暂停离开开启自动播放
    const stop = () => {
      if (timer) {
        clearInterval(timer)
      }
    }
    const start = () => {
      if (props.sliders.length && props.autoPlay) {
        autoPlayFn()
      }
    }
    // 点击控制器切换图片，上一张下一张
    const toggle = (step) => {
      // 将要改变的索引
      const newIndex = index.value + step
      // 超出的情况，太大了
      if (newIndex > (props.sliders.length - 1)) {
        index.value = 0
        return ''
      }
      // 超出的情况，太小了
      if (newIndex < 0) {
        index.value = props.sliders.length - 1
        return ''
      }
      //   正常
      index.value = newIndex
    }
    // 卸载组件时，清除浏览器
    onUnmounted(() => {
      clearInterval(timer)
    })
    return { index, stop, start, toggle }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel{
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel{
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;//显示
        z-index: 1;//5张图最高的
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background:  #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0,0,0,.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev{
        left: 20px;
      }
      &.next{
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
