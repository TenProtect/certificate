// 定位和地理编码工具类

/**
 * 使用高德地图逆地理编码API获取城市信息
 * 需要申请高德地图Web服务API key
 * @param {number} latitude 纬度
 * @param {number} longitude 经度
 * @param {string} key 高德地图API key
 * @returns {Promise} 城市信息
 */
export function getAddressByAmap(latitude, longitude, key) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo',
      data: {
        key: key,
        location: `${longitude},${latitude}`,
        poitype: '',
        radius: 1000,
        extensions: 'base',
        batch: false,
        roadlevel: 0
      },
      success: (res) => {
        if (res.data && res.data.status === '1' && res.data.regeocode) {
          const addressComponent = res.data.regeocode.addressComponent
          resolve({
            province: addressComponent.province,
            city: addressComponent.city,
            district: addressComponent.district,
            formatted_address: res.data.regeocode.formatted_address
          })
        } else {
          reject(new Error('逆地理编码失败'))
        }
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

/**
 * 使用腾讯地图逆地理编码API获取城市信息
 * 需要申请腾讯地图Web服务API key
 * @param {number} latitude 纬度
 * @param {number} longitude 经度
 * @param {string} key 腾讯地图API key
 * @returns {Promise} 城市信息
 */
export function getAddressByTencent(latitude, longitude, key) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        key: key,
        location: `${latitude},${longitude}`,
        get_poi: 0
      },
      success: (res) => {
        if (res.data && res.data.status === 0 && res.data.result) {
          const addressComponent = res.data.result.address_component
          resolve({
            province: addressComponent.province,
            city: addressComponent.city,
            district: addressComponent.district,
            formatted_address: res.data.result.address
          })
        } else {
          reject(new Error('逆地理编码失败'))
        }
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

/**
 * 通过经纬度范围简单判断城市（离线方案）
 * @param {number} lat 纬度
 * @param {number} lng 经度
 * @returns {string|null} 城市名称
 */
export function getCityByCoordinates(lat, lng) {
  // 主要城市的大致经纬度范围
  const cityRanges = [
    { name: '北京市', lat: [39.4, 41.1], lng: [115.4, 117.5] },
    { name: '上海市', lat: [30.7, 31.9], lng: [120.9, 122.0] },
    { name: '重庆市', lat: [28.1, 32.2], lng: [105.3, 110.2] },
    { name: '天津市', lat: [38.5, 40.3], lng: [116.8, 118.0] },
    { name: '广东省广州市', lat: [22.8, 23.9], lng: [112.9, 114.0] },
    { name: '广东省深圳市', lat: [22.4, 22.9], lng: [113.7, 114.6] },
    { name: '浙江省杭州市', lat: [29.8, 30.6], lng: [119.5, 120.9] },
    { name: '江苏省南京市', lat: [31.1, 32.6], lng: [118.1, 119.3] },
    { name: '四川省成都市', lat: [30.1, 31.4], lng: [103.5, 104.9] },
    { name: '湖北省武汉市', lat: [29.9, 31.4], lng: [113.7, 115.1] },
    { name: '陕西省西安市', lat: [33.7, 34.8], lng: [107.9, 109.5] },
    { name: '河南省郑州市', lat: [34.2, 35.1], lng: [112.9, 114.7] },
    { name: '山东省济南市', lat: [36.0, 37.0], lng: [116.3, 117.8] },
    { name: '辽宁省沈阳市', lat: [41.1, 42.0], lng: [122.8, 124.0] },
    { name: '吉林省长春市', lat: [43.4, 44.2], lng: [125.0, 126.1] },
    { name: '黑龙江省哈尔滨市', lat: [44.9, 46.2], lng: [125.8, 127.3] },
    { name: '福建省福州市', lat: [25.8, 26.4], lng: [119.0, 119.7] },
    { name: '福建省厦门市', lat: [24.2, 24.7], lng: [117.8, 118.4] },
    { name: '云南省昆明市', lat: [24.5, 25.4], lng: [102.4, 103.2] },
    { name: '贵州省贵阳市', lat: [26.1, 27.0], lng: [106.3, 107.1] },
    { name: '甘肃省兰州市', lat: [35.8, 36.4], lng: [103.5, 104.4] },
    { name: '青海省西宁市', lat: [36.4, 37.0], lng: [101.4, 102.1] },
    { name: '宁夏回族自治区银川市', lat: [38.1, 38.9], lng: [105.8, 106.8] },
    { name: '新疆维吾尔自治区乌鲁木齐市', lat: [43.4, 44.2], lng: [86.8, 88.6] },
    { name: '西藏自治区拉萨市', lat: [29.3, 30.2], lng: [90.8, 92.2] },
    { name: '内蒙古自治区呼和浩特市', lat: [40.5, 41.2], lng: [111.4, 112.2] },
    { name: '广西壮族自治区南宁市', lat: [22.5, 23.0], lng: [108.0, 109.0] },
    { name: '海南省海口市', lat: [19.8, 20.3], lng: [110.0, 110.6] },
    { name: '安徽省合肥市', lat: [31.5, 32.2], lng: [117.0, 117.8] },
    { name: '江西省南昌市', lat: [28.4, 29.0], lng: [115.6, 116.2] },
    { name: '山西省太原市', lat: [37.6, 38.2], lng: [112.2, 113.0] },
    { name: '河北省石家庄市', lat: [37.8, 38.5], lng: [114.2, 115.2] }
  ]
  
  for (const city of cityRanges) {
    if (lat >= city.lat[0] && lat <= city.lat[1] && 
        lng >= city.lng[0] && lng <= city.lng[1]) {
      return city.name
    }
  }
  
  return null
}

/**
 * 精简城市名称
 * @param {string} cityName 原始城市名
 * @returns {string} 精简后的城市名
 */
export function simplifyCityName(cityName) {
  if (!cityName) return '未知'
  
  console.log('原始城市名:', cityName)
  
  // 特殊地区处理（优先处理直辖市和特别行政区）
  const specialAreas = {
    '北京': '北京',
    '上海': '上海', 
    '天津': '天津',
    '重庆': '重庆',
    '香港': '香港',
    '澳门': '澳门'
  }
  
  for (const [key, value] of Object.entries(specialAreas)) {
    if (cityName.includes(key)) {
      return value
    }
  }
  
  let simplified = cityName
  
  // 处理省市结构：如"吉林省长春市" -> "长春"
  if (simplified.includes('省') && simplified.includes('市')) {
    const match = simplified.match(/省(.+?)市/)
    if (match && match[1]) {
      simplified = match[1]
    }
  }
  // 处理自治区结构：如"广西壮族自治区南宁市" -> "南宁"
  else if (simplified.includes('自治区') && simplified.includes('市')) {
    const match = simplified.match(/自治区(.+?)市/)
    if (match && match[1]) {
      simplified = match[1]
    }
  }
  // 处理省级单位：如"吉林省" -> "吉林"
  else if (simplified.includes('省')) {
    simplified = simplified.replace(/省$/, '')
  }
  // 处理自治区：如"广西壮族自治区" -> "广西"
  else if (simplified.includes('自治区')) {
    simplified = simplified.replace(/(壮族|维吾尔|回族|蒙古|藏族)?自治区$/, '')
  }
  
  // 去除常见的行政区划后缀
  const suffixes = ['市', '区', '县', '旗', '盟']
  for (const suffix of suffixes) {
    if (simplified.endsWith(suffix)) {
      simplified = simplified.slice(0, -suffix.length)
      break
    }
  }
  
  // 处理一些特殊情况
  const replacements = {
    '内蒙古': '呼和浩特',  // 如果只获取到内蒙古，默认为首府
    '新疆': '乌鲁木齐',
    '西藏': '拉萨',
    '宁夏': '银川',
    '广西': '南宁'
  }
  
  if (replacements[simplified]) {
    simplified = replacements[simplified]
  }
  
  console.log('精简后城市名:', simplified)
  return simplified || '未知'
}
