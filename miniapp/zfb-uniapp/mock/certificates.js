export default [
  {
    id: 1,
    name: '身份证',
    category: '回执',
    hasReceipt: true,
    price: 20,
    specs: {
      printSize: '26x32mm',
      pixelSize: '358x441px',
      resolution: '300DPI',
      saveElectronicPhoto: true,
      printLayout: true,
      bgColor: '#FFFFFF',
      imageFormat: 'JPEG',
      imageFileSize: '20KB-50KB',
      requirements: '免冠，照片可看见两耳轮廓'
    }
  },
  {
    id: 2,
    name: '护照',
    category: '证照',
    hasReceipt: false,
    price: 20,
    specs: {
      printSize: '33x48mm',
      pixelSize: '390x567px',
      resolution: '300DPI',
      saveElectronicPhoto: true,
      printLayout: true,
      bgColor: '#FFFFFF',
      imageFormat: 'JPEG',
      imageFileSize: '30KB-80KB',
      requirements: '免冠，照片可看见两耳轮廓'
    }
  }
]
