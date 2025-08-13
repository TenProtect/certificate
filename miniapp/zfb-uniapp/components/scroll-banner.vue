<template>
  <view class="scroll-banner-container" :style="containerStyle">
    <view 
      class="scroll-banner-wrapper"
      :style="wrapperStyle"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <view 
        class="scroll-banner-track"
        :style="trackStyle"
        ref="track"
      >
        <view 
          v-for="(item, index) in imageList" 
          :key="index"
          class="scroll-banner-item"
          :style="itemStyle"
          @click="onItemClick(item, index)"
        >
          <!-- 使用背景图实现顶部对齐裁剪 -->
          <view 
            :style="imageBgStyle(item, index)"
          />
        </view>
      </view>
    </view>
    
    <!-- 指示器 -->
    <view v-if="showIndicators && imageList.length > 1" class="scroll-banner-indicators">
      <view 
        v-for="(item, index) in imageList"
        :key="`indicator-${index}`"
        class="indicator-dot"
        :class="{ active: currentIndex === index }"
        @click="goToSlide(index)"
      ></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ScrollBanner',
  props: {
    // 图片列表
    images: {
      type: Array,
      default: () => []
    },
    // 滚动方向：horizontal(水平) | vertical(垂直)
    direction: {
      type: String,
      default: 'horizontal',
      validator: value => ['horizontal', 'vertical'].includes(value)
    },
    // 自动播放间隔时间（毫秒）
    interval: {
      type: Number,
      default: 3000
    },
    // 切换动画时长（毫秒）
    duration: {
      type: Number,
      default: 300
    },
    // 容器高度
    height: {
      type: [String, Number],
      default: '200rpx'
    },
    // 容器宽度
    width: {
      type: [String, Number],
      default: '100%'
    },
    // 图片宽度（水平滚动时）
    itemWidth: {
      type: [String, Number],
      default: '100%'
    },
    // 图片高度（垂直滚动时）
    itemHeight: {
      type: [String, Number],
      default: '100%'
    },
    // 是否自动播放
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 是否可以拖拽
    draggable: {
      type: Boolean,
      default: true
    },
    // 是否显示指示器
    showIndicators: {
      type: Boolean,
      default: true
    },
    // 是否循环播放
    loop: {
      type: Boolean,
      default: true
    },
    // 图片垂直对齐方式：top | center | bottom
    imageAlign: {
      type: String,
      default: 'top',
      validator: v => ['top', 'center', 'bottom'].includes(v)
    },
    // 图片向上偏移量（数值自动按 rpx 处理，也可直接传入如 '20px'、'10%'）
    imageOffsetY: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      currentIndex: 0,
      isDragging: false,
      dragOffset: 0,
      startPosition: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 },
      isTransitioning: false,
      autoPlayTimer: null
    }
  },
  computed: {
    imageList() {
      return this.images.length > 0 ? this.images : [
        '/static/logo.png',
        '/static/logo.png',
        '/static/logo.png'
      ]
    },
    isHorizontal() {
      return this.direction === 'horizontal'
    },
    containerStyle() {
      return {
        width: this.formatSize(this.width),
        height: this.formatSize(this.height),
        overflow: 'hidden',
        position: 'relative'
      }
    },
    wrapperStyle() {
      return {
        width: '100%',
        height: '100%',
        position: 'relative'
      }
    },
    trackStyle() {
      const movePercent = 100 / this.imageList.length
      const translateValue = -(this.currentIndex * movePercent) + (this.dragOffset * movePercent / 100)
      const transform = this.isHorizontal 
        ? `translateX(${translateValue}%)`
        : `translateY(${translateValue}%)`
      
      return {
        display: 'flex',
        flexDirection: this.isHorizontal ? 'row' : 'column',
        transform,
        transition: this.isDragging || this.isTransitioning 
          ? (this.isDragging ? 'none' : `transform ${this.duration}ms ease-in-out`)
          : 'none',
        width: this.isHorizontal ? `${this.imageList.length * 100}%` : '100%',
        height: this.isHorizontal ? '100%' : `${this.imageList.length * 100}%`
      }
    },
    itemStyle() {
      return {
        width: this.isHorizontal ? `${100 / this.imageList.length}%` : '100%',
        height: this.isHorizontal ? '100%' : `${100 / this.imageList.length}%`,
        flexShrink: 0
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.autoPlay && this.imageList.length > 1) {
        this.startAutoPlay()
      }
    })
  },
  beforeDestroy() {
    this.stopAutoPlay()
  },
  methods: {
    formatSize(size) {
      if (typeof size === 'number') {
        return `${size}rpx`
      }
      return size
    },
    
    calculateTranslate() {
      // 这个方法现在不再需要，直接在 trackStyle 中计算
      return -(this.currentIndex * 100) + this.dragOffset
    },
    
    startAutoPlay() {
      this.stopAutoPlay()
      if (this.autoPlay && this.imageList.length > 1) {
        this.autoPlayTimer = setInterval(() => {
          this.next()
        }, this.interval)
      }
    },
    
    stopAutoPlay() {
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer)
        this.autoPlayTimer = null
      }
    },
    
    next() {
      if (this.isTransitioning) return
      
      if (this.currentIndex >= this.imageList.length - 1) {
        if (this.loop) {
          this.goToSlide(0)
        }
      } else {
        this.goToSlide(this.currentIndex + 1)
      }
    },
    
    prev() {
      if (this.isTransitioning) return
      
      if (this.currentIndex <= 0) {
        if (this.loop) {
          this.goToSlide(this.imageList.length - 1)
        }
      } else {
        this.goToSlide(this.currentIndex - 1)
      }
    },
    
    goToSlide(index) {
      if (this.isTransitioning || index === this.currentIndex) return
      
      this.isTransitioning = true
      this.currentIndex = index
      
      setTimeout(() => {
        this.isTransitioning = false
      }, this.duration)
      
      this.$emit('change', {
        current: index,
        item: this.imageList[index]
      })
    },
    handleTouchStart(e) {
      if (!this.draggable) return
      
      this.stopAutoPlay()
      this.isDragging = true
      this.dragOffset = 0
      
      const touch = e.touches[0]
      this.startPosition = { x: touch.clientX, y: touch.clientY }
      this.currentPosition = { x: touch.clientX, y: touch.clientY }
    },
    
    handleTouchMove(e) {
      if (!this.draggable || !this.isDragging) return
      
      const touch = e.touches[0]
      this.currentPosition = { x: touch.clientX, y: touch.clientY }
      
      const deltaX = this.currentPosition.x - this.startPosition.x
      const deltaY = this.currentPosition.y - this.startPosition.y
      
      if (this.isHorizontal) {
        this.dragOffset = (deltaX / uni.getSystemInfoSync().windowWidth) * 100
      } else {
        this.dragOffset = (deltaY / uni.getSystemInfoSync().windowHeight) * 100
      }
      
      e.preventDefault()
    },
    
    handleTouchEnd(e) {
      if (!this.draggable || !this.isDragging) return
      
      this.isDragging = false
      
      const deltaX = this.currentPosition.x - this.startPosition.x
      const deltaY = this.currentPosition.y - this.startPosition.y
      const threshold = 50 // 滑动阈值
      
      if (this.isHorizontal) {
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            this.prev() // 向右滑，显示上一张
          } else {
            this.next() // 向左滑，显示下一张
          }
        }
      } else {
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0) {
            this.prev() // 向下滑，显示上一张
          } else {
            this.next() // 向上滑，显示下一张
          }
        }
      }
      
      this.dragOffset = 0
      
      // 重新开始自动播放
      if (this.autoPlay) {
        this.startAutoPlay()
      }
    },
    
    onItemClick(item, index) {
      this.$emit('click', {
        item,
        index
      })
    },
    
    onImageError() {
      console.warn('ScrollBanner: 图片加载失败')
    },
    // 归一化偏移量
    normalizeOffset(val) {
      if (val === null || val === undefined) return '0'
      if (typeof val === 'number') return `${val}rpx`
      const s = String(val).trim()
      return s.length ? s : '0'
    },
    imageBgStyle(item) {
      const src = (item && item.src) ? item.src : item
      // 计算背景位置
      const align = this.imageAlign
      const base = align === 'top' ? '0%' : (align === 'bottom' ? '100%' : '50%')
      const offset = this.normalizeOffset(this.imageOffsetY)
      // 当偏移为 0 时，不使用 calc，提升兼容性
      const isZero = offset === '0' || offset === '0rpx' || offset === '0px' || offset === '0%'
      const backgroundPosition = isZero
        ? `center ${base}`
        : `center calc(${base} - ${offset})`
      return {
        width: '100%',
        height: '100%',
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition,
        backgroundRepeat: 'no-repeat'
      }
    }
  }
}
</script>

<style scoped>
.scroll-banner-container {
  position: relative;
  background-color: #f5f5f5;
  border-radius: 8rpx;
}

.scroll-banner-wrapper {
  overflow: hidden;
  border-radius: 8rpx;
}

.scroll-banner-track {
  will-change: transform;
}

.scroll-banner-item {
  position: relative;
  overflow: hidden;
}

.scroll-banner-image {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
  background-color: #f0f0f0;
  background-size: cover;             /* 等效于 aspectFill */
  background-position: top center;    /* 顶部对齐 */
  background-repeat: no-repeat;
}

.scroll-banner-indicators {
  position: absolute;
  bottom: 16rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12rpx;
  z-index: 10;
}

.indicator-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;
}

.indicator-dot.active {
  background-color: rgba(255, 255, 255, 0.9);
  transform: scale(1.2);
}
</style>
