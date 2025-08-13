"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const UCameraOverlay = () => "../../components/ucamera-overlay/ucamera-overlay.js";
const _sfc_main = {
  name: "CameraCapture",
  components: {
    UCameraOverlay
  },
  data() {
    return {
      statusBarHeight: 0,
      currentCity: "",
      documentInfo: {
        name: "身份证",
        specs: {
          printSize: "26x32mm",
          pixelSize: "358x441px",
          resolution: "300DPI"
        }
      },
      // 相机设置
      cameraDevice: "front",
      cameraTips: "请将脸部对准中央区域",
      // UI状态
      isProcessing: false,
      isRotating: false
    };
  },
  onLoad(options) {
    const systemInfo = common_vendor.index.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 0;
    if (options.city) {
      this.currentCity = decodeURIComponent(options.city);
    }
    if (options.data) {
      try {
        this.documentInfo = JSON.parse(decodeURIComponent(options.data));
        this.cameraTips = `请将脸部对准引导区域`;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/camera-capture/camera-capture.vue:99", "解析文档数据失败:", e);
      }
    }
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    selectFromAlbum() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original"],
        sourceType: ["album"],
        success: (res) => {
          this.processPhoto(res.tempFilePaths[0], "album");
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      });
    },
    capturePhoto() {
      if (this.$refs.ucameraRef && this.$refs.ucameraRef.onShutter) {
        this.$refs.ucameraRef.onShutter();
      } else {
        this.fallbackCapture();
      }
    },
    fallbackCapture() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original"],
        sourceType: ["camera"],
        success: (res) => {
          this.processPhoto(res.tempFilePaths[0], "camera");
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "拍照失败",
            icon: "none"
          });
        }
      });
    },
    toggleCamera() {
      this.isRotating = true;
      const newDevice = this.cameraDevice === "front" ? "back" : "front";
      this.cameraDevice = newDevice;
      this.$emit("update:devicePosition", newDevice);
      common_vendor.index.showToast({
        title: newDevice === "front" ? "切换到前置摄像头" : "切换到后置摄像头",
        icon: "none",
        duration: 1e3
      });
      setTimeout(() => {
        this.isRotating = false;
      }, 300);
    },
    onPhotoCapture(imagePath) {
      this.processPhoto(imagePath, "ucamera");
    },
    onDeviceChange(device) {
      this.cameraDevice = device;
    },
    processPhoto(imagePath, source) {
      this.isProcessing = true;
      common_vendor.index.__f__("log", "at pages/camera-capture/camera-capture.vue:195", "处理图片:", imagePath, "来源:", source);
      setTimeout(() => {
        this.isProcessing = false;
        const imageData = encodeURIComponent(imagePath);
        const documentData = encodeURIComponent(JSON.stringify(this.documentInfo));
        const cityData = encodeURIComponent(this.currentCity);
        common_vendor.index.navigateTo({
          url: `/pages/photo-preview/photo-preview?image=${imageData}&document=${documentData}&city=${cityData}`
        });
      }, 1e3);
    }
  }
};
if (!Array) {
  const _component_UCameraOverlay = common_vendor.resolveComponent("UCameraOverlay");
  _component_UCameraOverlay();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.onPhotoCapture),
    b: common_vendor.o($options.onDeviceChange),
    c: common_vendor.p({
      devicePosition: $data.cameraDevice,
      showGuides: false,
      showControls: false,
      tips: ""
    }),
    d: common_assets._imports_0$1,
    e: common_vendor.o((...args) => $options.capturePhoto && $options.capturePhoto(...args)),
    f: common_assets._imports_1,
    g: $data.isRotating ? 1 : "",
    h: common_vendor.o((...args) => $options.toggleCamera && $options.toggleCamera(...args)),
    i: $data.isProcessing
  }, $data.isProcessing ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4e369d13"]]);
my.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-alipay/pages/camera-capture/camera-capture.js.map
