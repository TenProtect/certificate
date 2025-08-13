<template>
  <view class="custom-tabbar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
    <!-- 毛玻璃背景效果 -->
    <view class="tabbar-blur-bg"></view>
    
    <!-- 顶部分割线 -->
    <view class="tabbar-border"></view>
    
    <!-- Tab项容器 -->
    <view class="tabbar-content">
      <view 
        v-for="(item, index) in tabList" 
        :key="index"
        class="tab-item"
        :class="{ active: currentTab === index }"
        @tap="switchTab(index)"
      >
        <!-- 背景光晕效果 -->
        <view class="tab-glow" v-if="currentTab === index"></view>
        
        <!-- 图标容器 -->
        <view class="tab-icon-wrapper">
          <!-- 使用SVG图标替代图片 -->
          <view class="tab-svg-icon" :class="{ active: currentTab === index }">
            <!-- 首页图标 -->
            <view v-if="index === 0" class="svg-home">
              <view class="home-base"></view>
              <view class="home-roof"></view>
              <view class="home-door"></view>
            </view>
            
            <!-- 订单图标 -->
            <view v-else-if="index === 1" class="svg-order">
              <view class="order-paper"></view>
              <view class="order-lines"></view>
              <view class="order-check" v-if="currentTab === index"></view>
            </view>
            
            <!-- 我的图标 -->
            <view v-else-if="index === 2" class="svg-profile">
              <view class="profile-head"></view>
              <view class="profile-body"></view>
            </view>
          </view>
          
          <!-- 激活状态的光点 -->
          <view class="icon-dot" v-if="currentTab === index"></view>
        </view>
        
        <!-- 文字 -->
        <text class="tab-text" :class="{ active: currentTab === index }">
          {{ item.text }}
        </text>
        
        <!-- 激活指示器 -->
        <view class="active-indicator" v-if="currentTab === index"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomTabbar',
  props: {
    currentTab: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      safeAreaBottom: 0,
      tabList: [
        {
          pagePath: '/pages/home/home',
          text: '首页',
          iconPath: '/static/tabbar/home.svg',
          selectedIconPath: '/static/tabbar/home-active.svg'
        },
        {
          pagePath: '/pages/order/order',
          text: '订单',
          iconPath: '/static/tabbar/order.svg',
          selectedIconPath: '/static/tabbar/order-active.svg'
        },
        {
          pagePath: '/pages/profile/profile',
          text: '我的',
          iconPath: '/static/tabbar/profile.svg',
          selectedIconPath: '/static/tabbar/profile-active.svg'
        }
      ]
    }
  },
  mounted() {
    this.getSafeAreaBottom()
  },
  methods: {
    // 获取当前tab索引
    getCurrentTab() {
      try {
        const pages = getCurrentPages()
        if (pages.length > 0) {
          const currentPage = pages[pages.length - 1]
          const route = currentPage.route || currentPage.__route__
          
          console.log('当前页面路由:', route)
          
          this.tabList.forEach((item, index) => {
            const pagePath = item.pagePath.replace('/', '')
            if (route && (route.includes(pagePath) || route === pagePath)) {
              this.currentTab = index
              console.log('设置当前tab:', index, pagePath)
            }
          })
        }
      } catch (e) {
        console.log('获取当前页面失败:', e)
        // 降级方案：通过URL判断
        const url = window.location ? window.location.href : ''
        if (url.includes('home')) {
          this.currentTab = 0
        } else if (url.includes('order')) {
          this.currentTab = 1
        } else if (url.includes('profile')) {
          this.currentTab = 2
        }
      }
    },
    
    // 获取底部安全区域
    getSafeAreaBottom() {
      try {
        const systemInfo = uni.getSystemInfoSync()
        const safeArea = systemInfo.safeArea || {}
        const screenHeight = systemInfo.screenHeight || systemInfo.windowHeight
        
        // 支付宝小程序特殊处理
        if (systemInfo.platform === 'ios') {
          // iPhone X 系列底部安全区域
          this.safeAreaBottom = screenHeight - (safeArea.bottom || screenHeight)
          // 最小安全距离
          if (this.safeAreaBottom < 20) {
            this.safeAreaBottom = systemInfo.statusBarHeight > 44 ? 34 : 0
          }
        } else {
          // Android 设备通常不需要额外的底部安全区域
          this.safeAreaBottom = Math.max(0, screenHeight - (safeArea.bottom || screenHeight))
        }
        
        console.log('底部安全区域高度:', this.safeAreaBottom)
      } catch (e) {
        console.log('获取安全区域失败:', e)
        this.safeAreaBottom = 0
      }
    },
    
    // 切换tab
    switchTab(index) {
      if (this.currentTab === index) return
      
      // 发送切换事件给父组件
      this.$emit('tab-change', index)
      
      // 添加切换成功的反馈
      uni.vibrateShort({
        type: 'light'
      })
    }
  }
}
</script>

<style scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.tabbar-blur-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(255, 255, 255, 0.95) 50%, 
    rgba(255, 255, 255, 1) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.tabbar-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1rpx;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(61, 69, 230, 0.1) 50%, 
    transparent 100%
  );
}

.tabbar-content {
  position: relative;
  display: flex;
  height: 120rpx;
  align-items: center;
  justify-content: space-around;
  padding: 0 20rpx;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 10rpx 0;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.tab-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90rpx;
  height: 90rpx;
  background: radial-gradient(circle, rgba(61, 69, 230, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
  }
}

.tab-icon-wrapper {
  position: relative;
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 8rpx;
}

.tab-svg-icon {
  width: 100%;
  height: 100%;
  position: relative;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.tab-svg-icon.active {
  animation: icon-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* 首页图标样式 */
.svg-home {
  position: relative;
  width: 100%;
  height: 100%;
}

.home-base {
  position: absolute;
  bottom: 10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 38rpx;
  height: 24rpx;
  background: #999;
  transition: all 0.3s ease;
}

.tab-svg-icon.active .home-base {
  background: #3d45e6;
}

.home-roof {
  position: absolute;
  top: 8rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 24rpx solid transparent;
  border-right: 24rpx solid transparent;
  border-bottom: 20rpx solid #999;
  transition: all 0.3s ease;
}

.tab-svg-icon.active .home-roof {
  border-bottom-color: #3d45e6;
}

.home-door {
  position: absolute;
  bottom: 10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 10rpx;
  height: 14rpx;
  background: white;
  border-radius: 1rpx;
}

/* 订单图标样式 */
.svg-order {
  position: relative;
  width: 100%;
  height: 100%;
}

.order-paper {
  position: absolute;
  top: 6rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 36rpx;
  height: 46rpx;
  background: #999;
  border-radius: 4rpx;
  transition: all 0.3s ease;
}

.tab-svg-icon.active .order-paper {
  background: #3d45e6;
}

.order-lines {
  position: absolute;
  top: 16rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 24rpx;
  height: 2rpx;
  background: white;
  box-shadow: 0 8rpx 0 white, 0 16rpx 0 white;
}

.order-check {
  position: absolute;
  top: 38rpx;
  right: 6rpx;
  width: 10rpx;
  height: 10rpx;
  background: #4CAF50;
  border-radius: 50%;
  animation: check-appear 0.3s ease-out;
}

@keyframes check-appear {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 我的图标样式 */
.svg-profile {
  position: relative;
  width: 100%;
  height: 100%;
}

.profile-head {
  position: absolute;
  top: 8rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 22rpx;
  height: 22rpx;
  background: #999;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.tab-svg-icon.active .profile-head {
  background: #3d45e6;
}

.profile-body {
  position: absolute;
  bottom: 8rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 38rpx;
  height: 24rpx;
  background: #999;
  border-radius: 19rpx 19rpx 0 0;
  transition: all 0.3s ease;
}

.tab-svg-icon.active .profile-body {
  background: #3d45e6;
}

@keyframes icon-bounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2) translateY(-4rpx);
  }
  100% {
    transform: scale(1);
  }
}

.icon-dot {
  position: absolute;
  top: -6rpx;
  right: -6rpx;
  width: 16rpx;
  height: 16rpx;
  background: linear-gradient(135deg, #3d45e6 0%, #5b63f5 100%);
  border-radius: 50%;
  border: 2rpx solid white;
  animation: dot-pulse 1.5s ease-in-out infinite;
}

@keyframes dot-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(61, 69, 230, 0.7);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 8rpx rgba(61, 69, 230, 0);
  }
}

.tab-text {
  font-size: 22rpx;
  color: #999;
  font-weight: 400;
  transition: all 0.3s ease;
  letter-spacing: 0.5rpx;
}

.tab-text.active {
  color: #3d45e6;
  font-weight: 600;
  transform: scale(1.05);
}

.active-indicator {
  position: absolute;
  bottom: -2rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 30rpx;
  height: 6rpx;
  background: linear-gradient(90deg, #3d45e6 0%, #5b63f5 100%);
  border-radius: 3rpx;
  animation: indicator-slide-in 0.3s ease-out;
}

@keyframes indicator-slide-in {
  0% {
    width: 0;
    opacity: 0;
  }
  100% {
    width: 30rpx;
    opacity: 1;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .custom-tabbar {
    background: rgba(28, 28, 30, 0.95);
  }
  
  .tabbar-blur-bg {
    background: linear-gradient(180deg, 
      rgba(28, 28, 30, 0.9) 0%, 
      rgba(28, 28, 30, 0.95) 50%, 
      rgba(28, 28, 30, 1) 100%
    );
  }
  
  .tab-text {
    color: #8e8e93;
  }
  
  .tab-text.active {
    color: #007aff;
  }
}

/* 支付宝小程序适配 */
.custom-tabbar {
  box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.1);
  /* 硬件加速 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  /* 防止在某些设备上出现白线 */
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
}

/* 优化毛玻璃效果的兼容性 */
@supports not (backdrop-filter: blur(20px)) {
  .custom-tabbar,
  .tabbar-blur-bg {
    background: rgba(255, 255, 255, 0.98);
  }
}

/* 针对支付宝小程序的特殊优化 */
/* #ifdef MP-ALIPAY */
.custom-tabbar {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.tabbar-blur-bg {
  background: linear-gradient(180deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(255, 255, 255, 1) 100%
  );
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
/* #endif */

/* 确保在所有设备上都有良好的性能 */
.tab-item,
.tab-svg-icon,
.tab-text {
  will-change: transform, color;
}
</style>
