<template>
	<div :id="'term_wrap'+index" class='term_root' :listen='index' :change:listen='term_view.push_index'
		:listen1='parent_id' :change:listen1='term_view.push_parent_id'>
		<div class='term_view' :listen='output_buffer' :change:listen='term_view.get_message'></div>
		<div class='term_key_view' :listen='show_flag' :change:listen='term_view.retract_keyboard'>
			<div class='key_row'>
				<div class='key_col'>
					<div class='key' :id="'esc_key'+index" @touchstart='term_view.handle_click_key_touchstart'
						@touchend='term_view.handle_click_key_touchfinish'
						@touchcancle='term_view.handle_click_key_touchfinish'>
						ESC
					</div>
				</div>
				<div class='key_col'>
					<div class='key' :id="'dir_key'+index" @touchstart='term_view.handle_click_key_touchstart'
						@touchend='term_view.handle_click_key_touchfinish'
						@touchcancle='term_view.handle_click_key_touchfinish'>
						/
					</div>
				</div>
				<div class='key_col'>
					<div class='key' :id="'arg_key'+index" @touchstart='term_view.handle_click_key_touchstart'
						@touchend='term_view.handle_click_key_touchfinish'
						@touchcancle='term_view.handle_click_key_touchfinish'>
						-
					</div>
				</div>
				<div class='key_col'>
					<div class='key' :id="'home_key'+index" @touchstart='term_view.handle_click_key_touchstart'
						@touchend='term_view.handle_click_key_touchfinish'
						@touchcancle='term_view.handle_click_key_touchfinish'>
						HOME
					</div>
				</div>
				<div class='key_col'>
					<div class='key' :id="'up_key'+index" @touchstart='term_view.handle_click_key_touchstart'
						@touchend='term_view.handle_click_key_touchfinish'
						@touchcancle='term_view.handle_click_key_touchfinish'>
						&#8593;
					</div>
				</div>
				<div class='key_col'>
					<div class='key' :id="'end_key'+index" @touchstart='term_view.handle_click_key_touchstart'
						@touchend='term_view.handle_click_key_touchfinish'
						@touchcancle='term_view.handle_click_key_touchfinish'>
						END
					</div>
				</div>
				<div class='key_col'>
					<div class='key' :id="'pgup_key'+index" @touchstart='term_view.handle_click_key_touchstart'
						@touchend='term_view.handle_click_key_touchfinish'
						@touchcancle='term_view.handle_click_key_touchfinish'>
						PGUP
					</div>
				</div>
			</div>
			<div class='key_row'>
				<div class='key_col'>
					<div class='key' :id="'tab_key'+index" @touchstart='term_view.handle_click_key_touchstart'
						@touchend='term_view.handle_click_key_touchfinish'
						@touchcancle='term_view.handle_click_key_touchfinish'>
						TAB
					</div>
				</div>
				<div class='key_col'>
					<div class='key' :id="'ctrl_key'+index" @touchstart='term_view.handle_hold_key_touch'>
						CTRL
					</div>
				</div>
				<div class='key_col'>
					<div class='key' :id="'alt_key'+index" @touchstart='term_view.handle_hold_key_touch'>
						ALT
					</div>
				</div>
				<div class='key_col'>
					<div class='key' :id="'left_key'+index" @touchstart='term_view.handle_click_key_touchstart'
						@touchend='term_view.handle_click_key_touchfinish'
						@touchcancle='term_view.handle_click_key_touchfinish'>
						&#x2190;
					</div>
				</div>
				<div class='key_col'>
					<div class='key' :id="'down_key'+index" @touchstart='term_view.handle_click_key_touchstart'
						@touchend='term_view.handle_click_key_touchfinish'
						@touchcancle='term_view.handle_click_key_touchfinish'>
						&#x2193;
					</div>
				</div>
				<div class='key_col'>
					<div class='key' :id="'right_key'+index" @touchstart='term_view.handle_click_key_touchstart'
						@touchend='term_view.handle_click_key_touchfinish'
						@touchcancle='term_view.handle_click_key_touchfinish'>
						&#x2192;
					</div>
				</div>
				<div class='key_col'>
					<div class='key' :id="'pgdn_key'+index" @touchstart='term_view.handle_click_key_touchstart'
						@touchend='term_view.handle_click_key_touchfinish'
						@touchcancle='term_view.handle_click_key_touchfinish'>
						PGDN
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

// 组合式+选项式 server层
<script>
	import {
		onBeforeUnmount,
		onMounted,
		ref
	} from 'vue'
	export default {
		props: {
			index: Number | String,
			parent_id: String
		},
		setup() {
			const TermDo_core = uni.requireNativePlugin('TermDo_core') //原生api
			let term_config = null
			try {
				const value = uni.getStorageSync('term_config')
				if (value) {
					term_config = value.terminal
				}
				if (uni.getStorageSync('init_status') === false) {
					term_config = null
				}
			} catch (e) {
				// error
			}



			let fdm
			if (term_config) {
				fdm = TermDo_core.createTerm(term_config.cmd, 0, 0, '/', null) //创建终端
			} else {
				fdm = TermDo_core.createTerm('/system/bin/sh', 0, 0, '/', null, null) //创建终端
			}

			const output_buffer = ref('') //输出缓冲区

			//输出监听
			let change_flag = 0
			plus.globalEvent.addEventListener(fdm.toString(), (res) => {
				change_flag = 1 - change_flag
				output_buffer.value = change_flag + res.data
			}, false)

			//键盘残留问题
			const show_flag = ref(true)
			uni.$on('onShow', () => {
				show_flag.value = true
			})
			uni.$on('onHide', () => {
				show_flag.value = false
			})


			// //延迟开启读取流确保xterm已经挂载
			// onMounted(() => {
			// 	setTimeout(() => {
			// 		TermDo_core.openRead(fdm)
			// 	}, 500)
			// }) //改变策略

			//退出关闭
			onBeforeUnmount(() => {
				TermDo_core.closeTerm(fdm)
			})


			//已被js实现
			//ctrl alt
			// TermDo_core.handleKeys('ctrl', true)



			return {
				fdm,
				TermDo_core,
				output_buffer,
				show_flag
			}
		},
		methods: {
			term_write(data) {
				this.TermDo_core.write(this.fdm, data)
			},
			term_change_size(size) {
				this.TermDo_core.changeSize(this.fdm, size.rows, size.columns)
			},
			device_vibrateLong() {
				uni.vibrateLong()
			},
			device_vibrateShort() {
				uni.vibrateShort()
			},
			// get_root_element() {
			// 	return "term_wrap" + this.index
			// }
			open_read_buffer() {
				this.TermDo_core.openRead(this.fdm)
			},
			//create_finish
			create_finish() {
				uni.$emit('create_finish', this.index)
			}
		}
	}
</script>

// 选项式 view层
<script module='term_view' lang='renderjs'>
	import {
		Terminal
	} from 'xterm'
	import {
		FitAddon
	} from 'xterm-addon-fit'
	// 尝试一下webgl
	import {
		WebglAddon
	} from 'xterm-addon-webgl'

	export default {
		setup() {
			const xterm = new Terminal({
				rendererType: 'canvas',
				cursorBlink: true,
				cursorStyle: 'underline',
				fontWeight: 800,
				fontSize: 14,
				scrollSensitivity: 10000,
				fastScrollModifier: 'alt'
			})

			let show_flag = true

			//key_flag for ctrl  alt 
			let ctrl_key_flag = false
			let alt_key_flag = false

			//index
			let index = null
			let parent_id = null

			let root_element = null

			return {
				xterm,
				show_flag,
				ctrl_key_flag,
				alt_key_flag,
				index,
				parent_id,
				root_element
			}
		},
		methods: {
			//输入出流
			get_message(msg) {
				this.xterm.write(msg.substring(1))
				this.xterm.scrollToBottom()
			},
			submit_message(msg) {
				this.call_server_method('term_write', msg)
			},
			//解决键盘残留问题
			retract_keyboard(show_flag) {
				this.show_flag = show_flag
				if (show_flag) {
					// this.xterm.focus()
				} else {
					this.xterm.blur()
				}
			},
			call_server_method(func_name, args) {
				this.$ownerInstance.callMethod(func_name, args)
			},
			// tools
			set_css_var(var_name, value) {
				this.root_element.style.setProperty(var_name, value)
			},
			get_css_var(var_name) {
				return getComputedStyle(this.root_element).getPropertyValue(var_name)
			},
			//按键处理
			handle_click_key_touchstart(event) { //点击按键开始
				const element = document.getElementById(event.target.id)
				this.change_key_style(element)
				this.call_server_method('device_vibrateShort', null)

				let key = 0

				switch (event.target.id) {
					case 'esc_key' + this.index:
						key = 27
						break;
					case 'dir_key' + this.index:
						return this.submit_message('/') //return
						break;
					case 'arg_key' + this.index:
						return this.submit_message('-') //return
						break;
					case 'home_key' + this.index:
						key = 36
						break;
					case 'up_key' + this.index:
						key = 38
						break;
					case 'end_key' + this.index:
						key = 35
						break;
					case 'pgup_key' + this.index:
						key = 33
						break;
					case 'tab_key' + this.index:
						key = 9
						break;
					case 'left_key' + this.index:
						key = 37
						break;
					case 'down_key' + this.index:
						key = 40
						break;
					case 'right_key' + this.index:
						key = 39
						break;
					case 'pgdn_key' + this.index:
						key = 34
						break;
					default:
						break;
				}

				this.xterm.textarea.dispatchEvent(
					new KeyboardEvent('keydown', {
						keyCode: key
					})
				)
			},
			handle_click_key_touchfinish(event) { //点击按键结束
				const element = document.getElementById(event.target.id)
				this.change_key_style(element)
			},
			handle_hold_key_touch(event) { //保持按键
				const element = document.getElementById(event.target.id)
				this.change_key_style(element)
				this.call_server_method('device_vibrateShort', null)

				if (event.target.id === 'ctrl_key' + this.index) {
					this.ctrl_key_flag = !this.ctrl_key_flag
				} else {
					this.alt_key_flag = !this.alt_key_flag
				}
				/* this.xterm.textarea.dispatchEvent(
						new KeyboardEvent('keydown', {
							keyCode: 67,
							ctrlKey: true
					})
					) */ //test     说明人造KeyboardEvent虽然不能触发input事件 但如果是功能键是可以的
			},
			change_key_style(html_element) { //style change工具
				if (html_element.classList.length === 1) {
					html_element.classList.add('key_hold')
				} else {
					html_element.classList.remove('key_hold')
				}
			},
			push_index(index) {
				this.index = index
			},
			push_parent_id(parent_id) {
				this.parent_id = parent_id
			}
		},
		mounted() {
			/* init */
			//root element
			// console.log(this.index)
			this.root_element = document.getElementById('term_wrap' + this.index)


			const xterm = this.xterm
			const fitAddon = new FitAddon()
			xterm.loadAddon(fitAddon)
			const term_view = this.root_element.getElementsByClassName('term_view')[0]
			xterm.open(term_view)
			//尝试一下webgl 布局出现问题 暂时先不用叭
			// xterm.loadAddon(new WebglAddon)
			xterm.write(
				'Welcome to \x1B[1;3;31mTermDo\x1B[0m!\n\r' +
				'Powered by @\x1b[1;1;32mZakiaatot\x1b[0m!\n\r' +
				'https://github.com/zakiaatot\n\r' +
				'\u2764\ufe0f  \u2764\ufe0f  \u2764\ufe0f\n\r'
			)


			// function for init/resize
			const size_change = () => {
				// xterm.focus()
				term_view.removeAttribute('style')
				term_view.style.height = document.getElementById(this.parent_id).clientHeight - this.get_css_var(
					'--key-view-height').replace('px', '') - 10 - this.get_css_var(
					'--key-view-padding-bottom').replace('px', '') + 'px'

				fitAddon.fit()
				this.call_server_method('term_change_size', {
					rows: xterm.rows,
					columns: xterm.cols
				})
			}
			size_change()





			/* event */
			//write  and   handle  ctrl  and alt
			xterm.onData((data) => {
				if ((this.ctrl_key_flag || this.alt_key_flag)) { //数据拦截 
					// 注意事件顺序
					//拷贝一份flag
					const ctrl_flag = this.ctrl_key_flag
					const alt_flag = this.alt_key_flag
					if (this.ctrl_key_flag) {
						this.ctrl_key_flag = false
						this.change_key_style(document.getElementById('ctrl_key' + this.index))
					}
					if (this.alt_key_flag) {
						this.alt_key_flag = false
						this.change_key_style(document.getElementById('alt_key' + this.index))
					}
					// 如果是26字母自动转大写 
					let key_code = data[0].charCodeAt(0)
					if (key_code >= 97 && key_code <= 122) key_code = key_code - 32

					this.xterm.textarea.dispatchEvent(
						new KeyboardEvent('keydown', {
							keyCode: key_code,
							ctrlKey: ctrl_flag,
							altKey: alt_flag
						})
					)
					if (data.length > 1) { //处理剩余的
						this.submit_message(data.substring(1))
					}
				} else {
					this.submit_message(data)
				}
			})


			//scroll
			let scroll_timer = null
			const scroll_area = this.root_element.getElementsByClassName('xterm-viewport')[0]
			scroll_area.onscroll = () => {
				if (scroll_timer) clearTimeout(scroll_timer)
				this.set_css_var('--hide-scrollbar', 0.4)
				scroll_timer = setTimeout(() => {
					this.set_css_var('--hide-scrollbar', 0)
					scroll_timer = null
				}, 800)
			}
			//bell
			xterm.onBell(() => {
				this.call_server_method('device_vibrateLong', null)
			})
			//resize
			// window.onresize=会被覆盖 window的作用阈是全局 只能addEventListener
			window.addEventListener('resize', () => {
				size_change()
			})



			/* key_view */

			//prevent textarea blur
			// const textarea = this.xterm.textarea
			// textarea.addEventListener('blur', () => {
			// 	if (this.show_flag) {
			// 		xterm.focus()
			// 	}
			// })

			// const mouse_down_key_style = (html_element) => {
			// 	console.log(html_element.classList)
			// }
			// const mouse_up_key_style = (html_element) => {
			// 	let new_class = html_element.getAttribute('class').replace('key_hold', 'key')
			// 	html_element.setAttribute('class', new_class)
			// }

			//esc_key
			// const esc_key = document.getElementById('esc_key')
			// console.log(esc_key)
			// esc_key.onmousedown = (event) => {
			// 	event.preventDefault()
			// 	mouse_down_key_style(esc_key)
			// 	console.log('esc_key down')
			// }
			// esc_key.onmouseup = () => {
			// 	mouse_up_key_style(esc_key)
			// 	console.log('esc_key up')
			// }
			//已被event.preventDefault() 代替


			//preventDefault
			const key_collection = this.root_element.getElementsByClassName('key')
			for (let i = 0; i < key_collection.length; i++) {
				key_collection[i].ontouchstart = (event) => {
					event.preventDefault()
				}
			}

			//ctrl alt
			// 通过拦截到xtermjs之前的keyboardEvent实现 xterm.attachCustomKeyEventHandler((event) => {
			// 	event.preventDefault()
			// 	// console.log(JSON.stringify(event.keyCode))
			// 	if ((this.ctrl_key_flag || this.alt_key_flag) && event.isTrusted) { //拦截,防止死递归
			// 		event.preventDefault()
			// 		this.xterm.textarea.dispatchEvent(
			// 			new KeyboardEvent('keydown', {
			// 				keyCode: event.keyCode,
			// 				ctrlKey: this.ctrl_key_flag,
			// 				altKey: this.alt_key_flag
			// 			})
			// 		)
			// 		if (this.ctrl_key_flag) {
			// 			this.ctrl_key_flag = false
			// 			this.change_key_style(document.getElementById('ctrl_key'))
			// 		}
			// 		if (this.alt_key_flag) {
			// 			this.alt_key_flag = false
			// 			this.change_key_style(document.getElementById('alt_key'))
			// 		}
			// 		return false
			// 	}
			// 	return true
			// })
			// 这个方案很完美，可惜不支持IME输入法  所以在onData中去实现


			//最后开启读取流
			this.call_server_method('open_read_buffer', null)

			//发送事件
			this.call_server_method('create_finish', null)
		}
	}
</script>
<style scoped>
	/* 	wrap
	#term_wrap {
		height: 100%;
	} */
	.term_root {
		height: 100%;
		--background-color: #000;
		/* control auto hide */
		--hide-scrollbar: 0;
		--thumb-color: rgba(255, 255, 255, var(--hide-scrollbar));
		--term-font-size: 12px;
		--term-font-color: white;
		--key-hold-color: rgba(255, 255, 255, 0.4);
		/* key_view */
		--key-view-height: 80px;
		--key-row-height: 40px;
		--key-view-padding-bottom: 15px;
	}

	/* term_view */
	.term_view {
		padding: 5px;
		background-color: var(--background-color);
	}


	/*  customize scroll bar style */
	:deep(.xterm-viewport::-webkit-scrollbar) {
		background-color: var(--background-color);
		width: 5px;
	}

	:deep(.xterm-viewport::-webkit-scrollbar-thumb) {
		background: var(--thumb-color);
		border-radius: 10px;
	}

	/* term_key_view */
	.term_key_view {
		height: var(--key-view-height);
		background-color: var(--background-color);
		padding-bottom: var(--key-view-padding-bottom);
	}

	.key_row {
		width: 100%;
		height: 50%;
		column-count: 7;
		column-gap: 0;
	}

	.key_col {
		height: 100%;
		line-height: var(--key-row-height);
		background-color: var(--background-color);
	}

	.key {
		height: 100%;
		width: 100%;
		font-size: var(--term-font-size);
		font-weight: 600;
		background-color: var(--background-color);
		color: var(--term-font-color);
		text-align: center;
	}

	.key_hold {
		background-color: var(--key-hold-color) !important;
	}

	/* 解决键盘弹出 overflow的问题 */
	:deep(.xterm-helpers) {
		overflow: hidden;
	}
</style>
