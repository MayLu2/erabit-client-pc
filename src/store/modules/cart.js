import {
  getNewCartGoods, mergeCart, findCart, insertCart, updateCart, deleteCart,
  checkAllCart

} from '@/api/cart'

// 购物车状态
export default {
  namespaced: true,
  state: () => {
    return {
      // 购物车商品列表
      list: []
    }
  },
  getters: {
    // 有效商品列表
    validList (state) {
      // 有效商品：库存大于0  stock  商品有效标识为  true  isEffective
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    // 有效商品总件数
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 商品总价
    validAmount (state, getters) {
      /// 涉及到浮点数的价格计算，两位小数 ，1.10先乘100,
      // return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
      return getters.validList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(item => !(item.stock > 0 && item.isEffective))
    },
    // 选中的商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 选中商品件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品中金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + (c.nowPrice * 100 * c.count), 0) / 100
    },
    // 是否全选--有效商品和选中商品的长度是否相等，且不为0
    isCheckAll (state, getters) {
      return getters.validList.length !== 0 && getters.selectedList.length === getters.validList.length
    }

  },
  mutations: {
    // 加入购物车
    insertCart (state, payload) {
      // 约定加入购物车字段必须和后端保持一致 payload对象 的字段
      // id skuId name attrsText picture price nowPrice selected stock count isEffective
      // 插入数据规则：
      // 1. 先找下是否有相同商品
      // 2. 如果有相同的商品，查询它的数量，累加到payload上，再保存最新位置，原来商品需要删除
      // 3. 如果没有相同商品，保存在最新位置即可
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (sameIndex > -1) {
        const count = state.list[sameIndex].count
        payload.count += count
        state.list.splice(sameIndex, 1)
      }
      // 追加新的
      state.list.unshift(payload)
    },
    // 修改购物车商品
    updateCart (state, goods) {
    // goods 商品信息：nowPrice stock isEffective 但是也有情况是修改count等
    // goods 商品对象的字段不固定，对象中有哪些字段就改哪些字段，字段的值合理才改
    // goods 商品对象 必需有SKUID
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== undefined && goods.key !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 设置购物车列表
    setCartList (state, list) {
      state.list = list
    }
  },
  actions: {
    // 加入购物车
    insertCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        // ctx.rootState所以模块的state状态
        if (ctx.rootState.user.profile.token) {
          // 已登录
          insertCart({ skuId: payload.skuId, count: payload.count }).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          ctx.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 修改购物车（选中状态，数量）
    updateCart (ctx, payload) {
      // payload 需要：必需有skuId  可能：selected  count
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // // 已登录
          updateCart(payload).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 删除购物车
    deleteCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // // 已登录
          deleteCart([payload]).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登录
          // 单条删除 payload 现在  就是skuId
          ctx.commit('deleteCart', payload)
          resolve()
        }
      })
    },
    // 全选与取消全选
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // // 已登录
          const ids = ctx.getters.validList.map(item => item.skuId)
          checkAllCart({ selected, ids }).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.getters.validList.forEach(goods => {
            ctx.commit('updateCart', { skuId: goods.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 批量删除
    batchDeleteCart (ctx, isClear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          const ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.getters.selectedList.forEach((item) => {
            ctx.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },
    // 修改规格
    updateCartSku (ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          // 1. 找出旧的商品信息
          // 2. 删除旧商品数据
          // 3. 原先商品的数量+新skuId
          // 4. 添加新的商品
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldGoods.skuId]).then(() => {
            return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
          }).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登录
          // 1. 找出旧的商品信息
          // 2. 删除旧商品数据
          // 3. 根据新的sku信息和旧的商品信息，合并成一条新的购物车商品数据
          // 4. 添加新的商品
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          ctx.commit('deleteCart', oldSkuId)
          const { skuId, price: nowPrice, specsText: attrsText, inventory: stock } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, attrsText, stock }
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // 获取商品列表
    findCart (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          findCart().then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登录
          // 同时发送请求（有几个商品发几个请求）等所有请求成功，一并去修改本地数据。
          // Promise.all(promise数组).then((dataList)=>{})  同时发请求，所有请求成功，得到所有成功结果
          // Promise.resolve() Promise.reject() new Promise()
          // Promise.race(promise数组).then((data)=>{}) 同时发请求，最快的请求成功，得到成功结果
          const promiseArr = ctx.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          // dataList成功结果的集合，数据顺序和primiseArr顺序一致，它又是根据state.list而来
          Promise.all(promiseArr).then(dataList => {
            console.log(dataList)
            // 更新本地购物车
            dataList.forEach((data, i) => {
              ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...data.result })
              // 调用resolve代表操作成功
              resolve()
            })
          })
        }
      })
    },
    // 登录后，合并购物车
    async mergeLocalCart (ctx) {
      const cartList = ctx.getters.validList.map(({ skuId, selected, count }) => {
        return { skuId, selected, count }
      })
      await mergeCart(cartList)
      // 合并成功将本地购物车删除
      ctx.commit('setCartList', [])
    }

  }

}
