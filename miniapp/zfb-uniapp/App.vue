<script>
import TabBarManager from '@/utils/tabbar-manager.js'
import { heartbeat } from '@/utils/api.js'

export default {
        data() {
                return {
                        heartbeatTimer: null,
                        tokenExpiredShown: false,
                        isAppActive: false
                }
        },
        onLaunch: function() {
                console.log('App Launch')
                // 初始化TabBar管理
                TabBarManager.initTabBar()
                this.isAppActive = true
                this.startHeartbeat()
                
                // 监听登录成功事件，重启心跳检测
                uni.$on('login-success', () => {
                        console.log('收到登录成功事件，重置token过期标志并重启心跳检测')
                        this.tokenExpiredShown = false // 重置token过期标志
                        this.startHeartbeat()
                })
        },
        onShow: function() {
                console.log('App Show')
                // 应用显示时确保隐藏原生TabBar
                TabBarManager.onPageSwitch()
                
                // 只有在应用从后台返回前台时才重启心跳
                if (this.isAppActive) {
                        this.startHeartbeat()
                }
                this.isAppActive = true
        },
        onHide: function() {
                console.log('App Hide')
                this.isAppActive = false
                this.stopHeartbeat()
        },
        methods: {
               startHeartbeat() {
                       // 只有在有token的情况下才启动心跳检测
                       const token = uni.getStorageSync('token')
                       if (!token) {
                               console.log('无token，不启动心跳检测')
                               return
                       }
                       
                       // 如果已经显示过token过期弹框，则不再启动心跳检测
                       if (this.tokenExpiredShown) {
                               console.log('token已过期且已显示弹框，不重新启动心跳检测')
                               return
                       }
                       
                       this.stopHeartbeat()
                       console.log('启动心跳检测')
                       this.heartbeatTimer = setInterval(this.checkToken, 3 * 1000)
                       this.checkToken()
               },
                stopHeartbeat() {
                        if (this.heartbeatTimer) {
                                clearInterval(this.heartbeatTimer)
                                this.heartbeatTimer = null
                        }
                },
               async checkToken() {
                       if (this.tokenExpiredShown) {
                               return
                       }
                       try {
                               await heartbeat()
                       } catch (e) {
                               console.log('token过期，显示登录提醒')
                               this.tokenExpiredShown = true
                               this.stopHeartbeat() // 立即停止心跳检测
                               uni.removeStorageSync('token')
                               uni.removeStorageSync('refreshToken')
                               uni.showModal({
                                       title: '登录过期',
                                       content: '您的登录已过期，请重新登录',
                                       confirmText: '去登录',
                                       cancelText: '知道了',
                                       success: (res) => {
                                               if (res.confirm) {
                                                       uni.switchTab({
                                                               url: '/pages/main/main'
                                                       })
                                                       setTimeout(() => {
                                                               uni.$emit('switch-to-profile')
                                                       }, 100)
                                               }
                                       }
                               })
                       }
               }
       }
}
</script>

<style>
	/*每个页面公共css */
</style>
