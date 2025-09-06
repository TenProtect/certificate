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
    <view class="city-section" v-if="documentInfo.needCardNo">
      <view class="city-row">
        <text class="section-title">身份证号码</text>
        <view class="city-input-container">
          <input
            class="city-input"
            v-model="cardNo"
            placeholder="请输入照片本人身份证号码"
            type="text"
            maxlength="18"
          />
        </view>
      </view>
    </view>

    <view class="city-section" v-if="shouldShowCityAndSample">
      <view class="city-row">
        <text class="section-title">办理城市</text>
        <view class="city-input-container">
          <input 
            class="city-input" 
            v-model="selectedCity"
            placeholder="请输入办理城市"
            type="text"
            maxlength="20"
          />
        </view>
      </view>
    </view>

    <!-- 订单备注 -->
    <view class="remark-section">
      <view class="section-title">订单备注</view>
      <view class="input-container">
        <textarea 
          class="remark-input" 
          v-model="orderRemark"
          placeholder="请备注办理城市，云南地区港澳通行证及护照请备注身份证号码和姓名"
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
    <view class="sample-section" v-if="shouldShowCityAndSample">
        <image src="/static/demo/sample-receipt.jpg" class="sample-image" mode="aspectFit" />
    </view>

    <!-- 底部间距适配区域 -->
    <view class="bottom-spacer"></view>

    <!-- 照片类型选择弹窗 -->
    <view class="modal-overlay" v-if="showPhotoTypeModal" @tap="hidePhotoTypeModal">
      <view class="photo-type-modal" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">请选择照片类型</text>
        </view>
        
        <view class="photo-type-options">
          <view 
            class="photo-type-option" 
            :class="{ selected: selectedPhotoType === 0 }"
            @tap="selectPhotoType(0)"
          >
            <view class="option-content">
              <text class="option-title">电子照</text>
              <text class="option-desc">数字版本，可用于线上申请</text>
            </view>
            <view class="option-radio" :class="{ checked: selectedPhotoType === 0 }">
              <view class="radio-inner" v-if="selectedPhotoType === 0"></view>
            </view>
          </view>
          
          <view 
            class="photo-type-option" 
            :class="{ selected: selectedPhotoType === 1 }"
            @tap="selectPhotoType(1)"
          >
            <view class="option-content">
              <text class="option-title">冲印照</text>
              <text class="option-desc">实体照片，可用于线下提交</text>
            </view>
            <view class="option-radio" :class="{ checked: selectedPhotoType === 1 }">
              <view class="radio-inner" v-if="selectedPhotoType === 1"></view>
            </view>
          </view>
        </view>
        
        <view class="modal-actions">
          <view class="modal-btn cancel-btn" @tap="hidePhotoTypeModal">
            <text class="btn-text">取消</text>
          </view>
          <view 
            class="modal-btn confirm-btn" 
            :class="{ disabled: selectedPhotoType === null }"
            @tap="confirmPhotoType"
          >
            <text class="btn-text">确认</text>
          </view>
        </view>
      </view>
    </view>

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
      cardNo: '',
      orderRemark: '',
      documentInfo: {
        name: '身份证',
        price: 25,
        category: '回执',
        specs: {
          printSize: '26x32mm',
          pixelSize: '358x441px',
          resolution: '300DPI'
        },
        needCardNo: false
      },
      agreedToTerms: false,
      showPhotoTypeModal: false, // 显示照片类型选择弹窗
      selectedPhotoType: null // 选择的照片类型：0-电子照，1-冲印照
    }
  },
  
  computed: {
    // 判断是否需要显示办理城市和回执样本（签证、寸照、证照、考试类别不显示）
    shouldShowCityAndSample() {
      const hiddenCategories = ['签证', '寸照', '证照', '考试'];
      return !hiddenCategories.includes(this.documentInfo.category);
    },
    // 判断是否需要显示照片类型选择（签证、寸照、证照、考试类别需要选择）
    needPhotoTypeSelection() {
      const needSelectionCategories = ['签证', '寸照', '证照', '考试'];
      return needSelectionCategories.includes(this.documentInfo.category);
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

      if (this.documentInfo.needCardNo) {
        const idPattern = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
        if (!idPattern.test(this.cardNo)) {
          uni.showToast({
            title: '请输入正确的身份证号码',
            icon: 'none'
          })
          return
        }
      }

      // 只有需要显示城市的类别才验证城市输入
      if (this.shouldShowCityAndSample && (!this.selectedCity || this.selectedCity.trim() === '')) {
        uni.showToast({
          title: '请输入办理城市',
          icon: 'none'
        })
        return
      }

      // 如果需要选择照片类型，先显示选择弹窗
      if (this.needPhotoTypeSelection) {
        this.showPhotoTypeModal = true
        return
      }

      // 直接提交订单（不需要选择照片类型的情况）
      this.proceedWithOrder()
    },

    // 处理照片类型选择
    selectPhotoType(type) {
      this.selectedPhotoType = type
    },

    // 隐藏照片类型选择弹窗
    hidePhotoTypeModal() {
      this.showPhotoTypeModal = false
      this.selectedPhotoType = null
    },

    // 确认照片类型选择
    confirmPhotoType() {
      if (this.selectedPhotoType === null) {
        uni.showToast({
          title: '请选择照片类型',
          icon: 'none'
        })
        return
      }
      
      this.showPhotoTypeModal = false
      this.proceedWithOrder()
    },

    // 继续订单提交流程
    proceedWithOrder() {

      const proceed = photoUrl => {
        const orderData = {
          document_name: this.documentInfo.name,
          location: this.selectedCity,
          remark: this.orderRemark,
          amount: this.documentInfo.price,
          original_photo: photoUrl,
          certificate_snapshot: JSON.stringify(this.documentInfo)
        }
        
        // 添加照片类型字段（仅对需要选择的类别）
        if (this.needPhotoTypeSelection && this.selectedPhotoType !== null) {
          orderData.require_type = this.selectedPhotoType
        }
        
        if (this.documentInfo.needCardNo) {
          orderData.card_no = this.cardNo
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
}

.city-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.city-input-container {
  flex: 1;
  position: relative;
}

.city-input {
  width: 100%;
  height: 70rpx;
  padding: 16rpx;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12rpx;
  border: 2rpx solid transparent;
  font-size: 26rpx;
  color: #2c3e50;
  line-height: 1.5;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.city-input:focus {
  border-color: #3498db;
  background: #ffffff;
  box-shadow: 0 0 0 4rpx rgba(52, 152, 219, 0.1);
  outline: none;
}

.city-input::placeholder {
  color: #95a5a6;
  font-size: 24rpx;
}

.section-title {
  font-size: 30rpx;
  color: #2c3e50;
  font-weight: 600;
  min-width: 120rpx;
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
  height: 110rpx;
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
  padding: 2rpx;
  transition: all 0.3s ease;
}

.guarantee-item:last-child {
  margin-bottom: 0;
}

.guarantee-icon {
  font-size: 24rpx;
  margin-top: 2rpx;
  filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.1));
}

.guarantee-text {
  flex: 1;
  font-size: 20rpx;
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

/* 照片类型选择弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4rpx);
}

.photo-type-modal {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 32rpx 32rpx 0 0;
  width: 100%;
  max-width: 750rpx;
  padding: 32rpx 24rpx 40rpx;
  box-shadow: 0 -12rpx 48rpx rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  text-align: center;
  margin-bottom: 32rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #2c3e50;
}

.photo-type-options {
  margin-bottom: 32rpx;
}

.photo-type-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 20rpx;
  margin-bottom: 16rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.photo-type-option.selected {
  background: linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%);
  border-color: #3498db;
  box-shadow: 0 4rpx 16rpx rgba(52, 152, 219, 0.2);
}

.photo-type-option:active {
  transform: scale(0.98);
}

.option-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.option-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #2c3e50;
}

.option-desc {
  font-size: 24rpx;
  color: #7f8c8d;
  line-height: 1.4;
}

.option-radio {
  width: 40rpx;
  height: 40rpx;
  border: 3rpx solid #bdc3c7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.option-radio.checked {
  border-color: #3498db;
  background: #3498db;
  transform: scale(1.1);
}

.radio-inner {
  width: 16rpx;
  height: 16rpx;
  background: #fff;
  border-radius: 50%;
  transform: scale(0);
  animation: radioCheck 0.2s ease-out forwards;
}

@keyframes radioCheck {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.modal-actions {
  display: flex;
  gap: 20rpx;
  justify-content: space-between;
}

.modal-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.modal-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.modal-btn:active:not(.disabled) {
  transform: scale(0.95);
}

.modal-btn:active:not(.disabled)::before {
  left: 100%;
}

.cancel-btn {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2rpx solid #dee2e6;
}

.cancel-btn .btn-text {
  color: #6c757d;
  font-weight: 500;
}

.confirm-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
}

.confirm-btn.disabled {
  background: linear-gradient(135deg, #bdc3c7, #95a5a6);
  box-shadow: 0 4rpx 12rpx rgba(149, 165, 166, 0.3);
  opacity: 0.7;
}

.confirm-btn .btn-text {
  color: #fff;
  font-weight: 600;
}

.confirm-btn.disabled .btn-text {
  color: #ecf0f1;
}

.btn-text {
  font-size: 28rpx;
  letter-spacing: 1rpx;
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
