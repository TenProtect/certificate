<template>
  <div :id="chartId"></div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { Line } from '@antv/g2plot'

export default {
  name: 'Line',
  props: {
    chartData: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '趋势分析',
    },
  },
  data() {
    return {
      chartId: `line-${Math.random().toString(36).substr(2, 9)}`,
    }
  },
  watch: {
    chartData: {
      handler() {
        if (this.chart) {
          this.chart.changeData(this.chartData)
        } else {
          this.draw()
        }
      },
      immediate: true,
    },
  },
  methods: {
    draw() {
      this.chart = new Line(this.chartId, {
        title: {
          visible: true,
          text: this.title,
        },
        data: this.chartData,
        forceFit: true,
        seriesField: 'type',
        xField: 'month',
        yField: 'value',
        smooth: true,
        color: ['#4577FF', '#00C292', '#FEC108'],
        legend: {
          visible: true,
          position: 'top-right',
        },
      })
      this.chart.render()
    },
  },
}
</script>

<style scoped></style>
