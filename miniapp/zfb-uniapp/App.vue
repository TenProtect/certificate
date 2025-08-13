<script>
import TabBarManager from '@/utils/tabbar-manager.js'

export default {
	onLaunch: function() {
		console.log('App Launch')
		// 初始化TabBar管理
		TabBarManager.initTabBar()
	},
	onShow: function() {
		console.log('App Show')
		// 应用显示时确保隐藏原生TabBar
		TabBarManager.onPageSwitch()
	},
	onHide: function() {
		console.log('App Hide')
	}
}
</script>

<style>
	/*每个页面公共css */
</style>
