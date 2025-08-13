"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_tabbarManager = require("./utils/tabbar-manager.js");
if (!Math) {
  "./pages/main/main.js";
  "./pages/search/search.js";
  "./pages/city-selector/city-selector.js";
  "./pages/photo-detail/photo-detail.js";
  "./pages/index/index.js";
  "./pages/demo/demo.js";
  "./pages/photo-guide/photo-guide.js";
  "./pages/order-guide/order-guide.js";
  "./pages/camera-capture/camera-capture.js";
  "./pages/photo-preview/photo-preview.js";
  "./pages/order-submit/order-submit.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:6", "App Launch");
    utils_tabbarManager.TabBarManager.initTabBar();
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:11", "App Show");
    utils_tabbarManager.TabBarManager.onPageSwitch();
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:16", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-alipay/app.js.map
