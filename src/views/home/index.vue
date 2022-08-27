<template>
    <!-- 首页入口 -->
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />
        <!-- 轮播图 -->
        <HomeBanner/>
      </div>
    </div>
    <!-- 以下几个模块比较相似，可以先封装一个面板组件 -->
    <!-- 新鲜好物 -->
    <HomeNew/>
    <!-- 人气推荐 -->
    <HomeHot/>
    <!-- 品牌组件 -->
    <HomeBrand/>
    <!-- 产品区块 -->
    <HomeProduct/>
    <!-- 最新专题 -->
</template>
<script>
import HomeCategory from './components/home-category'
import HomeBanner from './components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot'
import HomeBrand from './components/home-brand'
import HomeProduct from './components/home-product'
// import XtxSkeleton from '@/components/library/xtx-skeleton' ///vue插件的方式注册全局组件
export default {
  name: 'PageHome',
  components: { HomeCategory, HomeBanner, HomeNew, HomeHot, HomeBrand, HomeProduct }
}
</script>
<style scoped lang="less">

</style>
