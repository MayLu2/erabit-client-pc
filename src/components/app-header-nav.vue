<template>
  <ul class="app-header-nav">
    <li class="home"><RouterLink to="/">首页</RouterLink></li>
    <li v-for="item in list" :key="item" @mousemove="show(item)" @mouseleave="hide(item)" >
        <router-link :to="`/category/${item.id}`" @click="hide(item)">{{item.name}}</router-link>
        <div class="layer" :class="{open:item.open}">
            <ul>
                <li v-for="sub in item.children" :key="sub.id">
                <router-link :to="`/category/sub/${sub.id}`" @click="hide(item)" >
                    <img :src="sub.picture" alt=""/>
                    <p>{{sub.name}}</p>
                </router-link>

                </li>
            </ul>
        </div>
    </li>
    <!-- <li>
      <a href="#">美食</a>
      <div class="layer">
        <ul>
          <li v-for="i in 10" :key="i">
            <a href="#">
              <img src="http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/img/category%20(4).png" alt="">
              <p>果干</p>
            </a>
          </li>
        </ul>
      </div>
    </li>
    <li><a href="#">餐厨</a></li>
    <li><a href="#">艺术</a></li>
    <li><a href="#">电器</a></li>
    <li><a href="#">居家</a></li>
    <li><a href="#">洗护</a></li>
    <li><a href="#">孕婴</a></li>
    <li><a href="#">服装</a></li>
    <li><a href="#">杂货</a></li> -->
  </ul>
</template>

<script>
import { computed } from '@vue/reactivity'
import { useStore } from 'vuex'
export default {
  name: 'AppHeaderNav',
  setup () {
    const store = useStore()
    const list = computed(() => {
      return store.state.category.list
    })
    // 跳转时候不会关闭二级类目，通过数据来控制
    // 1.vuex每个分类加上open数据
    // 2.vuex提供显示和隐藏函数，修改open数据
    // 3.组件中使用vuex中的函数，使用时间来绑定，提供一个类名显示隐藏的类目
    const show = (item) => {
      store.commit('category/show', item.id)
    }
    const hide = (item) => {
      store.commit('category/hide', item.id)
    }
    return { list, show, hide }
  }
}
</script>

<style scoped lang='less'>
.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;
  z-index: 998;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
    //   > .layer {
    //     height: 132px;
    //     opacity: 1;
    //   }
    }
  }
}
.layer {
    &.open {
    height: 132px;
    opacity: 1;
  }
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all .2s .1s;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
