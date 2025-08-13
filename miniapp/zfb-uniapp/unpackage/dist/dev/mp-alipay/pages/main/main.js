"use strict";
const common_vendor = require("../../common/vendor.js");
const HomePage = () => "./components/home-content.js";
const OrderPage = () => "./components/order-content.js";
const ProfilePage = () => "./components/profile-content.js";
const CustomTabbar = () => "../../components/custom-tabbar/custom-tabbar.js";
const _sfc_main = {
  name: "MainContainer",
  components: {
    HomePage,
    OrderPage,
    ProfilePage,
    CustomTabbar
  },
  data() {
    return {
      currentTab: 0
    };
  },
  onLoad(options) {
    if (options.tab) {
      this.currentTab = parseInt(options.tab) || 0;
    }
    common_vendor.index.__f__("log", "at pages/main/main.vue:58", "主容器加载完成，当前tab:", this.currentTab);
  },
  onShow() {
    common_vendor.index.hideTabBar({
      animation: false
    });
  },
  methods: {
    handleTabChange(tabIndex) {
      if (this.currentTab === tabIndex)
        return;
      common_vendor.index.__f__("log", "at pages/main/main.vue:70", "切换到tab:", tabIndex);
      this.currentTab = tabIndex;
      common_vendor.index.vibrateShort({
        type: "light"
      });
      this.triggerPageAnimation(tabIndex);
    },
    triggerPageAnimation(tabIndex) {
      const pages = ["首页", "订单", "我的"];
      common_vendor.index.__f__("log", "at pages/main/main.vue:85", `切换到${pages[tabIndex]}`);
    }
  }
};
if (!Array) {
  const _component_home_page = common_vendor.resolveComponent("home-page");
  const _component_order_page = common_vendor.resolveComponent("order-page");
  const _component_profile_page = common_vendor.resolveComponent("profile-page");
  const _easycom_custom_tabbar2 = common_vendor.resolveComponent("custom-tabbar");
  (_component_home_page + _component_order_page + _component_profile_page + _easycom_custom_tabbar2)();
}
const _easycom_custom_tabbar = () => "../../components/custom-tabbar/custom-tabbar.js";
if (!Math) {
  _easycom_custom_tabbar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.currentTab === 0
  }, $data.currentTab === 0 ? {
    b: $data.currentTab === 0 ? 1 : ""
  } : {}, {
    c: $data.currentTab === 1
  }, $data.currentTab === 1 ? {
    d: $data.currentTab === 1 ? 1 : "",
    e: common_vendor.o($options.handleTabChange)
  } : {}, {
    f: $data.currentTab === 2
  }, $data.currentTab === 2 ? {
    g: $data.currentTab === 2 ? 1 : ""
  } : {}, {
    h: common_vendor.o($options.handleTabChange),
    i: common_vendor.p({
      ["current-tab"]: $data.currentTab
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4f50ca8f"]]);
my.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-alipay/pages/main/main.js.map
