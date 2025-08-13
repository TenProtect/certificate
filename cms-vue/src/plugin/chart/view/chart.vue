<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <tiny-area-june
                title="今日流水"
                :num="overview ? Number(overview.today_revenue) : 0"
                percent=""
                :ratio="0"
              ></tiny-area-june>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <tiny-area-june
                title="本月流水"
                :num="monthly_revenue"
                percent=""
                :ratio="0"
              ></tiny-area-june>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <tiny-area-june
                title="总流水"
                :num="overview ? Number(overview.total_revenue) : 0"
                percent=""
                :ratio="0"
              ></tiny-area-june>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <tiny-area-july
                title="今日订单"
                :num="overview ? Number(overview.today_orders) : 0"
                percent=""
                :ratio="0"
              ></tiny-area-july>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <tiny-area-july
                title="本月订单"
                :num="latestMonth ? Number(latestMonth.order_count) : 0"
                percent=""
                :ratio="0"
              ></tiny-area-july>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <tiny-area-july
                title="总订单"
                :num="total_orders"
                percent=""
                :ratio="0"
              ></tiny-area-july>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <line-charts :chart-data="orderLineData" title="订单数走势"></line-charts>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <line-charts :chart-data="revenueLineData" title="流水走势"></line-charts>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Statistics from '@/model/statistics'
import TinyAreaJuly from '../component/tiny-area-july'
import TinyAreaJune from '../component/tiny-area-june'
import LineCharts from '../component/line-chart'

export default {
  components: {
    TinyAreaJuly,
    TinyAreaJune,
    LineCharts,
  },
  data() {
    return {
      overview: null,
      orderLineData: [],
      revenueLineData: [],
    }
  },
  computed: {
    latestMonth() {
      return this.overview && this.overview.monthly && this.overview.monthly[0]
        ? this.overview.monthly[0]
        : null
    },
    total_orders() {
      return this.overview ? Number(this.overview.total_orders) : 0
    },
    monthly_revenue() {
      return this.latestMonth ? Number(this.latestMonth.order_revenue) : 0
    },
  },
  async created() {
    this.overview = await Statistics.getOverview()
    const daily = await Statistics.getDaily(14)
    if (daily) {
      this.orderLineData = []
      this.revenueLineData = []
      daily.forEach(d => {
        this.orderLineData.push({ month: d.date, value: Number(d.order_count), type: '订单数' })
        this.revenueLineData.push({ month: d.date, value: Number(d.order_revenue), type: '流水' })
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;

  .el-row {
    .el-col {
      .grid-content {
        background: #ffffff;
        box-shadow: 0px 2px 14px 0px rgba(243, 243, 243, 1);
        border-radius: 8px;
        min-height: 36px;
        margin-bottom: 20px;
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .none {
    display: none;
  }
}
</style>
