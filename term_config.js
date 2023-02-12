const root_dir = '/data/data/com.termdo/files'
const dir = '/termdo_alpine'
export default {
	root_dir,
	theme: {

	},
	terminal: {
		cmd: root_dir + '/start.sh',
		// cwd: root_dir + dir + '/root',
		// args: ['-S', root_dir + dir, '/bin/ash', '-l'],
		// envs: [
		// 	'TERM=xterm-256color',
		// 	'AUTHOR=zakiaatot',
		// 	'HOME=' + root_dir + dir + '/root'
		// ],
		welcome: 'Welcome to \x1B[1;3;31mTermDo\x1B[0m!\n\r' +
			'Powered by @\x1b[1;1;32mZakiaatot\x1b[0m!\n\r' +
			'https://github.com/zakiaatot\n\r' +
			'\u2764\ufe0f  \u2764\ufe0f  \u2764\ufe0f\n\r'
	}
}
