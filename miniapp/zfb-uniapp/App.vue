<script>
import TabBarManager from '@/utils/tabbar-manager.js'
import { refreshToken } from '@/utils/api.js'

export default {
        onLaunch: function() {
                console.log('App Launch')
                // 初始化TabBar管理
                TabBarManager.initTabBar()
                this.startHeartbeat()
        },
        onShow: function() {
                console.log('App Show')
                // 应用显示时确保隐藏原生TabBar
                TabBarManager.onPageSwitch()
                this.startHeartbeat()
        },
        onHide: function() {
                console.log('App Hide')
                this.stopHeartbeat()
        },
        methods: {
                startHeartbeat() {
                        this.stopHeartbeat()
                        this.heartbeatTimer = setInterval(this.checkToken, 5 * 60 * 1000)
                },
                stopHeartbeat() {
                        if (this.heartbeatTimer) {
                                clearInterval(this.heartbeatTimer)
                                this.heartbeatTimer = null
                        }
                },
                async checkToken() {
                        const token = uni.getStorageSync('token')
                        if (!token || this.tokenExpiredShown) {
                                if (!token) {
                                        this.tokenExpiredShown = false
                                }
                                return
                        }
                        try {
                                const res = await refreshToken()
                                if (res.code === 0) {
                                        uni.setStorageSync('token', res.data.token)
                                        uni.setStorageSync('refreshToken', res.data.refreshToken)
                                } else {
                                        throw new Error('refresh failed')
                                }
                        } catch (e) {
                                this.tokenExpiredShown = true
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
