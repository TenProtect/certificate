"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "UCameraOverlay",
  props: {
    devicePosition: { type: String, default: "front" },
    // 'front' | 'back'
    showGuides: { type: Boolean, default: true },
    showControls: { type: Boolean, default: true },
    tips: { type: String, default: "请对齐人像轮廓" },
    guideColor: { type: String, default: "rgba(0,200,255,0.9)" },
    crosshairColor: { type: String, default: "rgba(255,255,255,0.6)" },
    guideLineWidth: { type: Number, default: 4 }
  },
  data() {
    return {
      canvasId: "overlay-" + this._uid,
      currentDevice: this.devicePosition,
      cameraCtx: null,
      frameListener: null,
      zoom: 1
    };
  },
  watch: {
    devicePosition(nv) {
      this.currentDevice = nv;
    }
  },
  mounted() {
  },
  beforeDestroy() {
    try {
      this.frameListener && this.frameListener.stop && this.frameListener.stop();
    } catch (e) {
    }
  },
  methods: {
    onCamReady() {
      try {
        this.cameraCtx = my.createCameraContext("ucam");
      } catch (e) {
      }
      this.$nextTick(() => {
        if (this.showGuides)
          this.drawGuides();
        this.startFrameLowFreq();
      });
    },
    drawGuides() {
      const ctx = common_vendor.index.createCanvasContext(this.canvasId, this);
      const query = common_vendor.index.createSelectorQuery().in(this);
      query.select("#" + this.canvasId).boundingClientRect();
      query.exec((res) => {
        const rect = res && res[0];
        if (!rect)
          return;
        const w = rect.width, h = rect.height;
        ctx.clearRect(0, 0, w, h);
        const cx = w / 2, cy = h * 0.45;
        const rx = w * 0.18, ry = h * 0.14;
        ctx.save();
        ctx.translate(cx, cy - h * 0.08);
        ctx.scale(rx, ry);
        ctx.setStrokeStyle(this.guideColor);
        ctx.setLineWidth(this.guideLineWidth);
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        ctx.setStrokeStyle(this.guideColor);
        ctx.setLineWidth(this.guideLineWidth);
        ctx.beginPath();
        ctx.moveTo(cx - w * 0.28, cy + h * 0.05);
        ctx.bezierCurveTo(cx - w * 0.12, cy + h * 0.18, cx + w * 0.12, cy + h * 0.18, cx + w * 0.28, cy + h * 0.05);
        ctx.stroke();
        ctx.setStrokeStyle(this.crosshairColor);
        ctx.setLineWidth(1);
        ctx.beginPath();
        ctx.moveTo(cx - 20, cy);
        ctx.lineTo(cx + 20, cy);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, cy - 20);
        ctx.lineTo(cx, cy + 20);
        ctx.stroke();
        ctx.draw();
      });
    },
    startFrameLowFreq() {
      if (!this.cameraCtx || !this.cameraCtx.onCameraFrame)
        return;
      this.frameListener = this.cameraCtx.onCameraFrame((frame) => {
      });
      try {
        this.frameListener.start({ interval: "low" });
      } catch (e) {
      }
    },
    onShutter() {
      if (!this.cameraCtx || !this.cameraCtx.takePhoto) {
        common_vendor.index.showToast({ title: "不支持拍照", icon: "none" });
        return;
      }
      this.cameraCtx.takePhoto({
        quality: "high",
        success: (res) => {
          this.$emit("capture", res.tempImagePath);
          common_vendor.index.previewImage({ urls: [res.tempImagePath] });
        },
        fail: () => {
          common_vendor.index.showToast({ title: "拍照失败", icon: "none" });
        }
      });
    },
    toggleDevice() {
      const next = this.currentDevice === "front" ? "back" : "front";
      this.currentDevice = next;
      this.$emit("update:devicePosition", next);
      this.$nextTick(() => this.drawGuides());
    },
    zoomIn() {
      this.zoom = Math.min(this.zoom + 0.2, 5);
      if (this.cameraCtx && this.cameraCtx.setZoom) {
        this.cameraCtx.setZoom({ zoom: this.zoom });
      } else {
        common_vendor.index.showToast({ title: "端上不支持变焦", icon: "none" });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.currentDevice,
    b: common_vendor.o((...args) => $options.onCamReady && $options.onCamReady(...args)),
    c: $data.canvasId,
    d: $data.canvasId,
    e: $props.showControls
  }, $props.showControls ? common_vendor.e({
    f: $props.tips
  }, $props.tips ? {
    g: common_vendor.t($props.tips)
  } : {}, {
    h: common_vendor.o((...args) => $options.onShutter && $options.onShutter(...args)),
    i: common_vendor.o((...args) => $options.toggleDevice && $options.toggleDevice(...args)),
    j: common_vendor.o((...args) => $options.zoomIn && $options.zoomIn(...args))
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-74b31db0"]]);
my.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-alipay/components/ucamera-overlay/ucamera-overlay.js.map
