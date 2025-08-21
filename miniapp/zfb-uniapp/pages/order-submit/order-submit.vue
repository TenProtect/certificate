<template>
  <view class="order-submit-page">
    <!-- 证件照预览 -->
    <view class="photo-preview">
      <view class="photo-container">
        <image :src="imagePath" class="photo-image" mode="aspectFit" />
        <view class="photo-badge">
          <text class="badge-desc">交易保障</text>
        </view>
      </view>
      
      <view class="photo-specs">
        <text class="document-name">{{ documentInfo.name }}</text>
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
      <text class="section-title">办理城市</text>
      <text class="city-text">{{ selectedCity || '请输入办理城市' }}</text>
    </view>

    <!-- 订单备注 -->
    <view class="remark-section">
      <view class="section-title">订单备注</view>
      <view class="input-container">
        <textarea 
          class="remark-input" 
          v-model="orderRemark"
          placeholder="请输入特殊要求或备注信息"
          maxlength="200"
          :auto-height="false"
          :show-count="false"
        />
        <view class="char-count">{{ orderRemark.length }}/200</view>
      </view>
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
        <image src="/static/demo/sample-receipt.jpg" class="sample-image" mode="aspectFit" />
    </view>

    <!-- 底部间距适配区域 -->
    <view class="bottom-spacer"></view>

    <!-- 合计金额与提交按钮 -->
    <view class="bottom-action">
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
      
      <view class="submit-btn" :class="{ disabled: !agreedToTerms }" @tap="submitOrder">
        <text class="submit-text">提交订单</text>
      </view>
    </view>
  </view>
</template>

<script>
import { createOrder, alipayNotifyTest, uploadImage, detectContent } from '@/utils/api.js'

export default {
  name: 'OrderSubmit',
  data() {
    return {
      statusBarHeight: 0,
      imagePath: '', // 用于显示的处理后图片路径
      originalImagePath: '', // 用于提交订单的原始图片路径
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
  
  async onLoad(options) {
    // 显示加载状态
    uni.showLoading({
      title: '检测图片合法性',
      mask: true
    })
    
    try {
      // 获取系统信息
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight || 0
      
      // 获取传递的图片路径
      if (options.image) {
        // 直接使用传递过来的处理后图片路径用于显示
        this.imagePath = decodeURIComponent(options.image)
      }
      
      // 获取原始图片路径用于提交订单
      if (options.originalImage) {
        this.originalImagePath = decodeURIComponent(options.originalImage)
      } else {
        // 如果没有传递原始路径，则使用显示路径作为原始路径
        this.originalImagePath = this.imagePath
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
    } catch (error) {
      console.error('页面初始化失败:', error)
      uni.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    } finally {
      // 隐藏加载状态
      uni.hideLoading()
    }
  },
  
  methods: {
    async processImagePath(imagePath) {
      if (!imagePath) return ''
      
      try {
        // #ifdef MP-ALIPAY
        const imageInfo = await new Promise((resolve, reject) => {
          my.getImageInfo({
            src: imagePath,
            success: resolve,
            fail: reject
          })
        })
        // 使用 getImageInfo 返回的路径，确保图片能正常显示
        return imageInfo.path || imageInfo.src || imagePath
        // #endif
        
        // #ifndef MP-ALIPAY
        const imageInfo = await new Promise((resolve, reject) => {
          uni.getImageInfo({
            src: imagePath,
            success: resolve,
            fail: reject
          })
        })
        return imageInfo.path || imagePath
        // #endif
      } catch (error) {
        console.warn('获取图片信息失败，使用原始路径:', error)
        return imagePath
      }
    },

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
          remark: this.orderRemark,
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

      const checkAndProceed = async photoUrl => {
        try {
          if (this.orderRemark) {
            const textRes = await detectContent({ content_type: 'TEXT', data: this.orderRemark })
            if (!textRes.message.pass) {
              uni.hideLoading()
              uni.showToast({ title: '您的输入不合规', icon: 'none' })
              return
            }
          }
          const imgRes = await detectContent({ content_type: 'PICTURE', data: photoUrl })
          if (!imgRes.message.pass) {
            uni.hideLoading()
            uni.showToast({ title: '您上传的图片不合规', icon: 'none' })
            return
          }
          proceed(photoUrl)
        } catch (e) {
          uni.hideLoading()
          uni.showToast({ title: '检测失败', icon: 'none' })
        }
      }

      uni.showLoading({
        title: '提交中...'
      })

      if (this.originalImagePath.startsWith('https://resource/')) {
        uploadImage(this.originalImagePath)
          .then(file => checkAndProceed(file.url))
          .catch(() => {
            uni.hideLoading()
            uni.showToast({ title: '上传失败', icon: 'none' })
          })
      } else {
        checkAndProceed(this.originalImagePath)
      }
    }
  }
}
</script>

<style scoped>
.order-submit-page {
  background-color: #F5F5F5;
  min-height: 100vh;
  padding: 16rpx;
  box-sizing: border-box;
}

/* 证件照预览 */
.photo-preview {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  padding: 24rpx;
  margin-bottom: 16rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.photo-container {
  position: relative;
  width: 120rpx;
  height: 150rpx;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.photo-image {
  width: 100%;
  height: 100%;
}

.photo-badge {
  position: absolute;
  top: 6rpx;
  left: 6rpx;
  background: rgba(0, 0, 0, 0.2);
  padding: 6rpx 10rpx;
  border-radius: 10rpx;
  backdrop-filter: blur(10rpx);
}

.badge-text {
  font-size: 20rpx;
  color: #fff;
  display: block;
  font-weight: 500;
}

.badge-desc {
  font-size: 16rpx;
  color: #4CAF50;
  display: block;
  font-weight: 400;
}

.photo-specs {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.document-name {
  font-size: 28rpx;
  color: #2c3e50;
  font-weight: 900;
}

.spec-title {
  font-size: 26rpx;
  color: #2c3e50;
  font-weight: 600;
}

.spec-detail {
  font-size: 22rpx;
  color: #7f8c8d;
  font-weight: 400;
}

.price-container {
  display: flex;
  align-items: baseline;
  margin-top: 1rpx;
}

.price-symbol {
  font-size: 24rpx;
  color: #e74c3c;
  font-weight: 600;
}

.price-amount {
  font-size: 36rpx;
  color: #e74c3c;
  font-weight: 700;
}

/* 办理城市 */
.city-section {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  padding: 24rpx;
  margin-bottom: 16rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 30rpx;
  color: #2c3e50;
  font-weight: 600;
}

.city-text {
  font-size: 26rpx;
  color: #3498db;
  font-weight: 500;
}

/* 订单备注 */
.remark-section {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  padding: 24rpx;
  margin-bottom: 16rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.input-container {
  position: relative;
  margin-top: 16rpx;
}

.remark-input {
  width: 100%;
  height: 80rpx;
  padding: 16rpx 100rpx 16rpx 16rpx;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12rpx;
  border: 2rpx solid transparent;
  font-size: 26rpx;
  color: #2c3e50;
  line-height: 1.5;
  box-sizing: border-box;
  transition: all 0.3s ease;
  resize: none;
}

.remark-input:focus {
  border-color: #3498db;
  background: #ffffff;
  box-shadow: 0 0 0 4rpx rgba(52, 152, 219, 0.1);
  outline: none;
}

.remark-input::placeholder {
  color: #95a5a6;
  font-size: 24rpx;
}

.char-count {
  position: absolute;
  bottom: 12rpx;
  right: 16rpx;
  font-size: 22rpx;
  color: #95a5a6;
  background: rgba(255, 255, 255, 0.8);
  padding: 4rpx 8rpx;
  border-radius: 6rpx;
  backdrop-filter: blur(14rpx);
  transition: all 0.3s ease;
}

.input-container:focus-within .char-count {
  color: #3498db;
}

/* 服务保障 */
.guarantee-section {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  padding: 24rpx;
  margin-bottom: 16rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.guarantee-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 10rpx;
  padding: 12rpx;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 10rpx;
  transition: all 0.3s ease;
}

.guarantee-item:last-child {
  margin-bottom: 0;
}

.guarantee-item:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.guarantee-icon {
  font-size: 28rpx;
  margin-top: 2rpx;
  filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.1));
}

.guarantee-text {
  flex: 1;
  font-size: 24rpx;
  color: #34495e;
  line-height: 1.5;
  font-weight: 400;
}

/* 证件照回执样本 */
.sample-section {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  margin-bottom: 16rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  padding: 20rpx;
  overflow: hidden;
}

.sample-image {
  width: 100%;
  display: block;
  border-radius: 12rpx;
}

/* 底部间距适配区域 */
.bottom-spacer {
  height: 160rpx;
}

/* 底部操作区域 */
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 16rpx;
  right: 16rpx;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  padding: 20rpx;
  border-radius: 24rpx 24rpx 0 0;
  box-shadow: 0 -8rpx 32rpx rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  gap: 20rpx;
  backdrop-filter: blur(20rpx);
}

/* 合计金额 */
.total-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.total-left {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.total-label {
  font-size: 28rpx;
  color: #2c3e50;
  font-weight: 600;
}

.total-price {
  font-size: 36rpx;
  color: #e74c3c;
  font-weight: 700;
}

.agreement-checkbox {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 8rpx;
  border-radius: 8rpx;
  transition: all 0.3s ease;
}

.agreement-checkbox:active {
  background: rgba(52, 152, 219, 0.1);
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 3rpx solid #bdc3c7;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.checkbox::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate(-50%, -50%);
}

.checkbox.checked {
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-color: #3498db;
  transform: scale(1.1);
}

.checkbox.checked::before {
  width: 100%;
  height: 100%;
  border-radius: 6rpx;
}

.check-mark {
  font-size: 20rpx;
  color: #fff;
  font-weight: bold;
  z-index: 1;
  position: relative;
}

.agreement-text {
  font-size: 22rpx;
  color: #34495e;
  font-weight: 400;
}

/* 提交按钮 */
.submit-btn {
  width: 220rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.submit-btn:active:not(.disabled) {
  transform: scale(0.95);
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
}

.submit-btn:active:not(.disabled)::before {
  left: 100%;
}

.submit-btn.disabled {
  background: linear-gradient(135deg, #bdc3c7, #95a5a6);
  box-shadow: 0 4rpx 12rpx rgba(149, 165, 166, 0.3);
  opacity: 0.7;
}

.submit-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 600;
  letter-spacing: 1rpx;
}

.submit-btn.disabled .submit-text {
  color: #ecf0f1;
}

/* 响应式设计 */
@media screen and (max-height: 667px) {
  .remark-input {
    height: 100rpx;
  }
  
  .bottom-spacer {
    height: 140rpx;
  }
}

@media screen and (max-height: 568px) {
  .photo-preview {
    padding: 20rpx;
  }
  
  .remark-input {
    height: 80rpx;
  }
  
  .guarantee-item {
    margin-bottom: 16rpx;
    padding: 10rpx;
  }
  
  .bottom-spacer {
    height: 120rpx;
  }
}

@media screen and (min-height: 812px) {
  .remark-input {
    height: 140rpx;
  }
  
  .bottom-spacer {
    height: 180rpx;
  }
}
</style>
