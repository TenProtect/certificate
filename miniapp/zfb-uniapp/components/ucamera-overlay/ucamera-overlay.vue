<template>
  <view class="ucam-root">
    <camera
      id="ucam"
      class="ucam-camera"
      :device-position="currentDevice"
      flash="off"
      mode="normal"
      resolution="high"
      frame-size="small"
      @ready="onCamReady"
    ></camera>

    <!-- 支付宝小程序：用原生 canvas 作为相机上的可覆盖层 -->
    <!-- #ifdef MP-ALIPAY -->
    <canvas
      class="ucam-overlay"
      :canvas-id="canvasId"
      :id="canvasId"
    ></canvas>

    <!-- 将按钮放在 cover-view（可盖在 canvas 上） -->
    <cover-view class="ucam-hud" v-if="showControls">
      <cover-view class="ucam-tips" v-if="tips">{{ tips }}</cover-view>
      <cover-view class="ucam-btns">
        <cover-view class="ucam-btn" @tap="onShutter">拍照</cover-view>
        <cover-view class="ucam-btn" @tap="toggleDevice">前/后</cover-view>
        <cover-view class="ucam-btn" @tap="zoomIn">放大</cover-view>
      </cover-view>
    </cover-view>
    <!-- #endif -->

    <!-- 其它端给出提示 -->
    <!-- #ifndef MP-ALIPAY -->
    <view class="ucam-notice">此组件的 HUD 仅在支付宝小程序端启用</view>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  name: 'UCameraOverlay',
  props: {
    devicePosition: { type: String, default: 'front' }, // 'front' | 'back'
    showGuides: { type: Boolean, default: true },
    showControls: { type: Boolean, default: true },
    tips: { type: String, default: '请对齐人像轮廓' },
    guideColor: { type: String, default: 'rgba(0,200,255,0.9)' },
    crosshairColor: { type: String, default: 'rgba(255,255,255,0.6)' },
    guideLineWidth: { type: Number, default: 4 },
    autoPreview: { type: Boolean, default: false } // 是否拍照后自动预览
  },
  data() {
    return {
      canvasId: 'overlay-' + this._uid,
      currentDevice: this.devicePosition,
      cameraCtx: null,
      frameListener: null,
      zoom: 1
    }
  },
  watch: {
    devicePosition(nv) {
      this.currentDevice = nv
    }
  },
  mounted() {},
  beforeDestroy() {
    try { this.frameListener && this.frameListener.stop && this.frameListener.stop() } catch(e){}
  },
  methods: {
    onCamReady() {
      // 仅在支付宝端相机 ready 后创建上下文
      // #ifdef MP-ALIPAY
      try {
        this.cameraCtx = my.createCameraContext('ucam')
      } catch(e) {
        // 可能是非支付宝端或开发者工具不支持
      }
      this.$nextTick(() => {
        if (this.showGuides) this.drawGuides()
        this.startFrameLowFreq()
      })
      // #endif
    },
    drawGuides() {
      // 使用 2D Canvas API 兼容写法（uni.createCanvasContext）
      const ctx = uni.createCanvasContext(this.canvasId, this)
      const query = uni.createSelectorQuery().in(this)
      query.select('#' + this.canvasId).boundingClientRect()
      query.exec(res => {
        const rect = res && res[0]
        if (!rect) return
        const w = rect.width, h = rect.height
        ctx.clearRect(0, 0, w, h)

        // 人像头部椭圆（用缩放画圆近似）
        const cx = w / 2, cy = h * 0.45
        const rx = w * 0.18, ry = h * 0.14
        ctx.save()
        ctx.translate(cx, cy - h * 0.08)
        ctx.scale(rx, ry)
        ctx.setStrokeStyle(this.guideColor)
        ctx.setLineWidth(this.guideLineWidth)
        ctx.beginPath()
        ctx.arc(0, 0, 1, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()

        // 肩部弧线
        ctx.setStrokeStyle(this.guideColor)
        ctx.setLineWidth(this.guideLineWidth)
        ctx.beginPath()
        ctx.moveTo(cx - w * 0.28, cy + h * 0.05)
        ctx.bezierCurveTo(cx - w * 0.12, cy + h * 0.18, cx + w * 0.12, cy + h * 0.18, cx + w * 0.28, cy + h * 0.05)
        ctx.stroke()

        // 准星
        ctx.setStrokeStyle(this.crosshairColor)
        ctx.setLineWidth(1)
        ctx.beginPath(); ctx.moveTo(cx - 20, cy); ctx.lineTo(cx + 20, cy); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(cx, cy - 20); ctx.lineTo(cx, cy + 20); ctx.stroke()

        ctx.draw()
      })
    },
    startFrameLowFreq() {
      // 可选：低频取帧，避免掉帧
      // #ifdef MP-ALIPAY
      if (!this.cameraCtx || !this.cameraCtx.onCameraFrame) return
      this.frameListener = this.cameraCtx.onCameraFrame((frame) => {
        // 这里保留扩展点：可做亮度/人脸位置轻量分析（建议节流）
      })
      try { this.frameListener.start({ interval: 'low' }) } catch(e){}
      // #endif
    },
    onShutter() {
      // #ifdef MP-ALIPAY
      if (!this.cameraCtx || !this.cameraCtx.takePhoto) {
        uni.showToast({ title: '不支持拍照', icon: 'none' })
        return
      }
      this.cameraCtx.takePhoto({
        quality: 'high',
        success: (res) => {
          // res.tempImagePath
          this.$emit('capture', res.tempImagePath)
          
          // 根据 autoPreview 属性决定是否自动预览
          if (this.autoPreview) {
            uni.previewImage({ urls: [res.tempImagePath] })
          }
        },
        fail: () => { uni.showToast({ title: '拍照失败', icon: 'none' }) }
      })
      // #endif
    },
    toggleDevice() {
      const next = this.currentDevice === 'front' ? 'back' : 'front'
      this.currentDevice = next
      this.$emit('update:devicePosition', next)
      // 重新绘制引导（尺寸不变无需重画，但为保险保留）
      this.$nextTick(() => this.drawGuides())
    },
    zoomIn() {
      this.zoom = Math.min(this.zoom + 0.2, 5)
      // #ifdef MP-ALIPAY
      if (this.cameraCtx && this.cameraCtx.setZoom) {
        this.cameraCtx.setZoom({ zoom: this.zoom })
      } else {
        uni.showToast({ title: '端上不支持变焦', icon: 'none' })
      }
      // #endif
    }
  }
}
</script>

<style scoped>
.ucam-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}
.ucam-camera {
  position: absolute;
  left: 0; right: 0; top: 0; bottom: 0;
  height: 100vh;
}
.ucam-overlay {
  position: absolute;
  left: 0; right: 0; top: 0; bottom: 0;
}
.ucam-hud {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  padding: 24rpx;
  display: flex; flex-direction: column; gap: 16rpx;
}
.ucam-tips {
  align-self: center;
  background: rgba(0,0,0,0.4);
  color: #fff;
  padding: 8rpx 16rpx;
  border-radius: 9999rpx;
  font-size: 28rpx;
}
.ucam-btns {
  display: flex;
  justify-content: center;
  gap: 24rpx;
}
.ucam-btn {
  background: rgba(0,0,0,0.55);
  color: #fff;
  padding: 16rpx 28rpx;
  border-radius: 9999rpx;
  font-size: 30rpx;
}
.ucam-notice {
  position: absolute; left: 12rpx; right: 12rpx; bottom: 12rpx;
  color: #fff; opacity: 0.8; text-align: center;
}
</style>
