<template>
    <!-- 顶部通栏 -->
    <AppNavbar></AppNavbar>
    <!-- 头部组件 -->
    <AppHeader />
    <!-- 吸顶头部 -->
    <AppHeaderSticky></AppHeaderSticky>
    <!-- 内容容器 -->
    <div class="app-body">
      <!-- 二级路由 -->
      <RouterView />
    </div>
    <!-- 底部组件 -->
    <AppFooter/>
</template>

<script>
import { useStore } from 'vuex'
import AppNavbar from '@/components/app-navbar.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
export default {
  name: 'Layout',
  components: {
    AppNavbar,
    AppHeader,
    AppHeaderSticky,
    AppFooter
  },
  setup () {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style lang="less" scoped>
.app-body{
  min-height: 600px;
}
</style>
