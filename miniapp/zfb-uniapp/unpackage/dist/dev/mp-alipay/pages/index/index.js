"use strict";
const common_vendor = require("../../common/vendor.js");
const ScrollBanner = () => "../../components/scroll-banner.js";
const _sfc_main = {
  components: {
    ScrollBanner
  },
  data() {
    return {
      autoPlayEnabled: true,
      demoImages: [
        {
          src: "/static/banner/banner1.png",
          alt: "演示图片1"
        },
        {
          src: "/static/banner/banner2.png",
          alt: "演示图片2"
        },
        {
          src: "/static/banner/banner3.png",
          alt: "演示图片3"
        }
      ]
    };
  },
  onLoad() {
  },
  methods: {
    toggleAutoPlay() {
      this.autoPlayEnabled = !this.autoPlayEnabled;
    },
    goToDemo() {
      common_vendor.index.navigateTo({
        url: "/pages/demo/demo"
      });
    },
    onBannerChange(e) {
      let payload = {};
      if (e.detail) {
        const { value, current, item, detail: innerDetail } = e.detail;
        if (Array.isArray(value) && value.length > 0) {
          payload = value[0];
        } else if (current !== void 0) {
          payload = { current, item };
        } else if (innerDetail && typeof innerDetail === "object") {
          payload = innerDetail;
        }
      } else {
        payload = e;
      }
      const currentIndex = payload.current;
      const altText = payload.item && payload.item.alt || "无";
      common_vendor.index.__f__("log", "at pages/index/index.vue:80", "轮播切换到:", currentIndex, altText);
    }
  }
};
if (!Array) {
  const _component_scroll_banner = common_vendor.resolveComponent("scroll-banner");
  _component_scroll_banner();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.onBannerChange),
    b: common_vendor.p({
      images: $data.demoImages,
      direction: "horizontal",
      interval: 3e3,
      duration: 300,
      height: "400rpx",
      ["auto-play"]: $data.autoPlayEnabled,
      draggable: true,
      ["show-indicators"]: true
    }),
    c: common_vendor.t($data.autoPlayEnabled ? "暂停自动播放" : "开始自动播放"),
    d: common_vendor.o((...args) => $options.toggleAutoPlay && $options.toggleAutoPlay(...args)),
    e: common_vendor.o((...args) => $options.goToDemo && $options.goToDemo(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
my.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-alipay/pages/index/index.js.map
