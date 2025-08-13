<template>
  <view class="profile-page">
    <!-- 用户信息头部 -->
    <view class="user-header">
      <view class="user-avatar">
        <image class="avatar-image" src="/static/default-avatar.svg" mode="aspectFill" />
      </view>
      <view class="user-title">支付宝用户</view>
    </view>
    
    <!-- 菜单列表 -->
    <view class="menu-list">
      <view class="menu-item" @tap="handleMenuTap('guide')">
        <view class="menu-icon guide-icon">
          <view class="icon-circle">
            <view class="camera-icon">
              <view class="camera-body"></view>
              <view class="camera-lens"></view>
            </view>
          </view>
        </view>
        <text class="menu-label">拍摄指引</text>
        <text class="menu-arrow">›</text>
      </view>
      
      <view class="menu-item" @tap="handleMenuTap('notice')">
        <view class="menu-icon notice-icon">
          <view class="icon-circle">
            <view class="notice-icon-content">
              <view class="document-icon">
                <view class="doc-line"></view>
                <view class="doc-line"></view>
                <view class="doc-line"></view>
              </view>
            </view>
          </view>
        </view>
        <text class="menu-label">下单须知</text>
        <text class="menu-arrow">›</text>
      </view>
      
      <view class="menu-item" @tap="handleMenuTap('share')">
        <view class="menu-icon share-icon">
          <view class="icon-circle">
            <view class="share-icon-content">
              <view class="share-dot"></view>
              <view class="share-lines">
                <view class="share-line share-line-1"></view>
                <view class="share-line share-line-2"></view>
              </view>
              <view class="share-dot share-dot-2"></view>
              <view class="share-dot share-dot-3"></view>
            </view>
          </view>
        </view>
        <text class="menu-label">分享给好友</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProfileContent',
  methods: {
    handleMenuTap(type) {
      switch(type) {
        case 'guide':
          uni.navigateTo({
            url: '/pages/photo-guide/photo-guide'
          })
          break
        case 'notice':
          uni.navigateTo({
            url: '/pages/order-guide/order-guide'
          })
          break
        case 'share':
          uni.showShareMenu({
            success: () => {
              console.log('分享成功')
            },
            fail: () => {
              uni.showToast({
                title: '分享功能暂不可用',
                icon: 'none'
              })
            }
          })
          break
        default:
          console.log('未知操作:', type)
      }
    }
  }
}
</script>

<style scoped>
.profile-page {
  background-color: #f5f5f5;
  min-height: 100%;
  box-sizing: border-box;
  padding-top: 80rpx;
}

/* 用户头部信息 */
.user-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 20rpx 40rpx;
  /* background: white; */
  margin: 20rpx;
  border-radius: 20rpx;
  /* box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05); */
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 60rpx;
}

.user-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  text-align: center;
}

/* 菜单列表 */
.menu-list {
  background: white;
  margin: 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx 40rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background-color: #f8f9fa;
}

.menu-icon {
  width: 80rpx;
  height: 80rpx;
  margin-right: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-circle {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 拍摄指引图标 */
.guide-icon .icon-circle {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.camera-icon {
  position: relative;
  width: 32rpx;
  height: 24rpx;
}

.camera-body {
  width: 100%;
  height: 18rpx;
  background: white;
  border-radius: 4rpx;
  position: relative;
}

.camera-lens {
  position: absolute;
  top: 3rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 12rpx;
  height: 12rpx;
  background: #4facfe;
  border-radius: 50%;
  border: 2rpx solid white;
}

/* 下单须知图标 */
.notice-icon .icon-circle {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.document-icon {
  width: 24rpx;
  height: 30rpx;
  background: white;
  border-radius: 3rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rpx;
}

.doc-line {
  width: 16rpx;
  height: 2rpx;
  background: #fa709a;
  border-radius: 1rpx;
}

/* 分享给好友图标 */
.share-icon .icon-circle {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.share-icon-content {
  position: relative;
  width: 30rpx;
  height: 30rpx;
}

.share-dot {
  width: 8rpx;
  height: 8rpx;
  background: white;
  border-radius: 50%;
  position: absolute;
}

.share-dot:first-child {
  top: 4rpx;
  left: 4rpx;
}

.share-dot-2 {
  bottom: 4rpx;
  left: 4rpx;
}

.share-dot-3 {
  top: 50%;
  right: 4rpx;
  transform: translateY(-50%);
}

.share-lines {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.share-line {
  width: 12rpx;
  height: 1rpx;
  background: white;
  position: absolute;
}

.share-line-1 {
  top: -3rpx;
  transform: rotate(20deg);
}

.share-line-2 {
  top: 3rpx;
  transform: rotate(-20deg);
}

.menu-label {
  flex: 1;
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.menu-arrow {
  font-size: 32rpx;
  color: #ccc;
  font-weight: 300;
}
</style>
