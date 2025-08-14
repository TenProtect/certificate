<template>
  <div class="container">
    <div class="header">
      <div class="title">订单列表</div>
    </div>
    <lin-table
      :tableColumn="tableColumn"
      :tableData="tableData"
      v-loading="loading"
      :operate="operate"
      @handleReview="handleReview"
      @handleReject="handleReject"
    />
    <el-dialog title="完成订单" :visible.sync="dialogVisible">
      <el-input v-model="form.standardPhoto" placeholder="标准照URL" />
      <el-input v-model="form.layoutPhoto" placeholder="排版照URL" style="margin-top:10px" />
      <el-input v-model="form.receiptPhoto" placeholder="回执照URL" style="margin-top:10px" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitReview">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import LinTable from '@/component/base/table/lin-table'
import photoOrder from '@/model/photo-order'

export default {
  components: { LinTable },
  data() {
    return {
      tableColumn: [
        { prop: 'orderNo', label: '订单号' },
        { prop: 'documentName', label: '证照' },
        { prop: 'location', label: '地区' },
        { prop: 'amount', label: '金额' },
        { prop: 'statusText', label: '状态' }
      ],
      tableData: [],
      operate: [],
      loading: false,
      dialogVisible: false,
      currentId: null,
      form: {
        standardPhoto: '',
        layoutPhoto: '',
        receiptPhoto: ''
      }
    }
  },
  async created() {
    this.loading = true
    await this.fetch()
    this.operate = [
      { name: '完成', func: 'handleReview', type: 'primary' },
      { name: '驳回', func: 'handleReject', type: 'danger' }
    ]
    this.loading = false
  },
  methods: {
    async fetch() {
      try {
        const res = await photoOrder.getOrders()
        this.tableData = res.data.map(o => ({
          ...o,
          amount: o.amount,
          statusText: this.mapStatus(o.status)
        }))
      } catch (e) {
        this.tableData = []
      }
    },
    mapStatus(val) {
      const map = { 0: '待付款', 1: '制作中', 2: '已驳回', 3: '已完成' }
      return map[val] || '待付款'
    },
    handleReview(val) {
      this.currentId = val.row.id
      this.form = { standardPhoto: '', layoutPhoto: '', receiptPhoto: '' }
      this.dialogVisible = true
    },
    async submitReview() {
      await photoOrder.review(this.currentId, this.form)
      this.dialogVisible = false
      this.fetch()
    },
    handleReject(val) {
      this.$prompt('请输入驳回原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async ({ value }) => {
        await photoOrder.reject(val.row.id, value)
        this.fetch()
      })
    }
  }
}
</script>

<style scoped>
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
