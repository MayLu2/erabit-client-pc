<template>
    <div class="member-order">
    <!-- tab组件 -->
    <!-- 插槽{{item.label}}不需要内容，直接改变一个面板的数据 -->
        <XtxTabs v-model="activeName" @tab-click="tabClick">
        <XtxTabsPanel
            v-for="item in orderStatus"
            :key="item.name"
            :label="item.label"
            :name="item.name"
        >
        </XtxTabsPanel>
        </XtxTabs>
    <!-- 订单列表 -->
        <div class="order-list">
            <div v-if="loading" class="loading"></div>
            <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
            <OrderItem
                @on-delete="handlerDelete"
                @on-cancel="handlerCancel"
                @on-confirm="handlerConfirm"
                @on-logistics="handlerLogistics"
                v-for="item in orderList"
                :key="item.id"
                :order="item">
            </OrderItem>
        </div>
        <!-- 分页组件 -->
        <XtxPagination
        v-if="total>0"
        :current-page="reqParams.page"
        :page-size="reqParams.pageSize"
        :total="total"
        @current-change="reqParams.page=$event"
        />
        <!-- 取消订单组件 -->
       <OrderCancel ref="orderCancelCom" ></OrderCancel>
       <!-- 查看物流组件 -->
       <OrderLogistics ref="orderLogisticsCom" />
    </div>

  </template>
<script>
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import OrderItem from './components/order-item'
import { confirmOrder, deleteOrder, findOrderList } from '@/api/order'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'
import OrderCancel from './components/order-cancel.vue'
import OrderLogistics from './components/order-logistics.vue'
export default {
  name: 'MemberOrder',
  components: { OrderItem, OrderCancel, OrderLogistics },
  setup () {
    const activeName = ref('all') // 默认激活全部订单
    const tabClick = ({ index }) => {
      console.log(index)
      reqParams.page = 1
      reqParams.orderState = index
    }
    // 筛选条件
    const reqParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    const orderList = ref([])
    const loading = ref(false)
    const total = ref(0)
    const getOrderList = () => {
      loading.value = true
      findOrderList(reqParams).then(data => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
        console.log(data)
      })
    }
    // 筛选条件变化重新加载
    watch(reqParams, () => {
      getOrderList()
    }, { immediate: true })
    // 删除订单
    const handlerDelete = (order) => {
      Confirm({ text: '亲，您确认删除该订单吗？' }).then(() => {
        deleteOrder(order.id).then(() => {
          Message({ type: 'success', text: '删除成功' })
          getOrderList()
        })
      }).catch(() => {})
    }
    return {
      orderStatus,
      activeName,
      tabClick,
      orderList,
      loading,
      total,
      reqParams,
      handlerDelete,
      ...useCancel(),
      ...useConfirm(),
      ...useLogistics()

    }
  }
}
// 取消订单逻辑
export const useCancel = () => {
  // 组件实例
  const orderCancelCom = ref(null)
  // 点击取消
  const handlerCancel = (order) => {
    console.log('触发取消订单')
    orderCancelCom.value.open(order)
  }
  return { handlerCancel, orderCancelCom }
}
// 确认收货逻辑
export const useConfirm = () => {
  const handlerConfirm = (order) => {
    Confirm({ text: '亲，您确认收货吗？确认后货款将打给卖家。' }).then(() => {
      confirmOrder(order.id).then(() => {
        Message({ type: 'success', text: '确认收货成功' })
        // 待收货--->待评价
        order.orderState = 4
      })
    }).catch(() => {})
  }
  return { handlerConfirm }
}
// 查看物流逻辑
export const useLogistics = () => {
  const orderLogisticsCom = ref(null)
  const handlerLogistics = (order) => {
    orderLogisticsCom.value.open(order)
  }
  return { handlerLogistics, orderLogisticsCom }
}
</script>
<style scoped lang="less">
    .member-order {
      height: 100%;
      background: #fff;
    }
    .order-list {
      background: #fff;
      padding: 20px;
      position: relative;
      min-height: 400px;
    }
    .loading {
      height: 100%;
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(255,255,255,.9) url(../../../assets/images/loading.gif) no-repeat center;
    }
    .none {
      height: 400px;
      text-align: center;
      line-height: 400px;
      color: #999;
    }
    </style>
