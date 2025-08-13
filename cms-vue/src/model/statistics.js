import { get } from '@/lin/plugin/axios'

class Statistics {
  static async getOverview() {
    const res = await get('v1/statistics/overview')
    return res
  }

  static async getDaily(days = 14) {
    const res = await get('v1/statistics/daily', { days })
    return res
  }
}

export default Statistics
