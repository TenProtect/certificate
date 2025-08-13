<template>
  <div class="container">
    <div class="title">
      <span>{{ isEdit ? '编辑证照' : '创建证照' }}</span>
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
            <el-form-item label="分类" prop="category">
              <el-input v-model="form.category" placeholder="请输入分类" />
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input-number v-model="form.price" :precision="2" :step="1" />
            </el-form-item>
            <el-form-item label="打印尺寸" prop="printSize">
              <div class="size-input">
                <el-input-number v-model="printSizeW" :min="0" />
                <span class="cross">×</span>
                <el-input-number v-model="printSizeH" :min="0" />
                <span class="unit">mm</span>
              </div>
            </el-form-item>
            <el-form-item label="像素尺寸" prop="pixelSize">
              <div class="size-input">
                <el-input-number v-model="pixelSizeW" :min="0" />
                <span class="cross">×</span>
                <el-input-number v-model="pixelSizeH" :min="0" />
                <span class="unit">px</span>
              </div>
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
        category: '',
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
      printSizeW: null,
      printSizeH: null,
      pixelSizeW: null,
      pixelSizeH: null,
      isEdit: false,
      certificateId: null,
    }
  },
  async created() {
    const { id } = this.$route.query
      if (id) {
        this.isEdit = true
        this.certificateId = id
        const info = await certificate.getCertificate(id)
        this.form = {
          name: info.name,
          hasReceipt: !!(info.has_receipt || info.hasReceipt),
          category: info.category,
          price: info.price,
          printSize: info.print_size || info.printSize,
        pixelSize: info.pixel_size || info.pixelSize,
        resolution: info.resolution,
        saveElectronicPhoto: !!(info.save_electronic_photo || info.saveElectronicPhoto),
        printLayout: !!(info.print_layout || info.printLayout),
        bgColor: info.bg_color || info.bgColor,
        imageFormat: info.image_format || info.imageFormat,
        imageFileSize: info.image_file_size || info.imageFileSize,
        requirements: info.requirements,
      }
      const printSize = this.form.printSize
      if (printSize) {
        const ps = printSize.replace('mm', '').split('x')
        this.printSizeW = Number(ps[0]) || null
        this.printSizeH = Number(ps[1]) || null
      }
      const pixelSize = this.form.pixelSize
      if (pixelSize) {
        const pxs = pixelSize.replace('px', '').split('x')
        this.pixelSizeW = Number(pxs[0]) || null
        this.pixelSizeH = Number(pxs[1]) || null
      }
    }
  },
  methods: {
    async submit() {
      this.form.printSize = this.printSizeW !== null && this.printSizeH !== null
        ? `${this.printSizeW}x${this.printSizeH}mm`
        : ''
      this.form.pixelSize = this.pixelSizeW !== null && this.pixelSizeH !== null
        ? `${this.pixelSizeW}x${this.pixelSizeH}px`
        : ''

      // 将字段名转换为蛇形命名
      const submitData = {
        name: this.form.name,
        has_receipt: this.form.hasReceipt,
        category: this.form.category,
        price: this.form.price,
        print_size: this.form.printSize,
        pixel_size: this.form.pixelSize,
        resolution: this.form.resolution,
        save_electronic_photo: this.form.saveElectronicPhoto,
        print_layout: this.form.printLayout,
        bg_color: this.form.bgColor,
        image_format: this.form.imageFormat,
        image_file_size: this.form.imageFileSize,
        requirements: this.form.requirements,
      }

      try {
        if (this.isEdit) {
          await certificate.editCertificate(this.certificateId, submitData)
          this.$message.success('更新成功')
        } else {
          await certificate.createCertificate(submitData)
          this.$message.success('创建成功')
        }
        this.$router.push({ path: '/certificate/list' })
      } catch (e) {
        this.$message.error(this.isEdit ? '更新失败' : '创建失败')
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
.size-input {
  display: inline-flex;
  align-items: center;
  .cross {
    margin: 0 4px;
  }
  .unit {
    margin-left: 4px;
  }
}
</style>
