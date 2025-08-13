"use strict";
const common_vendor = require("../common/vendor.js");
const TabBarManager = {
  // 隐藏原生TabBar
  hideNativeTabBar() {
    try {
      common_vendor.index.hideTabBar({
        animation: false,
        success: () => {
          common_vendor.index.__f__("log", "at utils/tabbar-manager.js:9", "原生TabBar隐藏成功");
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at utils/tabbar-manager.js:12", "隐藏原生TabBar失败:", err);
        }
      });
    } catch (e) {
      common_vendor.index.__f__("log", "at utils/tabbar-manager.js:16", "hideTabBar调用异常:", e);
    }
  },
  // 初始化TabBar（在App.vue中调用）
  initTabBar() {
    setTimeout(() => {
      this.hideNativeTabBar();
    }, 100);
  },
  // 页面切换时的TabBar处理
  onPageSwitch() {
    this.hideNativeTabBar();
  }
};
exports.TabBarManager = TabBarManager;
//# sourceMappingURL=../../.sourcemap/mp-alipay/utils/tabbar-manager.js.map
