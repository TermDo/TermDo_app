<template>
	<div id="status_bar"></div>
	<div id='init'>
		<term_view index='0' parent_id='init' ref='init_term' />
		<u-popup :show='show_flag' mode='center' :round='10'>
			<div class='init_wrap'>
				<div class="init_head">
					<h2>初始化(长时间卡住请重试)</h2>
				</div>
				<div class="init_body">
					<div>
						<h4>{{title}}</h4>
						<u-line-progress :percentage="rate" showText></u-line-progress>
					</div>
				</div>
			</div>
		</u-popup>
	</div>
</template>
<script>
	import term_view from '../term_view/term_view.vue'
	import term_config from '../../term_config.js'
	export default {
		data() {
			return {
				title: '',
				rate: 0,
				show_flag: true
			}
		},
		components: {
			term_view
		},
		mounted() {
			const root_dir = term_config.root_dir

			//download
			this.title = '资源下载中......'
			const download_task = uni.downloadFile({
				url: 'http://termdo.hackerfly.cn/src/termdo_alpine.zip', // 'http://termdo.hackerfly.cn/src/bootstrap-aarch64.zip',
				success: (res) => {
					// console.log(res.tempFilePath)

					// //创建目录
					// plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (file_manager) => {
					// 	file_manager.root.getDirectory('termdo', {
					// 		create: true,
					// 		exclusive: false
					// 	}, (sub_dir) => {
					// 		sub_dir.getDirectory('usr', {
					// 			create: true,
					// 			exclusive: false
					// 		}, (usr_dir) => {
					// 			this.title = '资源解压中......'
					// 			//解压
					// 			plus.zip.decompress(res.tempFilePath, usr_dir
					// 				.toLocalURL(), (
					// 					res) => {
					// 					this.title = '资源解压成功！初始化中！'
					// 					const init_shell = `
					// 					function initApp(){
					// 					  PATH=${root_dir+'/usr/bin:'}+$PATH
					// 					  chmod +x ${root_dir+'/usr/bin/*'}

					// 					  cd ${root_dir+'/usr'}/
					// 					  echo 准备符号链接...
					// 					  for line in \`cat SYMLINKS.txt\`
					// 					  do
					// 					    OLD_IFS="\$IFS"
					// 					    IFS="←"
					// 					    arr=(\$line)
					// 					    IFS="\$OLD_IFS"
					// 					    ln -s \${arr[0]} \${arr[3]}
					// 					  done
					// 					  rm -rf SYMLINKS.txt

					// 					  TMPDIR=${root_dir+'/usr/tmp'}
					// 					  filename=bootstrap
					// 					  rm -rf "\$TMPDIR/\$filename*"
					// 					  rm -rf "\$TMPDIR/*"
					// 					  chmod -R 0777 ${root_dir+'/usr/bin'}/*
					// 					  chmod -R 0777 ${root_dir+'/usr'}/lib/* 2>/dev/null
					// 					  chmod -R 0777 ${root_dir+'/usr'}/libexec/* 2>/dev/null


					// 					  apt update
					// 					  echo -e 一切处理结束
					// 					  bash
					// 					}
					// 					`
					// 					//exec
					// 					this.$refs.init_term.term_write(
					// 						`chmod +x ${root_dir+'/usr/bin'}/*` +
					// 						'\n')
					// 					this.$refs.init_term.term_write(
					// 						`PATH=${root_dir+'/usr/bin'}\n`)
					// 					this.$refs.init_term.term_write(
					// 						'bash\n')
					// 					this.$refs.init_term.term_write(
					// 						'whoami\n')

					// 					// uni.setStorage({
					// 					// 	key: 'init_status',
					// 					// 	data: true,
					// 					// 	success: () => {
					// 					// 		plus.runtime.restart()
					// 					// 	}
					// 					// })

					// 				})
					// 		})
					// 		sub_dir.getDirectory('home', {
					// 			create: true,
					// 			exclusive: false
					// 		})
					// 	})
					// })

					this.title = '资源解压初始化中......'
					const download_location =
						'/storage/emulated/0/Android/data/com.termdo/apps/__UNI__BBF5FD1/' + res.tempFilePath
						.replace('_doc', 'doc')


					const init_shell = `
					function init(){
						echo 移动解压资源...
						mv ${download_location} ${root_dir}
						cd ${root_dir}
						unzip termdo_alpine.zip
						
						chmod +x install.sh
						./install.sh
					}
					`
					this.$refs.init_term.term_write(init_shell + '\n')
					this.$refs.init_term.term_write('init\n')

					this.title = '10秒后自动开始，请勿退出，请耐心等待！'
					// this.show_flag = false
					setTimeout(() => {
						uni.setStorage({
							key: 'init_status',
							data: true,
							success: () => {
								plus.runtime.restart()
							}
						})
					}, 10000)
				}
			})
			download_task.onProgressUpdate((res) => {
				this.rate = res.progress
			})

		}
	}
</script>
<style scoped>
	#status_bar {
		height: 5%;
		background-color: #000;
	}

	#init {
		height: 95%;
	}

	.init_wrap {
		height: 200px;
		width: 300px;
	}

	.init_head {
		height: 60px;
		width: 100%;
		line-height: 60px;
		text-align: center;
	}

	.init_body {
		height: 140px;
		width: 100%;
		text-align: center;

	}

	.init_body div {
		width: 80%;
		height: 100%;
		margin: 20px auto;
	}
</style>
