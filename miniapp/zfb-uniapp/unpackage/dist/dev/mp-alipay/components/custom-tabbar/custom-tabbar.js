"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "CustomTabbar",
  props: {
    currentTab: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      safeAreaBottom: 0,
      tabList: [
        {
          pagePath: "/pages/home/home",
          text: "首页",
          iconPath: "/static/tabbar/home.svg",
          selectedIconPath: "/static/tabbar/home-active.svg"
        },
        {
          pagePath: "/pages/order/order",
          text: "订单",
          iconPath: "/static/tabbar/order.svg",
          selectedIconPath: "/static/tabbar/order-active.svg"
        },
        {
          pagePath: "/pages/profile/profile",
          text: "我的",
          iconPath: "/static/tabbar/profile.svg",
          selectedIconPath: "/static/tabbar/profile-active.svg"
        }
      ]
    };
  },
  mounted() {
    this.getSafeAreaBottom();
  },
  methods: {
    // 获取当前tab索引
    getCurrentTab() {
      try {
        const pages = getCurrentPages();
        if (pages.length > 0) {
          const currentPage = pages[pages.length - 1];
          const route = currentPage.route || currentPage.__route__;
          common_vendor.index.__f__("log", "at components/custom-tabbar/custom-tabbar.vue:108", "当前页面路由:", route);
          this.tabList.forEach((item, index) => {
            const pagePath = item.pagePath.replace("/", "");
            if (route && (route.includes(pagePath) || route === pagePath)) {
              this.currentTab = index;
              common_vendor.index.__f__("log", "at components/custom-tabbar/custom-tabbar.vue:114", "设置当前tab:", index, pagePath);
            }
          });
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at components/custom-tabbar/custom-tabbar.vue:119", "获取当前页面失败:", e);
        const url = window.location ? window.location.href : "";
        if (url.includes("home")) {
          this.currentTab = 0;
        } else if (url.includes("order")) {
          this.currentTab = 1;
        } else if (url.includes("profile")) {
          this.currentTab = 2;
        }
      }
    },
    // 获取底部安全区域
    getSafeAreaBottom() {
      try {
        const systemInfo = common_vendor.index.getSystemInfoSync();
        const safeArea = systemInfo.safeArea || {};
        const screenHeight = systemInfo.screenHeight || systemInfo.windowHeight;
        if (systemInfo.platform === "ios") {
          this.safeAreaBottom = screenHeight - (safeArea.bottom || screenHeight);
          if (this.safeAreaBottom < 20) {
            this.safeAreaBottom = systemInfo.statusBarHeight > 44 ? 34 : 0;
          }
        } else {
          this.safeAreaBottom = Math.max(0, screenHeight - (safeArea.bottom || screenHeight));
        }
        common_vendor.index.__f__("log", "at components/custom-tabbar/custom-tabbar.vue:152", "底部安全区域高度:", this.safeAreaBottom);
      } catch (e) {
        common_vendor.index.__f__("log", "at components/custom-tabbar/custom-tabbar.vue:154", "获取安全区域失败:", e);
        this.safeAreaBottom = 0;
      }
    },
    // 切换tab
    switchTab(index) {
      if (this.currentTab === index)
        return;
      this.$emit("tab-change", index);
      common_vendor.index.vibrateShort({
        type: "light"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.tabList, (item, index, i0) => {
      return common_vendor.e({
        a: $props.currentTab === index
      }, $props.currentTab === index ? {} : {}, {
        b: index === 0
      }, index === 0 ? {} : index === 1 ? common_vendor.e({
        d: $props.currentTab === index
      }, $props.currentTab === index ? {} : {}) : index === 2 ? {} : {}, {
        c: index === 1,
        e: index === 2,
        f: $props.currentTab === index ? 1 : "",
        g: $props.currentTab === index
      }, $props.currentTab === index ? {} : {}, {
        h: common_vendor.t(item.text),
        i: $props.currentTab === index ? 1 : "",
        j: $props.currentTab === index
      }, $props.currentTab === index ? {} : {}, {
        k: index,
        l: $props.currentTab === index ? 1 : "",
        m: common_vendor.o(($event) => $options.switchTab(index))
      });
    }),
    b: $data.safeAreaBottom + "px"
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-51c48e3c"]]);
my.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-alipay/components/custom-tabbar/custom-tabbar.js.map
