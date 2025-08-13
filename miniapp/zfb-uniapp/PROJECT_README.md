# 滚动播放组件项目

这是一个基于 UniApp 开发的滚动播放组件项目，包含了一个功能完整的图片滚动展示组件。

## 项目结构

```
zfb-uniapp/
├── components/           # 组件目录
│   ├── scroll-banner.vue # 滚动播放组件
│   └── README.md        # 组件使用说明
├── pages/               # 页面目录
│   ├── index/           # 首页
│   │   └── index.vue    # 基础演示页面
│   └── demo/            # 演示页面
│       └── demo.vue     # 高级演示页面
├── static/              # 静态资源
│   └── logo.png         # 示例图片
├── App.vue              # 应用入口
├── main.js              # 主入口文件
├── pages.json           # 页面配置
└── manifest.json        # 应用配置
```

## 功能特性

### ScrollBanner 组件特性
- ✅ 支持水平和垂直滚动方向
- ✅ 可调节滚动速度（像素/秒）
- ✅ 支持触摸拖拽操作
- ✅ 自动撑满容器宽度
- ✅ 无缝循环滚动
- ✅ 自动播放控制
- ✅ 响应式设计

### 演示页面
- **首页 (index)**：基础功能演示
- **高级演示 (demo)**：所有功能的完整展示

## 快速开始

### 1. 安装依赖
确保已安装 HBuilderX 或配置好 UniApp CLI 环境。

### 2. 运行项目
- 在 HBuilderX 中直接运行
- 或使用 CLI：`npm run dev:h5`

### 3. 使用组件

```vue
<template>
  <scroll-banner 
    :images="imageList"
    direction="horizontal"
    :speed="60"
    height="200rpx"
  />
</template>

<script>
import ScrollBanner from '@/components/scroll-banner.vue'

export default {
  components: { ScrollBanner },
  data() {
    return {
      imageList: [
        '/static/image1.jpg',
        '/static/image2.jpg'
      ]
    }
  }
}
</script>
```

## 组件 API

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| images | Array | [] | 图片列表 |
| direction | String | 'horizontal' | 滚动方向 |
| speed | Number | 50 | 滚动速度 |
| height | String/Number | '200rpx' | 容器高度 |
| width | String/Number | '100%' | 容器宽度 |
| itemWidth | String/Number | '300rpx' | 图片宽度 |
| itemHeight | String/Number | '150rpx' | 图片高度 |
| autoPlay | Boolean | true | 自动播放 |
| draggable | Boolean | true | 是否可拖拽 |

### 图片数据格式

```javascript
// 字符串数组
['image1.jpg', 'image2.jpg']

// 对象数组
[
  { src: 'image1.jpg', alt: '描述1' },
  { src: 'image2.jpg', alt: '描述2' }
]
```

## 使用场景

1. **广告横幅**：商品或活动图片轮播
2. **新闻公告**：文字或图片形式的滚动公告
3. **产品展示**：产品图片的连续滚动展示
4. **品牌展示**：合作伙伴或品牌logo展示

## 平台兼容性

- ✅ H5
- ✅ 微信小程序
- ✅ 支付宝小程序
- ✅ App (Android/iOS)
- ✅ 其他 UniApp 支持的平台

## 注意事项

1. 垂直滚动时务必设置容器高度
2. 图片路径建议使用绝对路径
3. 在小程序中测试触摸事件兼容性
4. 建议使用 rpx 单位以适配不同屏幕

## 技术支持

如有问题或建议，请查看组件源码中的注释或参考 `components/README.md` 文件。
