<template>
  <div class="container">
    <div class="title">
      <span>创建证照</span>
      <span class="back" @click="back"><i class="iconfont icon-fanhui"></i> 返回</span>
    </div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="form" ref="form" label-width="100px">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="含回执" prop="hasReceipt">
              <el-switch v-model="form.hasReceipt" />
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input-number v-model="form.price" :precision="2" :step="1" />
            </el-form-item>
            <el-form-item label="打印尺寸" prop="printSize">
              <el-input v-model="form.printSize" placeholder="例：26x32mm" />
            </el-form-item>
            <el-form-item label="像素尺寸" prop="pixelSize">
              <el-input v-model="form.pixelSize" placeholder="例：358x441px" />
            </el-form-item>
            <el-form-item label="分辨率" prop="resolution">
              <el-input v-model="form.resolution" placeholder="例：300DPI" />
            </el-form-item>
            <el-form-item label="保存电子照" prop="saveElectronicPhoto">
              <el-switch v-model="form.saveElectronicPhoto" />
            </el-form-item>
            <el-form-item label="排版" prop="printLayout">
              <el-switch v-model="form.printLayout" />
            </el-form-item>
            <el-form-item label="背景色" prop="bgColor">
              <el-color-picker v-model="form.bgColor" />
            </el-form-item>
            <el-form-item label="图片格式" prop="imageFormat">
              <el-input v-model="form.imageFormat" placeholder="例：JPEG" />
            </el-form-item>
            <el-form-item label="文件大小" prop="imageFileSize">
              <el-input v-model="form.imageFileSize" placeholder="例：20KB-50KB" />
            </el-form-item>
            <el-form-item label="要求" prop="requirements">
              <el-input v-model="form.requirements" placeholder="请输入其他要求" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submit">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import certificate from '@/model/certificate'

export default {
  data() {
    return {
      form: {
        name: '',
        hasReceipt: false,
        price: 0,
        printSize: '',
        pixelSize: '',
        resolution: '',
        saveElectronicPhoto: false,
        printLayout: false,
        bgColor: '',
        imageFormat: '',
        imageFileSize: '',
        requirements: '',
      },
    }
  },
  methods: {
    async submit() {
      try {
        await certificate.createCertificate(this.form)
        this.$message.success('创建成功')
        this.$router.push({ path: '/certificate/list' })
      } catch (e) {
        this.$message.error('创建失败')
      }
    },
    back() {
      this.$router.back()
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 0 30px;
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    .back {
      cursor: pointer;
      color: #606266;
      font-size: 14px;
    }
  }
}
</style>
