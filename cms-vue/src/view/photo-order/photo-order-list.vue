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
      <el-form label-width="80px">
        <el-form-item label="标准照">
          <upload-imgs ref="standardUpload" :max-num="1" />
        </el-form-item>
        <el-form-item label="排版照">
          <upload-imgs ref="layoutUpload" :max-num="1" />
        </el-form-item>
        <el-form-item label="回执照">
          <upload-imgs ref="receiptUpload" :max-num="1" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitReview">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import LinTable from '@/component/base/table/lin-table'
import UploadImgs from '@/component/base/upload-image'
import photoOrder from '@/model/photo-order'

export default {
  components: { LinTable, UploadImgs },
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
        this.tableData = res.map(o => ({
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
      this.$nextTick(() => {
        if (this.$refs.standardUpload) this.$refs.standardUpload.clear()
        if (this.$refs.layoutUpload) this.$refs.layoutUpload.clear()
        if (this.$refs.receiptUpload) this.$refs.receiptUpload.clear()
      })
    },
    async submitReview() {
      const standard = await this.$refs.standardUpload.getValue()
      const layout = await this.$refs.layoutUpload.getValue()
      const receipt = await this.$refs.receiptUpload.getValue()
      this.form.standardPhoto = standard && standard.length > 0 ? standard[0].display : ''
      this.form.layoutPhoto = layout && layout.length > 0 ? layout[0].display : ''
      this.form.receiptPhoto = receipt && receipt.length > 0 ? receipt[0].display : ''
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
