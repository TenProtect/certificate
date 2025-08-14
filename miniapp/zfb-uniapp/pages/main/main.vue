<template>
  <view class="main-container">
    <!-- 页面内容区域 -->
    <view class="page-content">
      <!-- 首页组件 -->
      <home-page 
        v-if="currentTab === 0" 
        :class="{ 'page-active': currentTab === 0 }"
      />
      
      <!-- 订单页组件 -->
      <order-page 
        v-if="currentTab === 1" 
        :class="{ 'page-active': currentTab === 1 }"
        @switch-tab="handleTabChange"
      />
      
      <!-- 我的页面组件 -->
      <profile-page 
        v-if="currentTab === 2" 
        :class="{ 'page-active': currentTab === 2 }"
      />
    </view>
    
    <!-- 自定义TabBar -->
    <custom-tabbar 
      :current-tab="currentTab" 
      @tab-change="handleTabChange"
    />
  </view>
</template>

<script>
import HomePage from './components/home-content.vue'
import OrderPage from './components/order-content.vue'
import ProfilePage from './components/profile-content.vue'
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'

export default {
  name: 'MainContainer',
  components: {
    HomePage,
    OrderPage,
    ProfilePage,
    CustomTabbar
  },
  data() {
    return {
      currentTab: 0
    }
  },
  onLoad(options) {
    // 根据传入参数设置初始页面
    if (options.tab) {
      this.currentTab = parseInt(options.tab) || 0
    }
    
    // 监听切换到个人中心的事件
    uni.$on('switch-to-profile', () => {
      this.handleTabChange(2)
    })
    
    console.log('主容器加载完成，当前tab:', this.currentTab)
  },
  onShow() {
    // 隐藏原生TabBar
    uni.hideTabBar({
      animation: false
    })
  },
  onUnload() {
    // 页面卸载时移除事件监听
    uni.$off('switch-to-profile')
  },
  methods: {
    handleTabChange(tabIndex) {
      if (this.currentTab === tabIndex) return
      
      console.log('切换到tab:', tabIndex)
      this.currentTab = tabIndex
      
      // 添加触觉反馈
      uni.vibrateShort({
        type: 'light'
      })
      
      // 触发页面切换动画
      this.triggerPageAnimation(tabIndex)
    },
    
    triggerPageAnimation(tabIndex) {
      // 这里可以添加页面切换时的动画逻辑
      const pages = ['首页', '订单', '我的']
      console.log(`切换到${pages[tabIndex]}`)
    }
  }
}
</script>

<style scoped>
.main-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  box-sizing: border-box;
}

.page-content {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 120rpx);
  padding-bottom: 120rpx;
}

/* 页面切换动画 */
.page-content > view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: 0;
  transform: translateX(100%);
}

.page-content > view.page-active {
  opacity: 1;
  transform: translateX(0);
  position: relative;
}

/* 优化性能 */
.page-content > view:not(.page-active) {
  pointer-events: none;
}

.page-content > view.page-active {
  pointer-events: auto;
}
</style>
