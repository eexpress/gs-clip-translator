/* extension.js
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

//~ 第一次点击开菜单时出的信息，和两个 can_focus 无关。
//~ clutter_input_focus_set_cursor_location: assertion 'clutter_input_focus_is_focused (focus)' failed

const GETTEXT_DOMAIN = 'clip-translator';

const { GObject, Gio, St } = imports.gi;

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
let newtext = false;

const IconPerLine = 10;
const AutoIcon = 'global-symbolic';

const MD5 = Me.imports.md5;
const md5 = MD5.MD5;

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
	_init() {
		super._init(0.0, _('Clip Translator'));

		const micon = new St.Icon({ gicon: local_gicon("trans-symbolic"), icon_size: 30 });
		this.add_child(micon);
		this.menu.connect('open-state-changed', (menu, open) => {
			if (open && mauto.state == false && newtext) {call_trans();}
		});
		//~ ----------------------------------------
		const minput = new PopupMenu.PopupBaseMenuItem({reactive: false});
		const input = new St.Entry({
			name: 'searchEntry',
			style_class: 'large_text',
			primary_icon: new St.Icon({ gicon: local_gicon(AutoIcon) }),
			secondary_icon: new St.Icon({ gicon: local_gicon("zh") }),
			can_focus: true,
			hint_text: _('Input text to translate.'),
			track_hover: true,
			x_expand: true,
		});
		input.connect('primary-icon-clicked', ()=>{mflag.visible = true; action=1});
		input.connect('secondary-icon-clicked', ()=>{mflag.visible = true; action=2});
		input.clutter_text.connect('activate', (actor) => {call_trans()});
		minput.add(input);
		this.menu.addMenuItem(minput);
		//~ ----------------------------------------
		const mflag = new PopupMenu.PopupBaseMenuItem({reactive: false});
		const vbox = new St.BoxLayout({vertical: true});
		const hbox = [];
		let cnt = 0;
		let i = 0;
		[AutoIcon,'ara','de','en','spa','fra','jp','kor','ru','zh'].forEach(showicon);
		function showicon(str){
			if(cnt%IconPerLine == 0){
				i = parseInt(cnt/IconPerLine);
				hbox[i] = new St.BoxLayout({style_class: 'iconlist'});
			}
			const icon = new St.Icon({ gicon: local_gicon(str)});
			const butt = new St.Button({ can_focus: true, child: icon });
			butt.connect('button-press-event', () => {choose_lang(str);});
			hbox[i].add_child(butt);
			cnt++;
		}
		hbox.forEach((i)=>{vbox.add_child(i)});
		mflag.actor.add_child(vbox);
		mflag.visible = false;
		this.menu.addMenuItem(mflag);
		//~ ----------------------------------------
		const mauto = new PopupMenu.PopupSwitchMenuItem(_('Auto translate'), false, {style_class: 'large_text'});
		//~ mauto.connect('toggled', () => {});
		this.menu.addMenuItem(mauto);
		//~ ----------------------------------------
		this._selection = global.display.get_selection();
		this._clipboard = St.Clipboard.get_default();
		this._ownerChangedId = this._selection.connect('owner-changed', () => {
			this._clipboard.get_text(St.ClipboardType.PRIMARY, (clipboard, text) => {
				if(text){
					input.text = text.replace(/\n/g,'');
					newtext = true;
					if(mauto.state == true){this.menu.open(); call_trans();}
				}
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
					if(str === AutoIcon) from = 'auto'; else from = str;
					break;
				 case 2:
					if(str === AutoIcon) break;	// to 不能设置为自动
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
		async function call_trans(){
			await baidu_api();
		}

		function baidu_api(){
			const appid = '20220103001044988';
			const key = 'KhmibtYkwpatwHEwLcym';
			const salt = (new Date).getTime();
			const query = (input.text)? input.text : 'test';
			const str = appid + query + salt +key;
			const sign = md5(str);
			let url = 'http://api.fanyi.baidu.com/api/trans/vip/translate?q=';
			//~ url += GLib.uri_escape_string(query, null, true);
			url += encodeURI(query);
			url += `&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`;
			//~ log(query);
		//~ ----------------------------------------
			const Soup = imports.gi.Soup;
			const session = new Soup.SessionAsync({timeout: 10});
			// 如果不异步，可能网络卡住，导致系统卡死。
			const message = Soup.Message.new('GET',url);
			//~ OK
			//~ --------------------------
			//~ http://blog.mecheye.net/2012/02/requirements-and-tips-for-getting-your-gnome-shell-extension-approved/
			//~ const urii = 'http://api.fanyi.baidu.com/api/trans/vip/translate';
			//~ const message = Soup.Message.new('POST',urii);
			//~ const params = {
					//~ 'q':encodeURI(query),
					//~ 'appid':appid, 'salt':salt, 'sign':sign,
					//~ 'from':from, 'to':to
				//~ }
			//~ const _params = JSON.stringify(params);
			//~ const _params = Soup.form_encode_hash(params);
			//~ const message = Soup.form_request_new_from_hash('GET', urii, _params);
			//~ message.set_request('application/json',	Soup.MemoryUse.COPY, _params);
			//~ message.set_request('application/x-www-form-urlencoded',	Soup.MemoryUse.COPY, _params);
			// GET POST 都没有反映，没有 Response
			//~ --------------------------
			//~ const message = Soup.form_request_new_from_hash('GET', url, {});
			//Response -> "UNAUTHORIZED USER"
			//~ --------------------------
			session.queue_message(message, () => {
				const response = message.response_body.data;
				//~ log(`Response: ${response}`);
				const obj = JSON.parse(response);
				if(obj.to) input.text = obj.trans_result[0].dst;
				newtext = false;
			});
		};
		//~ ----------------------------------------
//~ {"from":"en","to":"zh","trans_result":[{"src":"get","dst":"\u6536\u5230"}]}
//~ {"error_code":"58001","error_msg":"INVALID_TO_PARAM"}
		//~ ----------------------------------------
	}

	destroy(){
		this._selection.disconnect(this._ownerChangedId);
		if (this._actor) this._actor.destroy();
		super.destroy();
	};
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
