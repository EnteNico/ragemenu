fx_version 'adamant'

author 'Ente Nico'
version '1.0.0'
game 'gta5'
lua54 'yes'

client_scripts {
	'src/rageui.lua',
  'src/rageui_nui.lua',
  'example.lua'
}

ui_page 'web/dist/index.html'

files {
  'web/dist/**/*',
}