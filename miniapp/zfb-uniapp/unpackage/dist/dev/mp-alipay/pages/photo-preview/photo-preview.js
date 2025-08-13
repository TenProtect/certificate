"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "PhotoPreview",
  data() {
    return {
      statusBarHeight: 0,
      imagePath: "",
      currentCity: "",
      documentInfo: {
        name: "身份证",
        specs: {
          printSize: "26x32mm",
          pixelSize: "358x441px",
          resolution: "300DPI"
        }
      }
    };
  },
  onLoad(options) {
    const systemInfo = common_vendor.index.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 0;
    if (options.image) {
      this.imagePath = decodeURIComponent(options.image);
    }
    if (options.city) {
      this.currentCity = decodeURIComponent(options.city);
    }
    if (options.document) {
      try {
        this.documentInfo = JSON.parse(decodeURIComponent(options.document));
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/photo-preview/photo-preview.vue:96", "解析文档数据失败:", e);
      }
    }
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    retakePhoto() {
      common_vendor.index.navigateBack();
    },
    onImageLoad() {
      common_vendor.index.__f__("log", "at pages/photo-preview/photo-preview.vue:111", "图片加载成功");
    },
    onImageError() {
      common_vendor.index.showToast({
        title: "图片加载失败",
        icon: "none"
      });
    },
    submitOrder() {
      const imageData = encodeURIComponent(this.imagePath);
      const documentData = encodeURIComponent(JSON.stringify(this.documentInfo));
      const cityData = encodeURIComponent(this.currentCity);
      common_vendor.index.navigateTo({
        url: `/pages/order-submit/order-submit?image=${imageData}&document=${documentData}&city=${cityData}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.imagePath,
    b: common_vendor.o((...args) => $options.onImageLoad && $options.onImageLoad(...args)),
    c: common_vendor.o((...args) => $options.onImageError && $options.onImageError(...args)),
    d: common_vendor.t($data.documentInfo.name),
    e: common_vendor.t($data.documentInfo.specs.pixelSize),
    f: common_vendor.t($data.documentInfo.specs.resolution),
    g: common_vendor.t($data.documentInfo.name),
    h: common_vendor.t($data.documentInfo.specs.pixelSize),
    i: common_vendor.t($data.documentInfo.specs.resolution),
    j: common_vendor.o((...args) => $options.retakePhoto && $options.retakePhoto(...args)),
    k: common_vendor.o((...args) => $options.submitOrder && $options.submitOrder(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-58145b37"]]);
my.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-alipay/pages/photo-preview/photo-preview.js.map
