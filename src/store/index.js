import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import cart from './modules/cart'
import user from './modules/user'
import category from './modules/category'
// vue2.0创建仓库new Vuex.Store({})
// vue3.0创建仓库createStore({})
export default createStore({
  modules: {
    cart,
    user,
    category
  },
  plugins: [
    createPersistedState({
      key: 'erabbit-client-pc-store',
      paths: ['user', 'cart']
    })
  ]
})
