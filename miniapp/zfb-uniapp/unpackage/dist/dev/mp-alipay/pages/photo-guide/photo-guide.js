"use strict";
const common_vendor = require("../../common/vendor.js");
const ScrollBanner = () => "../../components/scroll-banner.js";
const _sfc_main = {
  name: "PhotoGuide",
  components: {
    ScrollBanner
  },
  data() {
    return {
      currentStep: 1,
      guideImages: [
        "/static/guide/step1.png",
        "/static/guide/step2.png",
        "/static/guide/step3.png",
        "/static/guide/step4.png"
      ],
      stepInfoList: [
        {
          title: "请优先使用后置摄像头拍摄",
          description: "使用后置摄像头可以获得更好的拍摄效果和清晰度"
        },
        {
          title: "拍摄时正对镜头，对齐参考线",
          description: "保持头部正直，眼睛平视镜头，按照参考线调整位置"
        },
        {
          title: "请选择纯色墙面做背景，避免光源不均",
          description: "选择简洁的纯色背景，确保光线均匀，避免阴影"
        },
        {
          title: "注意背景不要与衣服同色",
          description: "背景与服装颜色形成对比，确保人像轮廓清晰"
        }
      ]
    };
  },
  computed: {
    currentStepInfo() {
      return this.stepInfoList[this.currentStep - 1] || this.stepInfoList[0];
    }
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    onImageChange(e) {
      this.currentStep = e.current + 1;
    },
    onImageClick(e) {
      common_vendor.index.__f__("log", "at pages/photo-guide/photo-guide.vue:86", "点击了步骤图片:", e);
    },
    startPhoto() {
      common_vendor.index.showToast({
        title: "准备开始拍摄",
        icon: "success"
      });
    },
    skipGuide() {
      this.startPhoto();
    }
  }
};
if (!Array) {
  const _component_scroll_banner = common_vendor.resolveComponent("scroll-banner");
  _component_scroll_banner();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.onImageChange),
    b: common_vendor.o($options.onImageClick),
    c: common_vendor.p({
      images: $data.guideImages,
      height: 850,
      ["auto-play"]: false,
      loop: false,
      ["show-indicators"]: true,
      direction: "horizontal"
    }),
    d: common_vendor.t($data.currentStep),
    e: common_vendor.t($options.currentStepInfo.title),
    f: common_vendor.t($options.currentStepInfo.description),
    g: common_vendor.o((...args) => $options.startPhoto && $options.startPhoto(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8a3b14cf"]]);
my.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-alipay/pages/photo-guide/photo-guide.js.map
