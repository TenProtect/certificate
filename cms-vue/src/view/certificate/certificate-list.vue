<template>
  <div class="container">
    <div class="header">
      <div class="title">证照列表</div>
      <el-button type="primary" plain size="medium" @click="toCreate">新增证照</el-button>
    </div>
    <lin-table
      :tableColumn="tableColumn"
      :tableData="tableData"
      :loading="loading"
      :operate="operate"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
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
        { prop: 'category', label: '分类' },
        { prop: 'hasReceipt', label: '含回执' },
        { prop: 'needCardNo', label: '需身份证号' },
        { prop: 'price', label: '价格（元）' },
        { prop: 'printSize', label: '打印尺寸' },
        { prop: 'pixelSize', label: '像素尺寸' },
        { prop: 'resolution', label: '分辨率' },
      ],
      tableData: [],
      loading: false,
      operate: [],
    }
  },
  async created() {
    this.loading = true
    await this.getCertificates()
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
    ]
    this.loading = false
  },
  methods: {
    async getCertificates() {
      try {
        this.tableData = await certificate.getCertificates()
      } catch (error) {
        this.tableData = []
      }
    },
    toCreate() {
      this.$router.push({ path: '/certificate/create' })
    },
    handleEdit(val) {
      this.$router.push({ path: '/certificate/edit', query: { id: val.row.id } })
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该证照, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await certificate.deleteCertificate(val.row.id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          await this.getCertificates()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
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
