/* eslint-disable class-methods-use-this */
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class Certificate {
  async createCertificate(data) {
    return _axios({
      method: 'post',
      url: 'v1/certificate',
      data,
    })
  }

  async getCertificate(id) {
    const res = await get(`v1/certificate/${id}`)
    return res
  }

  async editCertificate(id, info) {
    const res = await put(`v1/certificate/${id}`, info)
    return res
  }

  async deleteCertificate(id) {
    const res = await _delete(`v1/certificate/${id}`)
    return res
  }

  async getCertificates() {
    return _axios({
      method: 'get',
      url: 'v1/certificate',
      handleError: true,
    })
  }
}

export default new Certificate()
