const certificateRouter = {
  route: null,
  name: null,
  title: '证照管理',
  type: 'folder',
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/certificate/',
  order: null,
  inNav: true,
  children: [
    {
      title: '证照列表',
      type: 'view',
      name: 'CertificateList',
      route: '/certificate/list',
      filePath: 'view/certificate/certificate-list.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '新增证照',
      type: 'view',
      name: 'CertificateCreate',
      route: '/certificate/create',
      filePath: 'view/certificate/certificate-create.vue',
      inNav: false,
    },
  ],
}

export default certificateRouter
