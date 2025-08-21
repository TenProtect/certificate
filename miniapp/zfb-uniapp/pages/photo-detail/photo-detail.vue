<template>
  <view class="photo-detail-page">
    <!-- 顶部指引图片轮播 -->
    <view class="guide-banner">
      <scroll-banner 
        :images="guideImages" 
        direction="horizontal" 
        :interval="3000"
        :duration="300"
        height="296rpx" 
        auto-play
        draggable
        image-align="top"
        :show-indicators="false" 
      />
    </view>

    <!-- 温馨提示 -->
    <view class="tip-notice">
      <text class="tip-text">根据相关部门规定，不得上传含有淫秽、色情以及涉及政治内容的图片</text>
    </view>

    <!-- 快速拍照流程 -->
    <view class="photo-process">
      <view class="process-header">
        <text class="process-title">3步极速拍照</text>
        <text class="process-subtitle">专业级证件照制作</text>
      </view>
      
      <view class="process-steps">
        <view class="step-wrapper">
          <view class="step-item">
            <view class="step-circle active">
              <view class="step-icon">📷</view>
            </view>
            <text class="step-label">拍摄上传</text>
            <text class="step-desc">高清拍照</text>
          </view>
          <view class="step-connector active"></view>
        </view>
        
        <view class="step-wrapper">
          <view class="step-item">
            <view class="step-circle active">
              <view class="step-icon">✨</view>
            </view>
            <text class="step-label">智能修图</text>
            <text class="step-desc">AI美化</text>
          </view>
          <view class="step-connector active"></view>
        </view>
        
        <view class="step-wrapper">
          <view class="step-item">
            <view class="step-circle active">
              <view class="step-icon">💎</view>
            </view>
            <text class="step-label">下载相片</text>
            <text class="step-desc">精品输出</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 证件规格信息 -->
    <view class="document-specs">
      <view class="doc-type">
        <text class="doc-type-text">{{ documentInfo.name }}</text>
      </view>
      
      <view class="specs-grid">
        <view class="spec-item">
          <text class="spec-label">冲印尺寸</text>
          <text class="spec-value">{{ documentInfo.printSize }}</text>
        </view>
        <view class="spec-item">
          <text class="spec-label">像素尺寸</text>
          <text class="spec-value">{{ documentInfo.pixelSize }}</text>
        </view>
        <view class="spec-item">
          <text class="spec-label">分辨率</text>
          <text class="spec-value">{{ documentInfo.resolution }}</text>
        </view>
      </view>
      
      <!-- 其他选项 -->
      <view class="other-options">
        <view class="option-item">
          <text class="option-label">保存电子照</text>
          <view class="option-switch active">
            <view class="switch-dot"></view>
          </view>
        </view>
        <view class="option-item">
          <text class="option-label">冲印排版照</text>
          <view class="option-switch active">
            <view class="switch-dot"></view>
          </view>
        </view>
        <view class="option-item">
          <text class="option-label">背景色</text>
          <view class="color-block" :style="{ backgroundColor: documentInfo.bgColor }"></view>
        </view>
        <view class="option-item">
          <text class="option-label">图片格式</text>
          <text class="option-value">{{ documentInfo.imageFormat || '无要求' }}</text>
        </view>
        <view class="option-item">
          <text class="option-label">图片大小</text>
          <text class="option-value">{{ documentInfo.imageFileSize || '无要求' }}</text>
        </view>
        <view class="option-item">
          <text class="option-label">其他要求</text>
          <text class="option-value">{{ documentInfo.requirements || '无要求' }}</text>
        </view>
      </view>
    </view>

    <!-- 底部间距适配区域 -->
    <view class="bottom-spacer"></view>

    <!-- 底部按钮 -->
    <view class="bottom-actions">
      <view class="action-btn secondary" @tap="selectFromAlbum">
        <text class="btn-text">相册选取</text>
      </view>
      <view class="action-btn primary" @tap="takePhoto">
        <text class="btn-text">现在拍摄</text>
      </view>
    </view>
  </view>
</template>

<script>
import ScrollBanner from '@/components/scroll-banner.vue'
import { uploadImage } from '@/utils/api.js'

export default {
  name: 'PhotoDetail',
  components: {
    ScrollBanner
  },
  data() {
    return {
      statusBarHeight: 0,
      currentCity: '',
       documentInfo: {
        name: '身份证',
        price: 20,
        specs: {
          printSize: '26x32mm',
          pixelSize: '358x441px',
          resolution: '300DPI',
          saveElectronicPhoto: true,
          printLayout: true,
          bgColor: '#FFFFFF',
          imageFormat: '无要求',
          imageFileSize: '无要求',
          requirements: '免冠，照片可看见两耳轮廓和相当于男士喉结处的地方'
        }
      },
      guideImages: [
        {
          src: '/static/detail-guide/P1.png',
          alt: '拍摄指引1'
        },
        {
          src: '/static/detail-guide/P2.png',
          alt: '拍摄指引2'
        },
        {
          src: '/static/detail-guide/P3.png',
          alt: '拍摄指引3'
        },
        {
          src: '/static/detail-guide/P4.png',
          alt: '拍摄指引4'
        }
      ]
    }
  },
  onLoad(options) {
    // 获取系统信息
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight || 0
    
    // 获取传递的城市信息
    if (options.city) {
      this.currentCity = decodeURIComponent(options.city)
    }
    
    // 获取传递的文档信息
    if (options.data) {
      try {
        this.documentInfo = JSON.parse(decodeURIComponent(options.data))
      } catch (e) {
        console.error('解析文档数据失败:', e)
      }
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    selectFromAlbum() {
      // 检查登录状态
      if (!this.checkLogin()) {
        return
      }

      uni.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['album'],
        success: (res) => {
          const localPath = res.tempFilePaths[0]
          uni.showLoading({ title: '上传中...' })
          uploadImage(localPath)
            .then(file => {
              const imageData = encodeURIComponent(file.url)
              const documentData = encodeURIComponent(JSON.stringify(this.documentInfo))
              const cityData = encodeURIComponent(this.currentCity)
              uni.hideLoading()
              uni.navigateTo({
                url: `/pages/photo-preview-choose/photo-preview-choose?image=${imageData}&document=${documentData}&city=${cityData}`
              })
            })
            .catch(() => {
              uni.showToast({ title: '上传失败', icon: 'none' })
            })
            .finally(() => {
              uni.hideLoading()
            })
        }
      })
    },
    
    checkLogin() {
      const hasToken = !!uni.getStorageSync('token')
      if (!hasToken) {
        uni.showModal({
          title: '请先登录',
          content: '拍摄证件照需要先登录账号，是否前往登录？',
          confirmText: '去登录',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              // 跳转到主页的个人中心进行登录
              uni.switchTab({
                url: '/pages/main/main'
              })
              // 发送事件通知切换到个人中心tab
              setTimeout(() => {
                uni.$emit('switch-to-profile')
              }, 100)
            }
          }
        })
        return false
      }
      return true
    },
    
    takePhoto() {
      // 检查登录状态
      if (!this.checkLogin()) {
        return
      }
      
      // 跳转到相机拍照页面
      const documentData = encodeURIComponent(JSON.stringify(this.documentInfo))
      const cityData = encodeURIComponent(this.currentCity)
      uni.navigateTo({
        url: `/pages/camera-capture/camera-capture?data=${documentData}&city=${cityData}`
      })
    }
  }
}
</script>

<style scoped>
.photo-detail-page {
  background-color: #fff;
  min-height: 100vh;
}

/* 自定义导航栏 */
.custom-navbar {
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navbar-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
}

.nav-left {
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

.nav-center {
  flex: 1;
  text-align: center;
}

.nav-title {
  font-size: 36rpx;
  color: #333;
  font-weight: 500;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.more-icon, .minus-icon {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.record-icon {
  width: 32rpx;
  height: 32rpx;
  border: 4rpx solid #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.record-dot {
  width: 12rpx;
  height: 12rpx;
  background-color: #333;
  border-radius: 50%;
}

/* 指引轮播图 */
.guide-banner {
  position: relative;
  margin: 32rpx;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.guide-step-indicator {
  position: absolute;
  bottom: 32rpx;
  left: 32rpx;
  right: 32rpx;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 16rpx;
  padding: 16rpx 24rpx;
  color: white;
}

.step-text {
  font-size: 28rpx;
  font-weight: 500;
  margin-right: 16rpx;
}

.step-desc {
  font-size: 24rpx;
  opacity: 0.9;
}

/* 温馨提示 */
.tip-notice {
  background-color: #E3F2FD;
  padding: 24rpx 32rpx;
  margin: 32rpx;
  border-radius: 16rpx;
  border-left: 8rpx solid #2196F3;
}

.tip-text {
  font-size: 24rpx;
  color: #1976D2;
  line-height: 1.5;
}

/* 3步极速拍照 */
.photo-process {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 32rpx;
  padding: 60rpx 40rpx;
  border-radius: 32rpx;
  box-shadow: 0 20rpx 60rpx rgba(102, 126, 234, 0.15);
  position: relative;
  overflow: hidden;
}

.photo-process::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.process-header {
  text-align: center;
  margin-bottom: 60rpx;
  position: relative;
  z-index: 2;
}

.process-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.process-subtitle {
  display: block;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
}

.process-steps {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.step-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  width: 100%;
}

.step-circle {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.step-circle.active {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.1);
  box-shadow: 0 12rpx 48rpx rgba(255, 255, 255, 0.2);
}

.step-circle.active::after {
  content: '';
  position: absolute;
  top: -6rpx;
  left: -6rpx;
  right: -6rpx;
  bottom: -6rpx;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
  background-size: 400% 400%;
  animation: gradientShift 3s ease infinite;
  z-index: -1;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.step-icon {
  font-size: 32rpx;
  filter: grayscale(100%);
  transition: all 0.3s ease;
}

.step-circle.active .step-icon {
  filter: grayscale(0%);
  transform: scale(1.1);
}

.step-connector {
  position: absolute;
  top: 40rpx;
  right: -50%;
  width: 100%;
  height: 4rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2rpx;
  overflow: hidden;
}

.step-connector.active {
  background: rgba(255, 255, 255, 0.4);
}

.step-connector.active::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  animation: flow 2s ease-in-out infinite;
}

@keyframes flow {
  0% { left: -100%; }
  100% { left: 100%; }
}

.step-wrapper:last-child .step-connector {
  display: none;
}

.step-label {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.step-desc {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 300;
  text-align: center;
  white-space: nowrap;
}

/* 证件规格信息 */
.document-specs {
  margin: 32rpx;
}

.doc-type {
  margin-bottom: 32rpx;
}

.doc-type-text {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24rpx;
  margin-bottom: 48rpx;
}

.spec-item {
  text-align: center;
  padding: 24rpx 16rpx;
  background-color: #F8F9FA;
  border-radius: 16rpx;
}

.spec-label {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.spec-value {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

/* 其他选项 */
.other-options {
  background-color: #fff;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
}

.option-item:last-child {
  border-bottom: none;
}

.option-label {
  font-size: 28rpx;
  color: #333;
}

.option-value {
  font-size: 28rpx;
  color: #666;
  max-width: 400rpx;
  text-align: right;
  line-height: 1.4;
}

/* 颜色显示组件 */
.color-block {
  width: 48rpx;
  height: 48rpx;
  border-radius: 12rpx;
  border: 2rpx solid #E0E0E0;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.option-switch {
  width: 88rpx;
  height: 48rpx;
  background-color: #E0E0E0;
  border-radius: 24rpx;
  position: relative;
  transition: all 0.3s ease;
}

.option-switch.active {
  background-color: #4CAF50;
}

.switch-dot {
  width: 40rpx;
  height: 40rpx;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 4rpx;
  left: 4rpx;
  transition: all 0.3s ease;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.option-switch.active .switch-dot {
  transform: translateX(40rpx);
}

/* 底部间距适配区域 */
.bottom-spacer {
  height: 152rpx; /* 底部按钮高度88rpx + 上下padding 32rpx*2 */
}

/* 底部按钮 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 32rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
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
  background-color: #F5F5F5;
  color: #333;
}

.action-btn.primary {
  background-color: #6C5CE7;
  color: white;
}

.action-btn:active {
  transform: scale(0.98);
}

.btn-text {
  font-size: 32rpx;
}

/* 底部版权信息 */
.footer-info {
  text-align: center;
  padding: 24rpx;
  margin-bottom: 120rpx;
}

.footer-text {
  font-size: 24rpx;
  color: #999;
  margin-right: 16rpx;
}

.footer-watermark {
  font-size: 24rpx;
  color: #333;
}
</style>
