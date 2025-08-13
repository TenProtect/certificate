<template>
  <div class="container">
    <div class="header">
      <div class="title">商家列表</div>
      <el-button style="margin-left:30px;" @click.prevent="handleAdd" type="primary" plain size="medium">创建商家</el-button>
    </div>
    <el-table stripe v-loading="loading" :data="tableData">
      <el-table-column prop="id" label="id" width="100" />
      <el-table-column prop="logo" label="头像" width="120">
        <template v-if="scope.row.logo" slot-scope="scope">
          <el-image :src="scope.row.logo" :preview-src-list="imgSrcList" style="max-height: 50px; max-width: 100px;" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="150" />
      <el-table-column prop="online" label="状态" width="100">
        <template slot-scope="scope">{{ scope.row.online === 1 ? '显示' : '不显示' }}</template>
      </el-table-column>
      <el-table-column prop="description" label="描述" min-width="200" :show-overflow-tooltip="true" />
      <el-table-column fixed="right" width="180" label="操作">
        <template slot-scope="scope">
          <el-button @click.prevent="handleEdit(scope.row)" type="primary" plain size="mini">编辑</el-button>
          <el-button @click.prevent="handleDelete(scope.row)" type="danger" plain size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :background="true"
        :page-size="pageCount"
        :current-page="currentPage"
        v-if="refreshPagination"
        layout="prev, pager, next, jumper"
        :total="totalNums"
      />
    </div>
    <merchant-edit
      v-if="dialogFormVisible"
      :dialogFormVisible="dialogFormVisible"
      :isCreate="isCreate"
      :merchantId="merchantId"
      @dialogClose="dialogClose"
    />
  </div>
</template>

<script>
import Merchant from '@/model/merchant'
import MerchantEdit from './merchant-edit'

export default {
  components: { MerchantEdit },
  data() {
    return {
      tableData: [],
      imgSrcList: [],
      totalNums: 0,
      currentPage: 1,
      pageCount: 10,
      refreshPagination: true,
      loading: false,
      dialogFormVisible: false,
      isCreate: false,
      merchantId: 0,
    }
  },
  async created() {
    this.loading = true
    await this.getMerchants()
    this.loading = false
  },
  methods: {
    async getMerchants() {
      const page = this.currentPage - 1
      const count = this.pageCount
      const res = await Merchant.getMerchants(page, count)
      this.tableData = res.items
      this.totalNums = res.total
      this.imgSrcList = this.tableData.map(item => item.logo).filter(i => i)
    },
    async handleCurrentChange(val) {
      this.imgSrcList = []
      this.currentPage = val
      this.loading = true
      await this.getMerchants()
      this.loading = false
    },
    handleAdd() {
      this.isCreate = true
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      this.isCreate = false
      this.merchantId = row.id
      this.dialogFormVisible = true
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该商家，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await Merchant.deleteMerchant(row.id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          if (this.totalNums % this.pageCount === 1 && this.currentPage !== 1) {
            this.currentPage--
          }
          await this.getMerchants()
          this.$message.success(res.message)
        }
      })
    },
    dialogClose() {
      this.dialogFormVisible = false
      this.loading = true
      this.getMerchants().then(() => {
        this.loading = false
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
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
