<template>
  <div class="container">
    <div class="header">
      <div class="title">证照列表</div>
      <el-button type="primary" plain size="medium" @click="toCreate">新增证照</el-button>
    </div>
    <lin-table
      :tableColumn="tableColumn"
      :tableData="tableData"
      v-loading="loading"
    ></lin-table>
  </div>
</template>

<script>
import certificate from '@/model/certificate'
import LinTable from '@/component/base/table/lin-table'

export default {
  components: {
    LinTable,
  },
  data() {
    return {
      tableColumn: [
        { prop: 'name', label: '名称' },
        { prop: 'badge', label: '类型' },
        { prop: 'hasReceipt', label: '含回执' },
        { prop: 'price', label: '价格' },
        { prop: 'printSize', label: '打印尺寸' },
        { prop: 'pixelSize', label: '像素尺寸' },
        { prop: 'resolution', label: '分辨率' },
      ],
      tableData: [],
      loading: false,
    }
  },
  async created() {
    this.loading = true
    await this.getCertificates()
    this.loading = false
  },
  methods: {
    async getCertificates() {
      try {
        const list = await certificate.getCertificates()
        this.tableData = list
      } catch (error) {
        this.tableData = []
      }
    },
    toCreate() {
      this.$router.push({ path: '/certificate/create' })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }
}
</style>
