<template>
    <div class="goods-sku">
      <dl v-for="item in goods.specs" :key="item.id">
        <dt>{{item.name}}</dt>
        <dd>
          <template v-for="val in item.values" :key="val.name">
            <img :class="{selected:val.selected,disabled:val.disabled}" @click="clickSpecs(item,val)" v-if="val.picture" :src="val.picture" :title="val.name">
            <span :class="{selected:val.selected,disabled:val.disabled}" @click="clickSpecs(item,val)" v-else>{{val.name}}</span>
          </template>
        </dd>
      </dl>
    </div>
  </template>
<script>
/**
 * SPU（Standard Product Unit）：标准化产品单元。是商品信息聚合的最小单位，是一组可复用、易检索的标准化信息的集合，该集合描述了一个产品的特性。通俗点讲，属性值、特性相同的商品就可以称为一个SPU。
 * SKU（Stock Keeping Unit）库存量单位，即库存进出计量的单位， 可以是以件、盒、托盘等为单位。
 * SKU是物理上不可分割的最小存货单元。在使用时要根据不同业态，不同管理模式来处理。
 * spu代表一个商品，拥有很多相同的属性。
 * sku代表该商品可选规格的任意组合，他是库存单位的唯一标识。
 */
import powerSet from '@/vender/power-set'
const spliter = '★'
/// 得到一个路径字典对象
const getPathMap = (skus) => {
  // 1. 得到所有的sku集合  props.goods.skus
  // 2. 从所有的sku中筛选出有效的sku
  // 3. 根据有效的sku使用power-set算法得到子集
  // 4. 根据子集往路径字典对象中存储 key-value
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory > 0) {
      // 计算当前有库存的sku的子集
      // 例如：[1,2,3] ==> [[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
      // 可选值数组
      const valueArr = sku.specs.map(val => val.valueName)
      //   console.log(valueArr)
      // 可选值数组 子集
      const valueArrPowerSet = powerSet(valueArr)
      //   console.log(valueArrPowerSet)
      // 遍历子集，往pathMap插入数据
      valueArrPowerSet.forEach(arr => {
        // 根据arr得到字符串的key，约定key是：['蓝色','美国'] ===> '蓝色★美国'
        const key = arr.join(spliter)
        // console.log(key)
        // 给pathMap设置数据
        if (pathMap[key]) {
          // 已经有key往数组追加
          pathMap[key].push(sku.id)
        } else {
          // 没有key设置一个数组
          pathMap[key] = [sku.id]
        }
        // console.log(pathMap)
      })
    }
  })
  return pathMap
}
// 获取已选中的值数组
const getSelectedValues = (specs) => {
  const arr = []/// arr的长度要个specs的规格长度一样，并且顺序对应
  specs.forEach(item => {
    // 选中的按钮对象
    const selectedVal = item.values.find(val => val.selected)
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}
// 默认选中
const initDefaultSelected = (goods, skuId) => {
  // 1.找出sku的信息
//   2.遍历每一个按钮，按钮的值和sku记录的值相同，就选中
  const sku = goods.skus.find(sku => sku.id === skuId)
  goods.specs.forEach((item, i) => {
    const val = item.values.find(val => val.name === sku.specs[i].valueName)
    val.selected = true
  })
}
// 更新按钮禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  // 1.约定每一个按钮的状态都由本身的disabled数据来控制
  specs.forEach((item, i) => {
    const selectedValues = getSelectedValues(specs)
    item.values.forEach(val => {
      // 2. 判断当前是否选中，是选中不用判断
      if (val.selected) return
      // 3. 拿当前的值按照顺序套入选中的值数组
      selectedValues[i] = val.name
      // 4. 剔除undefined数据，按照分隔符拼接key
      const key = selectedValues.filter(value => value).join(spliter)
      // 5. 拿着key去路径字典中查找是否有数据，有可以点击，没有就禁用（true）
      val.disabled = !pathMap[key]
    })
  })
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({ specs: [], skus: [] })
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)
    // 根据skuId初始化选中
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }
    // ☆组件初始化：更新按钮禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)
    const clickSpecs = (item, val) => {
      // 1. 选中与取消选中逻辑--约定每一个按钮都有一个selected
      if (val.disabled) return
      if (val.selected) {
        val.selected = false
      } else {
        // 未选中的，要先清除其他的选中
        item.values.forEach(bv => { bv.selected = false })
        val.selected = true
      }
      // ☆点击按钮时：更新按钮禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)

      // 将选择的sku信息传递给父组件（skuId,price,oldPrice,inventory,specsText}
      // 1.选择完整的sku按钮，才可以拿到这些信息，再提交父组件
      // 2.不是完整的sku组合按钮，提交空对象给父组件
      const validSelectValues = getSelectedValues(props.goods.specs).filter(v => v)
      if (validSelectValues.length === props.goods.specs.length) {
        // 完整的组合按钮
        const skuIds = pathMap[validSelectValues.join(spliter)]
        // console.log(skuIds)
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        // console.log(sku.specs.reduce((p, c) => `${p} ${c.name}：${c.valueName}`, '').trim())
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 属性名：属性值 属性名1：属性值1 ... 这样的字符串
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}：${c.valueName}`, '').trim()
        })
        console.log('sku改变')
      } else {
        /// 不完整
        // 父组件需要判断是否规格选择完整，不完整不能加购物车。
        emit('change', {})
      }
    }

    return { clickSpecs }
  }
}
</script>
<style scoped lang="less">
    .sku-state-mixin () {
      border: 1px solid #e4e4e4;
      margin-right: 10px;
      cursor: pointer;
      &.selected {
        border-color: @xtxColor;
      }
      &.disabled {
        opacity: 0.6;
        border-style: dashed;
        cursor: not-allowed;
      }
    }
    .goods-sku {
      padding-left: 10px;
      padding-top: 20px;
      dl {
        display: flex;
        padding-bottom: 10px;
        align-items: center;
        dt {
          width: 50px;
          color: #999;
        }
        dd {
          flex: 1;
          color: #666;
          line-height: 40px;
          > img {
            width: 50px;
            height: 50px;
            .sku-state-mixin ();
          }
          > span {
            display: inline-block;
            height: 30px;
            line-height: 28px;
            padding: 0 20px;
            .sku-state-mixin ();
          }
        }
      }
    }
</style>
