"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = {
  name: "ProfileContent",
  methods: {
    handleMenuTap(type) {
      switch (type) {
        case "guide":
          common_vendor.index.navigateTo({
            url: "/pages/photo-guide/photo-guide"
          });
          break;
        case "notice":
          common_vendor.index.navigateTo({
            url: "/pages/order-guide/order-guide"
          });
          break;
        case "share":
          common_vendor.index.showShareMenu({
            success: () => {
              common_vendor.index.__f__("log", "at pages/main/components/profile-content.vue:82", "分享成功");
            },
            fail: () => {
              common_vendor.index.showToast({
                title: "分享功能暂不可用",
                icon: "none"
              });
            }
          });
          break;
        default:
          common_vendor.index.__f__("log", "at pages/main/components/profile-content.vue:93", "未知操作:", type);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$4,
    b: common_vendor.o(($event) => $options.handleMenuTap("guide")),
    c: common_vendor.o(($event) => $options.handleMenuTap("notice")),
    d: common_vendor.o(($event) => $options.handleMenuTap("share"))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6ec24300"]]);
my.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-alipay/pages/main/components/profile-content.js.map
