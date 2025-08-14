<template>
  <view class="order-page">
    <view class="page-header" :style="{ paddingTop: statusBarHeight + 10 + 'px' }">
      <text class="page-title">回执订单</text>
    </view>
    
    <view class="order-tabs">
      <view 
        v-for="(tab, index) in orderTabs" 
        :key="tab.value"
        class="tab-item"
        :class="{ active: activeTabIndex === index }"
        @tap="switchTab(index)"
      >
        <text class="tab-text">{{ tab.label }}</text>
      </view>
    </view>
    
    <view class="order-list">
      <!-- 全局温馨提示 - 在所有订单最顶部 -->
      <view v-if="currentOrders.length > 0" class="global-warm-tip">
        <view class="tip-icon">🔊</view>
        <text class="tip-text">温馨提示：回执审核时间：早上 9:00 到晚上 20:30</text>
      </view>
      
      <view v-if="currentOrders.length === 0" class="empty-state">
        <view class="empty-icon">
          <text class="icon">📋</text>
        </view>
        <view class="empty-content">
          <text class="empty-title">暂无订单</text>
          <text class="empty-subtitle">您还没有任何{{ currentTabName }}订单记录</text>
        </view>
        <view class="empty-action">
          <text class="action-btn" @tap="goToHome">去拍摄</text>
        </view>
      </view>
      
      <view v-else class="orders-container">
        <view 
          v-for="order in currentOrders" 
          :key="order.orderNo"
          class="order-item"
        >
          <!-- 订单头部信息 -->
          <view class="order-header">
            <view class="order-info">
              <text class="order-number">订单编号：{{ order.orderNo }}</text>
            </view>
            <view class="order-status" :class="order.status">
              <text class="status-text">{{ getStatusText(order.status) }}</text>
            </view>
          </view>
          
          <!-- 订单内容 -->
          <view class="order-content">
            <view class="document-info">
              <image class="doc-photo" :src="order.photo" mode="aspectFill"></image>
              <view class="doc-details">
                <text class="doc-name">{{ order.documentName }}</text>
                <text class="process-location">办理地区：{{ order.location }}</text>
                <text class="payment-amount">支付金额：{{ order.amount }}</text>
                <text class="check-time">检测时间：{{ order.checkTime }}</text>
                <view class="check-result">
                  <text class="result-label">检测结果：</text>
                  <text class="result-value" :class="order.status">{{ getResultText(order.status) }}</text>
                </view>
                <view v-if="order.status === 'processing'" class="status-description">
                  <text class="status-desc">状态说明：</text>
                  <text class="status-detail">证件照回执正在审核中，审核结果将短信通知您，请稍等。</text>
                </view>
              </view>
            </view>
            
            <!-- 操作按钮区域 -->
            <view class="order-actions">
              <view v-if="order.status === 'completed'" class="action-buttons button-group">
                <view
                  class="action-btn group-btn first"
                  :class="{ 'only-two': !order.hasReceipt }"
                  @tap="downloadStandard(order)"
                >
                  <text class="btn-text">下载标准照</text>
                </view>
                <view
                  class="action-btn group-btn"
                  :class="{ 'middle': order.hasReceipt, 'last': !order.hasReceipt }"
                  @tap="downloadLayout(order)"
                >
                  <text class="btn-text">下载排版照</text>
                </view>
                <!-- 如果支持回执，显示回执按钮 -->
                <view
                  v-if="order.hasReceipt"
                  class="action-btn group-btn last"
                  @tap="downloadReceipt(order)"
                >
                  <text class="btn-text">下载回执照</text>
                </view>
              </view>
              <view v-else-if="order.status === 'rejected'" class="action-buttons button-group">
                <view class="action-btn group-btn first" @tap="reupload(order)">
                  <text class="btn-text">重新上传</text>
                </view>
                <view class="action-btn group-btn last consultation" @tap="contactService">
                  <image class="btn-icon" src="/static/customer-service.png" mode="aspectFit"></image>
                  <text class="btn-text">咨询客服</text>
                </view>
              </view>
              <view v-else class="action-buttons single">
                <view class="action-btn consultation" @tap="contactService">
                  <image class="btn-icon" src="/static/customer-service.png" mode="aspectFit"></image>
                  <text class="btn-text">咨询客服</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getOrders } from '@/utils/api.js'
export default {
  name: 'OrderContent',
  data() {
    return {
      statusBarHeight: 44, // 默认状态栏高度
      headerHeight: 44,    // 默认导航栏高度
      activeTabIndex: 0,   // 当前选中的标签页索引
      orderTabs: [
        { label: '全部', value: 'all' },
        { label: '待付款', value: 'pending_payment' },
        { label: '制作中', value: 'processing' },
        { label: '已驳回', value: 'rejected' },
        { label: '已完成', value: 'completed' }
      ],
      orders: []
    }
  },
  computed: {
    currentTabName() {
      return this.orderTabs[this.activeTabIndex].label
    },
    currentOrders() {
      const tabValue = this.orderTabs[this.activeTabIndex].value
      if (tabValue === 'all') {
        return this.orders
      }
      return this.orders.filter(order => order.status === tabValue)
    }
  },
  created() {
    this.getSystemInfo()
    this.loadOrders()
    uni.$on('order-updated', this.loadOrders)
  },
  beforeDestroy() {
    uni.$off('order-updated', this.loadOrders)
  },
  methods: {
    switchTab(index) {
      this.activeTabIndex = index
    },
    goToHome() {
      // 通过事件通知父组件切换到首页
      this.$emit('switch-tab', 0)
    },
    loadOrders() {
      getOrders()().then(res => {
        this.orders = res.data.map(o => ({
          ...o,
          amount: `¥${o.amount}`,
          photo: o.originalPhoto,
          hasReceipt: !!o.receiptPhoto,
          status: this.mapStatus(o.status)
        }))
      }).catch(() => {
        this.orders = []
      })
    },
    contactService() {
      // 联系客服
      uni.showToast({
        title: '正在为您联系客服...',
        icon: 'none'
      })
    },
    downloadStandard(order) {
      uni.downloadFile({
        url: order.standardPhoto,
        success: () => {
          uni.showToast({ title: '下载成功', icon: 'success' })
        }
      })
    },
    downloadLayout(order) {
      uni.downloadFile({
        url: order.layoutPhoto,
        success: () => {
          uni.showToast({ title: '下载成功', icon: 'success' })
        }
      })
    },
    downloadReceipt(order) {
      uni.downloadFile({
        url: order.receiptPhoto,
        success: () => {
          uni.showToast({ title: '下载成功', icon: 'success' })
        }
      })
    },
    reupload(order) {
      const data = encodeURIComponent(JSON.stringify({ name: order.documentName, specs: { requirements: '' } }))
      uni.navigateTo({
        url: `/pages/custom-camera/custom-camera?orderId=${order.id}&data=${data}`
      })
    },
    formatTime(timeString) {
      // 格式化时间显示
      const date = new Date(timeString)
      const now = new Date()
      const diff = now - date
      const hours = Math.floor(diff / (1000 * 60 * 60))
      
      if (hours < 24) {
        return `${hours}小时前`
      } else {
        const days = Math.floor(hours / 24)
        return `${days}天前`
      }
    },
    getStatusText(status) {
      const statusMap = {
        'pending_payment': '待付款',
        'processing': '制作中',
        'rejected': '已驳回',
        'completed': '已完成'
      }
      return statusMap[status] || '未知状态'
    },
    getResultText(status) {
      const resultMap = {
        'pending_payment': '等待付款',
        'processing': '制作中',
        'rejected': '审核未通过',
        'completed': '办理完成'
      }
      return resultMap[status] || '未知结果'
    },
    mapStatus(value) {
      const map = {
        0: 'pending_payment',
        1: 'processing',
        2: 'rejected',
        3: 'completed'
      }
      return map[value] || 'pending_payment'
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
        
        console.log('系统信息:', {
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

.order-page {
  background-color: #f5f5f5;
  min-height: 100%;
  box-sizing: border-box;
  overflow-y: hidden;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.page-header {
  background: white;
  padding: 0 20rpx 30rpx;
  text-align: center;
  position: relative;
  /* CSS环境变量回退方案 */
  padding-top: var(--status-bar-height, 44px);
}

/* 针对特殊机型的适配 */
@media screen and (device-width: 414px) and (device-height: 896px) {
  /* iPhone XR, iPhone 11 */
  .page-header {
    padding-top: 44px;
  }
}

@media screen and (device-width: 375px) and (device-height: 812px) {
  /* iPhone X, iPhone XS, iPhone 11 Pro */
  .page-header {
    padding-top: 44px;
  }
}

@media screen and (device-width: 414px) and (device-height: 896px) {
  /* iPhone XS Max, iPhone 11 Pro Max */
  .page-header {
    padding-top: 44px;
  }
}

.order-tabs {
  background: white;
  display: flex;
  padding: 0 20rpx;
  border-bottom: 1rpx solid #e9ecef;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 30rpx 0;
  position: relative;
  transition: all 0.2s ease;
}

.tab-item:active {
  background: rgba(61, 69, 230, 0.05);
}

.tab-item.active .tab-text {
  color: #3d45e6;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 4rpx;
  background: #3d45e6;
  border-radius: 2rpx;
}

.tab-text {
  font-size: 28rpx;
  color: #666;
  transition: color 0.2s ease;
}

.order-list {
  padding: 0 20rpx 40rpx;
}

/* 全局温馨提示样式 */
.global-warm-tip {
  display: flex;
  align-items: center;
  margin: 20rpx 0 30rpx;
  padding: 16rpx 20rpx;
  background: linear-gradient(135deg, #fff7e6 0%, #ffecc7 100%);
  border-radius: 16rpx;
  border: 1rpx solid #ffd591;
  box-shadow: 0 2rpx 8rpx rgba(255, 193, 7, 0.1);
}

.global-warm-tip .tip-icon {
  font-size: 28rpx;
  margin-right: 12rpx;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.global-warm-tip .tip-text {
  font-size: 26rpx;
  color: #d48806;
  line-height: 1.4;
  flex: 1;
  font-weight: 500;
}

.orders-container {
  padding-top: 0;
}

.order-item {
  background: white;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.2s ease;
}

.order-item:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 30rpx 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.order-info {
  flex: 1;
}

.order-number {
  font-size: 24rpx;
  color: #999;
}

.order-status {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  border: 1rpx solid;
}

.order-status.pending_payment {
  background: #fff7e6;
  color: #fa8c16;
  border-color: #ffd591;
}

.order-status.processing {
  background: #e6f7ff;
  color: #1890ff;
  border-color: #91d5ff;
}

.order-status.pending {
  background: #fff1f0;
  color: #f5222d;
  border-color: #ffa39e;
}

.order-status.completed {
  background: #f6ffed;
  color: #52c41a;
  border-color: #b7eb8f;
}

.status-text {
  font-weight: 500;
}

.order-content {
  padding: 20rpx 30rpx 30rpx;
}

.document-info {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30rpx;
}

.doc-photo {
  width: 120rpx;
  height: 160rpx;
  border-radius: 12rpx;
  margin-right: 24rpx;
  background: #f5f5f5;
  flex-shrink: 0;
}

.doc-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.doc-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
}

.process-location,
.payment-amount,
.check-time {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
}

.check-result {
  display: flex;
  align-items: center;
  margin-top: 4rpx;
}

.result-label {
  font-size: 26rpx;
  color: #666;
}

.result-value {
  font-size: 26rpx;
  font-weight: 500;
  margin-left: 8rpx;
}

.result-value.pending_payment {
  color: #fa8c16;
}

.result-value.processing {
  color: #1890ff;
}

.result-value.pending {
  color: #f5222d;
}

.result-value.completed {
  color: #52c41a;
}

.status-description {
  margin-top: 16rpx;
  padding: 16rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  border-left: 4rpx solid #3d45e6;
}

.status-desc {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
}

.status-detail {
  font-size: 24rpx;
  color: #333;
  line-height: 1.5;
}

.order-actions {
  margin-top: 20rpx;
}

.action-buttons {
  display: flex;
}

.action-buttons.single {
  justify-content: center;
}

.action-buttons.button-group {
  border-radius: 6rpx;
  overflow: hidden;
  border: 1rpx solid #dcdfe6;
  display: inline-flex;
  width: 100%;
}

.action-btn {
  padding: 20rpx 24rpx;
  text-align: center;
  font-size: 26rpx;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  background: white;
  color: #606266;
  position: relative;
}

.action-btn:active {
  transform: scale(0.98);
}

.action-btn.consultation {
  background: linear-gradient(135deg, #3d45e6 0%, #5b63f5 100%);
  color: white;
  border-radius: 50rpx;
  box-shadow: 0 6rpx 20rpx rgba(61, 69, 230, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  flex: 1;
  max-width: 300rpx;
  margin: 0 auto;
}

.action-btn.consultation:active {
  box-shadow: 0 4rpx 16rpx rgba(61, 69, 230, 0.4);
}

/* 按钮组样式 - Element Plus风格 */
.action-btn.group-btn {
  flex: 1;
  background: white;
  color: #606266;
  border: none;
  border-right: 1rpx solid #dcdfe6;
  border-radius: 0;
  position: relative;
}

.action-btn.group-btn:last-child,
.action-btn.group-btn.last {
  border-right: none;
}

.action-btn.group-btn:hover,
.action-btn.group-btn:active {
  background: #ecf5ff;
  color: #409eff;
  z-index: 1;
}

.action-btn.group-btn.first {
  border-radius: 6rpx 0 0 6rpx;
}

.action-btn.group-btn.last {
  border-radius: 0 6rpx 6rpx 0;
}

.action-btn.group-btn.only-two.first {
  border-radius: 6rpx 0 0 6rpx;
}

.action-btn.group-btn.only-two:last-child {
  border-radius: 0 6rpx 6rpx 0;
}

.btn-icon {
  width: 32rpx;
  height: 32rpx;
  filter: brightness(0) invert(1);
}

.btn-text {
  color: inherit;
}

.empty-state {
  text-align: center;
  padding: 120rpx 40rpx 80rpx;
  background: white;
  margin: 20rpx 0;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);
}

.empty-icon {
  margin-bottom: 30rpx;
}

.icon {
  font-size: 120rpx;
  opacity: 0.6;
  filter: grayscale(0.3);
}

.empty-content {
  margin-bottom: 60rpx;
}

.empty-title {
  display: block;
  color: #333;
  font-size: 32rpx;
  font-weight: 500;
  margin-bottom: 16rpx;
  letter-spacing: 1rpx;
}

.empty-subtitle {
  display: block;
  color: #999;
  font-size: 26rpx;
  line-height: 1.5;
}

.empty-action {
  margin-top: 40rpx;
}

.empty-state .action-btn {
  display: inline-block;
  background: linear-gradient(135deg, #3d45e6 0%, #5b63f5 100%);
  color: white;
  padding: 24rpx 60rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
  font-weight: 500;
  box-shadow: 0 8rpx 30rpx rgba(61, 69, 230, 0.3);
  transition: all 0.3s ease;
}

.empty-state .action-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 20rpx rgba(61, 69, 230, 0.4);
}
</style>
