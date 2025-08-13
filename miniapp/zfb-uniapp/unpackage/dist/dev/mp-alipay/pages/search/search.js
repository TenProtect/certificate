"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  name: "SearchPage",
  data() {
    return {
      currentCity: "重庆",
      searchKeyword: "",
      searchResults: [],
      // 模拟搜索数据 - 与home-content保持一致的数据格式
      allDocuments: [
        // 回执类证件
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
        },
        // 证照类
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
        },
        {
          id: 8,
          name: "居住证",
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
            requirements: "免冠正面照，表情自然，白色背景"
          }
        },
        // 签证类
        {
          id: 9,
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
          id: 10,
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
        // 考试类
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
        }
      ]
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/search/search.vue:309", "搜索页面加载完成");
    if (options.city) {
      this.currentCity = decodeURIComponent(options.city);
    }
    if (options.keyword) {
      this.searchKeyword = decodeURIComponent(options.keyword);
      this.performSearch(this.searchKeyword);
    }
  },
  methods: {
    onSearchInput(e) {
      const keyword = e.detail.value;
      this.searchKeyword = keyword;
      this.performSearch(keyword);
    },
    performSearch(keyword) {
      this.handleSearchEvent(this.currentCity, keyword);
      if (!keyword.trim()) {
        this.searchResults = [];
        return;
      }
      this.searchResults = this.allDocuments.filter((doc) => {
        const nameMatch = doc.name.includes(keyword);
        const badgeMatch = doc.badge.includes(keyword);
        const specsMatch = doc.specs.printSize.includes(keyword) || doc.specs.pixelSize.includes(keyword) || doc.specs.resolution.includes(keyword) || doc.specs.imageFormat.includes(keyword) || doc.specs.requirements.includes(keyword);
        return nameMatch || badgeMatch || specsMatch;
      });
    },
    handleSearchEvent(city, keyword) {
      common_vendor.index.__f__("log", "at pages/search/search.vue:352", "搜索事件触发:", { city, keyword });
    },
    onResultClick(item) {
      common_vendor.index.__f__("log", "at pages/search/search.vue:360", "点击搜索结果:", item.name, item);
      common_vendor.index.navigateTo({
        url: `/pages/photo-detail/photo-detail?data=${encodeURIComponent(JSON.stringify(item))}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.currentCity),
    b: common_vendor.o([($event) => $data.searchKeyword = $event.detail.value, (...args) => $options.onSearchInput && $options.onSearchInput(...args)]),
    c: $data.searchKeyword,
    d: !$data.searchKeyword
  }, !$data.searchKeyword ? {} : $data.searchResults.length === 0 ? {} : {
    f: common_vendor.f($data.searchResults, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.badge),
        c: common_vendor.t(item.specs.printSize),
        d: common_vendor.t(item.specs.pixelSize),
        e: item.id,
        f: common_vendor.o(($event) => $options.onResultClick(item))
      };
    }),
    g: common_assets._imports_0
  }, {
    e: $data.searchResults.length === 0
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c10c040c"]]);
my.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-alipay/pages/search/search.js.map
