<template>
  <view class="photo-guide-page">
    <!-- 主体内容 -->
    <view class="guide-content">
      <!-- 滚动组件展示步骤图片 -->
      <scroll-banner
        :images="guideImages"
        :height="850"
        :auto-play="false"
        :loop="false"
        :show-indicators="true"
        direction="horizontal"
        @change="onImageChange"
        @click="onImageClick"
      />
      
      <!-- 步骤标题和描述 -->
      <view class="step-info">
        <view class="step-number">STEP {{ currentStep }}</view>
        <view class="step-title">{{ currentStepInfo.title }}</view>
        <view class="step-description">{{ currentStepInfo.description }}</view>
      </view>
      
      <!-- 底部按钮 -->
      <view class="bottom-actions">
        <button class="guide-btn" type="primary" @click="startPhoto">
          开始拍摄
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import ScrollBanner from '@/components/scroll-banner.vue'

export default {
  name: 'PhotoGuide',
  components: {
    ScrollBanner
  },
  data() {
    return {
      currentStep: 1,
      guideImages: [
        '/static/guide/step1.png',
        '/static/guide/step2.png', 
        '/static/guide/step3.png',
        '/static/guide/step4.png'
      ],
      stepInfoList: [
        {
          title: '请优先使用后置摄像头拍摄',
          description: '使用后置摄像头可以获得更好的拍摄效果和清晰度'
        },
        {
          title: '拍摄时正对镜头，对齐参考线',
          description: '保持头部正直，眼睛平视镜头，按照参考线调整位置'
        },
        {
          title: '请选择纯色墙面做背景，避免光源不均',
          description: '选择简洁的纯色背景，确保光线均匀，避免阴影'
        },
        {
          title: '注意背景不要与衣服同色',
          description: '背景与服装颜色形成对比，确保人像轮廓清晰'
        }
      ]
    }
  },
  computed: {
    currentStepInfo() {
      return this.stepInfoList[this.currentStep - 1] || this.stepInfoList[0]
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    onImageChange(e) {
      this.currentStep = e.current + 1
    },
    
    onImageClick(e) {
      console.log('点击了步骤图片:', e)
    },
    
    startPhoto() {
      // 跳转到拍摄页面或启动相机
      uni.showToast({
        title: '准备开始拍摄',
        icon: 'success'
      })
      // 这里可以跳转到相机页面
      // uni.navigateTo({
      //   url: '/pages/camera/camera'
      // })
    },
    
    skipGuide() {
      // 跳过指引，直接进入拍摄
      this.startPhoto()
    }
  }
}
</script>

<style scoped>
.photo-guide-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

/* 导航栏样式 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 32rpx;
  padding-top: var(--status-bar-height, 44rpx);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10rpx);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-left {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
}

.back-icon {
  font-size: 40rpx;
  color: #333;
  font-weight: bold;
}

.navbar-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.navbar-right {
  width: 60rpx;
}

/* 主体内容 */
.guide-content {
  padding: 40rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 步骤信息 */
.step-info {
  margin-top: 60rpx;
  text-align: center;
  color: white;
}

.step-number {
  font-size: 28rpx;
  font-weight: bold;
  color: #4F7CFF;
  background: rgba(255, 255, 255, 0.9);
  padding: 8rpx 24rpx;
  border-radius: 20rpx;
  display: inline-block;
  margin-bottom: 24rpx;
}

.step-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
  line-height: 1.4;
}

.step-description {
  font-size: 28rpx;
  opacity: 0.9;
  line-height: 1.5;
  max-width: 600rpx;
}

/* 底部按钮 */
.bottom-actions {
  width: calc(100vw - 64rpx);
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32rpx;
  backdrop-filter: blur(10rpx);
}

.guide-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #4F7CFF 0%, #6366F1 100%);
  color: white;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 44rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(79, 124, 255, 0.3);
}

.guide-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 12rpx rgba(79, 124, 255, 0.3);
}

.skip-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 16rpx;
}

.skip-text:active {
  opacity: 0.7;
}

/* 滚动组件容器调整 */
:deep(.scroll-banner-container) {
  border-radius: 16rpx;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

:deep(.scroll-banner-indicators) {
  bottom: 24rpx;
}

:deep(.indicator-dot) {
  width: 16rpx;
  height: 16rpx;
  background-color: rgba(255, 255, 255, 0.4);
}

:deep(.indicator-dot.active) {
  background-color: rgba(255, 255, 255, 0.9);
  transform: scale(1.3);
}
</style>
