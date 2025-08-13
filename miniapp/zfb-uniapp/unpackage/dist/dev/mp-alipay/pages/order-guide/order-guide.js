"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "OrderGuide",
  data() {
    return {
      customerServicePhone: "18565104903"
      // 客服热线号码，请替换为实际号码
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    // 拨打客服热线
    callCustomerService() {
      my.makePhoneCall({
        number: this.customerServicePhone,
        success: () => {
          common_vendor.index.__f__("log", "at pages/order-guide/order-guide.vue:170", "调用拨打电话成功");
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/order-guide/order-guide.vue:173", "调用拨打电话失败:", error);
          my.showToast({
            content: "无法拨打电话，请手动拨打：" + this.customerServicePhone,
            type: "none",
            duration: 3e3
          });
        }
      });
    },
    // 在线咨询
    showOnlineService() {
      my.showToast({
        content: "在线咨询功能开发中",
        type: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.callCustomerService && $options.callCustomerService(...args)),
    b: common_vendor.o((...args) => $options.showOnlineService && $options.showOnlineService(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f372c316"]]);
my.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-alipay/pages/order-guide/order-guide.js.map
