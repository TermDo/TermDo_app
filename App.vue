<script>
	import term_config from '/term_config.js'
	export default {
		onLaunch: function() {
			plus.screen.lockOrientation('portrait-primary')
			// 底部安全区域
			// let color, ac, c2int, win
			// color = plus.android.newObject('android.graphics.Color')
			// ac = plus.android.runtimeMainActivity()
			// c2int = plus.android.invoke(color, 'parseColor', '#00000000')
			// win = plus.android.invoke(ac, 'getWindow')
			// plus.android.invoke(win, 'setNavigationBarColor', c2int)
			// console.log('App Launch')
			const Color = plus.android.importClass("android.graphics.Color")
			plus.android.importClass("android.view.Window")
			const mainActivity = plus.android.runtimeMainActivity()
			const window_android = mainActivity.getWindow()
			const WindowManager = plus.android.importClass("android.view.WindowManager")
			const View = plus.android.importClass("android.view.View")
			//设置为全透明  
			window_android.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS | WindowManager.LayoutParams
				.FLAG_TRANSLUCENT_NAVIGATION)
			window_android.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View
				.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE)
			window_android.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
			window_android.setNavigationBarColor(Color.TRANSPARENT)


			//config
			uni.getStorageInfo({
				success: (res) => {
					if (res.currentSize == 0) { //init
						uni.setStorage({
							key: 'term_config',
							data: term_config
						})
						uni.setStorage({
							key: 'init_status',
							data: false
						})
					}
				}
			})

			try {
				if (!uni.getStorageSync('init_status')) {
					uni.reLaunch({
						url: '/pages/init/init',
						success() {
							plus.navigator.closeSplashscreen()
						}
					})
				} else {
					plus.navigator.closeSplashscreen()
				}
			} catch (e) {
				//just wait
			}

		},
		onShow: function() {
			//解决键盘残留问题
			uni.$emit('onShow', true)
			console.log('App Show')
		},
		onHide: function() {
			//解决键盘残留问题
			uni.$emit('onHide', true)
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url(node_modules/xterm/css/xterm.css);
</style>
<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	// @import "uview-plus/index.scss";
</style>
