const merchantRouter = {
  route: null,
  name: null,
  title: '商家管理',
  type: 'folder',
  icon: 'el-icon-s-shop',
  filePath: 'view/merchant/',
  order: null,
  inNav: true,
  children: [
    {
      title: '商家列表',
      type: 'view',
      name: 'merchantList',
      route: '/merchant/list',
      filePath: 'view/merchant/merchant-list.vue',
      inNav: true,
      icon: '',
    },
  ],
}

export default merchantRouter
