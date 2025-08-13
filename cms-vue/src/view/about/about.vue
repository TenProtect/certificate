<template>
  <div class="about-container">
    <canvas ref="starCanvas" class="star-canvas"></canvas>
    <el-card class="center-card" shadow="hover">
      <h1>欢迎使用{{ this.isMobile ? '移动端': '' }}管理平台</h1>
      <p><i class="el-icon-time"></i>{{ currentTime }}</p>
    </el-card>
  </div>
</template>

<script>
import { Card } from 'element-ui'

export default {
  components: { ElCard: Card },
  name: 'About',
  data() {
    return {
      currentTime: '',
      stars: [],
      starCount: 50,
      ctx: null,
      rafStar: null,
      isMobile: false
    }
  },
  mounted() {
    this.checkMobile()
    if (!this.isMobile) this.initStars()
    window.addEventListener('resize', this.handleResize)
    this.startTime()
  },
  beforeDestroy() {
    cancelAnimationFrame(this.rafId)
    cancelAnimationFrame(this.rafStar)
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth < window.innerHeight
    },
    handleResize() {
      this.checkMobile()
      this.stars = []
      if (!this.isMobile) this.initStars()
    },
    initStars() {
      const canvas = this.$refs.starCanvas
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      this.ctx = canvas.getContext('2d')
      this.ctx.scale(dpr, dpr)
      for (let i = 0; i < this.starCount; i++) {
        this.stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: Math.random() * 2 + 1
        })
      }
      this.animateStars()
    },
    animateStars() {
      const canvas = this.$refs.starCanvas
      const { ctx } = this
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.stars.forEach(s => {
        s.x += s.vx
        s.y += s.vy
        if (s.x < 0 || s.x > canvas.width) s.vx *= -1
        if (s.y < 0 || s.y > canvas.height) s.vy *= -1
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        ctx.fill()
      })
      this.rafStar = requestAnimationFrame(this.animateStars)
    },
    startTime() {
      const update = () => {
        const dt = new Date()
        const pad = n => (n < 10 ? `0${n}` : `${n}`)
        const Y = dt.getFullYear()
        const M = pad(dt.getMonth() + 1)
        const D = pad(dt.getDate())
        const h = pad(dt.getHours())
        const m = pad(dt.getMinutes())
        const s = pad(dt.getSeconds())
        this.currentTime = `${Y}-${M}-${D} ${h}:${m}:${s}`
        this.rafId = requestAnimationFrame(update)
      }
      update()
    }
  }
}
</script>

<style scoped>
.about-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
}
.star-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.center-card {
  position: relative;
  z-index: 2;
  text-align: center;
  width: 380px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  border: 2px solid transparent;
  background-clip: padding-box;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.center-card:hover {
  transform: scale(1.03);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}
.center-card h1 {
  font-size: 28px;
  color: #333;
  font-weight: 700;
  margin: 16px 0;
  text-shadow: 1px 1px 4px rgba(0,0,0,0.1);
}
.center-card p {
  font-size: 16px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
}
.center-card p .el-icon-time {
  font-size: 20px;
  color: #409EFF;
  margin-right: 8px;
}

/* Mobile adaptation: portrait orientation */
@media (orientation: portrait) {
  .center-card {
    width: 90%;
    padding: 16px;
  }
  .center-card h1 {
    font-size: 22px;
  }
  .center-card p {
    font-size: 14px;
  }
  .star-canvas { display: none; }
}
</style>
