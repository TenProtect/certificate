<template>
  <view class="camera-capture-page">
    <!-- 相机组件 -->
    <UCameraOverlay
      ref="ucameraRef"
      :devicePosition="cameraDevice"
      :showGuides="false"
      :showControls="false"
      tips=""
      @capture="onPhotoCapture"
      @update:devicePosition="onDeviceChange"
      class="camera-component"
    />

    <!-- 人像轮廓引导 -->
    <!-- 临时隐藏引导图，调试相机显示问题 -->
    <view class="portrait-guide">
      <image src="/static/camera/person-guide.png" class="guide-overlay-image" mode="widthFix" />
    </view>

    <!-- 底部控制栏 -->
    <view class="camera-controls">
      <!-- 左侧占位 -->
      <view class="control-placeholder"></view>
      
      <!-- 拍照按钮 -->
      <view class="capture-button" @tap="capturePhoto">
        <view class="capture-outer">
          <view class="capture-inner"></view>
        </view>
      </view>
      
      <!-- 切换摄像头按钮 -->
      <view class="control-btn primary" @tap="toggleCamera">
        <image src="/static/icons/refresh.svg" 
               class="control-icon refresh-icon" 
               :class="{ 'rotating': isRotating }"
               mode="aspectFit" />
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading-overlay" v-if="isProcessing">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text class="loading-text">正在处理图片...</text>
      </view>
    </view>
  </view>
</template>

<script>
import UCameraOverlay from '@/components/ucamera-overlay/ucamera-overlay.vue'

export default {
  name: 'CameraCapture',
  components: {
    UCameraOverlay
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
          resolution: '300DPI'
        }
      },
      
      // 相机设置
      cameraDevice: 'front',
      cameraTips: '请将脸部对准中央区域',
      
      // UI状态
      isProcessing: false,
      isRotating: false
    }
  },
  
  onLoad(options) {
    // 检查登录状态
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
          } else {
            // 用户取消登录，返回上一页
            uni.navigateBack()
          }
        }
      })
      return
    }
    
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
        this.cameraTips = `请将脸部对准引导区域`
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
      uni.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['album'],
        success: (res) => {
          this.processPhoto(res.tempFilePaths[0], 'album')
        },
        fail: () => {
          uni.showToast({
            title: '选择图片失败',
            icon: 'none'
          })
        }
      })
    },
    
    capturePhoto() {
      // 首先尝试使用UCameraOverlay组件的拍照功能
      // #ifdef MP-ALIPAY
      if (this.$refs.ucameraRef && this.$refs.ucameraRef.onShutter) {
        this.$refs.ucameraRef.onShutter()
      } else {
        this.fallbackCapture()
      }
      // #endif
      
      // #ifndef MP-ALIPAY
      this.fallbackCapture()
      // #endif
    },
    
    fallbackCapture() {
      // 备用拍照方案
      uni.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['camera'],
        success: (res) => {
          this.processPhoto(res.tempFilePaths[0], 'camera')
        },
        fail: () => {
          uni.showToast({
            title: '拍照失败',
            icon: 'none'
          })
        }
      })
    },
    
    toggleCamera() {
      // 触发旋转动画
      this.isRotating = true
      
      // 切换前后摄像头
      const newDevice = this.cameraDevice === 'front' ? 'back' : 'front'
      this.cameraDevice = newDevice
      
      // 通知UCameraOverlay组件更新设备
      this.$emit('update:devicePosition', newDevice)
      
      // 视觉反馈
      uni.showToast({
        title: newDevice === 'front' ? '切换到前置摄像头' : '切换到后置摄像头',
        icon: 'none',
        duration: 1000
      })
      
      // 动画结束后重置状态
      setTimeout(() => {
        this.isRotating = false
      }, 300)
    },
    
    onPhotoCapture(imagePath) {
      // UCameraOverlay组件的拍照回调
      this.processPhoto(imagePath, 'ucamera')
    },
    
    onDeviceChange(device) {
      this.cameraDevice = device
    },
    
    processPhoto(imagePath, source) {
      this.isProcessing = true
      
      console.log('处理图片:', imagePath, '来源:', source)
      
      // 简单的处理过程，直接跳转到预览页面
      setTimeout(() => {
        this.isProcessing = false
        
        // 跳转到预览页面
        const imageData = encodeURIComponent(imagePath)
        const documentData = encodeURIComponent(JSON.stringify(this.documentInfo))
        const cityData = encodeURIComponent(this.currentCity)
        uni.navigateTo({
          url: `/pages/photo-preview/photo-preview?image=${imageData}&document=${documentData}&city=${cityData}`
        })
      }, 1000)
    }
  }
}
</script>

<style scoped>
.camera-capture-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
  z-index: 0;
}

/* 相机组件样式 */
.camera-component {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 1 !important;
  /* 临时调试边框 - 生产环境请删除 */
  /* border: 2px solid red; */
}

/* 确保UCameraOverlay内部元素正确显示 */
.camera-component >>> .ucam-root {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
}

.camera-component >>> .ucam-camera {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 100% !important;
}

.camera-component >>> .ucam-overlay {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 100% !important;
}

/* 顶部状态栏 */
.camera-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 80%, transparent 100%);
}

.header-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
}

.header-left,
.header-right {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon {
  width: 32rpx;
  height: 32rpx;
  filter: brightness(0) invert(1);
}

.header-center {
  flex: 1;
  text-align: center;
}

.header-title {
  font-size: 32rpx;
  color: #fff;
  font-weight: 500;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.5);
}

/* 人像轮廓引导 */
.portrait-guide {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 500;
  pointer-events: none;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.guide-overlay-image {
  width: 100%;
}

.guide-tips {
  position: absolute;
  top: -100rpx;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10rpx);
  padding: 16rpx 32rpx;
  border-radius: 32rpx;
  border: 1rpx solid rgba(0, 200, 255, 0.3);
  white-space: nowrap;
}

.tips-text {
  font-size: 24rpx;
  color: #fff;
  text-align: center;
  text-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.8);
}

/* 底部控制栏 */
.camera-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 60%, transparent 100%);
  padding: 60rpx 32rpx 120rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 左侧占位元素，确保拍照按钮居中 */
.control-placeholder {
  width: 120rpx;
  height: 120rpx;
}

/* 控制按钮 */
.control-btn {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(15rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.control-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 50%;
}

.control-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
}

.control-btn.primary {
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.8), rgba(168, 85, 247, 0.8));
  border-color: rgba(108, 92, 231, 0.5);
  box-shadow: 0 8rpx 32rpx rgba(108, 92, 231, 0.3);
}

.control-btn:active {
  transform: scale(0.95);
}

.control-icon {
  width: 48rpx;
  height: 48rpx;
  filter: brightness(0) invert(1);
  z-index: 1;
  transition: transform 0.3s ease-in-out;
}

/* 刷新图标特殊样式 */
.refresh-icon {
  transform-origin: center;
}

.refresh-icon.rotating {
  transform: rotate(180deg);
}

.control-btn:active .control-icon {
  transform: scale(0.9);
}

/* 拍照按钮 */
.capture-button {
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.capture-outer {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 8rpx 32rpx rgba(0, 0, 0, 0.4),
    inset 0 2rpx 4rpx rgba(255, 255, 255, 0.8),
    inset 0 -2rpx 4rpx rgba(0, 0, 0, 0.1);
  border: 4rpx solid rgba(255, 255, 255, 0.9);
}

.capture-inner {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #6C5CE7 0%, #A855F7 100%);
  box-shadow: 
    0 4rpx 16rpx rgba(108, 92, 231, 0.4),
    inset 0 2rpx 4rpx rgba(255, 255, 255, 0.3),
    inset 0 -2rpx 4rpx rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.capture-inner::before {
  content: '';
  position: absolute;
  top: 20%;
  left: 20%;
  width: 60%;
  height: 60%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
  border-radius: 50%;
}

.capture-button:active {
  transform: scale(0.95);
}

.capture-button:active .capture-outer {
  box-shadow: 
    0 4rpx 16rpx rgba(0, 0, 0, 0.4),
    inset 0 2rpx 4rpx rgba(255, 255, 255, 0.8),
    inset 0 -2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.capture-button:active .capture-inner {
  box-shadow: 
    0 2rpx 8rpx rgba(108, 92, 231, 0.4),
    inset 0 2rpx 4rpx rgba(255, 255, 255, 0.3),
    inset 0 -2rpx 4rpx rgba(0, 0, 0, 0.3);
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10rpx);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32rpx;
}

.loading-spinner {
  width: 80rpx;
  height: 80rpx;
  border: 6rpx solid rgba(255, 255, 255, 0.2);
  border-top: 6rpx solid #6C5CE7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: #fff;
  text-align: center;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.5);
}

/* 响应式适配 */
@media (max-width: 750rpx) {
  .guide-overlay-image {
    width: 350rpx;
    height: 460rpx;
  }
  
  .capture-button {
    width: 160rpx;
    height: 160rpx;
  }
  
  .capture-inner {
    width: 100rpx;
    height: 100rpx;
  }
  
  .control-btn {
    width: 100rpx;
    height: 100rpx;
  }
  
  .control-placeholder {
    width: 100rpx;
    height: 100rpx;
  }
  
  .control-icon {
    width: 40rpx;
    height: 40rpx;
  }
}

/* 强制相机全屏显示 */
.camera-capture-page,
.camera-component,
.camera-component >>> .ucam-root,
.camera-component >>> .ucam-camera {
  width: 100vw !important;
  height: 100vh !important;
}
</style>
