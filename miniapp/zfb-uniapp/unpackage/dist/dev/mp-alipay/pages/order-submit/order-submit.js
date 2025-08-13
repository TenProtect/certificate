"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  name: "OrderSubmit",
  data() {
    return {
      statusBarHeight: 0,
      imagePath: "",
      selectedCity: "",
      orderRemark: "",
      documentInfo: {
        name: "身份证",
        specs: {
          printSize: "26x32mm",
          pixelSize: "358x441px",
          resolution: "300DPI"
        }
      },
      agreedToTerms: false
    };
  },
  onLoad(options) {
    const systemInfo = common_vendor.index.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 0;
    if (options.image) {
      this.imagePath = decodeURIComponent(options.image);
    }
    if (options.city) {
      this.selectedCity = decodeURIComponent(options.city);
    }
    if (options.document) {
      try {
        this.documentInfo = JSON.parse(decodeURIComponent(options.document));
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/order-submit/order-submit.vue:134", "解析文档数据失败:", e);
      }
    }
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    toggleAgreement() {
      this.agreedToTerms = !this.agreedToTerms;
    },
    submitOrder() {
      if (!this.agreedToTerms) {
        common_vendor.index.showToast({
          title: "请先同意服务协议",
          icon: "none"
        });
        return;
      }
      const orderData = {
        image: this.imagePath,
        document: this.documentInfo,
        city: this.selectedCity,
        remark: this.orderRemark,
        agreedToTerms: this.agreedToTerms
      };
      common_vendor.index.__f__("log", "at pages/order-submit/order-submit.vue:166", "提交订单数据:", orderData);
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "订单提交成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack({
            delta: 3
            // 返回到首页
          });
        }, 1500);
      }, 2e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.imagePath,
    b: common_vendor.t($data.documentInfo.name),
    c: common_vendor.t($data.documentInfo.specs.printSize),
    d: common_vendor.t($data.selectedCity || "未选择"),
    e: $data.orderRemark,
    f: common_vendor.o(($event) => $data.orderRemark = $event.detail.value),
    g: common_vendor.t($data.orderRemark.length),
    h: common_assets._imports_0$2,
    i: $data.agreedToTerms
  }, $data.agreedToTerms ? {} : {}, {
    j: $data.agreedToTerms ? 1 : "",
    k: common_vendor.o((...args) => $options.toggleAgreement && $options.toggleAgreement(...args)),
    l: !$data.agreedToTerms ? 1 : "",
    m: common_vendor.o((...args) => $options.submitOrder && $options.submitOrder(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-cb69f009"]]);
my.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-alipay/pages/order-submit/order-submit.js.map
