"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "ScrollBanner",
  props: {
    // 图片列表
    images: {
      type: Array,
      default: () => []
    },
    // 滚动方向：horizontal(水平) | vertical(垂直)
    direction: {
      type: String,
      default: "horizontal",
      validator: (value) => ["horizontal", "vertical"].includes(value)
    },
    // 自动播放间隔时间（毫秒）
    interval: {
      type: Number,
      default: 3e3
    },
    // 切换动画时长（毫秒）
    duration: {
      type: Number,
      default: 300
    },
    // 容器高度
    height: {
      type: [String, Number],
      default: "200rpx"
    },
    // 容器宽度
    width: {
      type: [String, Number],
      default: "100%"
    },
    // 图片宽度（水平滚动时）
    itemWidth: {
      type: [String, Number],
      default: "100%"
    },
    // 图片高度（垂直滚动时）
    itemHeight: {
      type: [String, Number],
      default: "100%"
    },
    // 是否自动播放
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 是否可以拖拽
    draggable: {
      type: Boolean,
      default: true
    },
    // 是否显示指示器
    showIndicators: {
      type: Boolean,
      default: true
    },
    // 是否循环播放
    loop: {
      type: Boolean,
      default: true
    },
    // 图片垂直对齐方式：top | center | bottom
    imageAlign: {
      type: String,
      default: "top",
      validator: (v) => ["top", "center", "bottom"].includes(v)
    },
    // 图片向上偏移量（数值自动按 rpx 处理，也可直接传入如 '20px'、'10%'）
    imageOffsetY: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      currentIndex: 0,
      isDragging: false,
      dragOffset: 0,
      startPosition: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 },
      isTransitioning: false,
      autoPlayTimer: null
    };
  },
  computed: {
    imageList() {
      return this.images.length > 0 ? this.images : [
        "/static/logo.png",
        "/static/logo.png",
        "/static/logo.png"
      ];
    },
    isHorizontal() {
      return this.direction === "horizontal";
    },
    containerStyle() {
      return {
        width: this.formatSize(this.width),
        height: this.formatSize(this.height),
        overflow: "hidden",
        position: "relative"
      };
    },
    wrapperStyle() {
      return {
        width: "100%",
        height: "100%",
        position: "relative"
      };
    },
    trackStyle() {
      const movePercent = 100 / this.imageList.length;
      const translateValue = -(this.currentIndex * movePercent) + this.dragOffset * movePercent / 100;
      const transform = this.isHorizontal ? `translateX(${translateValue}%)` : `translateY(${translateValue}%)`;
      return {
        display: "flex",
        flexDirection: this.isHorizontal ? "row" : "column",
        transform,
        transition: this.isDragging || this.isTransitioning ? this.isDragging ? "none" : `transform ${this.duration}ms ease-in-out` : "none",
        width: this.isHorizontal ? `${this.imageList.length * 100}%` : "100%",
        height: this.isHorizontal ? "100%" : `${this.imageList.length * 100}%`
      };
    },
    itemStyle() {
      return {
        width: this.isHorizontal ? `${100 / this.imageList.length}%` : "100%",
        height: this.isHorizontal ? "100%" : `${100 / this.imageList.length}%`,
        flexShrink: 0
      };
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.autoPlay && this.imageList.length > 1) {
        this.startAutoPlay();
      }
    });
  },
  beforeDestroy() {
    this.stopAutoPlay();
  },
  methods: {
    formatSize(size) {
      if (typeof size === "number") {
        return `${size}rpx`;
      }
      return size;
    },
    calculateTranslate() {
      return -(this.currentIndex * 100) + this.dragOffset;
    },
    startAutoPlay() {
      this.stopAutoPlay();
      if (this.autoPlay && this.imageList.length > 1) {
        this.autoPlayTimer = setInterval(() => {
          this.next();
        }, this.interval);
      }
    },
    stopAutoPlay() {
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer);
        this.autoPlayTimer = null;
      }
    },
    next() {
      if (this.isTransitioning)
        return;
      if (this.currentIndex >= this.imageList.length - 1) {
        if (this.loop) {
          this.goToSlide(0);
        }
      } else {
        this.goToSlide(this.currentIndex + 1);
      }
    },
    prev() {
      if (this.isTransitioning)
        return;
      if (this.currentIndex <= 0) {
        if (this.loop) {
          this.goToSlide(this.imageList.length - 1);
        }
      } else {
        this.goToSlide(this.currentIndex - 1);
      }
    },
    goToSlide(index) {
      if (this.isTransitioning || index === this.currentIndex)
        return;
      this.isTransitioning = true;
      this.currentIndex = index;
      setTimeout(() => {
        this.isTransitioning = false;
      }, this.duration);
      this.$emit("change", {
        current: index,
        item: this.imageList[index]
      });
    },
    handleTouchStart(e) {
      if (!this.draggable)
        return;
      this.stopAutoPlay();
      this.isDragging = true;
      this.dragOffset = 0;
      const touch = e.touches[0];
      this.startPosition = { x: touch.clientX, y: touch.clientY };
      this.currentPosition = { x: touch.clientX, y: touch.clientY };
    },
    handleTouchMove(e) {
      if (!this.draggable || !this.isDragging)
        return;
      const touch = e.touches[0];
      this.currentPosition = { x: touch.clientX, y: touch.clientY };
      const deltaX = this.currentPosition.x - this.startPosition.x;
      const deltaY = this.currentPosition.y - this.startPosition.y;
      if (this.isHorizontal) {
        this.dragOffset = deltaX / common_vendor.index.getSystemInfoSync().windowWidth * 100;
      } else {
        this.dragOffset = deltaY / common_vendor.index.getSystemInfoSync().windowHeight * 100;
      }
      e.preventDefault();
    },
    handleTouchEnd(e) {
      if (!this.draggable || !this.isDragging)
        return;
      this.isDragging = false;
      const deltaX = this.currentPosition.x - this.startPosition.x;
      const deltaY = this.currentPosition.y - this.startPosition.y;
      const threshold = 50;
      if (this.isHorizontal) {
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            this.prev();
          } else {
            this.next();
          }
        }
      } else {
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0) {
            this.prev();
          } else {
            this.next();
          }
        }
      }
      this.dragOffset = 0;
      if (this.autoPlay) {
        this.startAutoPlay();
      }
    },
    onItemClick(item, index) {
      this.$emit("click", {
        item,
        index
      });
    },
    onImageError() {
      common_vendor.index.__f__("warn", "at components/scroll-banner.vue:334", "ScrollBanner: 图片加载失败");
    },
    // 归一化偏移量
    normalizeOffset(val) {
      if (val === null || val === void 0)
        return "0";
      if (typeof val === "number")
        return `${val}rpx`;
      const s = String(val).trim();
      return s.length ? s : "0";
    },
    imageBgStyle(item) {
      const src = item && item.src ? item.src : item;
      const align = this.imageAlign;
      const base = align === "top" ? "0%" : align === "bottom" ? "100%" : "50%";
      const offset = this.normalizeOffset(this.imageOffsetY);
      const isZero = offset === "0" || offset === "0rpx" || offset === "0px" || offset === "0%";
      const backgroundPosition = isZero ? `center ${base}` : `center calc(${base} - ${offset})`;
      return {
        width: "100%",
        height: "100%",
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition,
        backgroundRepeat: "no-repeat"
      };
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($options.imageList, (item, index, i0) => {
      return {
        a: common_vendor.s($options.imageBgStyle(item, index)),
        b: index,
        c: common_vendor.o(($event) => $options.onItemClick(item, index))
      };
    }),
    b: common_vendor.s($options.itemStyle),
    c: common_vendor.s($options.trackStyle),
    d: common_vendor.s($options.wrapperStyle),
    e: common_vendor.o((...args) => $options.handleTouchStart && $options.handleTouchStart(...args)),
    f: common_vendor.o((...args) => $options.handleTouchMove && $options.handleTouchMove(...args)),
    g: common_vendor.o((...args) => $options.handleTouchEnd && $options.handleTouchEnd(...args)),
    h: $props.showIndicators && $options.imageList.length > 1
  }, $props.showIndicators && $options.imageList.length > 1 ? {
    i: common_vendor.f($options.imageList, (item, index, i0) => {
      return {
        a: `indicator-${index}`,
        b: $data.currentIndex === index ? 1 : "",
        c: common_vendor.o(($event) => $options.goToSlide(index))
      };
    })
  } : {}, {
    j: common_vendor.s($options.containerStyle)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b9fe736d"]]);
my.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-alipay/components/scroll-banner.js.map
