/* eslint-disable class-methods-use-this */
import _axios, { get, post } from '@/lin/plugin/axios'

class PhotoOrder {
  async getOrders() {
    const res = await get('v1/mini/order')
    return res
  }

  async reject(id, reason) {
    return post(`v1/mini/order/${id}/reject`, { reason })
  }

  async review(id, data) {
    return post(`v1/mini/order/${id}/review`, data)
  }
}

export default new PhotoOrder()
