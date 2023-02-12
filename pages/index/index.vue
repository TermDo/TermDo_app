<template>


	<view class='index_wrap'>

		<u-navbar class='index_nav_bar' title='TermDo' :placeholder='true' bgColor='#f3f4f6'>
			<template #left>
				<u-icon name='list' size='24' @click='menu_open'></u-icon>
			</template>
		</u-navbar>

		<view id='index_main'>
			<term_view v-for='(obj,index) of term_instance' :index='index' v-show='term_select===index'
				parent_id='index_main' :key='obj' />
			<!-- <term_view v-for='index of 100' :index='index' v-show='false' /> -->
		</view>

		<u-popup :show='menu_show_flag' mode='left' :safeAreaInsetTop='true' @close='menu_show_flag = false'
			bgColor='#f3f4f6' :listen='menu_show_flag' :change:listen='index.menu_flag_change'>
			<div class='drawer'>
				<div class='drawer_head' :style='drawer_head_style'>
					<h1>TermDo</h1>
					<u-button v-show='false' v-for='i of 100'></u-button>
					<!-- fix some bug -->
				</div>
				<div class='drawer_body' :style='drawer_body_style'>
					<div class='drawer_body_block' v-for='(obj,index) of term_instance'
						:id='"drawer_body_block_btn"+index'
						:style='index===term_select?"background-color: rgba(0,0,0,0.1)":""'>
						<div class='term_name' @click='change_select($event,index)'>
							{{obj.alias===''?index:obj.alias}}
						</div>
						<div class='drawer_body_block_btn'>
							<div class='drawer_body_block_btn_name' :id='"name_btn"+index'>
								<u-button icon='edit-pen' :id='"name_btn"+index' class='drawer_btn' type='primary'
									size='small' @click='term_name(index)'>
								</u-button>
							</div>
							<div class='drawer_body_block_btn_del'>
								<u-button icon='close' :id='"del_btn"+index' class='drawer_btn' type='error'
									size='small' @click='term_del(index)'></u-button>
							</div>

						</div>
					</div>
					<div class='drawer_body_block'>
						<u-button icon='plus' type='success' class='add_btn' @click='term_add'>
						</u-button>
					</div>
				</div>
				<div class='drawer_foot'>
					<div class='setting'>
						<u-icon name='setting-fill' size='30' id='setting' @click='todo'></u-icon>
					</div>
					<div class='about'>
						<u-icon name='info-circle-fill' size='30' id='about' @click='todo'></u-icon>
					</div>
				</div>
			</div>
		</u-popup>

		<u-toast ref='term_toast'></u-toast>
		<!-- 通知toast -->

		<u-modal :show='modal_show_flag' :title='modal_title' showCancelButton closeOnClickOverlay @close='modal_close'
			@cancel='modal_close' @confirm='name_change'>
			<template #default>
				<view>
					<u--input placeholder='请输入别名' clearable v-model='input_buffer'></u--input>
				</view>
			</template>
		</u-modal>
		<!-- 模态框 -->


	</view>



</template>

<script>
	import term_view
	from '../term_view/term_view.vue'
	export default {
		data() {
			return {
				menu_show_flag: false,
				drawer_head_style: '',
				drawer_body_style: '',
				//about terminal instance
				term_instance: [{
					alias: '',
				}],
				term_select: 0,
				//modal
				modal_show_flag: false,
				modal_title: '',
				input_buffer: '',
				modal_index: 0
			}
		},
		methods: {
			menu_open() {
				this.menu_show_flag = !this.menu_show_flag
			},
			//about terminal
			term_add() {
				this.term_instance.push({
					alias: ''
				})
				this.term_select = this.term_instance.length - 1
				this.menu_show_flag = false
			},
			change_select(event, index) {
				this.term_select = index
				this.menu_show_flag = false
				const sel_obj = this.term_instance[index]
				this.toast('success', (sel_obj.alias === '' ? index : sel_obj.alias) + ' 切换成功！')
			},
			term_del(index) {
				console.log(index)
				this.menu_show_flag = false
				if (this.term_instance.length === 1) { //如果只有最后一个元素
					this.toast('error', '最后一个，禁止删除！')
				} else {
					const del_obj = this.term_instance[index]
					this.term_instance.splice(index, 1)
					if (this.term_select === index) { //如果要删的和要选的一致

						if (this.term_instance.length === index) { //如果删的最后一个
							this.term_select = this.term_select - 1
						} else {
							//不变
						}
					} else { //不一致
						if (this.term_select < index) { //在删的前面
							//不变
						} else { //在删的后面
							this.term_select = this.term_select - 1
						}
					}
					this.toast('success', (del_obj.alias === '' ? index : del_obj.alias) +
						' 删除成功！')
				}

			},
			term_name(index) {
				const name_obj = this.term_instance[index]
				this.modal_title = name_obj.alias === '' ? index.toString() : name_obj.alias
				this.modal_show_flag = true
				this.modal_index = index
			},
			modal_close() {
				this.input_buffer = ''
				this.modal_show_flag = false
			},
			name_change() {
				const name_obj = this.term_instance[this.modal_index]
				name_obj.alias = this.input_buffer

				this.modal_close()
				this.menu_show_flag = false
				this.toast('success', '更改成功！')
			},
			//toast
			toast(type, message) {
				this.$refs.term_toast.show({
					type,
					message,
					duration: 1000
				})
			},
			//todo
			todo() {
				this.menu_show_flag = false
				this.toast('default', '敬请期待！')
			}
		},
		mounted() {
			this.drawer_head_style = 'width: ' + uni.getSystemInfoSync().windowWidth * 0.6 + 'px'
			this.drawer_body_style = 'height: ' + (uni.getSystemInfoSync().windowHeight - 90 - 50 - 15 - 10 - 10 - 5) +
				'px'



			//toast
			uni.$on('create_finish', (res) => {
				this.toast('success', res + ' 创建成功！')
			})
		},
		components: {
			term_view
		}
	}
</script>
<script module='index' lang='renderjs'>
	export default {
		data() {
			return {
				root_element: null,
				menu_scroll_top: 0 //记录滚动条位置
			}
		},
		methods: {
			// tools
			set_css_var(var_name, value) {
				this.root_element.style.setProperty(var_name, value)
			},
			get_css_var(var_name) {
				return getComputedStyle(this.root_element).getPropertyValue(var_name)
			},
			//menu_flag  scroll
			menu_flag_change(menu_flag) {
				if (menu_flag) {
					// //scroll
					// let scroll_timer = null
					// //scroll listener
					// const scroll_listener = () => {
					// 	if (scroll_timer) clearTimeout(scroll_timer)
					// 	this.set_css_var('--hide-scrollbar', 0.4)
					// 	scroll_timer = setTimeout(() => {
					// 		this.set_css_var('--hide-scrollbar', 0)
					// 		scroll_timer = null
					// 	}, 900)
					// }
					// //register
					// const scroll_area = document.getElementsByClassName('drawer_body')[0]
					// scroll_area.onscroll = scroll_listener

					//保持滚动条位置
					const scroll_area = document.getElementsByClassName('drawer_body')[0]
					scroll_area.scrollTop = this.menu_scroll_top
					scroll_area.onscroll = () => {
						this.menu_scroll_top = scroll_area.scrollTop
					}
				}
			}
		},
		mounted() {
			this.root_element = document.getElementsByClassName('index_wrap')[0]


			//drawer_scroll   被另外方法代替
			// //scroll
			// let scroll_timer = null
			// //scroll listener
			// const scroll_listener = () => {
			// 	if (scroll_timer) clearTimeout(scroll_timer)
			// 	this.set_css_var('--hide-scrollbar', 0.4)
			// 	scroll_timer = setTimeout(() => {
			// 		this.set_css_var('--hide-scrollbar', 0)
			// 		scroll_timer = null
			// 	}, 900)
			// }
			// //register
			// const scroll_register = setInterval(() => {
			// 	const scroll_area = document.getElementsByClassName('drawer_body')[0]
			// 	if (scroll_area) {
			// 		scroll_area.onscroll = scroll_listener
			// 		clearInterval(scroll_register)
			// 	}
			// }, 100)
		}
	}
</script>



<style>
	.index_wrap {
		height: 100%;
		padding: 70px 0 0;
		box-sizing: border-box;
		--background-color: #f3f4f6;
		--hide-scrollbar: 0.6;
		--thumb-color: rgba(0, 0, 0, var(--hide-scrollbar));
	}

	.index_nav_bar {
		height: 70px;
		margin-top: -70px;
	}

	#index_main {
		height: 100%;
	}


	/* drawer */
	.drawer {
		padding-bottom: 105px;
	}

	.drawer_head {
		height: 44px;
		text-align: center;
		border-bottom: 2px solid #e4e7ed;
		box-sizing: border-box;
	}

	.drawer_body {
		width: 100%;
		overflow-y: scroll;
		overflow-x: hidden;
	}

	.drawer_body::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background-color: var(--thumb-color);
	}

	.drawer_body::-webkit-scrollbar {
		width: 5px;
		background-color: var(--background-color);
	}

	.drawer_foot {
		position: absolute;
		bottom: 0;
		height: 110px;
		width: 100%;
		border-top: 2px solid #e4e7ed;
		box-sizing: border-box;
	}

	.setting,
	.about {
		height: 100%;
		width: 50%;
		display: inline-block;
	}

	#setting,
	#about {
		height: 100%;
		justify-content: center;
		background-color: var(--background-color);
	}

	.drawer_body_block {

		height: 60px;
		text-align: left;
		padding-left: 10px;
		line-height: 60px;
		border: 1px solid #e4e7ed;
	}


	.drawer_body_block_btn {
		padding-right: 5px;
		float: right;
		height: 100%;
		width: 90px;
		margin-right: 5px;
	}

	.drawer_body_block_btn_del {
		box-sizing: border-box;
		display: inline-block;
		width: 50%;
		height: 100%;
		padding: 0 5px;
	}

	.drawer_body_block_btn_name {
		box-sizing: border-box;
		display: inline-block;
		width: 50%;
		height: 100%;
		padding: 0 5px;
	}

	.drawer_btn {
		margin: 15px 0;
	}

	:deep(.u-button--small) {
		min-width: 0 !important;
	}

	.add_btn {
		margin: 10px 0;
	}

	.term_name {
		float: left;
		height: 100%;
		width: 100px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
