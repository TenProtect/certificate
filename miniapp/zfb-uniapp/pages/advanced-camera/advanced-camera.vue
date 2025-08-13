<template>
  <view class="advanced-camera-page">
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
      <!-- Canvas 用于人脸检测绘制 -->
      <canvas 
        class="face-detection-canvas"
        canvas-id="faceCanvas"
        :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
      ></canvas>

      <!-- 相机表面覆盖层 -->
      <cover-view class="camera-overlay">
        <!-- 实时人脸检测状态 -->
        <cover-view class="face-status" :class="{ active: faceDetected }">
          <cover-view class="status-icon">{{ faceDetected ? '😊' : '🔍' }}</cover-view>
          <cover-view class="status-text">{{ faceStatus }}</cover-view>
        </cover-view>

        <!-- 智能拍摄引导 -->
        <cover-view class="smart-guide" v-if="showGuide">
          <cover-view class="guide-content">
            <cover-view class="guide-step">{{ currentGuideStep.title }}</cover-view>
            <cover-view class="guide-desc">{{ currentGuideStep.description }}</cover-view>
            <cover-view class="guide-progress">
              <cover-view 
                class="progress-dot" 
                v-for="(step, index) in guideSteps" 
                :key="index"
                :class="{ active: index <= currentGuideIndex }"
              ></cover-view>
            </cover-view>
          </cover-view>
        </cover-view>

        <!-- 人像轮廓实时调整框 -->
        <cover-view class="dynamic-frame" :style="frameStyle">
          <cover-view class="frame-corners">
            <cover-view class="corner top-left"></cover-view>
            <cover-view class="corner top-right"></cover-view>
            <cover-view class="corner bottom-left"></cover-view>
            <cover-view class="corner bottom-right"></cover-view>
          </cover-view>
          
          <!-- 人脸识别指示器 -->
          <cover-view class="face-indicators" v-if="faceRect">
            <cover-view 
              class="face-marker"
              :style="{ 
                left: faceRect.x + 'px', 
                top: faceRect.y + 'px',
                width: faceRect.width + 'px',
                height: faceRect.height + 'px'
              }"
            ></cover-view>
          </cover-view>
        </cover-view>

        <!-- 智能拍摄控制 -->
        <cover-view class="smart-controls">
          <!-- 自动拍摄模式 -->
          <cover-view class="auto-capture" v-if="autoMode">
            <cover-view class="countdown" v-if="countdown > 0">{{ countdown }}</cover-view>
            <cover-view class="auto-status">{{ autoStatus }}</cover-view>
          </cover-view>

          <!-- 拍摄质量指示器 -->
          <cover-view class="quality-indicator">
            <cover-view class="quality-item" :class="{ good: lightingGood }">
              <cover-view class="indicator-icon">💡</cover-view>
              <cover-view class="indicator-text">光线</cover-view>
            </cover-view>
            <cover-view class="quality-item" :class="{ good: stabilityGood }">
              <cover-view class="indicator-icon">📱</cover-view>
              <cover-view class="indicator-text">稳定</cover-view>
            </cover-view>
            <cover-view class="quality-item" :class="{ good: positionGood }">
              <cover-view class="indicator-icon">👤</cover-view>
              <cover-view class="indicator-text">位置</cover-view>
            </cover-view>
          </cover-view>
        </cover-view>

        <!-- 增强功能按钮组 -->
        <cover-view class="enhanced-controls">
          <cover-view class="control-group left">
            <cover-view class="control-btn" @tap="toggleAutoMode">
              <cover-image 
                :src="autoMode ? '/static/icons/auto-on.svg' : '/static/icons/auto-off.svg'" 
                class="btn-icon"
              ></cover-image>
              <cover-view class="btn-label">{{ autoMode ? '自动' : '手动' }}</cover-view>
            </cover-view>
            
            <cover-view class="control-btn" @tap="toggleGrid">
              <cover-image 
                :src="showGrid ? '/static/icons/grid-on.svg' : '/static/icons/grid-off.svg'" 
                class="btn-icon"
              ></cover-image>
              <cover-view class="btn-label">网格</cover-view>
            </cover-view>
          </cover-view>

          <cover-view class="control-group right">
            <cover-view class="control-btn" @tap="toggleBeauty">
              <cover-image 
                :src="beautyMode ? '/static/icons/beauty-on.svg' : '/static/icons/beauty-off.svg'" 
                class="btn-icon"
              ></cover-image>
              <cover-view class="btn-label">美颜</cover-view>
            </cover-view>
            
            <cover-view class="control-btn" @tap="adjustBrightness">
              <cover-image src="/static/icons/brightness.svg" class="btn-icon"></cover-image>
              <cover-view class="btn-label">亮度</cover-view>
            </cover-view>
          </cover-view>
        </cover-view>

        <!-- 网格线 -->
        <cover-view class="grid-overlay" v-if="showGrid">
          <cover-view class="grid-line horizontal" style="top: 33.33%"></cover-view>
          <cover-view class="grid-line horizontal" style="top: 66.67%"></cover-view>
          <cover-view class="grid-line vertical" style="left: 33.33%"></cover-view>
          <cover-view class="grid-line vertical" style="left: 66.67%"></cover-view>
        </cover-view>

        <!-- 底部增强控制栏 -->
        <cover-view class="bottom-enhanced-controls">
          <cover-view class="photo-modes">
            <cover-view 
              class="mode-btn" 
              v-for="mode in photoModes" 
              :key="mode.id"
              :class="{ active: currentMode === mode.id }"
              @tap="switchMode(mode.id)"
            >
              {{ mode.name }}
            </cover-view>
          </cover-view>

          <cover-view class="capture-section">
            <cover-view class="timer-btn" @tap="toggleTimer">
              <cover-view class="timer-icon">⏱️</cover-view>
              <cover-view class="timer-text">{{ timerSeconds }}s</cover-view>
            </cover-view>

            <cover-view class="main-capture-btn" @tap="smartCapture">
              <cover-view class="capture-ring" :class="{ recording: isCapturing }"></cover-view>
              <cover-view class="capture-dot"></cover-view>
            </cover-view>

            <cover-view class="burst-btn" @tap="toggleBurstMode">
              <cover-view class="burst-icon">📸</cover-view>
              <cover-view class="burst-text">连拍</cover-view>
            </cover-view>
          </cover-view>
        </cover-view>
      </cover-view>
    </camera>

    <!-- AI 分析结果展示 -->
    <view class="ai-analysis" v-if="showAnalysis">
      <view class="analysis-content">
        <view class="analysis-title">AI 分析结果</view>
        <view class="analysis-items">
          <view class="analysis-item" v-for="item in analysisResult" :key="item.key">
            <view class="item-label">{{ item.label }}</view>
            <view class="item-score" :class="item.status">{{ item.score }}</view>
          </view>
        </view>
        <view class="analysis-actions">
          <button @tap="hideAnalysis" class="btn secondary">继续拍摄</button>
          <button @tap="processPhoto" class="btn primary">确认使用</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AdvancedCamera',
  data() {
    return {
      // 基础相机设置
      devicePosition: 'back',
      flashMode: 'off',
      frameSize: 'large',
      
      // 人脸检测相关
      faceDetected: false,
      faceRect: null,
      faceStatus: '请将面部置于框内',
      
      // 智能引导
      showGuide: true,
      currentGuideIndex: 0,
      guideSteps: [
        { title: '调整距离', description: '请保持50-80cm的拍摄距离' },
        { title: '调整角度', description: '保持设备水平，面部居中' },
        { title: '检查光线', description: '确保光线充足均匀' },
        { title: '准备拍摄', description: '保持表情自然，准备拍摄' }
      ],
      
      // 拍摄质量检测
      lightingGood: false,
      stabilityGood: false,
      positionGood: false,
      
      // 增强功能
      autoMode: true,
      showGrid: false,
      beautyMode: false,
      countdown: 0,
      autoStatus: '智能检测中...',
      
      // 拍摄模式
      currentMode: 'photo',
      photoModes: [
        { id: 'photo', name: '拍照' },
        { id: 'burst', name: '连拍' },
        { id: 'timer', name: '定时' }
      ],
      
      // 定时器
      timerSeconds: 3,
      isCapturing: false,
      
      // Canvas 相关
      canvasWidth: 0,
      canvasHeight: 0,
      canvasContext: null,
      
      // AI 分析
      showAnalysis: false,
      analysisResult: [],
      
      // 文档信息
      documentInfo: {
        name: '身份证',
        specs: {
          requirements: '免冠，照片可看见两耳轮廓和相当于男士喉结处的地方'
        }
      }
    }
  },
  
  computed: {
    currentGuideStep() {
      return this.guideSteps[this.currentGuideIndex] || this.guideSteps[0]
    },
    
    frameStyle() {
      // 动态调整框的样式
      const baseStyle = {
        width: '400rpx',
        height: '520rpx',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }
      
      if (this.faceDetected) {
        baseStyle.borderColor = '#4CAF50'
        baseStyle.boxShadow = '0 0 20rpx rgba(76, 175, 80, 0.5)'
      }
      
      return baseStyle
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
    
    this.initCanvas()
    this.startQualityDetection()
  },
  
  onUnload() {
    this.stopQualityDetection()
  },
  
  methods: {
    // 初始化 Canvas
    initCanvas() {
      const query = uni.createSelectorQuery()
      query.select('.camera-preview').boundingClientRect((rect) => {
        this.canvasWidth = rect.width
        this.canvasHeight = rect.height
        this.canvasContext = uni.createCanvasContext('faceCanvas', this)
      }).exec()
    },
    
    // 开始质量检测
    startQualityDetection() {
      this.qualityTimer = setInterval(() => {
        this.detectQuality()
        this.updateGuide()
      }, 1000)
    },
    
    // 停止质量检测
    stopQualityDetection() {
      if (this.qualityTimer) {
        clearInterval(this.qualityTimer)
      }
    },
    
    // 检测拍摄质量
    detectQuality() {
      // 模拟质量检测逻辑
      this.lightingGood = Math.random() > 0.3
      this.stabilityGood = Math.random() > 0.2
      this.positionGood = this.faceDetected
      
      // 模拟人脸检测
      if (Math.random() > 0.4) {
        this.faceDetected = true
        this.faceRect = {
          x: this.canvasWidth * 0.3,
          y: this.canvasHeight * 0.25,
          width: this.canvasWidth * 0.4,
          height: this.canvasHeight * 0.5
        }
        this.faceStatus = '检测到人脸，位置良好'
      } else {
        this.faceDetected = false
        this.faceRect = null
        this.faceStatus = '请将面部置于框内'
      }
      
      // 自动拍摄逻辑
      if (this.autoMode && this.lightingGood && this.stabilityGood && this.positionGood) {
        this.autoCapture()
      }
    },
    
    // 更新引导步骤
    updateGuide() {
      if (!this.showGuide) return
      
      if (this.lightingGood && this.currentGuideIndex < 1) {
        this.currentGuideIndex = 1
      }
      if (this.stabilityGood && this.currentGuideIndex < 2) {
        this.currentGuideIndex = 2
      }
      if (this.positionGood && this.currentGuideIndex < 3) {
        this.currentGuideIndex = 3
        // 3秒后隐藏引导
        setTimeout(() => {
          this.showGuide = false
        }, 3000)
      }
    },
    
    // 自动拍摄
    autoCapture() {
      if (this.isCapturing) return
      
      this.autoStatus = '条件满足，准备拍摄'
      this.countdown = 3
      
      const countdownTimer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(countdownTimer)
          this.executeCapture()
        }
      }, 1000)
    },
    
    // 智能拍摄
    smartCapture() {
      if (this.currentMode === 'timer') {
        this.timerCapture()
      } else if (this.currentMode === 'burst') {
        this.burstCapture()
      } else {
        this.executeCapture()
      }
    },
    
    // 执行拍摄
    executeCapture() {
      this.isCapturing = true
      const ctx = uni.createCameraContext()
      
      ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          console.log('拍摄成功:', res.tempImagePath)
          
          // 触觉反馈
          uni.vibrateShort()
          
          // AI 分析
          this.analyzePhoto(res.tempImagePath)
          
          this.isCapturing = false
        },
        fail: (err) => {
          console.error('拍摄失败:', err)
          uni.showToast({
            title: '拍摄失败',
            icon: 'none'
          })
          this.isCapturing = false
        }
      })
    },
    
    // 定时拍摄
    timerCapture() {
      this.countdown = this.timerSeconds
      const timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(timer)
          this.executeCapture()
        }
      }, 1000)
    },
    
    // 连拍模式
    burstCapture() {
      let count = 0
      const maxCount = 5
      const interval = 500
      
      const burstTimer = setInterval(() => {
        if (count >= maxCount) {
          clearInterval(burstTimer)
          return
        }
        
        this.executeCapture()
        count++
      }, interval)
    },
    
    // AI 分析照片
    analyzePhoto(imagePath) {
      // 模拟 AI 分析
      setTimeout(() => {
        this.analysisResult = [
          { key: 'face', label: '人脸检测', score: '95分', status: 'good' },
          { key: 'lighting', label: '光线质量', score: '88分', status: 'good' },
          { key: 'clarity', label: '清晰度', score: '92分', status: 'good' },
          { key: 'position', label: '位置居中', score: '85分', status: 'warning' },
          { key: 'background', label: '背景纯净', score: '90分', status: 'good' }
        ]
        this.showAnalysis = true
      }, 1000)
    },
    
    // 切换拍摄模式
    switchMode(mode) {
      this.currentMode = mode
    },
    
    // 切换自动模式
    toggleAutoMode() {
      this.autoMode = !this.autoMode
      this.autoStatus = this.autoMode ? '智能检测中...' : '手动拍摄模式'
    },
    
    // 切换网格线
    toggleGrid() {
      this.showGrid = !this.showGrid
    },
    
    // 切换美颜
    toggleBeauty() {
      this.beautyMode = !this.beautyMode
    },
    
    // 调整亮度
    adjustBrightness() {
      // 这里可以实现亮度调整功能
      uni.showToast({
        title: '亮度调整功能',
        icon: 'none'
      })
    },
    
    // 切换定时器
    toggleTimer() {
      const times = [3, 5, 10]
      const currentIndex = times.indexOf(this.timerSeconds)
      this.timerSeconds = times[(currentIndex + 1) % times.length]
    },
    
    // 切换连拍模式
    toggleBurstMode() {
      this.currentMode = this.currentMode === 'burst' ? 'photo' : 'burst'
    },
    
    // 隐藏分析结果
    hideAnalysis() {
      this.showAnalysis = false
    },
    
    // 处理照片
    processPhoto() {
      // 返回上一页并传递结果
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      if (prevPage) {
        prevPage.$vm.handlePhotoResult('processed_image_path')
      }
      uni.navigateBack()
    },
    
    // 相机事件处理
    onCameraError(e) {
      console.error('相机错误:', e)
    },
    
    onCameraReady() {
      console.log('相机准备就绪')
    },
    
    onScanCode(e) {
      console.log('扫描到二维码:', e)
    }
  }
}
</script>

<style scoped>
.advanced-camera-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #000;
}

.camera-preview {
  width: 100%;
  height: 100%;
}

.face-detection-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  pointer-events: none;
}

.camera-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}

/* 人脸检测状态 */
.face-status {
  position: absolute;
  top: 100rpx;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 50rpx;
  padding: 20rpx 40rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  transition: all 0.3s ease;
}

.face-status.active {
  background-color: rgba(76, 175, 80, 0.8);
}

.status-icon {
  font-size: 32rpx;
}

.status-text {
  color: white;
  font-size: 28rpx;
}

/* 智能引导 */
.smart-guide {
  position: absolute;
  top: 200rpx;
  left: 32rpx;
  right: 32rpx;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 24rpx;
  padding: 32rpx;
}

.guide-content {
  text-align: center;
  color: white;
}

.guide-step {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.guide-desc {
  font-size: 26rpx;
  opacity: 0.8;
  margin-bottom: 24rpx;
}

.guide-progress {
  display: flex;
  justify-content: center;
  gap: 16rpx;
}

.progress-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.progress-dot.active {
  background-color: #4CAF50;
  transform: scale(1.2);
}

/* 动态框架 */
.dynamic-frame {
  position: absolute;
  border: 4rpx solid rgba(255, 255, 255, 0.8);
  border-radius: 24rpx;
  transition: all 0.3s ease;
}

.frame-corners {
  position: absolute;
  top: -8rpx;
  left: -8rpx;
  right: -8rpx;
  bottom: -8rpx;
}

.corner {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #4CAF50;
}

.corner.top-left {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
  border-radius: 8rpx 0 0 0;
}

.corner.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
  border-radius: 0 8rpx 0 0;
}

.corner.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 8rpx;
}

.corner.bottom-right {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
  border-radius: 0 0 8rpx 0;
}

.face-marker {
  position: absolute;
  border: 2rpx solid #4CAF50;
  border-radius: 8rpx;
  background-color: rgba(76, 175, 80, 0.1);
}

/* 智能控制 */
.smart-controls {
  position: absolute;
  top: 350rpx;
  left: 32rpx;
  right: 32rpx;
}

.auto-capture {
  text-align: center;
  margin-bottom: 32rpx;
}

.countdown {
  font-size: 80rpx;
  color: #4CAF50;
  font-weight: 700;
  text-shadow: 0 4rpx 16rpx rgba(76, 175, 80, 0.5);
}

.auto-status {
  color: white;
  font-size: 28rpx;
  margin-top: 16rpx;
}

.quality-indicator {
  display: flex;
  justify-content: center;
  gap: 32rpx;
}

.quality-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.quality-item.good {
  opacity: 1;
  transform: scale(1.1);
}

.indicator-icon {
  font-size: 32rpx;
}

.indicator-text {
  color: white;
  font-size: 24rpx;
}

/* 增强控制 */
.enhanced-controls {
  position: absolute;
  top: 50%;
  left: 32rpx;
  right: 32rpx;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.control-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 20rpx;
  padding: 20rpx;
  min-width: 80rpx;
}

.btn-icon {
  width: 48rpx;
  height: 48rpx;
}

.btn-label {
  color: white;
  font-size: 22rpx;
}

/* 网格线 */
.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.grid-line {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.3);
}

.grid-line.horizontal {
  left: 0;
  right: 0;
  height: 1rpx;
}

.grid-line.vertical {
  top: 0;
  bottom: 0;
  width: 1rpx;
}

/* 底部增强控制 */
.bottom-enhanced-controls {
  position: absolute;
  bottom: 60rpx;
  left: 0;
  right: 0;
  padding: 0 32rpx;
}

.photo-modes {
  display: flex;
  justify-content: center;
  gap: 40rpx;
  margin-bottom: 40rpx;
}

.mode-btn {
  color: rgba(255, 255, 255, 0.6);
  font-size: 28rpx;
  padding: 16rpx 24rpx;
  border-radius: 20rpx;
  transition: all 0.3s ease;
}

.mode-btn.active {
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
}

.capture-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.timer-btn, .burst-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.timer-icon, .burst-icon {
  font-size: 32rpx;
}

.timer-text, .burst-text {
  color: white;
  font-size: 24rpx;
}

.main-capture-btn {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.capture-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4rpx solid white;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.capture-ring.recording {
  border-color: #ff4444;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.capture-dot {
  width: 80rpx;
  height: 80rpx;
  background-color: white;
  border-radius: 50%;
}

/* AI 分析结果 */
.ai-analysis {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
}

.analysis-content {
  background-color: white;
  border-radius: 32rpx;
  padding: 60rpx 40rpx;
  margin: 40rpx;
  max-width: 600rpx;
}

.analysis-title {
  text-align: center;
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 40rpx;
  color: #333;
}

.analysis-items {
  margin-bottom: 40rpx;
}

.analysis-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.analysis-item:last-child {
  border-bottom: none;
}

.item-label {
  font-size: 28rpx;
  color: #333;
}

.item-score {
  font-size: 28rpx;
  font-weight: 600;
}

.item-score.good {
  color: #4CAF50;
}

.item-score.warning {
  color: #FF9800;
}

.item-score.error {
  color: #f44336;
}

.analysis-actions {
  display: flex;
  gap: 24rpx;
}

.btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  border: none;
}

.btn.secondary {
  background-color: #f5f5f5;
  color: #333;
}

.btn.primary {
  background-color: #6C5CE7;
  color: white;
}
</style>
