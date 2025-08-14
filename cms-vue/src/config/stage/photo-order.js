const photoOrderRouter = {
  route: null,
  name: null,
  title: '订单管理',
  type: 'folder',
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/photo-order/',
  order: null,
  inNav: true,
  children: [
    {
      title: '订单列表',
      type: 'view',
      name: 'PhotoOrderList',
      route: '/photo-order/list',
      filePath: 'view/photo-order/photo-order-list.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli'
    }
  ]
}

export default photoOrderRouter
