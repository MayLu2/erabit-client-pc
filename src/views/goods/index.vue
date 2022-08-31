<template>
  <div class='xtx-goods-page' v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{goods.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem>{{goods.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
       <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures"/>
          <GoodsSales></GoodsSales>
        </div>
        <div class="spec">
          <GoodsName :goods="goods"></GoodsName>
          <!-- 规格组件 -->
          <GoodsSku :goods="goods"  @change="changeSku"></GoodsSku>
           <!-- 数量选择组件 -->
           <XtxNumbox label="数量" v-model="num" :max="goods.inventory" />
           <!-- 按钮组件 -->
            <XtxButton  @click="insertCart()" type="primary" style="margin-top:20px">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐:同类推荐+猜你喜欢 -->
      <GoodsRelevant :goodsId="goods.id"/>
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <!-- <div class="goods-tabs"></div> -->
          <GoodsTabs/>
          <!-- 注意事项 -->
          <div class="goods-warn">
            <GoodsWarn/>
          </div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot :goodsId="goods.id" :type="1"/>
          <GoodsHot :goodsId="goods.id" :type="2"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { watch, nextTick, ref, provide } from 'vue'
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image'
import { findGoods } from '@/api/product'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku'
import GoodsTabs from './components/goods-tabs'
import GoodsHot from './components/goods-hot'
import GoodsWarn from './components/goods-warn'
import Message from '@/components/library/Message'
export default {
  name: 'XtxGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    GoodsTabs,
    GoodsHot,
    GoodsWarn
  },
  setup () {
    const goods = useGoods()

    const currSku = ref(null)
    const changeSku = (sku) => {
      console.log('触发sku选择', sku)
      // 修改商品的现价原价库存信息
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      // 记录选择后的sku，可能有数据，可能没有数据{}
      currSku.value = sku
    }

    // 选择的数量
    const num = ref(1)
    // 传递数据
    provide('goods', goods)

    // 加入购物车
    const store = useStore()
    const insertCart = () => {
      if (currSku.value && currSku.value.skuId) {
        // id skuId name attrsText picture price nowPrice selected stock count isEffective
        const { skuId, specsText: attrsText, inventory: stock } = currSku.value
        const { id, name, price, mainPictures } = goods.value
        store.dispatch('cart/insertCart', {
          skuId,
          attrsText,
          stock,
          id,
          name,
          price,
          nowPrice: price,
          picture: mainPictures[0],
          selected: true,
          isEffective: true,
          count: num.value
        }).then(() => {
          Message({ type: 'success', text: '加入购物车成功' })
          console.log(store.state.cart)
        })
      } else {
        Message({ text: '请选择完整规格' })
      }
    }

    return { goods, changeSku, num, insertCart }
  }

}
// 获取商品详情
const useGoods = () => {
  // 出现路由地址商品ID发生变化，但是不会重新初始化组件
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (newVal) => {
    if (newVal && `/product/${newVal}` === route.path) {
      findGoods(route.params.id).then(data => {
        // 让商品数据为null然后使用v-if的组件可以重新销毁和创建
        goods.value = null
        nextTick(() => {
          goods.value = data.result
        })
      })
    }
  }, { immediate: true })
  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
</style>
