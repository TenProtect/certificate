"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const ScrollBanner = () => "../../../components/scroll-banner.js";
const _sfc_main = {
  name: "HomeContent",
  components: {
    ScrollBanner
  },
  data() {
    return {
      currentCity: "重庆",
      activeTab: 0,
      // 当前激活的选项卡索引
      categories: [
        { id: 0, name: "回执", icon: "📋" },
        { id: 1, name: "证照", icon: "👤" },
        { id: 2, name: "签证", icon: "🌐" },
        { id: 3, name: "考试", icon: "📝" },
        { id: 4, name: "近期", icon: "🕐" }
      ],
      documentsData: {
        0: [
          // 回执
          {
            id: 1,
            name: "身份证",
            badge: "含回执",
            hasReceipt: true,
            specs: {
              printSize: "26x32mm",
              pixelSize: "358x441px",
              resolution: "300DPI",
              saveElectronicPhoto: true,
              printLayout: true,
              bgColor: "#FFFFFF",
              imageFormat: "无要求",
              imageFileSize: "无要求",
              requirements: "免冠，照片可看见两耳轮廓和相当于男士喉结处的地方"
            }
          },
          {
            id: 2,
            name: "港澳通行证",
            badge: "含回执",
            hasReceipt: true,
            specs: {
              printSize: "33x48mm",
              pixelSize: "390x567px",
              resolution: "300DPI",
              saveElectronicPhoto: true,
              printLayout: true,
              bgColor: "#FFFFFF",
              imageFormat: "JPEG",
              imageFileSize: "20KB-50KB",
              requirements: "免冠正面照，头部占照片面积的2/3，白色背景"
            }
          },
          {
            id: 3,
            name: "社保证",
            badge: "含回执",
            hasReceipt: true,
            specs: {
              printSize: "26x32mm",
              pixelSize: "358x441px",
              resolution: "300DPI",
              saveElectronicPhoto: true,
              printLayout: true,
              bgColor: "#FFFFFF",
              imageFormat: "无要求",
              imageFileSize: "无要求",
              requirements: "免冠正面照，表情自然，双眼睁开"
            }
          },
          {
            id: 4,
            name: "护照",
            badge: "含回执",
            hasReceipt: true,
            specs: {
              printSize: "33x48mm",
              pixelSize: "390x567px",
              resolution: "300DPI",
              saveElectronicPhoto: true,
              printLayout: true,
              bgColor: "#FFFFFF",
              imageFormat: "JPEG",
              imageFileSize: "40KB-120KB",
              requirements: "免冠正面照，不得佩戴帽子或头巾，白色背景"
            }
          }
        ],
        1: [
          // 证照
          {
            id: 5,
            name: "驾驶证",
            badge: "标准证照",
            hasReceipt: false,
            specs: {
              printSize: "22x32mm",
              pixelSize: "260x378px",
              resolution: "300DPI",
              saveElectronicPhoto: true,
              printLayout: true,
              bgColor: "#FFFFFF",
              imageFormat: "JPEG",
              imageFileSize: "无要求",
              requirements: "免冠正面照，不得戴有色眼镜，白色背景"
            }
          },
          {
            id: 6,
            name: "工作证",
            badge: "标准证照",
            hasReceipt: false,
            specs: {
              printSize: "25x35mm",
              pixelSize: "295x413px",
              resolution: "300DPI",
              saveElectronicPhoto: true,
              printLayout: true,
              bgColor: "#FFFFFF",
              imageFormat: "无要求",
              imageFileSize: "无要求",
              requirements: "免冠正面照，着正装，表情严肃自然"
            }
          },
          {
            id: 7,
            name: "学生证",
            badge: "标准证照",
            hasReceipt: false,
            specs: {
              printSize: "26x32mm",
              pixelSize: "358x441px",
              resolution: "300DPI",
              saveElectronicPhoto: true,
              printLayout: true,
              bgColor: "#FFFFFF",
              imageFormat: "无要求",
              imageFileSize: "无要求",
              requirements: "免冠正面照，表情自然，着装整洁"
            }
          }
        ],
        2: [
          // 签证
          {
            id: 8,
            name: "美国签证",
            badge: "签证专用",
            hasReceipt: false,
            specs: {
              printSize: "51x51mm",
              pixelSize: "600x600px",
              resolution: "300DPI",
              saveElectronicPhoto: true,
              printLayout: true,
              bgColor: "#FFFFFF",
              imageFormat: "JPEG",
              imageFileSize: "240KB以下",
              requirements: "正方形照片，头部占照片50%-69%，6个月内拍摄"
            }
          },
          {
            id: 9,
            name: "日本签证",
            badge: "签证专用",
            hasReceipt: false,
            specs: {
              printSize: "45x45mm",
              pixelSize: "531x531px",
              resolution: "300DPI",
              saveElectronicPhoto: true,
              printLayout: true,
              bgColor: "#FFFFFF",
              imageFormat: "JPEG",
              imageFileSize: "无要求",
              requirements: "正方形照片，头顶到下颌长度占总长度70%-80%"
            }
          },
          {
            id: 10,
            name: "韩国签证",
            badge: "签证专用",
            hasReceipt: false,
            specs: {
              printSize: "35x45mm",
              pixelSize: "413x531px",
              resolution: "300DPI",
              saveElectronicPhoto: true,
              printLayout: true,
              bgColor: "#FFFFFF",
              imageFormat: "JPEG",
              imageFileSize: "无要求",
              requirements: "免冠正面照，头部占照片2/3，6个月内拍摄"
            }
          }
        ],
        3: [
          // 考试
          {
            id: 11,
            name: "公务员考试",
            badge: "考试专用",
            hasReceipt: false,
            specs: {
              printSize: "25x35mm",
              pixelSize: "295x413px",
              resolution: "300DPI",
              saveElectronicPhoto: true,
              printLayout: true,
              bgColor: "#FFFFFF",
              imageFormat: "JPEG",
              imageFileSize: "20KB-50KB",
              requirements: "免冠正面照，着正装，表情严肃，近期拍摄"
            }
          },
          {
            id: 12,
            name: "教师资格证",
            badge: "考试专用",
            hasReceipt: false,
            specs: {
              printSize: "25x35mm",
              pixelSize: "295x413px",
              resolution: "300DPI",
              saveElectronicPhoto: true,
              printLayout: true,
              bgColor: "#FFFFFF",
              imageFormat: "JPEG",
              imageFileSize: "200KB以下",
              requirements: "免冠正面照，不得佩戴首饰，着装整洁"
            }
          },
          {
            id: 13,
            name: "会计师考试",
            badge: "考试专用",
            hasReceipt: false,
            specs: {
              printSize: "26x32mm",
              pixelSize: "358x441px",
              resolution: "300DPI",
              saveElectronicPhoto: true,
              printLayout: true,
              bgColor: "#FFFFFF",
              imageFormat: "JPEG",
              imageFileSize: "无要求",
              requirements: "免冠正面照，着正装，表情自然严肃"
            }
          }
        ],
        4: [
          // 近期
          {
            id: 14,
            name: "身份证",
            badge: "最近使用",
            hasReceipt: true,
            specs: {
              printSize: "26x32mm",
              pixelSize: "358x441px",
              resolution: "300DPI",
              saveElectronicPhoto: true,
              printLayout: true,
              bgColor: "#FFFFFF",
              imageFormat: "无要求",
              imageFileSize: "无要求",
              requirements: "免冠，照片可看见两耳轮廓和相当于男士喉结处的地方"
            }
          },
          {
            id: 15,
            name: "护照",
            badge: "最近使用",
            hasReceipt: true,
            specs: {
              printSize: "33x48mm",
              pixelSize: "390x567px",
              resolution: "300DPI",
              saveElectronicPhoto: true,
              printLayout: true,
              bgColor: "#FFFFFF",
              imageFormat: "JPEG",
              imageFileSize: "40KB-120KB",
              requirements: "免冠正面照，不得佩戴帽子或头巾，白色背景"
            }
          }
        ]
      },
      bannerImages: [
        {
          src: "/static/banner/banner1.png",
          alt: "演示图片1"
        },
        {
          src: "/static/banner/banner2.png",
          alt: "演示图片2"
        },
        {
          src: "/static/banner/banner3.png",
          alt: "演示图片3"
        }
      ]
    };
  },
  computed: {
    currentDocuments() {
      return this.documentsData[this.activeTab] || [];
    }
  },
  mounted() {
    common_vendor.index.$on("citySelected", this.onCitySelected);
  },
  beforeDestroy() {
    common_vendor.index.$off("citySelected", this.onCitySelected);
  },
  methods: {
    onCitySelect() {
      common_vendor.index.__f__("log", "at pages/main/components/home-content.vue:416", "选择城市");
      common_vendor.index.navigateTo({
        url: `/pages/city-selector/city-selector?city=${encodeURIComponent(this.currentCity)}`
      });
    },
    onCitySelected(city) {
      this.currentCity = city.name;
      common_vendor.index.__f__("log", "at pages/main/components/home-content.vue:425", "城市选择完成:", city.name);
      common_vendor.index.showToast({
        title: `已切换到${city.name}`,
        icon: "none"
      });
    },
    onTabClick(index) {
      this.activeTab = index;
      common_vendor.index.__f__("log", "at pages/main/components/home-content.vue:433", "切换到选项卡:", this.categories[index].name);
    },
    onDocumentClick(document) {
      common_vendor.index.__f__("log", "at pages/main/components/home-content.vue:436", "点击证件:", document.name, document);
      const documentData = encodeURIComponent(JSON.stringify(document));
      const cityData = encodeURIComponent(this.currentCity);
      common_vendor.index.navigateTo({
        url: `/pages/photo-detail/photo-detail?data=${documentData}&city=${cityData}`
      });
    },
    goToSearch() {
      common_vendor.index.navigateTo({
        url: `/pages/search/search?city=${encodeURIComponent(this.currentCity)}`
      });
    },
    onFloatingButtonClick() {
      common_vendor.index.showToast({
        title: "悬浮按钮被点击",
        icon: "none"
      });
      common_vendor.index.__f__("log", "at pages/main/components/home-content.vue:455", "悬浮按钮被点击");
    }
  }
};
if (!Array) {
  const _component_scroll_banner = common_vendor.resolveComponent("scroll-banner");
  _component_scroll_banner();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      images: $data.bannerImages,
      direction: "horizontal",
      interval: 4e3,
      duration: 300,
      height: "400rpx",
      ["auto-play"]: true,
      draggable: true,
      ["image-align"]: "top",
      ["show-indicators"]: false
    }),
    b: common_vendor.t($data.currentCity),
    c: common_vendor.o((...args) => $options.onCitySelect && $options.onCitySelect(...args)),
    d: common_vendor.o((...args) => $options.goToSearch && $options.goToSearch(...args)),
    e: common_vendor.o((...args) => $options.goToSearch && $options.goToSearch(...args)),
    f: `translateX(${$data.activeTab * 100}%)`,
    g: common_vendor.f($data.categories, (category, index, i0) => {
      return {
        a: common_vendor.t(category.icon),
        b: common_vendor.t(category.name),
        c: category.id,
        d: $data.activeTab === index ? 1 : "",
        e: common_vendor.o(($event) => $options.onTabClick(index))
      };
    }),
    h: common_vendor.f($options.currentDocuments, (document, k0, i0) => {
      return {
        a: common_vendor.t(document.name),
        b: common_vendor.t(document.badge),
        c: common_vendor.t(document.specs.printSize),
        d: common_vendor.t(document.specs.pixelSize),
        e: document.id,
        f: common_vendor.o(($event) => $options.onDocumentClick(document))
      };
    }),
    i: common_assets._imports_0,
    j: common_assets._imports_0$3,
    k: common_vendor.o((...args) => $options.onFloatingButtonClick && $options.onFloatingButtonClick(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3e72b81a"]]);
my.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-alipay/pages/main/components/home-content.js.map
