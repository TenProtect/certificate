import { post, get, put, _delete } from '@/lin/plugin/axios'

class Merchant {
  static async addMerchant(data) {
    const res = await post('v1/merchant', data)
    return res
  }

  static async getMerchant(id) {
    const res = await get(`v1/merchant/${id}`)
    return res
  }

  static async editMerchant(id, data) {
    const res = await put(`v1/merchant/${id}`, data)
    return res
  }

  static async deleteMerchant(id) {
    const res = await _delete(`v1/merchant/${id}`)
    return res
  }

  static async getMerchants(page = 0, count = 10) {
    const res = await get('v1/merchant/page', { page, count })
    return res
  }

  static async getList() {
    const res = await get('v1/merchant/list')
    return res
  }
}

export default Merchant
