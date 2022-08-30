<template>
    <div class="xtx-checkbox" @click="changeChecked">
      <i v-if="checked" class="iconfont icon-checked"></i>
      <i v-else class="iconfont icon-unchecked"></i>
      <span v-if="$slots.default"><slot /></span>
    </div>
  </template>
<script>
// import { ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
    // a: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    /**
     * 使用useVModel实现双向数据绑定v-model指令
     * vue3的v-model===>:modelValue  @update:modelValue
     *
     */
    // const checked = ref(false)
    // const changeChecked = () => {
    //   checked.value = !checked.value
    //   // 法一：使用emit通知父组件数据改变
    //   emit('update:modelValue', checked.value)
    // }
    // // 法一：实现双向数据绑定：使用监听器监听props的modelValue，得到父组件的传递参数，给checked数据
    // // 要用到watch
    // watch(() => props.modelValue, () => {
    //   checked.value = props.modelValue
    // }, { immediate: true })
    // 法二 setup结合vueuser库的方法
    // 1. 使用props接收modelValue
    // 2. 使用useVModel来包装props中的modelValue属性数据
    // 3. 在使用checked.value就是使用父组件数据
    // 4. 在使用checked.value = '数据' 赋值，触发emit('update:modelvalue', '数据')
    // const checked = useVModel(props, 'a', emit)
    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      const newVal = !checked.value
      // 通知父组件的change事件
      checked.value = newVal
      emit('change', newVal)
    }
    return { checked, changeChecked }
  }
}
</script>
  <style scoped lang="less">
  .xtx-checkbox {
    display: inline-block;
    margin-right: 2px;
    .icon-checked {
      color: @xtxColor;
      ~ span {
        color: @xtxColor;
      }
    }
    i {
      position: relative;
      top: 1px;
    }
    span {
      margin-left: 2px;
    }
  }
  </style>
