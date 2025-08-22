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
        <text class="tip-text">温馨提示：回执审核时间：早上 8:00 到晚上 23:00</text>
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
                <!-- <text class="check-time">检测时间：{{ order.checkTime }}</text> -->
                <view class="check-result">
                  <text class="result-label">检测结果：</text>
                  <text class="result-value" :class="order.status">{{ getResultText(order.status) }}</text>
                </view>
                <view v-if="order.status === 'rejected' && order.rejectReason" class="reject-reason">
                  <text class="reason-label">驳回原因：</text>
                  <text class="reason-value">{{ order.rejectReason }}</text>
                </view>
                <view v-if="order.status === 'processing'" class="status-description">
                  <text class="status-desc">状态说明：</text>
                  <text class="status-detail">证件照回执正在审核中，请稍等。</text>
                </view>
              </view>
            </view>
            
            <!-- 操作按钮区域 -->
            <view class="order-actions">
              <view v-if="order.status === 'completed'" class="action-buttons button-group">
                <!-- 标准照按钮 -->
                <view
                  v-if="order.hasStandard"
                  class="action-btn group-btn"
                  :class="getButtonClass(order, 'standard')"
                  @tap="showPreview(order, 'standard')"
                >
                  <text class="btn-text">下载标准照</text>
                </view>
                <!-- 排版照按钮 -->
                <view
                  v-if="order.hasLayout"
                  class="action-btn group-btn"
                  :class="getButtonClass(order, 'layout')"
                  @tap="showPreview(order, 'layout')"
                >
                  <text class="btn-text">下载排版照</text>
                </view>
                <!-- 回执照按钮 -->
                <view
                  v-if="order.hasReceipt"
                  class="action-btn group-btn"
                  :class="getButtonClass(order, 'receipt')"
                  @tap="showPreview(order, 'receipt')"
                >
                  <text class="btn-text">下载回执照</text>
                </view>
              </view>
              <view v-else-if="order.status === 'rejected'" class="action-buttons button-group">
                <view class="action-btn group-btn first" @tap="reupload(order)">
                  <text class="btn-text">重新上传</text>
                </view>
                <view class="action-btn group-btn last consultation-wrapper">
                  <contact-button
                    class="contact-button-native"
                    size="default"
                    color="#3d45e6"
                    icon="/static/customer-service.png"
                    :tnt-inst-id="contactConfig.tntInstId"
                    :scene="contactConfig.scene"
                  >
                  </contact-button>
                  <text class="btn-text btn-text-clickthrough">咨询客服</text>
                </view>
              </view>
              <view v-else-if="order.status === 'pending_payment'" class="action-buttons button-group">
                <view class="action-btn group-btn first" @tap="payOrder(order)">
                  <text class="btn-text">立即支付</text>
                </view>
                <view class="action-btn group-btn last consultation-wrapper">
                  <contact-button
                    class="contact-button-native"
                    size="default"
                    color="#3d45e6"
                    icon="/static/customer-service.png"
                    :tnt-inst-id="contactConfig.tntInstId"
                    :scene="contactConfig.scene"
                  >
                  </contact-button>
                  <text class="btn-text btn-text-clickthrough">咨询客服</text>
                </view>
              </view>
              <view v-else class="action-buttons single">
                <view class="consultation-wrapper-single">
                  <text class="btn-text btn-text-clickthrough">咨询客服</text>
                  <contact-button
                    class="contact-button-native-single"
                    size="default"
                    color="#3d45e6"
                    icon="/static/customer-service.png"
                    :tnt-inst-id="contactConfig.tntInstId"
                    :scene="contactConfig.scene"
                  >
                  </contact-button>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 预览对话框 -->
    <view v-if="previewDialog.show" class="preview-overlay" :class="{ 'closing': previewDialog.closing }" @tap="closePreview">
      <view class="preview-dialog" :class="{ 'closing': previewDialog.closing }" @tap.stop="">
        <view class="preview-header">
          <view class="preview-title">{{ previewDialog.title }}</view>
          <view class="close-btn" @tap="closePreview">
            <text class="close-icon">✕</text>
          </view>
        </view>
        
        <view class="preview-content">
          <view class="preview-image-container">
            <image 
              class="preview-image" 
              :src="previewDialog.imageUrl" 
              mode="aspectFit"
              @error="onImageError"
              @load="onImageLoad"
              @tap="previewFullscreen"
              :style="{ 
                width: '100%', 
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center'
              }"
            ></image>
            <!-- 加载状态 -->
            <view v-if="previewDialog.loading" class="image-loading">
              <view class="loading-spinner"></view>
              <text class="loading-text">加载中...</text>
            </view>
            <!-- 点击提示 -->
            <view v-if="!previewDialog.loading" class="zoom-tip">
              <text class="zoom-text">点击查看大图</text>
            </view>
          </view>
        </view>
        
        <view class="preview-footer">
          <view 
            class="download-btn" 
            :class="{ 'downloading': previewDialog.title.includes('下载中'), 'success': previewDialog.title.includes('成功') }"
            @tap="executeDownload"
          >
            <view class="download-icon" v-if="!previewDialog.title.includes('下载中')">
              <view v-if="previewDialog.title.includes('成功')" class="success-icon">
                <view class="check-mark"></view>
              </view>
              <view v-else class="download-arrow-icon">
                <view class="arrow-line"></view>
                <view class="arrow-head"></view>
                <view class="arrow-base"></view>
              </view>
            </view>
            <view v-else class="downloading-spinner"></view>
            <text class="download-text">{{ previewDialog.title }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getOrders, alipayNotifyTest } from '@/utils/api.js'
import contactConfig from '@/config.js'
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
      orders: [],
      contactConfig,
      // 预览对话框相关数据
      previewDialog: {
        show: false,
        imageUrl: '',
        title: '',
        downloadAction: null,
        loading: false,
        closing: false,  // 添加关闭动画状态
        originalImageUrl: '' // 保存原始图片URL用于下载
      },
      isDev: false
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
    
    checkLogin() {
      const hasToken = !!uni.getStorageSync('token')
      if (!hasToken) {
        uni.showModal({
          title: '请先登录',
          content: '拍摄证件照需要先登录账号，是否前往登录？',
          confirmText: '去登录',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              // 切换到个人中心tab进行登录
              this.$emit('switch-tab', 2) // 个人中心通常是第3个tab(索引为2)
            }
          }
        })
        return false
      }
      return true
    },
    
    goToHome() {
      // 检查登录状态
      if (!this.checkLogin()) {
        return
      }
      
      // 通过事件通知父组件切换到首页
      this.$emit('switch-tab', 0)
    },
    async loadOrders() {
      try {
        const res = await getOrders()
        this.isDev = res.__isDev__ || false
        // 处理每个订单的图片信息
        const processedOrders = await Promise.all(res.map(async (o) => {
          let processedPhoto = o.originalPhoto
          
          // 使用 my.getImageInfo 获取图片信息，确保真机显示正常
          if (o.originalPhoto) {
            try {
              // #ifdef MP-ALIPAY
              const imageInfo = await new Promise((resolve, reject) => {
                my.getImageInfo({
                  src: o.originalPhoto,
                  success: resolve,
                  fail: reject
                })
              })
              // 使用 getImageInfo 返回的路径，确保图片能正常显示
              processedPhoto = imageInfo.path || imageInfo.src || o.originalPhoto
              // #endif
              
              // #ifndef MP-ALIPAY
              const imageInfo = await new Promise((resolve, reject) => {
                uni.getImageInfo({
                  src: o.originalPhoto,
                  success: resolve,
                  fail: reject
                })
              })
              processedPhoto = imageInfo.path || o.originalPhoto
              // #endif
            } catch (error) {
              console.warn('获取图片信息失败，使用原始路径:', error)
              processedPhoto = o.originalPhoto
            }
          }
          
          const snapshot = JSON.parse(o.certificateSnapshot || '{}')
          const hasLayout = snapshot.printLayout && !!o.layoutPhoto
          const hasReceipt = snapshot.hasReceipt && !!o.receiptPhoto
          const hasStandard = !!o.standardPhoto

          return {
            ...o,
            amount: `¥${o.amount}`,
            photo: processedPhoto,
            hasReceipt,
            hasLayout,
            hasStandard,
            status: this.mapStatus(o.status),
            rejectReason: o.rejectReason,
            certificateSnapshot: o.certificateSnapshot,
            // 保存原始图片URL用于下载高质量图片
            originalStandardPhoto: o.standardPhoto,
            originalLayoutPhoto: o.layoutPhoto,
            originalReceiptPhoto: o.receiptPhoto,
            // 处理后的URL用于预览显示
            standardPhoto: o.standardPhoto,
            layoutPhoto: o.layoutPhoto,
            receiptPhoto: o.receiptPhoto
          }
        }))
        
        this.orders = processedOrders
      } catch (error) {
        console.error('加载订单失败:', error)
        this.orders = []
      }
    },
    contactService() {
      // 注意：使用原生 contact-button 组件时，此方法不再需要
      // 原生组件会自动处理联系客服的逻辑
      uni.showToast({
        title: '正在为您联系客服...',
        icon: 'none'
      })
    },
 // 通用：保存网络图片到系统相册（优先使用 my.saveImage，失败则回退到下载后保存）
  async saveImageToAlbum(url) {
    // #ifdef MP-ALIPAY
    try {
      // 方案A：直接用 my.saveImage 保存网络图到相册（最简）
      await my.saveImage({ url }); // 基础库支持直接传网络URL
      uni.showToast({ title: '已保存到相册', icon: 'success' });
      return;
    } catch (e) {
      // 方案B回退：先下载 -> 再保存到相册
      const dlRes = await new Promise((resolve, reject) => {
        my.downloadFile({
          url,
          success: resolve,
          fail: reject
        })
      });
      const tempPath = dlRes.apFilePath || dlRes.tempFilePath;
      await new Promise((resolve, reject) => {
        my.saveImageToPhotosAlbum
          ? my.saveImageToPhotosAlbum({ filePath: tempPath, success: resolve, fail: reject })
          : my.saveImage({ url, success: resolve, fail: reject }); // 兜底
      });
      uni.showToast({ title: '已保存到相册', icon: 'success' });
    }
    // #endif

    // #ifndef MP-ALIPAY
    // 其他小程序/APP/H5 的逻辑：下载 -> saveImageToPhotosAlbum（注意仅支持本地路径）
    const dl = await new Promise((resolve, reject) => {
      uni.downloadFile({ url, success: resolve, fail: reject });
    });
    await new Promise((resolve, reject) => {
      uni.saveImageToPhotosAlbum({
        filePath: dl.tempFilePath,
        success: resolve,
        fail: reject
      });
    });
    uni.showToast({ title: '已保存到相册', icon: 'success' });
    // #endif
  },

  // 辅助：把下载的文件“持久化”，安卓可在文件管理里看到（iOS 仅小程序内部可见）
  async persistFile(url) {
    // #ifdef MP-ALIPAY
    const dlRes = await new Promise((resolve, reject) => {
      my.downloadFile({ url, success: resolve, fail: reject });
    });
    const tempPath = dlRes.apFilePath || dlRes.tempFilePath;
    const saveRes = await new Promise((resolve, reject) => {
      my.saveFile({ apFilePath: tempPath, success: resolve, fail: reject });
    });
    // saveRes.apFilePath 即持久化后的路径（iOS 不在文件管理器展示）
    return saveRes.apFilePath || saveRes.filePath;
    // #endif

    // #ifndef MP-ALIPAY
    const dl = await new Promise((resolve, reject) => {
      uni.downloadFile({ url, success: resolve, fail: reject });
    });
    const saved = await new Promise((resolve, reject) => {
      uni.saveFile({ tempFilePath: dl.tempFilePath, success: resolve, fail: reject });
    });
    return saved.savedFilePath;
    // #endif
  },

  async downloadStandard(order) {
    try {
      // 使用原始图片URL进行下载，确保下载高质量图片
      const originalUrl = order.originalStandardPhoto || order.standardPhoto
      await this.saveImageToAlbum(originalUrl);
    } catch (e) {
      // 相册失败则尝试持久化保存
      try {
        const originalUrl = order.originalStandardPhoto || order.standardPhoto
        const p = await this.persistFile(originalUrl);
        uni.showToast({ title: '已保存文件', icon: 'success' });
        console.log('持久化路径：', p);
      } catch (err) {
        uni.showToast({ title: '保存失败', icon: 'none' });
        console.error(err);
      }
    }
  },
  async downloadLayout(order) {
    try {
      const originalUrl = order.originalLayoutPhoto || order.layoutPhoto
      await this.saveImageToAlbum(originalUrl);
    } catch (e) {
      try {
        const originalUrl = order.originalLayoutPhoto || order.layoutPhoto
        const p = await this.persistFile(originalUrl);
        uni.showToast({ title: '已保存文件', icon: 'success' });
        console.log('持久化路径：', p);
      } catch (err) {
        uni.showToast({ title: '保存失败', icon: 'none' });
        console.error(err);
      }
    }
  },
  async downloadReceipt(order) {
    try {
      const originalUrl = order.originalReceiptPhoto || order.receiptPhoto
      await this.saveImageToAlbum(originalUrl);
    } catch (e) {
      try {
        const originalUrl = order.originalReceiptPhoto || order.receiptPhoto
        const p = await this.persistFile(originalUrl);
        uni.showToast({ title: '已保存文件', icon: 'success' });
        console.log('持久化路径：', p);
      } catch (err) {
        uni.showToast({ title: '保存失败', icon: 'none' });
        console.error(err);
      }
    }
  },
    reupload(order) {
      uni.navigateTo({
        url: `/pages/photo-reupload-detail/photo-reupload-detail?orderId=${order.id}`
      })
    },
    payOrder(order) {
      if (this.isDev) {
        alipayNotifyTest({ out_trade_no: order.orderNo, trade_status: 'TRADE_SUCCESS' })
          .then(() => {
            uni.showToast({ title: '支付成功', icon: 'success' })
            this.loadOrders()
          })
          .catch(() => {
            uni.showToast({ title: '支付失败', icon: 'none' })
          })
      } else {
        if (!order.tradeNo) {
          uni.showToast({ title: '无法获取支付信息', icon: 'none' })
          return
        }
        my.tradePay({
          tradeNO: order.tradeNo,
          success: result => {
            if (result.resultCode === '9000') {
              uni.showToast({ title: '支付成功', icon: 'success' })
              this.loadOrders()
            } else {
              uni.showToast({ title: '支付失败', icon: 'none' })
            }
          },
          fail: () => {
            uni.showToast({ title: '支付失败', icon: 'none' })
          }
        })
      }
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
    
    // 显示预览对话框
    async showPreview(order, type) {
      let originalImageUrl = ''  // 原始图片URL，用于下载
      let previewImageUrl = ''   // 预览图片URL，经过处理的
      let title = ''
      let downloadAction = null
      
      switch(type) {
        case 'standard':
          originalImageUrl = order.originalStandardPhoto || order.standardPhoto
          title = '下载标准照'
          downloadAction = () => this.downloadStandard(order)
          break
        case 'layout':
          originalImageUrl = order.originalLayoutPhoto || order.layoutPhoto
          title = '下载排版照'
          downloadAction = () => this.downloadLayout(order)
          break
        case 'receipt':
          originalImageUrl = order.originalReceiptPhoto || order.receiptPhoto
          title = '下载回执照'
          downloadAction = () => this.downloadReceipt(order)
          break
      }
      
      // 先显示对话框和加载状态
      this.previewDialog = {
        show: true,
        imageUrl: originalImageUrl, // 临时使用原始URL
        title,
        downloadAction,
        loading: true,
        closing: false,
        originalImageUrl // 保存原始URL用于下载
      }
      
      // 处理预览图片URL
      try {
        // #ifdef MP-ALIPAY
        if (originalImageUrl) {
          const imageInfo = await new Promise((resolve, reject) => {
            my.getImageInfo({
              src: originalImageUrl,
              success: resolve,
              fail: reject
            })
          })
          // 使用处理后的路径用于预览
          previewImageUrl = imageInfo.path || imageInfo.src || originalImageUrl
        }
        // #endif
        
        // #ifndef MP-ALIPAY
        if (originalImageUrl) {
          const imageInfo = await new Promise((resolve, reject) => {
            uni.getImageInfo({
              src: originalImageUrl,
              success: resolve,
              fail: reject
            })
          })
          previewImageUrl = imageInfo.path || originalImageUrl
        }
        // #endif
        
        // 更新预览图片URL
        this.previewDialog.imageUrl = previewImageUrl
        
      } catch (error) {
        console.warn('获取预览图片信息失败，使用原始路径:', error)
        this.previewDialog.imageUrl = originalImageUrl
      }
    },
    
    // 关闭预览对话框
    closePreview() {
      // 添加关闭动画状态
      this.previewDialog.closing = true
      
      // 延迟关闭以显示动画效果
      setTimeout(() => {
        this.previewDialog = {
          show: false,
          imageUrl: '',
          title: '',
          downloadAction: null,
          loading: false,
          closing: false,
          originalImageUrl: ''
        }
      }, 300)
    },
    
    // 执行下载
    async executeDownload() {
      if (this.previewDialog.downloadAction) {
        // 添加下载中状态
        const originalTitle = this.previewDialog.title
        this.previewDialog.title = '下载中...'
        
        try {
          await this.previewDialog.downloadAction()
          // 下载成功后短暂显示成功状态
          this.previewDialog.title = '下载成功'
          setTimeout(() => {
            this.closePreview()
          }, 1000)
        } catch (error) {
          // 下载失败，恢复原标题
          this.previewDialog.title = originalTitle
          console.error('下载失败:', error)
        }
      }
    },
    
    // 预览全屏图片
    previewFullscreen() {
      if (this.previewDialog.imageUrl) {
        uni.previewImage({
          urls: [this.previewDialog.imageUrl],
          current: this.previewDialog.imageUrl
        })
      }
    },
    onImageLoad() {
      this.previewDialog.loading = false
    },
    
    // 图片加载失败处理
    onImageError() {
      this.previewDialog.loading = false
    },
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
    },
    
    // 获取按钮样式类
    getButtonClass(order, buttonType) {
      // 获取所有可用的按钮类型
      const availableButtons = []
      if (order.hasStandard) availableButtons.push('standard')
      if (order.hasLayout) availableButtons.push('layout')
      if (order.hasReceipt) availableButtons.push('receipt')
      
      const totalButtons = availableButtons.length
      const currentIndex = availableButtons.indexOf(buttonType)
      
      // 只有一个按钮时
      if (totalButtons === 1) {
        return 'first last'
      }
      
      // 两个按钮时
      if (totalButtons === 2) {
        if (currentIndex === 0) {
          return 'first only-two'
        } else {
          return 'last only-two'
        }
      }
      
      // 三个按钮时
      if (totalButtons === 3) {
        if (currentIndex === 0) {
          return 'first'
        } else if (currentIndex === 1) {
          return 'middle'
        } else {
          return 'last'
        }
      }
      
      return ''
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

.reject-reason {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #f5222d;
}

.reason-label {
  color: #666;
}

.reason-value {
  margin-left: 8rpx;
}

.order-actions {
  margin-top: 20rpx;
  height: 80rpx;
  overflow: hidden;
}

.action-buttons {
  display: flex;
  height: 100%;
  box-sizing: border-box;
}

.action-buttons.single {
  justify-content: center;
  height: 100%;
}

.action-buttons.button-group {
  border-radius: 6rpx;
  overflow: hidden;
  border: 1rpx solid #dcdfe6;
  display: inline-flex;
  width: 100%;
  height: 100%;
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
  overflow: hidden;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.action-btn:active {
  transform: scale(0.98);
}



.consultation-wrapper,
.consultation-wrapper-single {
  position: relative;
  background: linear-gradient(135deg, #3d45e6 0%, #5b63f5 100%);
  color: white;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  overflow: hidden;
}

/* 原生联系客服按钮样式覆盖 */
.contact-button-native,
.contact-button-native-single {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.01; /* 几乎透明但保持可点击 */
}

.consultation-wrapper-single {
  margin: 0 auto;
  max-width: 300rpx;
  height: 80rpx;
  min-height: 80rpx;
  max-height: 80rpx;
  box-sizing: border-box;
  box-shadow: 0 6rpx 20rpx rgba(61, 69, 230, 0.3);
}

/* hover效果模拟 */
.consultation-wrapper:active {
  background: linear-gradient(135deg, #2f38d9 0%, #4a52e8 100%);
  transform: scale(0.98);
}

.consultation-wrapper-single:active {
  background: linear-gradient(135deg, #2f38d9 0%, #4a52e8 100%);
  transform: scale(0.98);
  box-shadow: 0 4rpx 16rpx rgba(61, 69, 230, 0.4);
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
  height: 100%;
  box-sizing: border-box;
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
  position: absolute;
  z-index: 999;
}

/* 允许点击穿透的文本样式 */
.btn-text-clickthrough {
  pointer-events: none;
  user-select: none;
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

/* 预览对话框样式 */
.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  box-sizing: border-box;
  backdrop-filter: blur(10rpx);
  animation: fadeIn 0.3s ease-out;
}

.preview-overlay.closing {
  animation: fadeOut 0.3s ease-out;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.preview-dialog.closing {
  animation: slideDown 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.preview-dialog {
  background: white;
  border-radius: 24rpx;
  width: 100%;
  max-width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
  position: relative;
}

@keyframes slideUp {
  from {
    transform: translateY(60rpx);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(60rpx);
    opacity: 0;
  }
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 30rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
}

.preview-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  letter-spacing: 1rpx;
}

.close-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:active {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(0.95);
}

.close-icon {
  font-size: 28rpx;
  color: #666;
  font-weight: 300;
}

.preview-content {
  padding: 30rpx;
  background: #fafafa;
}

.preview-image-container {
  width: 100%;
  height: 600rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background: linear-gradient(45deg, #f8f9fa 25%, transparent 25%), 
              linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #f8f9fa 75%), 
              linear-gradient(-45deg, transparent 75%, #f8f9fa 75%);
  background-size: 20rpx 20rpx;
  background-position: 0 0, 0 10rpx, 10rpx -10rpx, -10rpx 0rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: center;
  background: white;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  display: block;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 小程序环境下的图片显示优化 */
/* #ifdef MP-ALIPAY */
.preview-image {
  width: 100% !important;
  height: 100% !important;
}
/* #endif */

/* #ifdef MP-WEIXIN */
.preview-image {
  width: 100% !important;
  height: 100% !important;
}
/* #endif */

.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4rpx);
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #3d45e6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 24rpx;
  color: #999;
  font-weight: 500;
}

.zoom-tip {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
  background: rgba(0, 0, 0, 0.7);
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  backdrop-filter: blur(8rpx);
  opacity: 0.8;
  transition: opacity 0.3s ease;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 36rpx;
}

.zoom-text {
  font-size: 20rpx;
  color: white;
  font-weight: 400;
  text-align: center;
  line-height: 1;
  white-space: nowrap;
}

.preview-footer {
  padding: 30rpx;
  background: white;
}

.download-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #3d45e6 0%, #5b63f5 100%);
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  box-shadow: 0 12rpx 40rpx rgba(61, 69, 230, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.download-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.download-btn:active::before {
  left: 100%;
}

.download-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 8rpx 32rpx rgba(61, 69, 230, 0.4);
}

.download-icon {
  font-size: 32rpx;
  color: white;
  font-weight: bold;
  animation: bounce 2s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
}

/* 下载箭头图标 */
.download-arrow-icon {
  position: relative;
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.3));
}

.arrow-line {
  position: absolute;
  width: 3rpx;
  height: 20rpx;
  background: white;
  border-radius: 2rpx;
  top: 2rpx;
  left: 50%;
  transform: translateX(-50%);
}

.arrow-head {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 6rpx solid transparent;
  border-right: 6rpx solid transparent;
  border-top: 8rpx solid white;
  bottom: 2rpx;
  left: 50%;
  transform: translateX(-50%);
}

.arrow-base {
  position: absolute;
  width: 16rpx;
  height: 3rpx;
  background: white;
  border-radius: 2rpx;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

/* 成功图标 */
.success-icon {
  position: relative;
  width: 32rpx;
  height: 32rpx;
  border: 3rpx solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: success-scale 0.3s ease-out;
  filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.3));
  box-shadow: 0 0 0 2rpx rgba(255, 255, 255, 0.3);
}

@keyframes success-scale {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.check-mark {
  position: relative;
  width: 16rpx;
  height: 8rpx;
}

.check-mark::before,
.check-mark::after {
  content: '';
  position: absolute;
  background: white;
  border-radius: 2rpx;
}

.check-mark::before {
  width: 3rpx;
  height: 8rpx;
  left: 6rpx;
  top: 2rpx;
  transform: rotate(45deg);
}

.check-mark::after {
  width: 3rpx;
  height: 4rpx;
  left: 2rpx;
  top: 4rpx;
  transform: rotate(-45deg);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4rpx);
  }
  60% {
    transform: translateY(-2rpx);
  }
}

/* 下载按钮激活时的图标动画 */
.download-btn:active .download-arrow-icon {
  animation: download-press 0.2s ease-out;
}

@keyframes download-press {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

/* 下载箭头的脉冲动画 */
.download-arrow-icon .arrow-head {
  animation: arrow-pulse 1.5s ease-in-out infinite;
}

@keyframes arrow-pulse {
  0%, 100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  50% {
    opacity: 0.7;
    transform: translateX(-50%) translateY(2rpx);
  }
}

.download-btn.downloading {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  pointer-events: none;
}

.download-btn.success {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  animation: success-pulse 0.6s ease-out;
}

@keyframes success-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.downloading-spinner {
  width: 32rpx;
  height: 32rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.3);
  border-top: 3rpx solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.download-text {
  font-size: 30rpx;
  color: white;
  font-weight: 600;
  letter-spacing: 1rpx;
}
</style>
