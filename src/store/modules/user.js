export default {
  namespaced: true,
  state () { /// 写成一个函数可以避免参数相互影响,类似于data()
    return {
      // 用户信息
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      },
      // 登录后回跳路径
      redirectUrl: '/'
    }
  },
  mutations: {
    // 修改用户信息，payload就是用户信息对象
    setUser (state, payload) {
      state.profile = payload
    },
    // 修改回跳地址
    setRedirectUrl (state, url) {
      state.redirectUrl = url
    }
  }
}
