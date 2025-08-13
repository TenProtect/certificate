"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = {
  name: "OrderContent",
  data() {
    return {
      statusBarHeight: 44,
      // 默认状态栏高度
      headerHeight: 44,
      // 默认导航栏高度
      activeTabIndex: 0,
      // 当前选中的标签页索引
      orderTabs: [
        { label: "全部", value: "all" },
        { label: "待付款", value: "pending_payment" },
        { label: "制作中", value: "processing" },
        { label: "已完成", value: "completed" }
      ],
      // 模拟订单数据
      mockOrders: [
        {
          orderNo: "432507230000272",
          documentName: "广东身份证",
          location: "广东省广州市",
          amount: "¥18",
          checkTime: "2025-07-23 11:54:07",
          status: "completed",
          hasReceipt: true,
          photo: "/static/default-license.png"
        },
        {
          orderNo: "432507230000273",
          documentName: "护照",
          location: "广东省深圳市",
          amount: "¥25",
          checkTime: "2025-07-22 15:30:20",
          status: "pending",
          hasReceipt: true,
          photo: "/static/default-license.png"
        },
        {
          orderNo: "432507230000274",
          documentName: "驾驶证",
          location: "广东省广州市",
          amount: "¥15",
          checkTime: "2025-07-21 09:15:33",
          status: "processing",
          hasReceipt: false,
          photo: "/static/default-license.png"
        }
      ]
    };
  },
  computed: {
    currentTabName() {
      return this.orderTabs[this.activeTabIndex].label;
    },
    currentOrders() {
      const tabValue = this.orderTabs[this.activeTabIndex].value;
      if (tabValue === "all") {
        return this.mockOrders;
      }
      return this.mockOrders.filter((order) => order.status === tabValue);
    }
  },
  created() {
    this.getSystemInfo();
  },
  methods: {
    switchTab(index) {
      this.activeTabIndex = index;
    },
    goToHome() {
      this.$emit("switch-tab", 0);
    },
    contactService() {
      common_vendor.index.showToast({
        title: "正在为您联系客服...",
        icon: "none"
      });
    },
    downloadStandard(order) {
      common_vendor.index.showToast({
        title: "正在生成标准照...",
        icon: "none"
      });
    },
    downloadLayout(order) {
      common_vendor.index.showToast({
        title: "正在生成排版照...",
        icon: "none"
      });
    },
    downloadReceipt(order) {
      common_vendor.index.showToast({
        title: "正在生成回执照...",
        icon: "none"
      });
    },
    formatTime(timeString) {
      const date = new Date(timeString);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      if (hours < 24) {
        return `${hours}小时前`;
      } else {
        const days = Math.floor(hours / 24);
        return `${days}天前`;
      }
    },
    getStatusText(status) {
      const statusMap = {
        "pending_payment": "待付款",
        "processing": "制作中",
        "pending": "已提交",
        "completed": "已完成"
      };
      return statusMap[status] || "未知状态";
    },
    getResultText(status) {
      const resultMap = {
        "pending_payment": "等待付款",
        "processing": "制作中",
        "pending": "待审核",
        "completed": "办理完成"
      };
      return resultMap[status] || "未知结果";
    },
    // 获取系统信息，适配刘海屏
    getSystemInfo() {
      try {
        const systemInfo = common_vendor.index.getSystemInfoSync();
        this.statusBarHeight = systemInfo.statusBarHeight || 44;
        if (systemInfo.platform === "ios") {
          if (systemInfo.statusBarHeight >= 44) {
            this.headerHeight = 44;
          } else {
            this.headerHeight = 44;
          }
        } else if (systemInfo.platform === "android") {
          this.headerHeight = 48;
        } else {
          this.headerHeight = 44;
        }
        const safeArea = systemInfo.safeArea || {};
        const safeAreaTop = safeArea.top || this.statusBarHeight;
        this.statusBarHeight = Math.max(this.statusBarHeight, safeAreaTop);
        common_vendor.index.__f__("log", "at pages/main/components/order-content.vue:279", "系统信息:", {
          platform: systemInfo.platform,
          statusBarHeight: this.statusBarHeight,
          headerHeight: this.headerHeight,
          model: systemInfo.model,
          safeArea
        });
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/main/components/order-content.vue:287", "获取系统信息失败，使用默认值:", e);
        const userAgent = navigator.userAgent || "";
        if (userAgent.includes("iPhone")) {
          this.statusBarHeight = 44;
          this.headerHeight = 44;
        } else {
          this.statusBarHeight = 44;
          this.headerHeight = 48;
        }
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + 10 + "px",
    b: common_vendor.f($data.orderTabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab.label),
        b: tab.value,
        c: $data.activeTabIndex === index ? 1 : "",
        d: common_vendor.o(($event) => $options.switchTab(index))
      };
    }),
    c: $options.currentOrders.length > 0
  }, $options.currentOrders.length > 0 ? {} : {}, {
    d: $options.currentOrders.length === 0
  }, $options.currentOrders.length === 0 ? {
    e: common_vendor.t($options.currentTabName),
    f: common_vendor.o((...args) => $options.goToHome && $options.goToHome(...args))
  } : {
    g: common_vendor.f($options.currentOrders, (order, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(order.orderNo),
        b: common_vendor.t($options.getStatusText(order.status)),
        c: common_vendor.n(order.status),
        d: order.photo,
        e: common_vendor.t(order.documentName),
        f: common_vendor.t(order.location),
        g: common_vendor.t(order.amount),
        h: common_vendor.t(order.checkTime),
        i: common_vendor.t($options.getResultText(order.status)),
        j: common_vendor.n(order.status),
        k: order.status === "pending"
      }, order.status === "pending" ? {} : {}, {
        l: order.status !== "completed"
      }, order.status !== "completed" ? {
        m: common_assets._imports_0$3,
        n: common_vendor.o((...args) => $options.contactService && $options.contactService(...args))
      } : common_vendor.e({
        o: !order.hasReceipt ? 1 : "",
        p: common_vendor.o(($event) => $options.downloadStandard(order)),
        q: order.hasReceipt ? 1 : "",
        r: !order.hasReceipt ? 1 : "",
        s: common_vendor.o(($event) => $options.downloadLayout(order)),
        t: order.hasReceipt
      }, order.hasReceipt ? {
        v: common_vendor.o(($event) => $options.downloadReceipt(order))
      } : {}), {
        w: order.orderNo
      });
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2c1dbf3d"]]);
my.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-alipay/pages/main/components/order-content.js.map
