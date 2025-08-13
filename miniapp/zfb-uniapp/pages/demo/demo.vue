<template>
  <view class="demo-page">
    <view class="header">
      <text class="page-title">滚动播放组件高级演示</text>
    </view>
    
    <!-- 基础水平轮播 -->
    <view class="demo-card">
      <view class="card-header">
        <text class="card-title">基础水平轮播</text>
        <text class="card-desc">3秒间隔自动切换，支持拖拽</text>
      </view>
      <scroll-banner 
        :images="bannerImages"
        direction="horizontal"
        :interval="3000"
        :duration="300"
        height="180rpx"
        :auto-play="true"
        :draggable="true"
        :show-indicators="true"
        @change="onBannerChange"
        @click="onBannerClick"
      />
    </view>
    
    <!-- 快速切换轮播 -->
    <view class="demo-card">
      <view class="card-header">
        <text class="card-title">快速切换轮播</text>
        <text class="card-desc">1.5秒快速切换，适用于新闻滚动</text>
      </view>
      <scroll-banner 
        :images="newsImages"
        direction="horizontal"
        :interval="1500"
        :duration="200"
        height="120rpx"
        :auto-play="true"
        :draggable="true"
        :show-indicators="false"
      />
    </view>
    
    <!-- 垂直轮播 -->
    <view class="demo-card">
      <view class="card-header">
        <text class="card-title">垂直轮播</text>
        <text class="card-desc">上下切换展示</text>
      </view>
      <scroll-banner 
        :images="productImages"
        direction="vertical"
        :interval="4000"
        :duration="400"
        height="300rpx"
        :auto-play="true"
        :draggable="true"
        :show-indicators="true"
      />
    </view>
    
    <!-- 全屏轮播 -->
    <view class="demo-card">
      <view class="card-header">
        <text class="card-title">全屏轮播</text>
        <text class="card-desc">大图展示，慢速切换</text>
      </view>
      <scroll-banner 
        :images="fullscreenImages"
        direction="horizontal"
        :interval="5000"
        :duration="500"
        height="250rpx"
        :auto-play="true"
        :draggable="true"
        :show-indicators="true"
      />
    </view>
    
    <!-- 控制面板 -->
    <view class="control-panel">
      <text class="panel-title">控制面板</text>
      <view class="control-group">
        <view class="control-item">
          <text class="control-label">切换间隔: {{ currentInterval }}ms</text>
          <slider 
            :value="currentInterval" 
            :min="1000" 
            :max="8000" 
            @change="onIntervalChange"
            activeColor="#007aff"
          />
        </view>
        <view class="control-buttons">
          <button @click="toggleDirection" class="control-btn">
            {{ currentDirection === 'horizontal' ? '切换到垂直' : '切换到水平' }}
          </button>
          <button @click="toggleAutoPlay" class="control-btn">
            {{ autoPlay ? '暂停播放' : '开始播放' }}
          </button>
        </view>
      </view>
    </view>
    
    <!-- 动态控制的组件 -->
    <view class="demo-card">
      <view class="card-header">
        <text class="card-title">动态控制示例</text>
        <text class="card-desc">通过上方控制面板调整参数</text>
      </view>
      <scroll-banner 
        :images="controlledImages"
        :direction="currentDirection"
        :interval="currentInterval"
        :duration="300"
        :height="currentDirection === 'vertical' ? '250rpx' : '180rpx'"
        :auto-play="autoPlay"
        :show-indicators="true"
      />
    </view>
  </view>
</template>

<script>
import ScrollBanner from '@/components/scroll-banner.vue'

export default {
  components: {
    ScrollBanner
  },
  data() {
    return {
      currentInterval: 3000,
      currentDirection: 'horizontal',
      autoPlay: true,
      
      // 横幅广告图片
      bannerImages: [
        { src: 'https://picsum.photos/800/300?random=1&text=双11购物节', alt: '双11购物节' },
        { src: 'https://picsum.photos/800/300?random=2&text=618年中大促', alt: '618年中大促' },
        { src: 'https://picsum.photos/800/300?random=3&text=黑五优惠', alt: '黑五优惠' }
      ],
      
      // 产品展示图片
      productImages: [
        { src: 'https://picsum.photos/400/200?random=6', alt: '智能手机' },
        { src: 'https://picsum.photos/400/200?random=7', alt: '笔记本电脑' },
        { src: 'https://picsum.photos/400/200?random=8', alt: '智能手表' },
        { src: 'https://picsum.photos/400/200?random=9', alt: '无线耳机' },
        { src: 'https://picsum.photos/400/200?random=10', alt: '平板电脑' },
        { src: 'https://picsum.photos/400/200?random=11', alt: '智能音箱' }
      ],
      
      // 新闻资讯图片
      newsImages: [
        { src: 'https://picsum.photos/600/150?random=12', alt: '科技新闻1' },
        { src: 'https://picsum.photos/600/150?random=13', alt: '科技新闻2' },
        { src: 'https://picsum.photos/600/150?random=14', alt: '科技新闻3' },
        { src: 'https://picsum.photos/600/150?random=15', alt: '科技新闻4' }
      ],
      
      // 全屏广告图片
      fullscreenImages: [
        { src: 'https://picsum.photos/800/400?random=16&text=双11购物节', alt: '双11购物节' },
        { src: 'https://picsum.photos/800/400?random=17&text=618年中大促', alt: '618年中大促' },
        { src: 'https://picsum.photos/800/400?random=18&text=黑五优惠', alt: '黑五优惠' }
      ],
      
      // 受控制的图片
      controlledImages: [
        { src: 'https://picsum.photos/700/250?random=19', alt: '动态展示1' },
        { src: 'https://picsum.photos/700/250?random=20', alt: '动态展示2' },
        { src: 'https://picsum.photos/700/250?random=21', alt: '动态展示3' },
        { src: 'https://picsum.photos/700/250?random=22', alt: '动态展示4' }
      ]
    }
  },
  methods: {
    onIntervalChange(e) {
      this.currentInterval = e.detail.value
    },
    
    toggleDirection() {
      this.currentDirection = this.currentDirection === 'horizontal' ? 'vertical' : 'horizontal'
    },
    
    toggleAutoPlay() {
      this.autoPlay = !this.autoPlay
    },
    
    onBannerChange(e) {
      console.log('轮播切换:', e)
    },
    
    onBannerClick(e) {
      console.log('点击轮播:', e)
      uni.showToast({
        title: `点击了: ${e.item.alt}`,
        icon: 'none'
      })
    }
  }
}
</script>

<style scoped>
.demo-page {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 20rpx;
}

.header {
  text-align: center;
  padding: 30rpx 0;
  margin-bottom: 20rpx;
}

.page-title {
  font-size: 44rpx;
  font-weight: bold;
  color: #2c3e50;
}

.demo-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.card-header {
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #2c3e50;
  display: block;
  margin-bottom: 8rpx;
}

.card-desc {
  font-size: 24rpx;
  color: #7f8c8d;
  display: block;
}

.control-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  color: white;
}

.panel-title {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 30rpx;
  text-align: center;
}

.control-group {
  width: 100%;
}

.control-item {
  margin-bottom: 30rpx;
}

.control-label {
  font-size: 28rpx;
  display: block;
  margin-bottom: 15rpx;
  opacity: 0.9;
}

.control-buttons {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
}

.control-btn {
  flex: 1;
  min-width: 200rpx;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 26rpx;
  backdrop-filter: blur(10rpx);
}

.control-btn:active {
  background-color: rgba(255, 255, 255, 0.3);
}

/* 滑块样式调整 */
slider {
  width: 100%;
}
</style>
