<template>
    <div>
      <!-- 面包屑 -->
      <SubBread />
      <!--筛选区  -->
      <SubFilter @filter-change='filterChange'/>
      <!-- 测试checkbox组件 -->
      <!-- <XtxCheckbox v-model='isAllChecked'>全选{{isAllChecked}}</XtxCheckbox> -->
      <!-- <XtxCheckbox v-model:a='isAllChecked'>全选{{isAllChecked}}</XtxCheckbox> -->
      <!-- 商品区（排序+列表） -->
      <div class="goods-list">
          <SubSort @sort-change='sortChange'/>
          <ul>
            <li v-for="goods in goodsList" :key="goods.id" >
              <GoodsItem :goods="goods" />
            </li>
          </ul>
           <!-- 无限加载组件 -->
        <XtxInfiniteLoading :loading="loading" :finished="finished" @infinite="getData" />
      </div>
    </div>
</template>

<script>
import { findSubCategoryGoods } from '@/api/category'
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
export default {
  components: { SubBread, SubFilter, SubSort, GoodsItem },
  setup () {
    // 测试checktbox组件
    // const isAllChecked = ref(true)

    const route = useRoute()
    // 加载中
    const loading = ref(false)
    // 是否加载完毕
    const finished = ref(false)
    // 商品列表数据
    const goodsList = ref([])
    // 请求参数--定义成let
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    // 获取商品数据
    const getData = () => {
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        // 获取数据成功
        if (result.items.length) {
          // 有数据就追加数据
          goodsList.value.push(...result.items)
          // 把page改成下一页页码
          reqParams.page++
        } else {
          // 没有数据，代表加载完成
          finished.value = true
        }
        loading.value = false
      })
    }

    // 二级分类路由id改变时，重新加载数据
    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/sub/${newVal}` === route.path) {
        finished.value = false
        goodsList.value = [] // 导致列表空的，加载更多组件顶上来，进入可视区，区加载数据
        // eslint-disable-next-line no-const-assign
        reqParams = {
          page: 1,
          pageSize: 20
        }
        // getData()
      }
    })
    // 更改筛选组件的筛选数据，重新请求
    const filterChange = (filterParams) => {
      finished.value = false
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodsList.value = []
      console.log('触发请求')
    }
    // 排序改变事件
    const sortChange = (sortParams) => {
      finished.value = false
      // 合并请求参数，保留之前参数
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodsList.value = []
      console.log('触发筛选请求')
    }
    return { loading, finished, getData, goodsList, sortChange, filterChange }
  }
}
</script>

<style lang="less" scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
