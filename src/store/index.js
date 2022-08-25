import { createStore } from 'vuex'

import cart from './modules/cart'
import user from './modules/user'
// vue2.0创建仓库new Vuex.Store({})
// vue3.0创建仓库createStore({})
export default createStore({
  modules: {
    cart,
    user
  }
})
