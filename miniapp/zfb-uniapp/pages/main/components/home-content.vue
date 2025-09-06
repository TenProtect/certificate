<template>
  <view class="home-page">
    <!-- 顶部横幅 - 全屏宽度 -->
    <view class="banner-section">
      <scroll-banner :images="bannerImages" direction="horizontal" :interval="4000" :duration="300"
          height="400rpx" :auto-play="true" :draggable="true"  image-align="top"
          :show-indicators="false" />
    </view>

    <!-- 主内容区 - 遮住Banner底部 -->
    <view class="main-content">
      <!-- 城市选择和搜索 -->
      <view class="search-section">
        <view class="city-selector" @tap="onCitySelect">
          <text class="city-text" :class="{ 'loading': isLocationLoading }">{{ currentCity }}</text>
          <text class="dropdown-icon" v-if="!isLocationLoading">▼</text>
          <view class="loading-icon" v-if="isLocationLoading">⟲</view>
        </view>
        <view class="search-box" @tap="goToSearch">
          <view class="search-input">
            <text class="search-placeholder">搜索需要的证件照</text>
          </view>
          <view class="search-icon">
            <view class="search-icon-svg">
              <view class="search-circle"></view>
              <view class="search-handle"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 热门规格 -->
      <view class="hot-specs">
        <view class="section-header">
          <text class="section-title">热门规格</text>
          <view class="more-badge" @tap="goToSearch">
            <text class="more-text">更多</text>
            <text class="more-arrow">›</text>
          </view>
        </view>

        <!-- 功能分类 -->
        <view class="category-tabs">
          <!-- 滑动背景色块 -->
          <view 
            class="tab-slider"
            :style="{ transform: `translateX(${activeTab * 100}%)` }"
          ></view>
          
          <view 
            v-for="(category, index) in categories" 
            :key="category.id"
            class="tab-item" 
            :class="{ active: activeTab === index }"
            @tap="onTabClick(index)"
          >
            <view class="tab-icon">{{ category.icon }}</view>
            <text class="tab-text">{{ category.name }}</text>
          </view>
        </view>

        <!-- 证件列表 -->
        <view class="document-list">
          <view 
            v-for="document in currentDocuments" 
            :key="document.id"
            class="document-item"
            @tap="onDocumentClick(document)"
          >
            <view class="doc-icon">
              <image src="/static/default-license.png" class="doc-icon-img" />
            </view>
            <view class="doc-info">
              <view class="doc-header">
                  <text class="doc-name">{{ document.name }}</text>
                  <text class="doc-badge" v-if="document.hasReceipt">含回执</text>
              </view>
              <view class="doc-specs">
                <text class="spec-tag">可冲印</text>
                <text class="spec-size">{{ document.printSize }}</text>
                <text class="spec-tag">电子照</text>
                <text class="spec-size">{{ document.pixelSize }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 悬浮按钮 -->
    <view class="floating-button-wrapper" v-if="false">
      <contact-button
        class="floating-contact-button"
        size="46"
        color="#565DF4"
        icon="/static/customer-service.png"
        :tnt-inst-id="contactConfig.tntInstId"
        :scene="contactConfig.scene"
      >
      </contact-button>
    </view>
  </view>
</template>

<script>
import ScrollBanner from '@/components/scroll-banner.vue'
import { getCertificates } from '@/utils/api.js'
import mockCertificates from '@/mock/certificates.js'
import contactConfig from '@/config.js'
import { getCityByCoordinates, simplifyCityName } from '@/utils/location.js'

export default {
  name: 'HomeContent',
  components: {
    ScrollBanner
  },
  data() {
    return {
      currentCity: '定位中...',
      activeTab: 0, // 当前激活的选项卡索引
      categories: [
        { id: 0, name: '回执', icon: '📋' },
        { id: 1, name: '寸照', icon: '👤' },
        { id: 2, name: '签证', icon: '🌐' },
        { id: 3, name: '考试', icon: '📝' },
        { id: 4, name: '近期', icon: '🕐' }
      ],
      documentsData: {},
      allDocuments: [],
      isLocationLoading: false,
      bannerImages: [
        {
          src: '/static/banner/banner1.webp',
          alt: '演示图片1'
        },
        {
          src: '/static/banner/banner2.webp',
          alt: '演示图片2'
        },
        {
          src: '/static/banner/banner3.webp',
          alt: '演示图片3'
        }
      ],
      contactConfig
    }
  },
  computed: {
    currentDocuments() {
      return this.documentsData[this.activeTab] || []
    }
  },
  mounted() {
    // 监听城市选择事件
    uni.$on('citySelected', this.onCitySelected)
    this.getCurrentLocation()
    this.loadCertificates()
  },
  beforeDestroy() {
    // 移除事件监听
    uni.$off('citySelected', this.onCitySelected)
  },
  methods: {
    // 获取当前定位
    async getCurrentLocation() {
      this.isLocationLoading = true
      try {
        // 先尝试直接获取位置信息
        const location = await new Promise((resolve, reject) => {
          uni.getLocation({
            type: 'gcj02',
            success: resolve,
            fail: (error) => {
              console.log('getLocation失败:', error)
              // 如果直接获取失败，尝试申请权限
              uni.authorize({
                scope: 'scope.userLocation',
                success: () => {
                  // 权限申请成功后再次尝试获取位置
                  uni.getLocation({
                    type: 'gcj02',
                    success: resolve,
                    fail: reject
                  })
                },
                fail: () => {
                  reject(new Error('用户拒绝定位权限'))
                }
              })
            }
          })
        })

        console.log('获取位置成功:', location)
        
        // 逆地理编码获取城市信息
        const cityInfo = await this.getCityFromCoordinates(location.latitude, location.longitude)
        this.currentCity = simplifyCityName(cityInfo)
        
        console.log('最终城市名:', this.currentCity)
        
      } catch (error) {
        console.log('定位失败:', error)
        // 定位失败时的处理
        this.handleLocationError(error)
      } finally {
        this.isLocationLoading = false
      }
    },

    // 通过坐标获取城市信息
    async getCityFromCoordinates(latitude, longitude) {
      // 使用简单的经纬度范围判断城市（离线方案）
      const cityName = getCityByCoordinates(latitude, longitude)
      if (cityName) {
        return cityName
      } else {
        // 如果无法通过坐标判断，使用默认城市
        console.log('无法通过坐标判断城市，使用默认城市')
        return '重庆市'
      }
    },

    // 定位失败时的处理
    handleLocationError(error) {
      // 可以设置默认城市或让用户手动选择
      this.currentCity = '重庆' // 默认城市
      
      let message = '定位失败，已设为默认城市'
      if (error && error.message) {
        if (error.message.includes('权限')) {
          message = '定位权限被拒绝，已设为默认城市'
        } else if (error.message.includes('超时')) {
          message = '定位超时，已设为默认城市'
        }
      }
      
      uni.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      })
    },

    async loadCertificates() {
      try {
        const list = await getCertificates()
        console.log('获取证件列表:', list)
        this.allDocuments = list
      } catch (e) {
        this.allDocuments = mockCertificates
      }
      this.groupDocuments()
    },
    groupDocuments() {
      const grouped = {}
      this.allDocuments.forEach(doc => {
        const key = doc.category
        if (!grouped[key]) grouped[key] = []
        grouped[key].push(doc)
      })
      this.documentsData = {}
      this.categories.forEach((cat, index) => {
        if (cat.name === '近期') {
          this.documentsData[index] = this.allDocuments.slice(0, 5)
        } else if (cat.name === '寸照') {
          // 寸照分类除了匹配名字为“寸照”的外，也要包含名字为“证照”的文档
          const cun = grouped['寸照'] || []
          const zheng = grouped['证照'] || []
          // 合并并去重（按 id）以保持顺序
          const merged = [...cun]
          const ids = new Set(merged.map(d => d.id))
          zheng.forEach(d => { if (!ids.has(d.id)) merged.push(d) })
          this.documentsData[index] = merged
        } else {
          this.documentsData[index] = grouped[cat.name] || []
        }
      })
    },
    onCitySelect() {
      console.log('选择城市')
      // 跳转到城市选择页面
      uni.navigateTo({
        url: `/pages/city-selector/city-selector?city=${encodeURIComponent(this.currentCity)}`
      })
    },
    onCitySelected(city) {
      // 城市选择回调
      this.currentCity = city.name
      console.log('城市选择完成:', city.name)
      uni.showToast({
        title: `已切换到${city.name}`,
        icon: 'none'
      })
    },
    onTabClick(index) {
      this.activeTab = index
      console.log('切换到选项卡:', this.categories[index].name)
    },
    onDocumentClick(document) {
      console.log('点击证件:', document.name, document)
      // 跳转到拍摄指引详情页面，传递完整的document对象和当前城市
      const documentData = encodeURIComponent(JSON.stringify(document))
      const cityData = encodeURIComponent(this.currentCity)
      uni.navigateTo({
        url: `/pages/photo-detail/photo-detail?data=${documentData}&city=${cityData}`
      })
    },
    goToSearch() {
      // 跳转到搜索页面，传递当前城市
      uni.navigateTo({
        url: `/pages/search/search?city=${encodeURIComponent(this.currentCity)}`
      })
    },
    onFloatingButtonClick() {
      uni.showToast({
        title: '悬浮按钮被点击',
        icon: 'none'
      })
      console.log('悬浮按钮被点击')
    }
  }
}
</script>

<style scoped>
.home-page {
  background-color: white;
  min-height: 100%;
  box-sizing: border-box;
  position: relative;
}

/* 顶部Banner区域 - 全屏宽度，无边距 */
.banner-section {
  width: 100%;
  height: 400rpx;
  position: relative;
}

/* 主内容区 - 遮住Banner底部80rpx */
.main-content {
  position: relative;
  margin-top: -20rpx;
  background: #F5F6F8;
  border-radius: 32rpx 32rpx 0 0;
  padding: 40rpx 20rpx 20rpx;
  z-index: 10;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.city-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15rpx 20rpx;
  border-radius: 25rpx;
  width: 140rpx;
  cursor: pointer;
  transition: all 0.2s ease;
}

.city-selector:active {
  background: #f0f0f0;
  transform: scale(0.98);
}

.city-text {
  color: #333;
  font-size: 28rpx;
  flex: 1;
  text-align: left;
}

.city-text.loading {
  color: #999;
}

.dropdown-icon {
  color: #666;
  font-size: 20rpx;
  flex-shrink: 0;
}

.loading-icon {
  color: #565DF4;
  font-size: 24rpx;
  flex-shrink: 0;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.search-box {
  flex: 1;
  position: relative;
  background: #f8f9fa;
  border: 1rpx solid #e9ecef;
  border-radius: 25rpx;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-box:active {
  background: #e9ecef;
  transform: scale(0.98);
}

.search-box:active .search-circle {
  border-color: #565DF4;
}

.search-box:active .search-handle {
  background-color: #565DF4;
}

.search-input {
  flex: 1;
  padding: 25rpx 20rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.search-placeholder {
  color: #999;
}

.search-icon {
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-icon-svg {
  position: relative;
  width: 32rpx;
  height: 32rpx;
}

.search-circle {
  width: 24rpx;
  height: 24rpx;
  border: 3rpx solid #999;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
}

.search-handle {
  width: 12rpx;
  height: 3rpx;
  background-color: #999;
  border-radius: 2rpx;
  position: absolute;
  bottom: 7rpx;
  right: -5rpx;
  transform: rotate(40deg);
  transform-origin: left center;
}

.hot-specs {
  background: transparent;
  padding: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.more-link {
  color: #666;
  font-size: 28rpx;
}

.more-badge {
  background: #f8f9fa;
  border: 1rpx solid #e9ecef;
  color: #666;
  font-size: 24rpx;
  padding: 12rpx 20rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  transition: all 0.2s ease;
  cursor: pointer;
}

.more-badge:active {
  background: #e9ecef;
  transform: scale(0.98);
}

.more-badge:active .more-arrow {
  transform: translateX(2rpx) translateY(-1rpx);
}

.more-text {
  color: #666;
  font-size: 24rpx;
}

.more-arrow {
  color: grey;
  font-size: 28rpx;
  font-weight: bold;
  transform: translateY(-1rpx);
  transition: transform 0.2s ease;
}

.category-tabs {
  display: flex;
  margin-bottom: 30rpx;
  padding: 0 10rpx;
  position: relative;
}

.tab-slider {
  position: absolute;
  top: 0;
  left: 10rpx; /* 考虑父容器的 padding */
  width: calc(20% - 4rpx); /* 减去左右间距 */
  height: 100%;
  background-color: #565DF4;
  border-radius: 18rpx;
  transition: transform 0.3s ease-in-out;
  z-index: 1;
}

.tab-slider::after {
  content: '';
  position: absolute;
  bottom: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 12rpx solid transparent;
  border-right: 12rpx solid transparent;
  border-top: 12rpx solid #565DF4;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 10rpx;
  border-radius: 18rpx;
  position: relative;
  z-index: 2;
  flex: 1;
  width: 20%;
}

.tab-item.active .tab-icon,
.tab-item.active .tab-text {
  color: white;
}

.tab-icon {
  font-size: 40rpx;
  margin-bottom: 10rpx;
  color: #666;
  transition: color 0.3s ease;
}

.tab-text {
  font-size: 24rpx;
  color: #666;
  transition: color 0.3s ease;
}

.document-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 30rpx;
  margin-left: -20rpx;
  margin-right: -20rpx;
  padding: 30rpx 10rpx;
  background-color: #F5F6F8;
}

.document-item {
  display: flex;
  align-items: center;
  padding: 35rpx 30rpx;
  background-color: white;
  margin: 0 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 5rpx 16rpx rgba(230, 230, 230, 0.5);
}

.doc-icon {
  width: 80rpx;
  height: 80rpx;
  background: #e3f2fd;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 20rpx;
  overflow: hidden;
}

.doc-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.doc-info {
  flex: 1;
}

.doc-header {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.doc-name {
  font-size: 32rpx;
  font-weight: 900;
  color: #333;
  margin-right: 15rpx;
}

.doc-badge {
  background: linear-gradient(135deg, #ECD49F 0%, #C3A36C 100%);
  color: white;
  font-size: 24rpx;
  padding: 4rpx 8rpx;
  border-radius: 24rpx;
}

.doc-specs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 15rpx;
}

.spec-item {
  color: #666;
  font-size: 24rpx;
}

.spec-tag {
  background: #f0f8ff;
  color: #565DF4;
  font-size: 22rpx;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  border: 1rpx solid #e3f2fd;
}

.spec-size {
  color: #999;
  font-size: 24rpx;
}

/* 悬浮按钮样式 */
.floating-button-wrapper {
  position: fixed;
  right: 20rpx;
  bottom: 140rpx; /* 调整位置避免与TabBar重叠 */
  width: 90rpx;
  height: 90rpx;
  z-index: 999;
  border-radius: 50%;
  box-shadow: 0 8rpx 24rpx rgba(86, 93, 244, 0.3);
  transition: all 0.2s ease;
  backdrop-filter: blur(10rpx);
}

.floating-button-wrapper:active {
  transform: scale(0.95);
  box-shadow: 0 4rpx 16rpx rgba(86, 93, 244, 0.4);
}

.floating-contact-button {
  width: 100% !important;
  height: 100% !important;
  border-radius: 50% !important;
  background: linear-gradient(135deg, #565DF4 0%, #4A52E8 100%) !important;
  border: none !important;
  box-shadow: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: white !important;
  font-size: 0 !important; /* 隐藏文字，只显示图标 */
  overflow: hidden !important;
}

.floating-button {
  position: fixed;
  right: 20rpx;
  bottom: 140rpx; /* 调整位置避免与TabBar重叠 */
  width: 90rpx;
  height: 90rpx;
  background: #00000000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  box-shadow: 0 8rpx 24rpx rgba(86, 93, 244, 0.3);
  transition: all 0.2s ease;
  cursor: pointer;
  backdrop-filter: blur(10rpx);
}

.floating-button:active {
  transform: scale(0.95);
  box-shadow: 0 4rpx 16rpx rgba(86, 93, 244, 0.4);
}

.floating-button-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
