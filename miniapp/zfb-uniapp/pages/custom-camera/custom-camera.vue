<template>
  <view class="custom-camera-page">
    <!-- 相机组件 -->
    <camera 
      class="camera-preview"
      :device-position="devicePosition"
      :flash="flashMode"
      :frame-size="frameSize"
      @error="onCameraError"
      @initdone="onCameraReady"
      @scancode="onScanCode"
    >
      <!-- 相机表面覆盖层 -->
      <cover-view class="camera-overlay">
        <!-- 顶部控制栏 -->
        <cover-view class="top-controls">
          <cover-view class="control-btn" @tap="goBack">
            <cover-image src="/static/icons/back.svg" class="icon"></cover-image>
          </cover-view>
          
          <cover-view class="camera-title">{{ documentInfo.name }}拍摄</cover-view>
          
          <cover-view class="control-btn" @tap="toggleFlash">
            <cover-image 
              :src="flashMode === 'on' ? '/static/icons/flash-on.svg' : '/static/icons/flash-off.svg'" 
              class="icon"
            ></cover-image>
          </cover-view>
        </cover-view>

        <!-- 人像轮廓参考框 -->
        <cover-view class="photo-guide-frame">
          <!-- 证件照参考框 -->
          <cover-view class="id-photo-frame">
            <cover-view class="frame-border"></cover-view>
            
            <!-- 人脸轮廓指引 -->
            <cover-view class="face-guide">
              <cover-view class="face-outline">
                <!-- 头部轮廓 -->
                <cover-view class="head-outline"></cover-view>
                <!-- 肩部轮廓 -->
                <cover-view class="shoulder-outline"></cover-view>
              </cover-view>
              
              <!-- 对齐指引线 -->
              <cover-view class="guide-lines">
                <cover-view class="horizontal-line top"></cover-view>
                <cover-view class="horizontal-line center"></cover-view>
                <cover-view class="horizontal-line bottom"></cover-view>
                <cover-view class="vertical-line left"></cover-view>
                <cover-view class="vertical-line right"></cover-view>
              </cover-view>
            </cover-view>
            
            <!-- 拍摄提示文字 -->
            <cover-view class="photo-tips">
              <cover-view class="tip-text">请保持头部居中，面部清晰</cover-view>
              <cover-view class="tip-text">{{ documentInfo.requirements }}</cover-view>
            </cover-view>
          </cover-view>
        </cover-view>

        <!-- 底部控制栏 -->
        <cover-view class="bottom-controls">
          <!-- 相册按钮 -->
          <cover-view class="album-btn" @tap="openAlbum">
            <cover-image src="/static/icons/album.svg" class="album-icon"></cover-image>
            <cover-view class="album-text">相册</cover-view>
          </cover-view>
          
          <!-- 拍照按钮 -->
          <cover-view class="capture-btn-wrapper">
            <cover-view class="capture-btn" @tap="takePhoto">
              <cover-view class="capture-inner"></cover-view>
            </cover-view>
          </cover-view>
          
          <!-- 翻转相机按钮 -->
          <cover-view class="flip-btn" @tap="flipCamera">
            <cover-image src="/static/icons/flip-camera.svg" class="flip-icon"></cover-image>
            <cover-view class="flip-text">翻转</cover-view>
          </cover-view>
        </cover-view>

        <!-- 拍摄设置面板 -->
        <cover-view class="settings-panel" v-if="showSettings">
          <cover-view class="settings-content">
            <cover-view class="setting-item">
              <cover-view class="setting-label">画质</cover-view>
              <cover-view class="setting-options">
                <cover-view 
                  class="option-btn" 
                  :class="{ active: frameSize === 'medium' }"
                  @tap="setFrameSize('medium')"
                >
                  标准
                </cover-view>
                <cover-view 
                  class="option-btn" 
                  :class="{ active: frameSize === 'large' }"
                  @tap="setFrameSize('large')"
                >
                  高清
                </cover-view>
              </cover-view>
            </cover-view>
          </cover-view>
        </cover-view>

        <!-- 设置按钮 -->
        <cover-view class="settings-btn" @tap="toggleSettings">
          <cover-image src="/static/icons/settings.svg" class="settings-icon"></cover-image>
        </cover-view>
      </cover-view>
    </camera>

    <!-- 拍摄成功预览 -->
    <view class="photo-preview" v-if="capturedImage">
      <image :src="capturedImage" class="preview-image" mode="aspectFit"></image>
      
      <view class="preview-controls">
        <view class="preview-btn secondary" @tap="retakePhoto">
          <text class="btn-text">重新拍摄</text>
        </view>
        <view class="preview-btn primary" @tap="confirmPhoto">
          <text class="btn-text">确认使用</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomCamera',
  data() {
    return {
      devicePosition: 'back', // 'front' | 'back'
      flashMode: 'off', // 'auto' | 'on' | 'off'
      frameSize: 'large', // 'small' | 'medium' | 'large'
      showSettings: false,
      capturedImage: null,
       documentInfo: {
        name: '身份证',
        price: 20,
        specs: {
          requirements: '免冠，照片可看见两耳轮廓和相当于男士喉结处的地方'
        }
      }
    }
  },
  
  onLoad(options) {
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
    
    toggleFlash() {
      const modes = ['off', 'on', 'auto']
      const currentIndex = modes.indexOf(this.flashMode)
      this.flashMode = modes[(currentIndex + 1) % modes.length]
    },
    
    flipCamera() {
      this.devicePosition = this.devicePosition === 'back' ? 'front' : 'back'
    },
    
    toggleSettings() {
      this.showSettings = !this.showSettings
    },
    
    setFrameSize(size) {
      this.frameSize = size
      this.showSettings = false
    },
    
    takePhoto() {
      const ctx = uni.createCameraContext()
      ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          this.capturedImage = res.tempImagePath
          console.log('拍摄成功:', res.tempImagePath)
          
          // 提供触觉反馈
          uni.vibrateShort()
        },
        fail: (err) => {
          console.error('拍摄失败:', err)
          uni.showToast({
            title: '拍摄失败',
            icon: 'none'
          })
        }
      })
    },
    
    openAlbum() {
      uni.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['album'],
        success: (res) => {
          this.capturedImage = res.tempFilePaths[0]
        }
      })
    },
    
    retakePhoto() {
      this.capturedImage = null
    },
    
    confirmPhoto() {
      if (this.capturedImage) {
        // 返回上一页并传递图片路径
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        if (prevPage) {
          prevPage.$vm.handlePhotoResult(this.capturedImage)
        }
        uni.navigateBack()
      }
    },
    
    onCameraError(e) {
      console.error('相机错误:', e)
      uni.showToast({
        title: '相机启动失败',
        icon: 'none'
      })
    },
    
    onCameraReady() {
      console.log('相机准备就绪')
    },
    
    onScanCode(e) {
      // 如果需要二维码扫描功能
      console.log('扫描到二维码:', e)
    }
  }
}
</script>

<style scoped>
.custom-camera-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #000;
}

.camera-preview {
  width: 100%;
  height: 100%;
}

.camera-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}

/* 顶部控制栏 */
.top-controls {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  padding-top: var(--status-bar-height, 44rpx);
}

.control-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
}

.icon {
  width: 48rpx;
  height: 48rpx;
}

.camera-title {
  color: white;
  font-size: 32rpx;
  font-weight: 500;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.5);
}

/* 人像轮廓参考框 */
.photo-guide-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500rpx;
  height: 650rpx;
}

.id-photo-frame {
  position: relative;
  width: 100%;
  height: 100%;
}

.frame-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 4rpx solid rgba(255, 255, 255, 0.8);
  border-radius: 16rpx;
  box-shadow: 0 0 0 2rpx rgba(0, 0, 0, 0.3);
}

.face-guide {
  position: absolute;
  top: 60rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 320rpx;
  height: 400rpx;
}

.face-outline {
  position: relative;
  width: 100%;
  height: 100%;
}

.head-outline {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 240rpx;
  height: 300rpx;
  border: 2rpx dashed rgba(255, 255, 255, 0.6);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
}

.shoulder-outline {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 300rpx;
  height: 120rpx;
  border: 2rpx dashed rgba(255, 255, 255, 0.6);
  border-radius: 50% 50% 0 0;
  border-bottom: none;
}

.guide-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.horizontal-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1rpx;
  background-color: rgba(255, 255, 255, 0.4);
}

.horizontal-line.top { top: 80rpx; }
.horizontal-line.center { top: 50%; }
.horizontal-line.bottom { bottom: 80rpx; }

.vertical-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1rpx;
  background-color: rgba(255, 255, 255, 0.4);
}

.vertical-line.left { left: 60rpx; }
.vertical-line.right { right: 60rpx; }

.photo-tips {
  position: absolute;
  bottom: -120rpx;
  left: 0;
  right: 0;
  text-align: center;
}

.tip-text {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: 24rpx;
  line-height: 1.4;
  margin-bottom: 8rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.5);
}

/* 底部控制栏 */
.bottom-controls {
  position: absolute;
  bottom: 60rpx;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 80rpx;
}

.album-btn, .flip-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.album-icon, .flip-icon {
  width: 56rpx;
  height: 56rpx;
}

.album-text, .flip-text {
  color: white;
  font-size: 24rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.5);
}

.capture-btn-wrapper {
  position: relative;
}

.capture-btn {
  width: 120rpx;
  height: 120rpx;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.capture-btn:active {
  transform: scale(0.95);
}

.capture-inner {
  width: 100rpx;
  height: 100rpx;
  background-color: #6C5CE7;
  border-radius: 50%;
}

/* 设置面板 */
.settings-btn {
  position: absolute;
  right: 32rpx;
  bottom: 240rpx;
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-icon {
  width: 48rpx;
  height: 48rpx;
}

.settings-panel {
  position: absolute;
  right: 32rpx;
  bottom: 340rpx;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 16rpx;
  padding: 32rpx;
  min-width: 200rpx;
}

.settings-content {
  color: white;
}

.setting-item {
  margin-bottom: 24rpx;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-label {
  font-size: 28rpx;
  margin-bottom: 16rpx;
}

.setting-options {
  display: flex;
  gap: 16rpx;
}

.option-btn {
  padding: 12rpx 24rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8rpx;
  font-size: 24rpx;
  text-align: center;
}

.option-btn.active {
  background-color: #6C5CE7;
}

/* 预览页面 */
.photo-preview {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  z-index: 20;
  display: flex;
  flex-direction: column;
}

.preview-image {
  flex: 1;
  width: 100%;
}

.preview-controls {
  padding: 32rpx;
  display: flex;
  gap: 24rpx;
}

.preview-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.preview-btn.secondary {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.preview-btn.primary {
  background-color: #6C5CE7;
  color: white;
}

.btn-text {
  font-size: 32rpx;
}
</style>
