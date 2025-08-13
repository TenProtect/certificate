<template>
  <el-dialog :append-to-body="true" :before-close="handleClose" :visible.sync="visible">
    <div style="margin-top:-25px;">
      <div class="dialog-title">
        <span>{{ isCreate ? '创建商家' : '更新商家' }}</span>
      </div>
      <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
        <el-form-item label="名称" prop="name">
          <el-input size="medium" v-model="form.name" placeholder="请填写名称" />
        </el-form-item>
        <el-form-item label="显示上线" prop="online">
          <el-switch
            v-model="display"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="上线"
            inactive-text="下线"
          />
        </el-form-item>
        <el-form-item label="头像" prop="logo">
          <upload-imgs ref="uploadEle" :max-num="maxNum" :value="initData" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input size="medium" v-model="form.description" type="textarea" :rows="1" placeholder="请填写描述" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer" style="padding-left:5px;">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="resetForm('form')">重 置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Merchant from '@/model/merchant'
import UploadImgs from '@/component/base/upload-image'

export default {
  components: { UploadImgs },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    isCreate: {
      type: Boolean,
      default: false,
    },
    merchantId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      display: true,
      initData: [],
      maxNum: 1,
      form: {
        name: '',
        logo: '',
        description: '',
        online: 1,
      },
    }
  },
  computed: {
    visible: {
      get() {
        return this.dialogFormVisible
      },
      set() {},
    },
  },
  watch: {
    display(val) {
      this.form.online = val ? 1 : 0
    },
  },
  async mounted() {
    if (!this.isCreate) {
      const res = await Merchant.getMerchant(this.merchantId)
      this.form = res
      this.display = res.online === 1
      if (res.logo) {
        this.initData = [{ display: res.logo }]
      }
    }
  },
  methods: {
    async submitForm() {
      await this.getValue()
      let res
      if (this.isCreate) {
        res = await Merchant.addMerchant(this.form)
      } else {
        res = await Merchant.editMerchant(this.merchantId, this.form)
      }
      if (res.code < window.MAX_SUCCESS_CODE) {
        this.$message.success(res.message)
        this.$emit('dialogClose')
      }
    },
    async getValue() {
      const val = await this.$refs.uploadEle.getValue()
      if (val && val.length > 0) {
        this.form.logo = val[0].display
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleClose(done) {
      done()
      this.$emit('dialogClose')
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog-title {
  color: $parent-title-color;
  font-size: 16px;
  margin-bottom: 20px;
}
</style>
