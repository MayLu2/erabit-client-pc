<template>
  <div class="xtx-bread-item">
    <!-- 是否传入路径 to -->
    <RouterLink v-if="to" :to="to"><slot /></RouterLink>
    <span v-else><slot /></span>
    <!-- <i class="iconfont icon-angle-right"></i> -->
  </div>
</template>
<script>
export default {
  name: 'XtxBreadItem',
  props: {
    to: {
      type: [String, Object]
    }
  }
}
</script>
