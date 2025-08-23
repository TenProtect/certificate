<template>
  <div class="container" v-if="!showDetail">
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
      @handleView="handleView"
      @handlePhoto="handlePhoto"
    />
    <el-dialog title="完成订单" :visible.sync="dialogVisible">
      <el-form label-width="80px">
        <el-form-item label="标准照">
          <upload-imgs ref="standardUpload" :max-num="1" />
        </el-form-item>
        <el-form-item label="排版照" v-if="currentHasLayout">
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
    <el-dialog title="用户上传照片" :visible.sync="photoDialogVisible">
      <el-image v-if="previewPhoto" :src="previewPhoto" :preview-src-list="[previewPhoto]" style="max-width: 100%" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="downloadPhoto">下载</el-button>
      </span>
    </el-dialog>
  </div>
  <photo-order-detail
    v-else
    :order-id="detailId"
    :remark="detailRemark"
    @viewClose="detailClose"
  />
</template>

<script>
import LinTable from '@/component/base/table/lin-table'
import UploadImgs from '@/component/base/upload-image'
import photoOrder from '@/model/photo-order'
import PhotoOrderDetail from './photo-order-detail'

export default {
  components: { LinTable, UploadImgs, PhotoOrderDetail },
  data() {
    return {
      tableColumn: [
        { prop: 'orderNo', label: '订单号' },
        { prop: 'documentName', label: '证照' },
        { prop: 'location', label: '地区' },
        { prop: 'cardNo', label: '身份证号' },
        { prop: 'remark', label: '备注' },
        { prop: 'amount', label: '金额' },
        { prop: 'statusText', label: '状态' }
      ],
      tableData: [],
      operate: [],
      loading: false,
      dialogVisible: false,
      photoDialogVisible: false,
      previewPhoto: '',
      currentId: null,
      currentHasLayout: false,
      detailId: null,
      detailRemark: '',
      showDetail: false,
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
      { name: '完成', func: 'handleReview', type: 'primary', show: row => row.status === 1 },
      { name: '驳回', func: 'handleReject', type: 'danger', show: row => row.status === 1 },
      { name: '查看', func: 'handleView', type: 'primary', show: row => row.status === 3 },
      { name: '用户照片', func: 'handlePhoto', type: 'primary', show: row => !!row.originalPhoto }
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
      const snapshot = JSON.parse(val.row.certificateSnapshot || '{}')
      this.currentHasLayout = !!snapshot.printLayout
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
      const layout = this.currentHasLayout && this.$refs.layoutUpload ? await this.$refs.layoutUpload.getValue() : []
      const receipt = await this.$refs.receiptUpload.getValue()
      this.form.standard_photo = standard && standard.length > 0 ? standard[0].display : ''
      this.form.layout_photo = layout && layout.length > 0 ? layout[0].display : ''
      this.form.receipt_photo = receipt && receipt.length > 0 ? receipt[0].display : ''
      await photoOrder.review(this.currentId, this.form)
      this.dialogVisible = false
      await this.fetch()
    },
    handleReject(val) {
      this.$prompt('请输入驳回原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async ({ value }) => {
        await photoOrder.reject(val.row.id, value)
        await this.fetch()
      })
    },
    handleView(val) {
      this.detailId = val.row.id
      this.detailRemark = val.row.remark || ''
      this.showDetail = true
    },
    handlePhoto(val) {
      this.previewPhoto = val.row.originalPhoto
      this.photoDialogVisible = true
    },
    downloadPhoto() {
      if (!this.previewPhoto) {
        this.$message.warning('没有可下载的图片')
        return
      }

      // 创建一个临时的 a 标签来下载文件
      const link = document.createElement('a')
      link.style.display = 'none'

      // 如果是跨域图片，需要先获取blob再下载
      if (this.previewPhoto.startsWith('http')) {
        fetch(this.previewPhoto, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        })
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob)
          link.href = url
          link.download = `user_photo_${Date.now()}.jpg`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        })
        .catch(error => {
          console.error('下载失败:', error)
          // 如果fetch失败，尝试直接下载
          link.href = this.previewPhoto
          link.download = `user_photo_${Date.now()}.jpg`
          link.target = '_blank'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      } else {
        // 如果是同域图片，直接下载
        link.href = this.previewPhoto
        link.download = `user_photo_${Date.now()}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },
    detailClose() {
      this.showDetail = false
      this.fetch()
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
