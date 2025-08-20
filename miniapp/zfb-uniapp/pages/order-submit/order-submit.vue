<template>
  <view class="order-submit-page">
    <!-- 证件照预览 -->
    <view class="photo-preview">
      <view class="photo-container">
        <image :src="imagePath" class="photo-image" mode="aspectFit" />
        <view class="photo-badge">
          <text class="badge-text">{{ documentInfo.name }}</text>
          <text class="badge-desc">交易保障</text>
        </view>
      </view>
      
      <view class="photo-specs">
        <text class="spec-title">规格：{{ documentInfo.printSize }}</text>
        <text class="spec-detail">照片回执（含电子照）</text>
        <view class="price-container">
          <text class="price-symbol">¥</text>
        <text class="price-amount">{{ documentInfo.price.toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <!-- 办理城市 -->
    <view class="city-section">
      <view class="section-title">办理城市</view>
      <view class="city-display">
        <text class="city-text">{{ selectedCity || '未选择' }}</text>
      </view>
    </view>

    <!-- 订单备注 -->
    <view class="remark-section">
      <view class="section-title">订单备注</view>
      <textarea 
        class="remark-input" 
        v-model="orderRemark"
        placeholder="请输入特殊要求或备注信息"
        maxlength="200"
        auto-height
      />
      <view class="char-count">{{ orderRemark.length }}/200</view>
    </view>

    <!-- 服务保障 -->
    <view class="guarantee-section">
      <view class="guarantee-item">
        <view class="guarantee-icon">💯</view>
        <text class="guarantee-text">官方认可回执，最快3分钟出回执(3-30分钟)</text>
      </view>
      <view class="guarantee-item">
        <view class="guarantee-icon">💯</view>
        <text class="guarantee-text">交易成功后下载取，自行打印</text>
      </view>
      <view class="guarantee-item">
        <view class="guarantee-icon">💯</view>
        <text class="guarantee-text">有疑问请查看下单须知及联系客服</text>
      </view>
    </view>

    <!-- 证件照回执样本 -->
    <view class="sample-section">
      <view class="sample-preview">
        <image src="/static/demo/sample-receipt.png" class="sample-image" mode="aspectFit" />
      </view>
    </view>

    <!-- 合计金额 -->
    <view class="total-section">
      <view class="total-left">
        <text class="total-label">合计：</text>
        <text class="total-price">¥{{ documentInfo.price.toFixed(2) }}</text>
      </view>
      <view class="agreement-checkbox" @tap="toggleAgreement">
        <view class="checkbox" :class="{ checked: agreedToTerms }">
          <text class="check-mark" v-if="agreedToTerms">✓</text>
        </view>
        <text class="agreement-text">同意《隐私条款及服务协议》</text>
      </view>
    </view>

    <!-- 底部间距适配区域 -->
    <view class="bottom-spacer"></view>

    <!-- 底部提交按钮 -->
    <view class="bottom-submit">
      <view class="submit-btn" :class="{ disabled: !agreedToTerms }" @tap="submitOrder">
        <text class="submit-text">提交订单</text>
      </view>
    </view>
  </view>
</template>

<script>
import { createOrder, alipayNotifyTest, uploadImage } from '@/utils/api.js'

export default {
  name: 'OrderSubmit',
  data() {
    return {
      statusBarHeight: 0,
      imagePath: '',
      selectedCity: '',
      orderRemark: '',
      documentInfo: {
        name: '身份证',
        price: 25,
        specs: {
          printSize: '26x32mm',
          pixelSize: '358x441px',
          resolution: '300DPI'
        }
      },
      agreedToTerms: false
    }
  },
  
  onLoad(options) {
    // 获取系统信息
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight || 0
    
    // 获取传递的图片路径
    if (options.image) {
      this.imagePath = decodeURIComponent(options.image)
    }
    
    // 获取传递的城市信息
    if (options.city) {
      this.selectedCity = decodeURIComponent(options.city)
    }
    
    // 获取传递的文档信息
    if (options.document) {
      try {
        this.documentInfo = JSON.parse(decodeURIComponent(options.document))
      } catch (e) {
        console.error('解析文档数据失败:', e)
      }
    }
  },
  
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    toggleAgreement() {
      this.agreedToTerms = !this.agreedToTerms
    },
    
    submitOrder() {
      if (!this.agreedToTerms) {
        uni.showToast({
          title: '请先同意服务协议',
          icon: 'none'
        })
        return
      }

      const proceed = photoUrl => {
        const orderData = {
          document_name: this.documentInfo.name,
          location: this.selectedCity,
          amount: this.documentInfo.price,
          original_photo: photoUrl,
          certificate_snapshot: JSON.stringify(this.documentInfo)
        }

        createOrder(orderData)
          .then(res => {
            uni.hideLoading()
            const tradeNo = res.message.tradeNo
            const orderNo = res.message.orderNo
            if (res.__isDev__) {
              alipayNotifyTest({ out_trade_no: orderNo, trade_status: 'TRADE_SUCCESS' })
                .then(() => {
                  uni.showToast({ title: '支付成功', icon: 'success' })
                  uni.navigateBack({ delta: 1 })
                })
                .catch(() => {
                  uni.showToast({ title: '支付失败', icon: 'none' })
                })
            } else {
              my.tradePay({
                tradeNO: tradeNo,
                success: result => {
                  if (result.resultCode === '9000') {
                    uni.showToast({ title: '支付成功', icon: 'success' })
                    uni.navigateBack({ delta: 1 })
                  } else {
                    uni.showToast({ title: '支付失败', icon: 'none' })
                  }
                },
                fail: () => {
                  uni.showToast({ title: '支付失败', icon: 'none' })
                }
              })
            }
          })
          .catch(() => {
            uni.hideLoading()
            uni.showToast({ title: '订单创建失败', icon: 'none' })
          })
      }

      uni.showLoading({
        title: '提交中...'
      })

      if (this.imagePath.startsWith('https://resource/')) {
        uploadImage(this.imagePath)
          .then(file => proceed(file.url))
          .catch(() => {
            uni.hideLoading()
            uni.showToast({ title: '上传失败', icon: 'none' })
          })
      } else {
        proceed(this.imagePath)
      }
    }
  }
}
</script>

<style scoped>
.order-submit-page {
  background-color: #F5F5F5;
  min-height: 100vh;
}

/* 证件照预览 */
.photo-preview {
  background: #fff;
  padding: 32rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.photo-container {
  position: relative;
  width: 160rpx;
  height: 200rpx;
  border-radius: 12rpx;
  overflow: hidden;
  border: 2rpx solid #E0E0E0;
}

.photo-image {
  width: 100%;
  height: 100%;
}

.photo-badge {
  position: absolute;
  top: 8rpx;
  left: 8rpx;
  background: rgba(0, 0, 0, 0.7);
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
}

.badge-text {
  font-size: 20rpx;
  color: #fff;
  display: block;
}

.badge-desc {
  font-size: 16rpx;
  color: #4CAF50;
  display: block;
}

.photo-specs {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.spec-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}

.spec-detail {
  font-size: 28rpx;
  color: #666;
}

.price-container {
  display: flex;
  align-items: baseline;
  margin-top: 16rpx;
}

.price-symbol {
  font-size: 32rpx;
  color: #FF4444;
  font-weight: 600;
}

.price-amount {
  font-size: 48rpx;
  color: #FF4444;
  font-weight: 700;
}

/* 办理城市 */
.city-section {
  background: #fff;
  padding: 32rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 24rpx;
}

.city-display {
  padding: 24rpx;
  background: #F8F9FA;
  border-radius: 12rpx;
  border: 2rpx solid #E0E0E0;
}

.city-text {
  font-size: 28rpx;
  color: #333;
}

/* 订单备注 */
.remark-section {
  background: #fff;
  padding: 32rpx;
  margin-bottom: 20rpx;
}

.remark-input {
  width: 100%;
  min-height: 120rpx;
  padding: 24rpx;
  background: #F8F9FA;
  border-radius: 12rpx;
  border: 2rpx solid #E0E0E0;
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  box-sizing: border-box;
}

.char-count {
  text-align: right;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #999;
}

/* 服务保障 */
.guarantee-section {
  background: #fff;
  padding: 32rpx;
  margin-bottom: 20rpx;
}

.guarantee-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.guarantee-item:last-child {
  margin-bottom: 0;
}

.guarantee-icon {
  font-size: 32rpx;
  margin-top: 4rpx;
}

.guarantee-text {
  flex: 1;
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

/* 证件照回执样本 */
.sample-section {
  background: #fff;
  padding: 32rpx;
  margin-bottom: 20rpx;
}

.sample-preview {
  position: relative;
  border-radius: 12rpx;
  overflow: hidden;
  border: 2rpx solid #E0E0E0;
}

.sample-image {
  width: 100%;
  height: 400rpx;
}

/* 合计金额 */
.total-section {
  background: #fff;
  padding: 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.total-left {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.total-label {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}

.total-price {
  font-size: 40rpx;
  color: #FF4444;
  font-weight: 700;
}

.agreement-checkbox {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #E0E0E0;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.checkbox.checked {
  background: #6C5CE7;
  border-color: #6C5CE7;
}

.check-mark {
  font-size: 20rpx;
  color: #fff;
  font-weight: bold;
}

.agreement-text {
  font-size: 24rpx;
  color: #666;
}

/* 底部间距适配区域 */
.bottom-spacer {
  height: 152rpx;
}

/* 底部提交按钮 */
.bottom-submit {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 32rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.submit-btn {
  height: 88rpx;
  background: linear-gradient(135deg, #6C5CE7, #A855F7);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.submit-btn.disabled {
  background: #E0E0E0;
  opacity: 0.6;
}

.submit-btn:active:not(.disabled) {
  transform: scale(0.98);
}

.submit-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
}

.submit-btn.disabled .submit-text {
  color: #999;
}
</style>
