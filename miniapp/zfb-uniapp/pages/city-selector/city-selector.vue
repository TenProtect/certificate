<template>
    <view class="city-selector-page">
        <!-- 自定义导航栏 -->
        <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 30 + 'px' }">
            <text class="nav-title"></text>
            <view class="nav-placeholder"></view>
        </view>

        <!-- 搜索框 -->
        <view class="search-container">
            <view class="search-box">
                <view class="search-icon">
                    <view class="search-icon-svg">
                        <view class="search-circle"></view>
                        <view class="search-handle"></view>
                    </view>
                </view>
                <input class="search-input" placeholder="输入城市" v-model="searchKeyword" @input="onSearchInput"
                    :focus="searchFocus" />
                <view v-if="searchKeyword" class="clear-btn" @tap="clearSearch">
                    <text class="clear-icon">×</text>
                </view>
            </view>
        </view>

        <!-- 热门城市 -->
        <view v-if="!searchKeyword" class="hot-cities">
            <text class="section-title">热门城市</text>
            <view class="hot-city-grid">
                <view v-for="city in hotCities" :key="city.code" class="hot-city-item" @tap="selectCity(city)">
                    <text class="hot-city-name">{{ city.name.replace('市', '') }}</text>
                </view>
            </view>
        </view>

        <!-- 城市列表容器 -->
        <view class="city-list-container">
            <!-- 搜索结果 -->
            <view v-if="searchKeyword" class="search-results">
                <view v-if="searchResults.length === 0" class="no-results">
                    <text class="no-results-text">未找到相关城市</text>
                </view>
                <view v-else class="search-result-list">
                    <view v-for="city in searchResults" :key="city.code" class="city-item search-result-item"
                        @tap="selectCity(city)">
                        <text class="city-name">{{ city.name }}</text>
                    </view>
                </view>
            </view>

            <!-- 字母分组城市列表 -->
            <scroll-view v-else class="city-list" scroll-y :scroll-into-view="scrollIntoView"
                :scroll-with-animation="false" @scroll="onScroll">
                <view v-for="letter in alphabetList" :key="letter" :id="`letter-${letter}`" class="letter-section">
                    <view class="letter-header">
                        <text class="letter-title">{{ letter }}</text>
                    </view>
                    <view class="city-group">
                        <view v-for="city in groupedCities[letter]" :key="city.code" class="city-item"
                            @tap="selectCity(city)">
                            <text class="city-name">{{ city.name }}</text>
                        </view>
                    </view>
                </view>
            </scroll-view>

            <!-- 字母索引条 -->
            <view v-if="!searchKeyword" class="alphabet-index" @touchstart="onIndexTouchStart"
                @touchmove="onIndexTouchMove" @touchend="onIndexTouchEnd">
                <view v-for="letter in alphabetList" :key="letter" :data-letter="letter" class="index-letter"
                    :class="{ active: currentLetter === letter }" @tap="onLetterTap(letter)">
                    <text class="index-letter-text">{{ letter }}</text>
                </view>
            </view>

            <!-- 字母提示浮层 -->
            <view v-if="showLetterTip && !searchKeyword" class="letter-tip">
                <text class="letter-tip-text">{{ currentLetter }}</text>
            </view>
        </view>
    </view>
</template>

<script>
import { citiesData } from '@/utils/cities-data.js'

export default {
    name: 'CitySelector',
    data() {
        return {
            searchKeyword: '',
            searchFocus: false,
            currentCity: '重庆',
            cities: [],
            groupedCities: {},
            alphabetList: [],
            hotCities: [],
            searchResults: [],
            scrollIntoView: '',
            currentLetter: '',
            showLetterTip: false,
            indexTouching: false,
            statusBarHeight: 44, // 默认状态栏高度
            headerHeight: 44     // 默认导航栏高度
        }
    },
    async onLoad(options) {
        // 获取传入的当前城市
        if (options.city) {
            this.currentCity = decodeURIComponent(options.city)
        }

        // 获取系统信息，适配刘海屏
        this.getSystemInfo()

        await this.loadCities()
        this.setupHotCities()
        this.groupCitiesByLetter()
    },
    methods: {
        async loadCities() {
            // 使用导入的城市数据
            this.cities = citiesData || []
            console.log('加载城市数据成功，共', this.cities.length, '个城市')
        },

        setupHotCities() {
            // 设置热门城市（可以根据实际需求调整）
            const hotCityCodes = ['1101', '3101', '4403', '4401', '3301', '3201', '5001', '5101']
            this.hotCities = this.cities.filter(city => hotCityCodes.includes(city.code))
        },

        groupCitiesByLetter() {
            const grouped = {}
            const alphabet = []

            // 按拼音首字母分组
            this.cities.forEach(city => {
                const firstChar = this.getFirstLetter(city.name)
                if (!grouped[firstChar]) {
                    grouped[firstChar] = []
                    if (!alphabet.includes(firstChar)) {
                        alphabet.push(firstChar)
                    }
                }
                grouped[firstChar].push(city)
            })

            // 排序字母列表
            alphabet.sort()

            // 按每组内的城市名称排序
            Object.keys(grouped).forEach(letter => {
                grouped[letter].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
            })

            this.groupedCities = grouped
            this.alphabetList = alphabet

            console.log('城市分组完成:', Object.keys(grouped).length, '个字母组')
        },

        getFirstLetter(cityName) {
            // 更完整的拼音首字母映射
            const letterMap = {
                // A
                '安': 'A', '阿': 'A', '鞍': 'A',
                // B
                '保': 'B', '包': 'B', '北': 'B', '博': 'B', '宝': 'B', '巴': 'B', '本': 'B', '毕': 'B', '滨': 'B', '白': 'B', '百': 'B', '蚌': 'B',
                // C
                '崇': 'C', '常': 'C', '成': 'C', '承': 'C', '昌': 'C', '朝': 'C', '楚': 'C', '池': 'C', '沧': 'C', '滁': 'C', '潮': 'C', '赤': 'C', '郴': 'C', '重': 'C', '长': 'C',
                // D
                '东': 'D', '丹': 'D', '大': 'D', '定': 'D', '德': 'D', '达': 'D', '迪': 'D',
                // E
                '恩': 'E', '鄂': 'E',
                // F
                '佛': 'F', '抚': 'F', '福': 'F', '阜': 'F', '防': 'F',
                // G
                '固': 'G', '广': 'G', '果': 'G', '桂': 'G', '甘': 'G', '贵': 'G', '赣': 'G',
                // H
                '合': 'H', '呼': 'H', '和': 'H', '哈': 'H', '怀': 'H', '惠': 'H', '杭': 'H', '汉': 'H', '河': 'H', '海': 'H', '淮': 'H', '湖': 'H', '红': 'H', '菏': 'H', '葫': 'H', '衡': 'H', '贺': 'H', '邯': 'H', '鹤': 'H', '黄': 'H', '黑': 'H',
                // J
                '九': 'J', '佳': 'J', '吉': 'J', '嘉': 'J', '揭': 'J', '晋': 'J', '景': 'J', '江': 'J', '济': 'J', '焦': 'J', '荆': 'J', '酒': 'J', '金': 'J', '锦': 'J', '鸡': 'J',
                // K
                '克': 'K', '喀': 'K', '开': 'K', '昆': 'K',
                // L
                '临': 'L', '丽': 'L', '乐': 'L', '六': 'L', '兰': 'L', '凉': 'L', '吕': 'L', '娄': 'L', '廊': 'L', '拉': 'L', '来': 'L', '林': 'L', '柳': 'L', '泸': 'L', '洛': 'L', '漯': 'L', '聊': 'L', '辽': 'L', '连': 'L', '陇': 'L', '龙': 'L',
                // M
                '梅': 'M', '牡': 'M', '眉': 'M', '绵': 'M', '茂': 'M', '马': 'M',
                // N
                '内': 'N', '南': 'N', '宁': 'N', '怒': 'N', '那': 'N',
                // P
                '平': 'P', '攀': 'P', '普': 'P', '濮': 'P', '盘': 'P', '莆': 'P', '萍': 'P',
                // Q
                '七': 'Q', '庆': 'Q', '曲': 'Q', '泉': 'Q', '清': 'Q', '秦': 'Q', '衢': 'Q', '钦': 'Q', '青': 'Q', '黔': 'Q', '齐': 'Q',
                // R
                '日': 'R',
                // S
                '三': 'S', '上': 'S', '十': 'S', '双': 'S', '商': 'S', '四': 'S', '宿': 'S', '山': 'S', '朔': 'S', '松': 'S', '汕': 'S', '沈': 'S', '深': 'S', '石': 'S', '绍': 'S', '绥': 'S', '苏': 'S', '遂': 'S', '邵': 'S', '随': 'S', '韶': 'S',
                // T
                '台': 'T', '吐': 'T', '唐': 'T', '塔': 'T', '天': 'T', '太': 'T', '泰': 'T', '通': 'T', '铁': 'T', '铜': 'T',
                // W
                '乌': 'W', '吴': 'W', '威': 'W', '文': 'W', '无': 'W', '梧': 'W', '武': 'W', '温': 'W', '渭': 'W', '潍': 'W', '芜': 'W',
                // X
                '信': 'X', '兴': 'X', '厦': 'X', '县': 'X', '咸': 'X', '孝': 'X', '宣': 'X', '徐': 'X', '忻': 'X', '新': 'X', '湘': 'X', '襄': 'X', '西': 'X', '许': 'X', '邢': 'X', '锡': 'X',
                // Y
                '云': 'Y', '伊': 'Y', '宜': 'Y', '岳': 'Y', '延': 'Y', '扬': 'Y', '榆': 'Y', '永': 'Y', '烟': 'Y', '玉': 'Y', '益': 'Y', '盐': 'Y', '营': 'Y', '运': 'Y', '银': 'Y', '阳': 'Y', '雅': 'Y', '鹰': 'Y',
                // Z
                '中': 'Z', '亳': 'Z', '儋': 'Z', '周': 'Z', '张': 'Z', '昭': 'Z', '枣': 'Z', '株': 'Z', '淄': 'Z', '湛': 'Z', '漳': 'Z', '珠': 'Z', '肇': 'Z', '自': 'Z', '舟': 'Z', '资': 'Z', '遵': 'Z', '郑': 'Z', '镇': 'Z', '驻': 'Z',
            }
            const firstChar = cityName.charAt(0)
            return letterMap[firstChar] || '#'
        },

        onSearchInput() {
            if (this.searchKeyword.trim()) {
                this.searchResults = this.cities.filter(city =>
                    city.name.includes(this.searchKeyword.trim())
                )
            } else {
                this.searchResults = []
            }
        },

        clearSearch() {
            this.searchKeyword = ''
            this.searchResults = []
        },

        selectCity(city) {
            console.log('选择城市:', city.name)

            // 通过事件通信或页面参数返回选中的城市
            const pages = getCurrentPages()
            const prevPage = pages[pages.length - 2]

            if (prevPage) {
                // 如果有回调方法，调用回调
                if (prevPage.$vm && typeof prevPage.$vm.onCitySelected === 'function') {
                    prevPage.$vm.onCitySelected(city)
                }
                // 或者通过全局事件
                uni.$emit('citySelected', city)
            }

            // 返回上一页
            uni.navigateBack()
        },

        goBack() {
            uni.navigateBack()
        },

        // 字母索引相关方法
        onLetterTap(letter) {
            this.currentLetter = letter
            // 先清空，然后立即设置，减少动画时间
            this.scrollIntoView = ''
            this.$nextTick(() => {
                this.scrollIntoView = `letter-${letter}`
            })
            this.showLetterTip = true
            setTimeout(() => {
                this.showLetterTip = false
            }, 300) // 减少提示显示时间
        },

        onIndexTouchStart(e) {
            this.indexTouching = true
            this.showLetterTip = true
            this.handleIndexTouch(e)
        },

        onIndexTouchMove(e) {
            if (this.indexTouching) {
                this.handleIndexTouch(e)
            }
        },

        onIndexTouchEnd(e) {
            this.indexTouching = false
            setTimeout(() => {
                this.showLetterTip = false
            }, 300) // 减少提示显示时间
        },

        handleIndexTouch(e) {
            const touch = e.touches[0] || e.changedTouches[0]

            if (!touch) return

            // 获取索引条的位置信息
            uni.createSelectorQuery().in(this).select('.alphabet-index').boundingClientRect((rect) => {
                if (rect) {
                    // 使用clientY而不是pageY，更准确
                    const relativeY = touch.clientY - rect.top
                    const letterHeight = rect.height / this.alphabetList.length
                    const index = Math.floor(relativeY / letterHeight)

                    if (index >= 0 && index < this.alphabetList.length) {
                        const letter = this.alphabetList[index]
                        this.currentLetter = letter

                        // 先清空，然后立即设置，实现快速滚动
                        this.scrollIntoView = ''
                        this.$nextTick(() => {
                            this.scrollIntoView = `letter-${letter}`
                        })
                    }
                }
            }).exec()
        },

        onScroll(e) {
            // 简化滚动处理，只在非拖拽状态下更新当前字母
            if (!this.indexTouching) {
                // 可以在这里添加简单的当前字母更新逻辑
            }
        },

        // 获取系统信息，适配刘海屏
        getSystemInfo() {
            try {
                const systemInfo = uni.getSystemInfoSync()
                // 支付宝小程序获取状态栏高度
                this.statusBarHeight = systemInfo.statusBarHeight || 44
                
                // 根据平台和机型设置不同的导航栏高度
                if (systemInfo.platform === 'ios') {
                    // iPhone刘海屏适配
                    if (systemInfo.statusBarHeight >= 44) {
                        this.headerHeight = 44  // iPhone X及以上
                    } else {
                        this.headerHeight = 44  // iPhone 8及以下
                    }
                } else if (systemInfo.platform === 'android') {
                    // Android刘海屏适配
                    this.headerHeight = 48
                } else {
                    this.headerHeight = 44
                }
                
                // 额外的安全区域处理
                const safeArea = systemInfo.safeArea || {}
                const safeAreaTop = safeArea.top || this.statusBarHeight
                
                // 使用更安全的顶部距离
                this.statusBarHeight = Math.max(this.statusBarHeight, safeAreaTop)
                
                console.log('城市选择页系统信息:', {
                    platform: systemInfo.platform,
                    statusBarHeight: this.statusBarHeight,
                    headerHeight: this.headerHeight,
                    model: systemInfo.model,
                    safeArea: safeArea
                })
            } catch (e) {
                console.log('获取系统信息失败，使用默认值:', e)
                // 降级方案：根据用户代理判断
                const userAgent = navigator.userAgent || ''
                if (userAgent.includes('iPhone')) {
                    this.statusBarHeight = 44
                    this.headerHeight = 44
                } else {
                    this.statusBarHeight = 44
                    this.headerHeight = 48
                }
            }
        }
    }
}
</script>

<style scoped>
/* 全局CSS变量定义 */
:root {
  --status-bar-height: 44px;
}

/* 支付宝小程序环境变量支持 */
@supports (top: env(safe-area-inset-top)) {
  :root {
    --status-bar-height: env(safe-area-inset-top);
  }
}

/* 微信小程序环境变量支持 */
@supports (top: constant(safe-area-inset-top)) {
  :root {
    --status-bar-height: constant(safe-area-inset-top);
  }
}

.city-selector-page {
    height: 100vh;
    background-color: #f5f6f8;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow-y: hidden;
}

/* 导航栏 */
.nav-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20rpx 30rpx;
    background-color: white;
    position: relative;
    z-index: 100;
    /* CSS环境变量回退方案 */
    padding-top: var(--status-bar-height, 44px);
}

.nav-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
}

.nav-placeholder {
    width: 80rpx;
}

/* 针对特殊机型的适配 */
@media screen and (device-width: 414px) and (device-height: 896px) {
  /* iPhone XR, iPhone 11 */
  .nav-bar {
    padding-top: 44px;
  }
}

@media screen and (device-width: 375px) and (device-height: 812px) {
  /* iPhone X, iPhone XS, iPhone 11 Pro */
  .nav-bar {
    padding-top: 44px;
  }
}

@media screen and (device-width: 414px) and (device-height: 896px) {
  /* iPhone XS Max, iPhone 11 Pro Max */
  .nav-bar {
    padding-top: 44px;
  }
}

/* 搜索框 */
.search-container {
    background-color: white;
    padding: 20rpx;
    border-bottom: 1rpx solid #e9ecef;
}

.search-box {
    display: flex;
    align-items: center;
    background: #f8f9fa;
    border: 1rpx solid #e9ecef;
    border-radius: 25rpx;
    padding: 0 20rpx;
}

.search-icon {
    margin-right: 15rpx;
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

.search-input {
    flex: 1;
    padding: 25rpx 0;
    font-size: 28rpx;
    border: none;
    background: transparent;
}

.clear-btn {
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.clear-icon {
    font-size: 32rpx;
    color: #999;
}

/* 热门城市 */
.hot-cities {
    background-color: white;
    padding: 30rpx 20rpx;
    border-bottom: 1rpx solid #e9ecef;
}

.section-title {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 20rpx;
    display: block;
}

.hot-city-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;
}

.hot-city-item {
    padding: 20rpx;
    text-align: center;
    background: #f8f9fa;
    border-radius: 12rpx;
    cursor: pointer;
    transition: all 0.2s ease;
}

.hot-city-item:active {
    background: #e9ecef;
    transform: scale(0.98);
}

.hot-city-name {
    font-size: 28rpx;
    color: #333;
}

/* 城市列表容器 */
.city-list-container {
    flex: 1;
    position: relative;
    overflow: hidden;
}

/* 搜索结果 */
.search-results {
    height: 100%;
    background-color: white;
}

.no-results {
    padding: 100rpx 20rpx;
    text-align: center;
}

.no-results-text {
    font-size: 28rpx;
    color: #999;
}

.search-result-list {
    padding: 0 20rpx;
}

.search-result-item {
    border-bottom: 1rpx solid #f0f0f0;
}

/* 城市列表 */
.city-list {
    height: 100%;
    background-color: white;
}

.letter-section {
    margin-bottom: 20rpx;
}

.letter-header {
    background: #f8f9fa;
    padding: 15rpx 20rpx;
    border-bottom: 1rpx solid #e9ecef;
}

.letter-title {
    font-size: 24rpx;
    color: #666;
    font-weight: bold;
}

.city-group {
    background-color: white;
}

.city-item {
    padding: 30rpx 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.city-item:active {
    background-color: #f8f9fa;
}

.city-item:last-child {
    border-bottom: none;
}

.city-name {
    font-size: 32rpx;
    color: #333;
}

/* 字母索引条 */
.alphabet-index {
    position: fixed;
    right: 10rpx;
    top: calc(100vh - 480rpx);
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 999;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 20rpx;
    padding: 10rpx 5rpx;
}

.index-letter {
    padding: 5rpx;
    width: 30rpx;
    height: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.index-letter.active {
    background-color: #565DF4;
}

.index-letter-text {
    font-size: 20rpx;
    color: #666;
    font-weight: bold;
}

.index-letter.active .index-letter-text {
    color: white;
}

/* 字母提示浮层 */
.letter-tip {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120rpx;
    height: 120rpx;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.letter-tip-text {
    font-size: 48rpx;
    color: white;
    font-weight: bold;
}
</style>
