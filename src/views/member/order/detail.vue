<template>
    <div class="order-detail-page" v-if="order" >
      <!-- 操作栏 -->
      <DetailAction :order="order" />
      <!-- 步骤条 组件xtx-steps.vue-->
      <DetailStep :order="order" />
      <!-- 物流栏 -->
      <!-- // 使用suspense 先等待#fallback，异步数据出来之后，在显示#default -->
      <Suspense>
      <template #default>
        <DetailLogistics v-if="[3,4,5].includes(order.orderState)" :order="order" />
      </template>
      <template #fallback>
        <div class="loading">loading...</div>
      </template>
    </Suspense>
      <!-- 订单商品信息 -->
    <DetailInfo :order="order" />
    </div>
  </template>
<script>
import { ref } from 'vue'
import DetailAction from './components/detail-action'
import DetailStep from './components/detail-steps'
import DetailLogistics from './components/detail-logistics'
import { useRoute } from 'vue-router'
import { findOrderDetail } from '@/api/order'
import DetailInfo from './components/detail-info'
export default {
  name: 'OrderDetailPage',
  components: { DetailAction, DetailStep, DetailLogistics, DetailInfo },
  setup () {
    const order = ref(null)
    const route = useRoute()
    findOrderDetail(route.params.id).then(data => {
      order.value = data.result
    })
    return { order }
  }
}
</script>
  <style scoped lang="less">
  .order-detail-page {
    background: #fff;
  }
  .loading {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
}
  </style>
