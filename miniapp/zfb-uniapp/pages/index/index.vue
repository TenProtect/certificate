<template>
	<view class="content">
		<view class="header">
			<text class="title">滚动播放组件演示</text>
		</view>

		<!-- 全屏轮播 -->
		<view class="demo-section">
			<scroll-banner :images="demoImages" direction="horizontal" :interval="3000" :duration="300" height="400rpx"
				:auto-play="autoPlayEnabled" :draggable="true" :show-indicators="true" @change="onBannerChange" />
		</view>

		<!-- 控制按钮 -->
		<view class="control-section">
			<button @click="toggleAutoPlay" class="control-btn">
				{{ autoPlayEnabled ? '暂停自动播放' : '开始自动播放' }}
			</button>
			<button @click="goToDemo" class="control-btn demo-btn">
				查看高级演示
			</button>
		</view>
	</view>
</template>

<script>
import ScrollBanner from '@/components/scroll-banner.vue'

export default {
	components: {
		ScrollBanner
	},
	data() {
		return {
			autoPlayEnabled: true,
			demoImages: [
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
			]
		}
	},
	onLoad() {

	},
	methods: {
		toggleAutoPlay() {
			this.autoPlayEnabled = !this.autoPlayEnabled
		},
		goToDemo() {
			uni.navigateTo({
				url: '/pages/demo/demo'
			})
		},
		onBannerChange(e) {
			// 提取事件 payload: 小程序平台自定义组件事件可能在 e.detail.value[0]
			let payload = {}
			if (e.detail) {
				const { value, current, item, detail: innerDetail } = e.detail
				if (Array.isArray(value) && value.length > 0) {
					payload = value[0]
				} else if (current !== undefined) {
					payload = { current, item }
				} else if (innerDetail && typeof innerDetail === 'object') {
					payload = innerDetail
				}
			} else {
				payload = e
			}
			const currentIndex = payload.current
			const altText = (payload.item && payload.item.alt) || '无'
			console.log('轮播切换到:', currentIndex, altText)
		}
	}
}
</script>

<style>
.content {
	padding: 20rpx;
	background-color: #f8f8f8;
	min-height: 100vh;
}

.header {
	text-align: center;
	margin-bottom: 40rpx;
	padding: 20rpx 0;
}

.title {
	font-size: 42rpx;
	color: #333;
	font-weight: bold;
}

.demo-section {
	margin-bottom: 40rpx;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.section-title {
	display: block;
	font-size: 28rpx;
	color: #666;
	margin-bottom: 20rpx;
	font-weight: 500;
}

.control-section {
	text-align: center;
	margin-top: 40rpx;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.control-btn {
	background-color: #007aff;
	color: white;
	border: none;
	border-radius: 8rpx;
	padding: 20rpx 40rpx;
	font-size: 28rpx;
	margin: 0 auto;
	width: 300rpx;
}

.control-btn:active {
	background-color: #0056b3;
}

.demo-btn {
	background-color: #34c759;
}

.demo-btn:active {
	background-color: #28a745;
}
</style>
