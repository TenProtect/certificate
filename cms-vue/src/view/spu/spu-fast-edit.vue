<template>
  <div>
    <sticky-top>
      <div class="title">
        <span>快速添加SPU</span>
        <span class="back" @click="back">
          <i class="iconfont icon-fanhui"></i> 返回
        </span>
        <el-divider></el-divider>
      </div>
    </sticky-top>
    <div class="container">
      <div class="wrap">
        <el-row>
          <el-col :lg="16" :md="20" :sm="24" :xs="24">
            <el-form :model="form" ref="form" label-width="100px" @submit.native.prevent>
              <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" placeholder="请填写标题"></el-input>
              </el-form-item>
              <el-form-item label="价格" prop="price">
                <el-input v-model="form.price" placeholder="请填写价格"></el-input>
              </el-form-item>
              <el-form-item label="商家" prop="merchant_id">
                <el-autocomplete
                  @focus="loadMerchantSuggestions"
                  popper-class="my-autocomplete"
                  class="inline-input"
                  v-model="merchantState"
                  :fetch-suggestions="queryMerchantSearch"
                  placeholder="请选择商家"
                  @select="handleMerchantSelect"
                >
                  <template slot-scope="{ item }">
                    <span class="id">{{ item.id }}</span>
                    <span class="name">{{ item.name }}</span>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <el-form-item label="商品图" prop="img">
                <upload-imgs :max-num="1" ref="uploadEle" :value="initData" />
              </el-form-item>
              <el-form-item class="submit">
                <el-button type="primary" @click="submitForm('form')">保 存</el-button>
                <el-button @click="resetForm('form')">重 置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Spu from '@/model/spu'
import Sku from '@/model/sku'
import Merchant from '@/model/merchant'
import UploadImgs from '@/component/base/upload-image'

export default {
  components: { UploadImgs },
  data() {
    return {
      form: {
        title: '',
        price: '',
        img: null,
        merchant_id: null,
        online: 1,
      },
      initData: [],
      merchantState: '',
      merchantSuggestions: [],
    }
  },
  methods: {
    async submitForm(formName) {
      await this.getValue()
      this.form.for_theme_img = this.form.img
      this.form.spu_img_list = [this.form.img]
      this.form.spu_detail_img_list = [this.form.img]
      const postData = { ...this.form }
      const res = await Spu.addSpu(postData)
      if (res.code < window.MAX_SUCCESS_CODE) {
        // 获取新建spu id
        const list = await Spu.getList()
        const spu = list[list.length - 1]
        const skuData = {
          title: spu.title,
          img: spu.img,
          price: spu.price,
          spu_id: spu.id,
          stock: 9999,
          online: 1,
          selectors: [],
        }
        await Sku.addSku(skuData)
        this.$message.success(`${res.message}`)
        this.$confirm('是否返回上一页', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.back()
        })
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    async getValue() {
      const val = await this.$refs.uploadEle.getValue()
      if (val && val.length > 0) {
        this.form.img = val[0].display
      }
    },
    queryMerchantSearch(queryString, cb) {
      const suggestions = this.merchantSuggestions
      const results = queryString ? suggestions.filter(this.createFilter(queryString)) : suggestions
      cb(results)
    },
    createFilter(queryString) {
      return suggestion => {
        return suggestion.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleMerchantSelect(item) {
      this.merchantState = item.name
      this.form.merchant_id = item.id
    },
    async loadMerchantSuggestions() {
      if (this.merchantSuggestions.length > 0) {
        return
      }
      try {
        this.merchantSuggestions = await Merchant.getList()
      } catch (error) {
        this.$message.error('获取商家建议信息失败')
      }
    },
    back() {
      this.$router.back()
    },
  },
}
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 0;
}

.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}

.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;
    display: inline-flex;
    align-content: space-around;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .id {
      margin-right: 15px;
      font-size: 12px;
      color: #b4b4b4;
    }
  }
}
</style>

