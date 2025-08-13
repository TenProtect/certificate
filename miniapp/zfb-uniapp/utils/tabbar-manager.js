// TabBar管理工具
export const TabBarManager = {
  // 隐藏原生TabBar
  hideNativeTabBar() {
    try {
      uni.hideTabBar({
        animation: false,
        success: () => {
          console.log('原生TabBar隐藏成功')
        },
        fail: (err) => {
          console.log('隐藏原生TabBar失败:', err)
        }
      })
    } catch (e) {
      console.log('hideTabBar调用异常:', e)
    }
  },

  // 初始化TabBar（在App.vue中调用）
  initTabBar() {
    // 确保在应用启动时就隐藏原生TabBar
    setTimeout(() => {
      this.hideNativeTabBar()
    }, 100)
  },

  // 页面切换时的TabBar处理
  onPageSwitch() {
    // 每次页面切换都确保隐藏原生TabBar
    this.hideNativeTabBar()
  }
}

export default TabBarManager
