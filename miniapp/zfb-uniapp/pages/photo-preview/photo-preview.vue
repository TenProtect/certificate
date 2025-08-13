<template>
  <view class="photo-preview-page">
    <!-- 照片预览区域 -->
    <view class="photo-container">
      <view class="photo-wrapper">
        <image 
          :src="imagePath" 
          class="preview-image" 
          mode="aspectFit"
          @load="onImageLoad"
          @error="onImageError"
        />
        
        <!-- 照片信息叠加 -->
        <view class="photo-overlay">
          <view class="document-badge">
            <text class="badge-text">{{ documentInfo.name }}</text>
          </view>
          
          <view class="photo-specs">
            <text class="spec-text">{{ documentInfo.specs.pixelSize }}</text>
            <text class="spec-text">{{ documentInfo.specs.resolution }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 照片信息 -->
    <view class="photo-info">
      <view class="info-header">
        <text class="info-title">照片预览</text>
        <text class="info-subtitle">确认照片符合要求后提交</text>
      </view>
      
      <view class="document-info">
        <text class="document-name">{{ documentInfo.name }}</text>
        <text class="document-specs">{{ documentInfo.specs.pixelSize }} · {{ documentInfo.specs.resolution }}</text>
      </view>
    </view>

    <!-- 底部间距适配区域 -->
    <view class="bottom-spacer"></view>

    <!-- 底部操作按钮 -->
    <view class="bottom-actions">
      <view class="action-btn secondary" @tap="retakePhoto">
        <text class="btn-text">重拍</text>
      </view>
      <view class="action-btn primary" @tap="submitOrder">
        <text class="btn-text">提交</text>
      </view>
    </view>

  </view>
</template>

<script>
export default {
  name: 'PhotoPreview',
  data() {
    return {
      statusBarHeight: 0,
      imagePath: '',
      currentCity: '',
      documentInfo: {
        name: '身份证',
        specs: {
          printSize: '26x32mm',
          pixelSize: '358x441px',
          resolution: '300DPI'
        }
      }
    }
  },
  
  onLoad(options) {
    // 获取系统信息
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight || 0
    
    // 获取传递的图片路径
    if (options.image) {
      this.imagePath = decodeURIComponent(options.image)
    }
    
    // 获取传递的城市信息
    if (options.city) {
      this.currentCity = decodeURIComponent(options.city)
    }
    
    // 获取传递的文档信息
    if (options.document) {
      try {
        this.documentInfo = JSON.parse(decodeURIComponent(options.document))
      } catch (e) {
        console.error('解析文档数据失败:', e)
      }
    }
  },
  
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    retakePhoto() {
      uni.navigateBack()
    },
    
    onImageLoad() {
      console.log('图片加载成功')
    },
    
    onImageError() {
      uni.showToast({
        title: '图片加载失败',
        icon: 'none'
      })
    },
    
    submitOrder() {
      // 跳转到提交订单页面
      const imageData = encodeURIComponent(this.imagePath)
      const documentData = encodeURIComponent(JSON.stringify(this.documentInfo))
      const cityData = encodeURIComponent(this.currentCity)
      uni.navigateTo({
        url: `/pages/order-submit/order-submit?image=${imageData}&document=${documentData}&city=${cityData}`
      })
    }
  }
}
</script>

<style scoped>
.photo-preview-page {
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  min-height: 100vh;
}

/* 顶部导航栏 */
.preview-header {
  background: #fff;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.1);
}

.header-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
}

.header-left {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 48rpx;
  color: #333;
  font-weight: 300;
}

.header-center {
  flex: 1;
  text-align: center;
}

.header-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}

.header-right {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.retry-btn {
  padding: 12rpx 24rpx;
  background: #6C5CE7;
  border-radius: 24rpx;
}

.retry-text {
  font-size: 24rpx;
  color: #fff;
}

/* 照片预览区域 */
.photo-container {
  padding: 32rpx;
}

.photo-wrapper {
  position: relative;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 12rpx 48rpx rgba(0, 0, 0, 0.15);
  background: #fff;
}

.preview-image {
  width: 100%;
  height: 600rpx;
  display: block;
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.4) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24rpx;
}

.document-badge {
  align-self: flex-start;
  background: rgba(108, 92, 231, 0.9);
  padding: 12rpx 24rpx;
  border-radius: 24rpx;
  backdrop-filter: blur(10rpx);
}

.badge-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: 500;
}

.photo-specs {
  align-self: flex-end;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.spec-text {
  font-size: 20rpx;
  color: #fff;
  text-align: right;
  background: rgba(0, 0, 0, 0.3);
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  backdrop-filter: blur(5rpx);
}

/* 照片信息 */
.photo-info {
  margin: 32rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
}

.info-header {
  margin-bottom: 32rpx;
  text-align: center;
}

.info-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.info-subtitle {
  display: block;
  font-size: 24rpx;
  color: #666;
}

.document-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.document-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.document-specs {
  font-size: 24rpx;
  color: #666;
}

/* 底部间距适配区域 */
.bottom-spacer {
  height: 152rpx;
}

/* 底部操作按钮 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 32rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 24rpx;
}

.action-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-btn.secondary {
  background: #F5F5F5;
  color: #333;
}

.action-btn.primary {
  background: linear-gradient(135deg, #6C5CE7, #A855F7);
  color: #fff;
}

.action-btn:active {
  transform: scale(0.98);
}

.btn-text {
  font-size: 32rpx;
}
</style>
