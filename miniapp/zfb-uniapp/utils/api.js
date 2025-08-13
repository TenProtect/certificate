const API_BASE = 'http://localhost:8080/v1/mini'

export function getCertificates(keyword = '') {
  return new Promise((resolve, reject) => {
    const url = keyword
      ? `${API_BASE}/certificate?keyword=${encodeURIComponent(keyword)}`
      : `${API_BASE}/certificate`
    uni.request({
      url,
      method: 'GET',
      success: (res) => {
        const list = res.data && res.data.data ? res.data.data : res.data
        const mapped = (list || []).map(item => ({
          ...item,
          specs: {
            printSize: item.printSize,
            pixelSize: item.pixelSize,
            resolution: item.resolution,
            saveElectronicPhoto: item.saveElectronicPhoto,
            printLayout: item.printLayout,
            bgColor: item.bgColor,
            imageFormat: item.imageFormat,
            imageFileSize: item.imageFileSize,
            requirements: item.requirements
          }
        }))
        resolve(mapped)
      },
      fail: (err) => reject(err)
    })
  })
}

export default {
  getCertificates
}
