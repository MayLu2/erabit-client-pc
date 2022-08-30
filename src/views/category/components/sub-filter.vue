<template>
<!-- 筛选区 -->
   <div class="sub-filter" v-if="filterData && !filterLoading">
      <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a @click="changeBrand(item.id)" :class="{active:item.id===filterData.selectedBrand}" href="javascript:;" v-for="item in filterData.brands" :key="item.id">{{item.name}}</a>
      </div>
    </div>
     <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
       <div class="head">{{item.name}}:</div>
       <div class="body">
         <a @click="changeProp(item,prop.id)" href="javascript:;" :class="{active:prop.id===item.selectedProp}" v-for="prop in item.properties" :key="prop.id">{{prop.name}}</a>
       </div>
     </div>
   </div>
   <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
   </div>
</template>
<script>
import { findSubCategoryFilter } from '@/api/category'
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()
    // 监听二级类目Id的变化获取筛选数据
    const filterData = ref(null)
    const filterLoading = ref(false)
    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/sub/${newVal}` === route.path) {
        filterLoading.value = true
        // 获取筛选数据
        findSubCategoryFilter(route.params.id).then(data => {
          // 加上全部筛选条件
          data.result.selectedBrand = null
          data.result.brands.unshift({ id: null, name: '全部' })
          data.result.saleProperties.forEach(item => {
            item.selectedProp = null
            item.properties.unshift({ id: null, name: '全部' })
          })
          filterData.value = data.result
          filterLoading.value = false
        })
      }
    }, { immediate: true })

    // 获取筛选参数的函数
    const getFilterParams = () => {
      const obj = { brandIs: null, attrs: [] }
      // 品牌id
      obj.brandId = filterData.value.selectedBrand
      // 筛选属性
      filterData.value.saleProperties.forEach(item => {
        if (item.selectedProp) {
          const prop = item.properties.find(prop => prop.id === item.selectedProp)
          obj.attrs.push({ groupName: item.name, propertyName: prop.name })
        }
      })
      // 参考数据：{brandId:'',attrs:[{groupName:'',propertyName:''},...]}
      if (obj.attrs.length === 0) obj.attrs = null/// 为null就不会发请求
      return obj
    }

    // 1.选择品牌
    const changeBrand = (brandId) => {
      if (filterData.value.selectedBrand === brandId) return
      filterData.value.selectedBrand = brandId
      emit('filter-change', getFilterParams)
    }
    // 2.选择筛选参数，存到一个数组中
    const changeProp = (item, propId) => {
      if (item.selectedProp === propId) return
      item.selectedProp = propId
      console.log(getFilterParams())
      emit('filter-change', getFilterParams())
    }
    return { filterData, filterLoading, changeBrand, changeProp }
  }
}
</script>
<style scoped lang='less'>
  // 筛选区
  .sub-filter {
    background: #fff;
    padding: 25px;
    .item {
      display: flex;
      line-height: 40px;
      .head {
        width: 80px;
        color: #999;
      }
      .body {
        flex: 1;
        a {
          margin-right: 36px;
          transition: all .3s;
          display: inline-block;
          &.active,
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
</style>
