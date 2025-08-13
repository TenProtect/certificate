"use strict";
const common_vendor = require("../../common/vendor.js");
const ScrollBanner = () => "../../components/scroll-banner.js";
const _sfc_main = {
  components: {
    ScrollBanner
  },
  data() {
    return {
      currentInterval: 3e3,
      currentDirection: "horizontal",
      autoPlay: true,
      // 横幅广告图片
      bannerImages: [
        { src: "https://picsum.photos/800/300?random=1&text=双11购物节", alt: "双11购物节" },
        { src: "https://picsum.photos/800/300?random=2&text=618年中大促", alt: "618年中大促" },
        { src: "https://picsum.photos/800/300?random=3&text=黑五优惠", alt: "黑五优惠" }
      ],
      // 产品展示图片
      productImages: [
        { src: "https://picsum.photos/400/200?random=6", alt: "智能手机" },
        { src: "https://picsum.photos/400/200?random=7", alt: "笔记本电脑" },
        { src: "https://picsum.photos/400/200?random=8", alt: "智能手表" },
        { src: "https://picsum.photos/400/200?random=9", alt: "无线耳机" },
        { src: "https://picsum.photos/400/200?random=10", alt: "平板电脑" },
        { src: "https://picsum.photos/400/200?random=11", alt: "智能音箱" }
      ],
      // 新闻资讯图片
      newsImages: [
        { src: "https://picsum.photos/600/150?random=12", alt: "科技新闻1" },
        { src: "https://picsum.photos/600/150?random=13", alt: "科技新闻2" },
        { src: "https://picsum.photos/600/150?random=14", alt: "科技新闻3" },
        { src: "https://picsum.photos/600/150?random=15", alt: "科技新闻4" }
      ],
      // 全屏广告图片
      fullscreenImages: [
        { src: "https://picsum.photos/800/400?random=16&text=双11购物节", alt: "双11购物节" },
        { src: "https://picsum.photos/800/400?random=17&text=618年中大促", alt: "618年中大促" },
        { src: "https://picsum.photos/800/400?random=18&text=黑五优惠", alt: "黑五优惠" }
      ],
      // 受控制的图片
      controlledImages: [
        { src: "https://picsum.photos/700/250?random=19", alt: "动态展示1" },
        { src: "https://picsum.photos/700/250?random=20", alt: "动态展示2" },
        { src: "https://picsum.photos/700/250?random=21", alt: "动态展示3" },
        { src: "https://picsum.photos/700/250?random=22", alt: "动态展示4" }
      ]
    };
  },
  methods: {
    onIntervalChange(e) {
      this.currentInterval = e.detail.value;
    },
    toggleDirection() {
      this.currentDirection = this.currentDirection === "horizontal" ? "vertical" : "horizontal";
    },
    toggleAutoPlay() {
      this.autoPlay = !this.autoPlay;
    },
    onBannerChange(e) {
      common_vendor.index.__f__("log", "at pages/demo/demo.vue:193", "轮播切换:", e);
    },
    onBannerClick(e) {
      common_vendor.index.__f__("log", "at pages/demo/demo.vue:197", "点击轮播:", e);
      common_vendor.index.showToast({
        title: `点击了: ${e.item.alt}`,
        icon: "none"
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
    a: common_vendor.o($options.onBannerChange),
    b: common_vendor.o($options.onBannerClick),
    c: common_vendor.p({
      images: $data.bannerImages,
      direction: "horizontal",
      interval: 3e3,
      duration: 300,
      height: "180rpx",
      ["auto-play"]: true,
      draggable: true,
      ["show-indicators"]: true
    }),
    d: common_vendor.p({
      images: $data.newsImages,
      direction: "horizontal",
      interval: 1500,
      duration: 200,
      height: "120rpx",
      ["auto-play"]: true,
      draggable: true,
      ["show-indicators"]: false
    }),
    e: common_vendor.p({
      images: $data.productImages,
      direction: "vertical",
      interval: 4e3,
      duration: 400,
      height: "300rpx",
      ["auto-play"]: true,
      draggable: true,
      ["show-indicators"]: true
    }),
    f: common_vendor.p({
      images: $data.fullscreenImages,
      direction: "horizontal",
      interval: 5e3,
      duration: 500,
      height: "250rpx",
      ["auto-play"]: true,
      draggable: true,
      ["show-indicators"]: true
    }),
    g: common_vendor.t($data.currentInterval),
    h: $data.currentInterval,
    i: common_vendor.o((...args) => $options.onIntervalChange && $options.onIntervalChange(...args)),
    j: common_vendor.t($data.currentDirection === "horizontal" ? "切换到垂直" : "切换到水平"),
    k: common_vendor.o((...args) => $options.toggleDirection && $options.toggleDirection(...args)),
    l: common_vendor.t($data.autoPlay ? "暂停播放" : "开始播放"),
    m: common_vendor.o((...args) => $options.toggleAutoPlay && $options.toggleAutoPlay(...args)),
    n: common_vendor.p({
      images: $data.controlledImages,
      direction: $data.currentDirection,
      interval: $data.currentInterval,
      duration: 300,
      height: $data.currentDirection === "vertical" ? "250rpx" : "180rpx",
      ["auto-play"]: $data.autoPlay,
      ["show-indicators"]: true
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d10efb47"]]);
my.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-alipay/pages/demo/demo.js.map
