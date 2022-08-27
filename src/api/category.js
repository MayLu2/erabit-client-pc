import request from '@/utils/request'
/**
 * 获取分类菜单
 */
const findAllCategory = () => {
  return request('/home/category/head', 'get')
}

export { findAllCategory }
