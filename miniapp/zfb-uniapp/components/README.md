# ScrollBanner 轮播组件

一个功能完整的 UniApp 轮播组件，支持水平和垂直方向的间隔切换展示。

## 功能特性

- ✅ 支持水平和垂直轮播方向
- ✅ 可调节切换间隔时间
- ✅ 支持触摸拖拽切换
- ✅ 默认撑满容器宽度
- ✅ 指示器显示当前位置
- ✅ 自动播放控制
- ✅ 响应式设计
- ✅ 循环播放

## 基本用法

```vue
<template>
  <scroll-banner 
    :images="imageList"
    direction="horizontal"
    :interval="3000"
    :duration="300"
    height="200rpx"
    :auto-play="true"
    :show-indicators="true"
  />
</template>

<script>
import ScrollBanner from '@/components/scroll-banner.vue'

export default {
  components: {
    ScrollBanner
  },
  data() {
    return {
      imageList: [
        { src: '/static/image1.jpg', alt: '图片1' },
        { src: '/static/image2.jpg', alt: '图片2' },
        { src: '/static/image3.jpg', alt: '图片3' }
      ]
    }
  }
}
</script>
```

## 属性说明

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| images | Array | [] | 图片列表，支持字符串数组或对象数组 |
| direction | String | 'horizontal' | 轮播方向：'horizontal'(水平) 或 'vertical'(垂直) |
| interval | Number | 3000 | 自动切换间隔时间，单位：毫秒 |
| duration | Number | 300 | 切换动画时长，单位：毫秒 |
| height | String/Number | '200rpx' | 容器高度 |
| width | String/Number | '100%' | 容器宽度 |
| itemWidth | String/Number | '100%' | 图片宽度（水平轮播时） |
| itemHeight | String/Number | '100%' | 图片高度（垂直轮播时） |
| autoPlay | Boolean | true | 是否自动播放 |
| draggable | Boolean | true | 是否可以拖拽 |
| showIndicators | Boolean | true | 是否显示指示器 |
| loop | Boolean | true | 是否循环播放 |

## 事件说明

| 事件名 | 说明 | 参数 |
|--------|------|------|
| change | 轮播切换时触发 | `{ current: 当前索引, item: 当前项数据 }` |
| click | 点击轮播项时触发 | `{ item: 点击项数据, index: 点击项索引 }` |

## 使用示例

### 基础轮播
```vue
<scroll-banner 
  :images="images"
  direction="horizontal"
  :interval="3000"
  height="200rpx"
  :auto-play="true"
  @change="onBannerChange"
/>
```

### 垂直轮播
```vue
<scroll-banner 
  :images="images"
  direction="vertical"
  :interval="4000"
  height="300rpx"
  item-height="100rpx"
/>
```

### 快速切换
```vue
<scroll-banner 
  :images="images"
  direction="horizontal"
  :interval="1500"
  :duration="200"
  height="150rpx"
  :show-indicators="false"
/>
```

### 手动控制
```vue
<scroll-banner 
  :images="images"
  :auto-play="false"
  :draggable="true"
  height="200rpx"
/>
```

## 图片数据格式

支持两种格式：

### 1. 字符串数组
```javascript
images: [
  '/static/image1.jpg',
  '/static/image2.jpg',
  '/static/image3.jpg'
]
```

### 2. 对象数组
```javascript
images: [
  { src: '/static/image1.jpg', alt: '图片1描述' },
  { src: '/static/image2.jpg', alt: '图片2描述' },
  { src: '/static/image3.jpg', alt: '图片3描述' }
]
```

## 图片数据格式

支持两种格式：

### 1. 字符串数组
```javascript
images: [
  '/static/image1.jpg',
  '/static/image2.jpg',
  '/static/image3.jpg'
]
```

### 2. 对象数组
```javascript
images: [
  { src: '/static/image1.jpg', alt: '图片1描述' },
  { src: '/static/image2.jpg', alt: '图片2描述' },
  { src: '/static/image3.jpg', alt: '图片3描述' }
]
```

## 方法

通过 ref 可以调用以下方法：

| 方法名 | 说明 | 参数 |
|--------|------|------|
| next() | 切换到下一张 | - |
| prev() | 切换到上一张 | - |
| goToSlide(index) | 切换到指定索引 | index: 目标索引 |
| startAutoPlay() | 开始自动播放 | - |
| stopAutoPlay() | 停止自动播放 | - |

### 方法使用示例
```vue
<template>
  <scroll-banner ref="banner" :images="images" />
  <button @click="nextSlide">下一张</button>
  <button @click="prevSlide">上一张</button>
</template>

<script>
export default {
  methods: {
    nextSlide() {
      this.$refs.banner.next()
    },
    prevSlide() {
      this.$refs.banner.prev()
    }
  }
}
</script>
```

## 注意事项

1. **垂直轮播时必须设置容器高度**：`height` 属性是必需的
2. **图片路径**：确保图片路径正确，建议使用绝对路径或在线图片
3. **性能优化**：组件使用了CSS3动画进行优化
4. **触摸事件**：在小程序中完全兼容触摸手势
5. **尺寸单位**：支持 rpx、px、% 等单位，推荐使用 rpx

## 自定义样式

可以通过以下CSS类名进行样式自定义：

```css
/* 容器样式 */
.scroll-banner-container {
  border-radius: 12rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
}

/* 图片样式 */
.scroll-banner-image {
  border-radius: 8rpx;
}

/* 指示器样式 */
.scroll-banner-indicators {
  bottom: 20rpx;
}

.indicator-dot {
  width: 16rpx;
  height: 16rpx;
  background-color: rgba(255, 255, 255, 0.6);
}

.indicator-dot.active {
  background-color: #007aff;
}
```

## 最佳实践

### 1. 响应式图片
推荐使用在线图片服务，自动适配不同屏幕尺寸：
```javascript
images: [
  { src: 'https://example.com/image1.jpg?w=800&h=300', alt: '图片1' }
]
```

### 2. 图片预加载
对于重要轮播图，建议预加载：
```javascript
onReady() {
  this.images.forEach(item => {
    const img = new Image()
    img.src = item.src || item
  })
}
```

### 3. 错误处理
监听图片加载错误：
```vue
<scroll-banner 
  :images="images"
  @error="onImageError"
/>
```

## 兼容性

- ✅ H5
- ✅ 微信小程序
- ✅ 支付宝小程序
- ✅ App (Android/iOS)
- ✅ 其他 UniApp 支持的平台

## 更新日志

### v2.0.0
- 🎉 重构为轮播模式，支持间隔切换
- ✨ 新增指示器显示
- ✨ 新增点击事件
- ✨ 新增手动控制方法
- 🐛 修复自动播放问题
- 💄 优化动画效果

### v1.0.0
- 🎉 初始版本，支持连续滚动
