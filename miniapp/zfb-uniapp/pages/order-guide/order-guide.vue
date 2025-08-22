<template>
    <view class="order-guide-page">
        <!-- 内容区域 -->
        <scroll-view scroll-y class="content-container">
            <!-- FAQ列表 -->
            <view class="faq-list">
                <!-- 问题1 -->
                <view class="faq-item">
                    <view class="question">
                        <text class="question-number">一、</text>
                        <text class="question-text">如何正确的拍摄证件照？</text>
                    </view>
                    <view class="answer">
                        <text class="answer-text">
                            背靠纯色或不复杂的背景墙，拍摄环境光线均匀，面部正对光源，不要刚好在灯底下拍摄（头部会曝光过度），手机或相机和头部平行保持30cm的距离，眼睛平视正前方，头摆正，双肩并齐，头发不遮挡肩耳和耳朵，不要佩戴眼镜和饰品。露出胸部以上完整的肩膀。
                        </text>
                    </view>
                </view>

                <!-- 问题2 -->
                <view class="faq-item">
                    <view class="question">
                        <text class="question-number">二、</text>
                        <text class="question-text">如何获取照片回执？</text>
                    </view>
                    <view class="answer">
                        <text class="answer-text">
                            下单后，收到处理成功消息后，订单页会出现保存回执按钮，点击保存，然后一定要允许小程序访问相册（否则将无法保存回执），可以在手机相册里看到回执单的图片。
                        </text>
                    </view>
                </view>

                <!-- 问题3 -->
                <view class="faq-item">
                    <view class="question">
                        <text class="question-number">三、</text>
                        <text class="question-text">回执单是否需要打印？</text>
                    </view>
                    <view class="answer">
                        <text class="answer-text">具体要看办证件的方式。</text>
                        <text class="answer-text">
                            例如：办理身份证，如果是全程线上办理的方式，只需要保存回执单上的图像号码即可；如果是线下自助机或者办证窗口办理，建议打印纸质的回执单，普通的A4纸黑白打印即可。
                        </text>
                    </view>
                </view>

                <!-- 问题4 -->
                <view class="faq-item">
                    <view class="question">
                        <text class="question-number">四、</text>
                        <text class="question-text">办理照片回执需要多久？</text>
                    </view>
                    <view class="answer">
                        <text class="answer-text">官方出具回执的时间为：8：00-23：00</text>
                        <text class="answer-text">
                            在这个时间段的订单，最快三分钟，常规时间10-30分钟；若是在非该时间段的订单（这个时间段任何平台都无法出具回执），需要等到次日早晨8:00开始处理。
                        </text>
                    </view>
                </view>

                <!-- 问题5 -->
                <view class="faq-item">
                    <view class="question">
                        <text class="question-number">五、</text>
                        <text class="question-text">客服上班时间？</text>
                    </view>
                    <view class="answer">
                        <text class="answer-text">8：00-23：00</text>
                    </view>
                </view>

                <!-- 问题6 -->
                <view class="faq-item">
                    <view class="question">
                        <text class="question-number">六、</text>
                        <text class="question-text">收到我们驳回重拍的消息，还需要再付费吗？</text>
                    </view>
                    <view class="answer">
                        <text class="answer-text">
                            不需要。在订单页有重新拍摄按钮，可以重新拍摄或者相册上传，不需要再支付费用。
                        </text>
                    </view>
                </view>

                <!-- 问题7 -->
                <view class="faq-item">
                    <view class="question">
                        <text class="question-number">七、</text>
                        <text class="question-text">下错订单可以退还吗？</text>
                    </view>
                    <view class="answer">
                        <text class="answer-text">
                            例如：需要办理身份证回执，下了居住证的订单；在没有出具回执单前，可联系客服登记更换回执类型；如果回执已经处理成功，则不可退换。
                        </text>
                    </view>
                </view>

                <!-- 问题8 -->
                <view class="faq-item">
                    <view class="question">
                        <text class="question-number">八、</text>
                        <text class="question-text">回执单出具完成后，还可以退款吗？</text>
                    </view>
                    <view class="answer">
                        <text
                            class="answer-text">回执属于即时生效产品，并且具有个体独立性（只能本人使用），一经出具无法撤回、无法更换、无法进行二次销售，本平台不支持无理由退款。</text>
                        <text
                            class="answer-text">温馨提示1：本平台仅对上传的相片，根据国家法律进行比对得出相片的质量要求进行检测，检测合格后提供办理回执。如您使用非近期相片、非本人相片、化妆及美颜过度等原因导致办证被拒，本平台将不支持退款。</text>
                        <text
                            class="answer-text">温馨提示2：本平台仅提供您的照片的对应照片回执，若因本人办证事宜不符（某些带照片的证，不符合户籍条件等）、未能严格确认回执用途及类型的相关说明、未订购相应类型的回执等，导致无法使用，均不支持退款。</text>
                        <text
                            class="answer-text">温馨提示3：出视频回执后，如因客服无法获取视频信息等原因，可以找到回执的官方客服电话，根据像素编号电话、或者联系客服发起客服的协助处理，换成视频回执。需要以此单在平台上提交后才能换取回执类型，未出具的不支持退款。</text>
                        <text
                            class="answer-text">温馨提示4：客服下班时间（23：00-次日8：00）下的订单，若在官方系统未出具回执时间（23：00-次日8：00）联系客服更换类型，不支持退款。修改或更换申请，可在上班时间联系客服提供订单号登记退或更换类型。</text>
                    </view>
                </view>

                <!-- 问题9 -->
                <view class="faq-item">
                    <view class="question">
                        <text class="question-number">九、</text>
                        <text class="question-text">寸照订单支持退款吗？</text>
                    </view>
                    <view class="answer">
                        <text class="answer-text">
                            不支持。寸照都有预览效果，以及相关的参数展示，一经生成，不支持退款。
                        </text>
                    </view>
                </view>
            </view>

            <!-- 客服联系区域 -->
            <view class="customer-service">
                <view class="service-time">
                    <text class="service-text">客服服务时间 8：00-23：00</text>
                </view>
                <view class="service-buttons">
                    <view class="service-btn hotline-btn" @tap="callCustomerService">
                        <text class="btn-text">客服热线</text>
                    </view>
                    <view class="service-btn online-btn consultation-wrapper">
                        <text class="btn-text btn-text-clickthrough">在线咨询</text>
                        <contact-button
                            class="contact-button-native"
                            size="default"
                            color="#1677ff"
                            icon="/static/customer-service.png"
                            :tnt-inst-id="contactConfig.tntInstId"
                            :scene="contactConfig.scene"
                        >
                        </contact-button>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
import contactConfig from '@/config.js'
export default {
    name: 'OrderGuide',
    data() {
        return {
            customerServicePhone: '18565104903', // 客服热线号码，请替换为实际号码
            contactConfig
        }
    },
    methods: {
        goBack() {
            uni.navigateBack()
        },

        // 拨打客服热线
        callCustomerService() {
            // 支付宝小程序调用拨打电话功能
            my.makePhoneCall({
                number: this.customerServicePhone,
                success: () => {
                    console.log('调用拨打电话成功')
                },
                fail: (error) => {
                    console.error('调用拨打电话失败:', error)
                    my.showToast({
                        content: '无法拨打电话，请手动拨打：' + this.customerServicePhone,
                        type: 'none',
                        duration: 3000
                    })
                }
            })
        },

        // 在线咨询
        showOnlineService() {
            // 注意：使用原生 contact-button 组件时，此方法不再需要
            // 原生组件会自动处理联系客服的逻辑
            uni.showToast({
                title: '正在为您联系客服...',
                icon: 'none'
            })
        }
    }
}
</script>

<style scoped>
.order-guide-page {
    height: 100vh;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
}

/* 导航栏 */
.nav-header {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    background: white;
    border-bottom: 1rpx solid #e5e5e5;
    position: relative;
}

.nav-back {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.back-icon {
    font-size: 40rpx;
    color: #333;
    font-weight: 300;
}

.nav-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
}

/* 内容区域 */
.content-container {
    flex: 1;
    padding: 20rpx;
}

.faq-list {
    background: white;
    border-radius: 20rpx;
    padding: 40rpx 30rpx;
    margin-bottom: 30rpx;
}

.faq-item {
    margin-bottom: 50rpx;
}

.faq-item:last-child {
    margin-bottom: 0;
}

.question {
    display: flex;
    margin-bottom: 20rpx;
}

.question-number {
    color: #1677ff;
    font-size: 28rpx;
    font-weight: 600;
    margin-right: 10rpx;
}

.question-text {
    color: #333;
    font-size: 28rpx;
    font-weight: 600;
    flex: 1;
}

.answer {
    padding-left: 30rpx;
}

.answer-text {
    color: #666;
    font-size: 26rpx;
    line-height: 1.6;
    display: block;
    margin-bottom: 15rpx;
}

.answer-text:last-child {
    margin-bottom: 0;
}

/* 客服区域 */
.customer-service {
    background: white;
    border-radius: 20rpx;
    padding: 40rpx 30rpx;
    text-align: center;
}

.service-time {
    margin-bottom: 30rpx;
}

.service-text {
    color: #666;
    font-size: 24rpx;
    line-height: 1.5;
}

.service-buttons {
    display: flex;
    gap: 20rpx;
    justify-content: center;
}

.service-btn {
    flex: 1;
    height: 80rpx;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.hotline-btn {
    background: #f0f0f0;
    border: 1rpx solid #d9d9d9;
}

.hotline-btn:active {
    background: #e6e6e6;
}

.consultation-wrapper {
    position: relative;
    overflow: hidden;
}

.online-btn {
    background: #1677ff;
}

.online-btn:active {
    background: #0958d9;
}

/* 原生联系客服按钮样式覆盖 */
.contact-button-native {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0.01; /* 几乎透明但保持可点击 */
    border-radius: 40rpx;
}

/* hover效果模拟 */
.consultation-wrapper:active {
    background: #0958d9;
    transform: scale(0.98);
}

.btn-text {
    font-size: 28rpx;
    font-weight: 500;
    position: absolute;
    z-index: 999;
}

/* 允许点击穿透的文本样式 */
.btn-text-clickthrough {
    pointer-events: none;
    user-select: none;
}

.hotline-btn .btn-text {
    color: #333;
}

.online-btn .btn-text {
    color: white;
}

/* 滚动条样式 */
::-webkit-scrollbar {
    width: 0;
    background: transparent;
}
</style>
