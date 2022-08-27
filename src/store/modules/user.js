export default {
  namespaced: true,
  state () { /// 写成一个函数可以避免参数相互影响,类似于data()
    return {
      // 用户信息
      profile: {
        id: '1',
        avatar: '',
        nickname: '周杰伦',
        account: '123',
        mobile: '12344',
        token: '123455xcvxvxvxvxv'
      }
    }
  },
  mutations: {
    // 修改用户信息，payload就是用户信息对象
    setUser (state, payload) {
      state.profile = payload
    }
  }
}
