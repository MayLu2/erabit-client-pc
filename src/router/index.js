// import { h } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
// import store from 'vuex'
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category/index')
const SubCategory = () => import('@/views/category/sub')
const Product = () => import('@/views/goods/index')
const Cart = () => import('@/views/cart/index')

const Login = () => import('@/views/login/index')
const LoginCallback = () => import('@/views/login/callback')

const Checkout = () => import('@/views/member/pay/checkout')
const Pay = () => import('@/views/member/pay/index')
const PayResult = () => import('@/views/member/pay/result')
const MemberLayout = () => import('@/views/member/Layout')
const MemberHome = () => import('@/views/member/home')
const MemberOrder = () => import('@/views/member/order')
const MemberOrderDetail = () => import('@/views/member/order/detail')

// 路由规则
const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home
      },
      {
        path: '/category/:id',
        name: 'TopCategory',
        component: TopCategory
      },
      {
        path: '/category/sub/:id',
        name: 'SubCategory',
        component: SubCategory
      },
      {
        path: '/product/:id',
        name: 'Product',
        component: Product
      },
      {
        path: '/cart',
        name: 'Cart',
        component: Cart
      },
      {
        path: '/member/checkout',
        name: 'Checkout',
        component: Checkout
      },
      {
        path: '/member/pay',
        name: 'Pay',
        component: Pay
      },
      {
        path: '/pay/callback',
        name: 'PayResult',
        component: PayResult
      },
      {
        path: '/member',
        component: MemberLayout,
        children: [
          {
            path: '/member',
            name: 'MemberHome',
            component: MemberHome
          },
          { path: '/member/order', component: MemberOrder },
          { path: '/member/order/:id', component: MemberOrderDetail }
          // {
          //   path: '/member/order',
          //   component: { render: () => h(<RouterView />) },
          //   children: [
          //     { path: '', component: MemberOrder },
          //     { path: ':id', component: MemberOrderDetail }
          //   ]
          // }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/login/callback',
    name: 'LoginCallback',
    component: LoginCallback
  }
]
// vue2.0 new VueRouter({}) 创建路由实例
// vue3.0 createRouter({}) 创建路由实例
const router = createRouter({
  history: createWebHashHistory(), // 使用hash的路由模式
  routes
})

// router.beforeEach((to, from, next) => {
//   const { profile } = store.state.user
//   if (!profile.token && to.path.startsWith('/member')) {
//     return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
//   }
//   next()
// })

export default router
