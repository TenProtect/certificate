<template>
    <view class="search-page">
        <!-- 顶部搜索区域 -->
        <view class="search-header">
            <view class="search-section">
                <view class="city-selector disabled">
                    <text class="city-text">{{ currentCity }}</text>
                    <text class="dropdown-icon">▼</text>
                </view>
                <view class="search-box">
                    <input 
                        class="search-input" 
                        v-model="searchKeyword"
                        placeholder="搜索需要的证件照" 
                        placeholder-class="search-placeholder"
                        @input="onSearchInput"
                        focus
                    />
                    <view class="search-icon">
                        <view class="search-icon-svg">
                            <view class="search-circle"></view>
                            <view class="search-handle"></view>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 搜索结果区域 -->
        <view class="search-results">
            <view v-if="!searchKeyword" class="search-tips">
                <view class="tips-container">
                    <view class="tips-icon">🔍</view>
                    <text class="tips-title">发现你的专属证件照</text>
                    <text class="tips-subtitle">输入关键词，快速找到所需规格</text>
                    <view class="tips-features">
                        <view class="feature-item">
                            <view class="feature-dot"></view>
                            <text class="feature-text">智能识别</text>
                        </view>
                        <view class="feature-item">
                            <view class="feature-dot"></view>
                            <text class="feature-text">精准匹配</text>
                        </view>
                        <view class="feature-item">
                            <view class="feature-dot"></view>
                            <text class="feature-text">实时搜索</text>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else-if="searchResults.length === 0" class="no-results">
                <view class="no-results-container">
                    <view class="no-results-icon">📋</view>
                    <text class="no-results-title">暂无相关结果</text>
                    <text class="no-results-subtitle">试试其他关键词或浏览热门规格</text>
                </view>
            </view>
            <view v-else class="results-list">
                <view 
                    class="result-item" 
                    v-for="(item, index) in searchResults" 
                    :key="item.id"
                    @tap="onResultClick(item)"
                >
                    <view class="doc-icon">
                        <image src="/static/default-license.png" class="doc-icon-img" />
                    </view>
                    <view class="doc-info">
                        <view class="doc-header">
                              <text class="doc-name">{{ item.name }}</text>
                              <text class="doc-badge" v-if="item.hasReceipt">含回执</text>
                        </view>
                        <view class="doc-specs">
                            <text class="spec-tag">可冲印</text>
                            <text class="spec-size">{{ item.specs.printSize }}</text>
                            <text class="spec-tag">电子照</text>
                            <text class="spec-size">{{ item.specs.pixelSize }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { getCertificates } from '@/utils/api.js'
import mockCertificates from '@/mock/certificates.js'
export default {
    name: 'SearchPage',
    data() {
        return {
            currentCity: '重庆',
            searchKeyword: '',
            searchResults: [],
            allDocuments: []
        }
    },
    async onLoad(options) {
        console.log('搜索页面加载完成')
        // 接收传入的城市参数
        if (options.city) {
            this.currentCity = decodeURIComponent(options.city)
        }
        // 接收传入的搜索关键词
        if (options.keyword) {
            this.searchKeyword = decodeURIComponent(options.keyword)
        }
        await this.loadCertificates()
        if (this.searchKeyword) {
            this.performSearch(this.searchKeyword)
        }
    },
    methods: {
        async loadCertificates() {
            try {
                const list = await getCertificates()
                this.allDocuments = list
            } catch (e) {
                this.allDocuments = mockCertificates
            }
        },
        onSearchInput(e) {
            const keyword = e.detail.value
            this.searchKeyword = keyword
            this.performSearch(keyword)
        },
        
        performSearch(keyword) {
            // 触发搜索事件，传入地区和关键词参数
            this.handleSearchEvent(this.currentCity, keyword)
            
            if (!keyword.trim()) {
                this.searchResults = []
                return
            }
            
            // 模拟搜索逻辑 - 搜索名称和规格相关字段
            this.searchResults = this.allDocuments.filter(doc => {
                const nameMatch = doc.name.includes(keyword)
                const specsMatch =
                    doc.specs.printSize.includes(keyword) ||
                    doc.specs.pixelSize.includes(keyword) ||
                    doc.specs.resolution.includes(keyword) ||
                    doc.specs.imageFormat.includes(keyword) ||
                    doc.specs.requirements.includes(keyword)
                return nameMatch || specsMatch
            })
        },
        
        handleSearchEvent(city, keyword) {
            // 这是主要的搜索事件处理函数
            console.log('搜索事件触发:', { city, keyword })
            
            // 在这里可以调用API进行实际搜索
            // 例如：
            // this.callSearchAPI(city, keyword)
        },
        
        onResultClick(item) {
            console.log('点击搜索结果:', item.name, item)
            // 跳转到拍摄指引详情页面，传递完整的item对象
            uni.navigateTo({
                url: `/pages/photo-detail/photo-detail?data=${encodeURIComponent(JSON.stringify(item))}`
            })
        }
    }
}
</script>

<style scoped>
.search-page {
    background-color: #f5f5f5;
    min-height: 100vh;
}

.search-header {
    background: white;
    padding: 20rpx 20rpx 30rpx;
    border-radius: 0 0 32rpx 32rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.search-section {
    display: flex;
    align-items: center;
    gap: 20rpx;
}

.city-selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15rpx 20rpx;
    border-radius: 25rpx;
    width: 140rpx;
    background: #f8f9fa;
    border: 1rpx solid #e9ecef;
}

.city-selector.disabled {
    background: #f0f0f0;
    opacity: 0.6;
}

.city-selector.disabled .city-text,
.city-selector.disabled .dropdown-icon {
    color: #999;
}

.city-text {
    color: #333;
    font-size: 28rpx;
    flex: 1;
    text-align: center;
}

.dropdown-icon {
    color: #ccc;
    font-size: 20rpx;
}

.search-box {
    flex: 1;
    position: relative;
    background: #f8f9fa;
    border: 2rpx solid #3d45e6;
    border-radius: 25rpx;
    display: flex;
    align-items: center;
}

.search-input {
    flex: 1;
    padding: 15rpx 20rpx;
    font-size: 28rpx;
    border: none;
    background: transparent;
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
    border: 3rpx solid #3d45e6;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
}

.search-handle {
    width: 12rpx;
    height: 3rpx;
    background-color: #3d45e6;
    border-radius: 2rpx;
    position: absolute;
    bottom: 7rpx;
    right: -5rpx;
    transform: rotate(40deg);
    transform-origin: left center;
}

.search-results {
    padding: 30rpx 20rpx;
}

.search-tips,
.no-results {
    padding: 60rpx 20rpx 100rpx;
}

.tips-container,
.no-results-container {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.tips-icon,
.no-results-icon {
    width: 120rpx;
    height: 120rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 12rpx 32rpx rgba(102, 126, 234, 0.3);
}

.tips-title,
.no-results-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
}

.tips-subtitle,
.no-results-subtitle {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 40rpx;
    line-height: 1.5;
}

.tips-features {
    display: flex;
    justify-content: center;
    gap: 30rpx;
    flex-wrap: wrap;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 12rpx 20rpx;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 20rpx;
    border: 1rpx solid rgba(102, 126, 234, 0.2);
}

.feature-dot {
    width: 8rpx;
    height: 8rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
}

.feature-text {
    font-size: 24rpx;
    color: #667eea;
    font-weight: 500;
}

.results-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.result-item {
    display: flex;
    align-items: center;
    padding: 35rpx 30rpx;
    background: white;
    border-radius: 16rpx;
    box-shadow: 0 5rpx 16rpx rgba(230, 230, 230, 0.5);
    transition: all 0.2s ease;
}

.result-item:active {
    transform: scale(0.98);
    background: #f8f9fa;
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
</style>
