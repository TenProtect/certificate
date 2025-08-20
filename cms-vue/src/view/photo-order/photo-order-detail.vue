<template>
  <div class="container">
    <div class="title">
      <span>查看订单</span>
      <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>
    <el-divider></el-divider>
    <div class="img-list">
      <div class="img-item" v-if="photos.standardPhoto">
        <div class="label">标准照</div>
        <el-image :src="photos.standardPhoto" :preview-src-list="[photos.standardPhoto]" />
      </div>
      <div class="img-item" v-if="photos.layoutPhoto">
        <div class="label">排版照</div>
        <el-image :src="photos.layoutPhoto" :preview-src-list="[photos.layoutPhoto]" />
      </div>
      <div class="img-item" v-if="photos.receiptPhoto">
        <div class="label">回执照</div>
        <el-image :src="photos.receiptPhoto" :preview-src-list="[photos.receiptPhoto]" />
      </div>
    </div>
  </div>
</template>

<script>
import photoOrder from '@/model/photo-order'

export default {
  props: {
    orderId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      photos: {}
    }
  },
  async mounted() {
    this.photos = await photoOrder.getPhotos(this.orderId)
  },
  methods: {
    back() {
      this.$emit('viewClose')
    }
  }
}
</script>

<style scoped>
.container {
  padding: 0 30px;
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }
  .img-list {
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    .img-item {
      margin-right: 20px;
      margin-bottom: 20px;
      .label {
        margin-bottom: 10px;
      }
      .el-image {
        max-width: 300px;
      }
    }
  }
}
</style>
