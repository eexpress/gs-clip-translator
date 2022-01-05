/* extension.js
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

const GETTEXT_DOMAIN = 'clip-translator';

const { GObject, GLib, Gio, St } = imports.gi;

const Gettext = imports.gettext.domain(GETTEXT_DOMAIN);
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

	let action = 0;	// 0 is none, 1 is primary_icon, 2 is secondary_icon.
	let from = 'auto';
	let to = 'zh';
const IconPerLine = 8;

const MD5 = Me.imports.md5;
let md5 = MD5.MD5;

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
	_init() {
		super._init(0.0, _('Clip Translator'));

		this.add_child(new St.Icon({
			//~ icon_name: 'face-devilish-symbolic',
			gicon: local_gicon("trans-symbolic"),
			icon_size: 30,
			style_class: 'system-status-icon',
		}));
		//~ ----------------------------------------
		//~ ----------------------------------------
		const minput = new PopupMenu.PopupBaseMenuItem({reactive: false});
		const input = new St.Entry({
			name: 'searchEntry',
			style_class: 'big_text',
			primary_icon: new St.Icon({ gicon: local_gicon("globa-symbolic") }),
			secondary_icon: new St.Icon({ gicon: local_gicon("zh") }),
			can_focus: true,
			hint_text: _('Input text to translate.'),
			track_hover: true,
			x_expand: true,
		});
		input.connect('primary-icon-clicked', ()=>{mflag.visible = true; action=1});
		input.connect('secondary-icon-clicked', ()=>{mflag.visible = true; action=2});
		input.clutter_text.connect('activate', (actor) => {trans_baidu()});
		minput.add(input);
		this.menu.addMenuItem(minput);
		//~ ----------------------------------------
		const mflag = new PopupMenu.PopupBaseMenuItem({reactive: false});
		//~ const mflag = new PopupMenu.PopupMenuItem('');
		const vbox = new St.BoxLayout({vertical: true});
		//~ vbox.vertical = true;
		let hbox = [];
		let cnt = 0;
		let i = 0;
		['globa-symbolic','ar','de','en','es','fr','ja','ko','ru','zh'].forEach(showicon);
		function showicon(str){
			if(cnt%IconPerLine == 0){
				i = parseInt(cnt/IconPerLine);
				hbox[i] = new St.BoxLayout({style_class: 'iconlist'});
			}
			let icon = new St.Icon({ gicon: local_gicon(str)});
			let butt = new St.Button({ can_focus: true, child: icon });
			butt.connect('button-press-event', () => {choose_lang(str);});
			hbox[i].add_child(butt);
			cnt++;
		}
		hbox.forEach((i)=>{vbox.add_child(i)});
		mflag.actor.add_child(vbox);
		mflag.visible = false;
		this.menu.addMenuItem(mflag);
		//~ ----------------------------------------
		const mauto = new PopupMenu.PopupSwitchMenuItem(_('Auto translate'), true, {style_class: 'large_text'});
		mauto.connect('toggled', () => { log(mauto.state); });
		this.menu.addMenuItem(mauto);
		//~ this._enableTransItem = mauto;
		//~ ----------------------------------------
		this._selection = global.display.get_selection();
		this._clipboard = St.Clipboard.get_default();
		this._ownerChangedId = this._selection.connect('owner-changed', () => {
			this._clipboard.get_text(St.ClipboardType.PRIMARY, (clipboard, text) => {
				input.text = text;
			});
		});
		//~ ----------------------------------------
		function local_gicon(str){
			return Gio.icon_new_for_string(
			Me.path+"/img/"+str+".svg");
		}
		//~ ----------------------------------------
		function choose_lang(str){
			switch(action) {
				 case 1:
					input.set_primary_icon(new St.Icon({gicon: local_gicon(str)}));
					if(str === 'globa-symbolic') from = 'auto'; else from = str;
					break;
				 case 2:
					if(str === 'globa-symbolic') break;	// to 不能设置为自动
					input.set_secondary_icon(new St.Icon({gicon: local_gicon(str)}));
					to = str;
					break;
				 default:
			}
			mflag.visible = false;
			action = 0;
			log(`${from} -> ${to}`);
		}
		//~ ----------------------------------------
		function trans_baidu(){
			const appid = '20220103001044988';
			const key = 'KhmibtYkwpatwHEwLcym';
			const salt = (new Date).getTime();
			const query = (input.text)? input.text : 'test';
			// 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
			const str = appid + query + salt +key;
			const sign = md5(str);
			let url = 'http://api.fanyi.baidu.com/api/trans/vip/translate?q=';
			url += query.replace(/ /g, '%20');
			url += `&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`;
log(url);
			return url;
		};
		//~ ----------------------------------------
	}

	destroy() {
		this._selection.disconnect(this._ownerChangedId);
	}
});

class Extension {
	constructor(uuid) {
		this._uuid = uuid;

		ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
	}

	enable() {
		this._indicator = new Indicator();
		Main.panel.addToStatusArea(this._uuid, this._indicator);
	}

	disable() {
		this._indicator.destroy();
		this._indicator = null;
	}
}

function init(meta) {
	return new Extension(meta.uuid);
}
