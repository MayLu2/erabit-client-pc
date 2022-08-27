<template>
    <div class="home-banner">
        <!-- 传入轮播图的大小 -->
        <XtxCarousel auto-play :sliders="sliders"></XtxCarousel>
    </div>
</template>

<script>
import { ref } from 'vue'
import { findBanner } from '@/api/home'
// import XtxCarousel from '../../../components/library/xtx-carousel.vue'
export default {
  setup () {
    const sliders = ref([])
    findBanner().then(data => {
      sliders.value = data.result
    })
    return { sliders }
  }
//   components: { XtxCarousel }
}
</script>

<style lang="less" scoped>
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98
}
// 覆盖样式，不能直接在banner组件中修改
.xtx-carousel {
  :deep(.carousel-btn.prev){
    left: 270px;
  }
  :deep(.carousel-indicator) {
    padding-left: 250px;
  }
}
</style>
