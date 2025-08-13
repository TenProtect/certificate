"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_citiesData = require("../../utils/cities-data.js");
const _sfc_main = {
  name: "CitySelector",
  data() {
    return {
      searchKeyword: "",
      searchFocus: false,
      currentCity: "重庆",
      cities: [],
      groupedCities: {},
      alphabetList: [],
      hotCities: [],
      searchResults: [],
      scrollIntoView: "",
      currentLetter: "",
      showLetterTip: false,
      indexTouching: false,
      statusBarHeight: 44,
      // 默认状态栏高度
      headerHeight: 44
      // 默认导航栏高度
    };
  },
  async onLoad(options) {
    if (options.city) {
      this.currentCity = decodeURIComponent(options.city);
    }
    this.getSystemInfo();
    await this.loadCities();
    this.setupHotCities();
    this.groupCitiesByLetter();
  },
  methods: {
    async loadCities() {
      this.cities = utils_citiesData.citiesData || [];
      common_vendor.index.__f__("log", "at pages/city-selector/city-selector.vue:124", "加载城市数据成功，共", this.cities.length, "个城市");
    },
    setupHotCities() {
      const hotCityCodes = ["1101", "3101", "4403", "4401", "3301", "3201", "5001", "5101"];
      this.hotCities = this.cities.filter((city) => hotCityCodes.includes(city.code));
    },
    groupCitiesByLetter() {
      const grouped = {};
      const alphabet = [];
      this.cities.forEach((city) => {
        const firstChar = this.getFirstLetter(city.name);
        if (!grouped[firstChar]) {
          grouped[firstChar] = [];
          if (!alphabet.includes(firstChar)) {
            alphabet.push(firstChar);
          }
        }
        grouped[firstChar].push(city);
      });
      alphabet.sort();
      Object.keys(grouped).forEach((letter) => {
        grouped[letter].sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
      });
      this.groupedCities = grouped;
      this.alphabetList = alphabet;
      common_vendor.index.__f__("log", "at pages/city-selector/city-selector.vue:160", "城市分组完成:", Object.keys(grouped).length, "个字母组");
    },
    getFirstLetter(cityName) {
      const letterMap = {
        // A
        "安": "A",
        "阿": "A",
        "鞍": "A",
        // B
        "保": "B",
        "包": "B",
        "北": "B",
        "博": "B",
        "宝": "B",
        "巴": "B",
        "本": "B",
        "毕": "B",
        "滨": "B",
        "白": "B",
        "百": "B",
        "蚌": "B",
        // C
        "崇": "C",
        "常": "C",
        "成": "C",
        "承": "C",
        "昌": "C",
        "朝": "C",
        "楚": "C",
        "池": "C",
        "沧": "C",
        "滁": "C",
        "潮": "C",
        "赤": "C",
        "郴": "C",
        "重": "C",
        "长": "C",
        // D
        "东": "D",
        "丹": "D",
        "大": "D",
        "定": "D",
        "德": "D",
        "达": "D",
        "迪": "D",
        // E
        "恩": "E",
        "鄂": "E",
        // F
        "佛": "F",
        "抚": "F",
        "福": "F",
        "阜": "F",
        "防": "F",
        // G
        "固": "G",
        "广": "G",
        "果": "G",
        "桂": "G",
        "甘": "G",
        "贵": "G",
        "赣": "G",
        // H
        "合": "H",
        "呼": "H",
        "和": "H",
        "哈": "H",
        "怀": "H",
        "惠": "H",
        "杭": "H",
        "汉": "H",
        "河": "H",
        "海": "H",
        "淮": "H",
        "湖": "H",
        "红": "H",
        "菏": "H",
        "葫": "H",
        "衡": "H",
        "贺": "H",
        "邯": "H",
        "鹤": "H",
        "黄": "H",
        "黑": "H",
        // J
        "九": "J",
        "佳": "J",
        "吉": "J",
        "嘉": "J",
        "揭": "J",
        "晋": "J",
        "景": "J",
        "江": "J",
        "济": "J",
        "焦": "J",
        "荆": "J",
        "酒": "J",
        "金": "J",
        "锦": "J",
        "鸡": "J",
        // K
        "克": "K",
        "喀": "K",
        "开": "K",
        "昆": "K",
        // L
        "临": "L",
        "丽": "L",
        "乐": "L",
        "六": "L",
        "兰": "L",
        "凉": "L",
        "吕": "L",
        "娄": "L",
        "廊": "L",
        "拉": "L",
        "来": "L",
        "林": "L",
        "柳": "L",
        "泸": "L",
        "洛": "L",
        "漯": "L",
        "聊": "L",
        "辽": "L",
        "连": "L",
        "陇": "L",
        "龙": "L",
        // M
        "梅": "M",
        "牡": "M",
        "眉": "M",
        "绵": "M",
        "茂": "M",
        "马": "M",
        // N
        "内": "N",
        "南": "N",
        "宁": "N",
        "怒": "N",
        "那": "N",
        // P
        "平": "P",
        "攀": "P",
        "普": "P",
        "濮": "P",
        "盘": "P",
        "莆": "P",
        "萍": "P",
        // Q
        "七": "Q",
        "庆": "Q",
        "曲": "Q",
        "泉": "Q",
        "清": "Q",
        "秦": "Q",
        "衢": "Q",
        "钦": "Q",
        "青": "Q",
        "黔": "Q",
        "齐": "Q",
        // R
        "日": "R",
        // S
        "三": "S",
        "上": "S",
        "十": "S",
        "双": "S",
        "商": "S",
        "四": "S",
        "宿": "S",
        "山": "S",
        "朔": "S",
        "松": "S",
        "汕": "S",
        "沈": "S",
        "深": "S",
        "石": "S",
        "绍": "S",
        "绥": "S",
        "苏": "S",
        "遂": "S",
        "邵": "S",
        "随": "S",
        "韶": "S",
        // T
        "台": "T",
        "吐": "T",
        "唐": "T",
        "塔": "T",
        "天": "T",
        "太": "T",
        "泰": "T",
        "通": "T",
        "铁": "T",
        "铜": "T",
        // W
        "乌": "W",
        "吴": "W",
        "威": "W",
        "文": "W",
        "无": "W",
        "梧": "W",
        "武": "W",
        "温": "W",
        "渭": "W",
        "潍": "W",
        "芜": "W",
        // X
        "信": "X",
        "兴": "X",
        "厦": "X",
        "县": "X",
        "咸": "X",
        "孝": "X",
        "宣": "X",
        "徐": "X",
        "忻": "X",
        "新": "X",
        "湘": "X",
        "襄": "X",
        "西": "X",
        "许": "X",
        "邢": "X",
        "锡": "X",
        // Y
        "云": "Y",
        "伊": "Y",
        "宜": "Y",
        "岳": "Y",
        "延": "Y",
        "扬": "Y",
        "榆": "Y",
        "永": "Y",
        "烟": "Y",
        "玉": "Y",
        "益": "Y",
        "盐": "Y",
        "营": "Y",
        "运": "Y",
        "银": "Y",
        "阳": "Y",
        "雅": "Y",
        "鹰": "Y",
        // Z
        "中": "Z",
        "亳": "Z",
        "儋": "Z",
        "周": "Z",
        "张": "Z",
        "昭": "Z",
        "枣": "Z",
        "株": "Z",
        "淄": "Z",
        "湛": "Z",
        "漳": "Z",
        "珠": "Z",
        "肇": "Z",
        "自": "Z",
        "舟": "Z",
        "资": "Z",
        "遵": "Z",
        "郑": "Z",
        "镇": "Z",
        "驻": "Z"
      };
      const firstChar = cityName.charAt(0);
      return letterMap[firstChar] || "#";
    },
    onSearchInput() {
      if (this.searchKeyword.trim()) {
        this.searchResults = this.cities.filter(
          (city) => city.name.includes(this.searchKeyword.trim())
        );
      } else {
        this.searchResults = [];
      }
    },
    clearSearch() {
      this.searchKeyword = "";
      this.searchResults = [];
    },
    selectCity(city) {
      common_vendor.index.__f__("log", "at pages/city-selector/city-selector.vue:231", "选择城市:", city.name);
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      if (prevPage) {
        if (prevPage.$vm && typeof prevPage.$vm.onCitySelected === "function") {
          prevPage.$vm.onCitySelected(city);
        }
        common_vendor.index.$emit("citySelected", city);
      }
      common_vendor.index.navigateBack();
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    // 字母索引相关方法
    onLetterTap(letter) {
      this.currentLetter = letter;
      this.scrollIntoView = "";
      this.$nextTick(() => {
        this.scrollIntoView = `letter-${letter}`;
      });
      this.showLetterTip = true;
      setTimeout(() => {
        this.showLetterTip = false;
      }, 300);
    },
    onIndexTouchStart(e) {
      this.indexTouching = true;
      this.showLetterTip = true;
      this.handleIndexTouch(e);
    },
    onIndexTouchMove(e) {
      if (this.indexTouching) {
        this.handleIndexTouch(e);
      }
    },
    onIndexTouchEnd(e) {
      this.indexTouching = false;
      setTimeout(() => {
        this.showLetterTip = false;
      }, 300);
    },
    handleIndexTouch(e) {
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch)
        return;
      common_vendor.index.createSelectorQuery().in(this).select(".alphabet-index").boundingClientRect((rect) => {
        if (rect) {
          const relativeY = touch.clientY - rect.top;
          const letterHeight = rect.height / this.alphabetList.length;
          const index = Math.floor(relativeY / letterHeight);
          if (index >= 0 && index < this.alphabetList.length) {
            const letter = this.alphabetList[index];
            this.currentLetter = letter;
            this.scrollIntoView = "";
            this.$nextTick(() => {
              this.scrollIntoView = `letter-${letter}`;
            });
          }
        }
      }).exec();
    },
    onScroll(e) {
      if (!this.indexTouching)
        ;
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
        common_vendor.index.__f__("log", "at pages/city-selector/city-selector.vue:350", "城市选择页系统信息:", {
          platform: systemInfo.platform,
          statusBarHeight: this.statusBarHeight,
          headerHeight: this.headerHeight,
          model: systemInfo.model,
          safeArea
        });
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/city-selector/city-selector.vue:358", "获取系统信息失败，使用默认值:", e);
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
    a: $data.statusBarHeight + 30 + "px",
    b: common_vendor.o([($event) => $data.searchKeyword = $event.detail.value, (...args) => $options.onSearchInput && $options.onSearchInput(...args)]),
    c: $data.searchFocus,
    d: $data.searchKeyword,
    e: $data.searchKeyword
  }, $data.searchKeyword ? {
    f: common_vendor.o((...args) => $options.clearSearch && $options.clearSearch(...args))
  } : {}, {
    g: !$data.searchKeyword
  }, !$data.searchKeyword ? {
    h: common_vendor.f($data.hotCities, (city, k0, i0) => {
      return {
        a: common_vendor.t(city.name.replace("市", "")),
        b: city.code,
        c: common_vendor.o(($event) => $options.selectCity(city))
      };
    })
  } : {}, {
    i: $data.searchKeyword
  }, $data.searchKeyword ? common_vendor.e({
    j: $data.searchResults.length === 0
  }, $data.searchResults.length === 0 ? {} : {
    k: common_vendor.f($data.searchResults, (city, k0, i0) => {
      return {
        a: common_vendor.t(city.name),
        b: city.code,
        c: common_vendor.o(($event) => $options.selectCity(city))
      };
    })
  }) : {
    l: common_vendor.f($data.alphabetList, (letter, k0, i0) => {
      return {
        a: common_vendor.t(letter),
        b: common_vendor.f($data.groupedCities[letter], (city, k1, i1) => {
          return {
            a: common_vendor.t(city.name),
            b: city.code,
            c: common_vendor.o(($event) => $options.selectCity(city))
          };
        }),
        c: letter,
        d: `letter-${letter}`
      };
    }),
    m: $data.scrollIntoView,
    n: common_vendor.o((...args) => $options.onScroll && $options.onScroll(...args))
  }, {
    o: !$data.searchKeyword
  }, !$data.searchKeyword ? {
    p: common_vendor.f($data.alphabetList, (letter, k0, i0) => {
      return {
        a: common_vendor.t(letter),
        b: letter,
        c: letter,
        d: $data.currentLetter === letter ? 1 : "",
        e: common_vendor.o(($event) => $options.onLetterTap(letter))
      };
    }),
    q: common_vendor.o((...args) => $options.onIndexTouchStart && $options.onIndexTouchStart(...args)),
    r: common_vendor.o((...args) => $options.onIndexTouchMove && $options.onIndexTouchMove(...args)),
    s: common_vendor.o((...args) => $options.onIndexTouchEnd && $options.onIndexTouchEnd(...args))
  } : {}, {
    t: $data.showLetterTip && !$data.searchKeyword
  }, $data.showLetterTip && !$data.searchKeyword ? {
    v: common_vendor.t($data.currentLetter)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4194678e"]]);
my.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-alipay/pages/city-selector/city-selector.js.map
