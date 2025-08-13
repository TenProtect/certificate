"use strict";
const common_vendor = require("../../common/vendor.js");
const ScrollBanner = () => "../../components/scroll-banner.js";
const _sfc_main = {
  name: "PhotoDetail",
  components: {
    ScrollBanner
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
          resolution: "300DPI",
          saveElectronicPhoto: true,
          printLayout: true,
          bgColor: "#FFFFFF",
          imageFormat: "无要求",
          imageFileSize: "无要求",
          requirements: "免冠，照片可看见两耳轮廓和相当于男士喉结处的地方"
        }
      },
      guideImages: [
        {
          src: "/static/detail-guide/P1.png",
          alt: "拍摄指引1"
        },
        {
          src: "/static/detail-guide/P2.png",
          alt: "拍摄指引2"
        },
        {
          src: "/static/detail-guide/P3.png",
          alt: "拍摄指引3"
        },
        {
          src: "/static/detail-guide/P4.png",
          alt: "拍摄指引4"
        }
      ]
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
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/photo-detail/photo-detail.vue:195", "解析文档数据失败:", e);
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
          common_vendor.index.__f__("log", "at pages/photo-detail/photo-detail.vue:210", "选择的图片:", res.tempFilePaths[0]);
          common_vendor.index.showToast({
            title: "图片选择成功",
            icon: "success"
          });
        }
      });
    },
    takePhoto() {
      const documentData = encodeURIComponent(JSON.stringify(this.documentInfo));
      const cityData = encodeURIComponent(this.currentCity);
      common_vendor.index.navigateTo({
        url: `/pages/camera-capture/camera-capture?data=${documentData}&city=${cityData}`
      });
    }
  }
};
if (!Array) {
  const _component_scroll_banner = common_vendor.resolveComponent("scroll-banner");
  _component_scroll_banner();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      images: $data.guideImages,
      direction: "horizontal",
      interval: 3e3,
      duration: 300,
      height: "296rpx",
      ["auto-play"]: true,
      draggable: true,
      ["image-align"]: "top",
      ["show-indicators"]: false
    }),
    b: common_vendor.t($data.documentInfo.name),
    c: common_vendor.t($data.documentInfo.specs.printSize),
    d: common_vendor.t($data.documentInfo.specs.pixelSize),
    e: common_vendor.t($data.documentInfo.specs.resolution),
    f: common_vendor.t($data.documentInfo.specs.imageFormat),
    g: common_vendor.t($data.documentInfo.specs.imageFileSize),
    h: common_vendor.t($data.documentInfo.specs.requirements),
    i: common_vendor.o((...args) => $options.selectFromAlbum && $options.selectFromAlbum(...args)),
    j: common_vendor.o((...args) => $options.takePhoto && $options.takePhoto(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d60a3ea4"]]);
my.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-alipay/pages/photo-detail/photo-detail.js.map
