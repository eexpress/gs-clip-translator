const { GObject, GLib, Gio, St, Soup } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const ByteArray = imports.byteArray;

const Gettext = imports.gettext.domain(Me.metadata['gettext-domain']);
const _ = Gettext.gettext;

//~ const debug = false;
const debug = true;
function lg(s) {
	if (debug) log("===" + Me.metadata['gettext-domain'] + "===>" + s);
}

let action = 0; // 0 is none, 1 is primary_icon, 2 is secondary_icon.
let from = 'auto';
let to = 'zh';
let newtext = false;
const configfile = Me.path + "/config";

const IconPerLine = 10;

const MD5 = Me.imports.md5;
const md5 = MD5.MD5;

const Indicator = GObject.registerClass(
	class Indicator extends PanelMenu.Button {
		_init() {
			super._init(0.0, _(Me.metadata['name']));
			lg("start");
			const [ok, content] = GLib.file_get_contents(configfile);
			if (ok) {
				const c = ByteArray.toString(content).split(" -> ");
				from = c[0];
				to = c[1];
			}

			const micon = new St.Icon({ gicon : local_gicon("trans-symbolic"), icon_size : 30 });
			this.add_child(micon);
			this.menu.connect('open-state-changed', (menu, open) => {
				if (open && mauto.state == false && newtext) { call_trans(); }
			});

			const minput = new PopupMenu.PopupBaseMenuItem({ reactive : false });
			const input = new St.Entry({
				name : 'searchEntry',
				style_class : 'ct-text',
				primary_icon : new St.Icon({ gicon : local_gicon(from) }),
				secondary_icon : new St.Icon({ gicon : local_gicon(to) }),
				can_focus : true,
				hint_text : _('Input text to translate.'),
				x_expand : true,
			});
			input.connect('primary-icon-clicked', () => {mflag.visible = true; action=1 });
			input.connect('secondary-icon-clicked', () => {mflag.visible = true; action=2 });
			input.clutter_text.connect('activate', (actor) => { call_trans() });
			minput.add(input);
			this.menu.addMenuItem(minput);

			const mflag = new PopupMenu.PopupBaseMenuItem({ reactive : false });
			const vbox = new St.BoxLayout({ vertical : true });
			const hbox = [];
			let cnt = 0;
			let i = 0;
			['auto', 'ara', 'de', 'en', 'spa', 'fra', 'jp', 'kor', 'ru', 'zh'].forEach(showicon);
			function showicon(str) {
				if (cnt % IconPerLine == 0) {
					i = parseInt(cnt / IconPerLine);
					hbox[i] = new St.BoxLayout({ style_class : 'ct-icon' });
				}
				const icon = new St.Icon({ gicon : local_gicon(str) });
				const butt = new St.Button({ can_focus : true, child : icon });
				butt.connect('button-press-event', () => { choose_lang(str); });
				hbox[i].add_child(butt);
				cnt++;
			}
			hbox.forEach((i) => { vbox.add_child(i) });
			mflag.actor.add_child(vbox);
			mflag.visible = false;
			this.menu.addMenuItem(mflag);

			const mauto = new PopupMenu.PopupSwitchMenuItem(_('Auto translate'), false, { style_class : 'ct-text' });
			this.menu.addMenuItem(mauto);

			this._selection = global.display.get_selection();
			this._clipboard = St.Clipboard.get_default();
			this._ownerChangedId = this._selection.connect('owner-changed', () => {
				this._clipboard.get_text(St.ClipboardType.PRIMARY, (clipboard, text) => {
					if (text) {
						input.text = text.replace(/\n/g, '');
						newtext = true;
						if (mauto.state == true) {
							this.menu.open();
							call_trans();
						}
					}
				});
			});

			function local_gicon(str) {
				return Gio.icon_new_for_string(Me.path + "/img/" + str + ".svg");
			}

			function choose_lang(str) {
				switch (action) {
				case 1:
					input.set_primary_icon(new St.Icon({ gicon : local_gicon(str) }));
					from = str;
				case 2:
					if (str === 'auto') break; // to 不能设置为自动
					input.set_secondary_icon(new St.Icon({ gicon : local_gicon(str) }));
					to = str;
					break;
				default:
				}
				mflag.visible = false;
				action = 0;
				//~ log(`${from} -> ${to}`);
			}
			//~ ----------------------------------------
			async function call_trans() {
				await baidu_api();
			}

			function baidu_api() {
				const appid = '20220103001044988';
				const key = 'KhmibtYkwpatwHEwLcym';
				const salt = (new Date).getTime();
				const query = (input.text) ? input.text : 'test';
				const str = appid + query + salt + key;
				const sign = md5(str);
				const q = encodeURI(query);
				const url = 'http://api.fanyi.baidu.com/api/trans/vip/translate';
				const params = `q=${q}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`;

				const _params = {
					'q' : q,
					'from' : from,
					'to' : to,
					'appid' : appid,
					'salt' : salt,
					'sign' : sign
				};
				//~ lg("bp 1");
				//~ 在终端下正常，在这里此函数直接变黑洞？
				//~ let o = Soup.form_encode_hash(_params);
				//~ lg(o);
				//~ lg("bp 2");
				//~ ----------------------------------------
				try {
					const session = new Soup.SessionAsync({ timeout : 10 });
					// 如果不异步，可能网络卡住，导致系统卡死。
					let message;
					const useGET = false;
					if (useGET) { // GET
						message = Soup.Message.new('GET', url + "?" + params);
					} else { // POST
						message = Soup.Message.new('POST', url);
						message.set_request('application/x-www-form-urlencoded', Soup.MemoryUse.COPY, params);
						//~ message.set_request('application/json', Soup.MemoryUse.COPY, JSON.stringify(_params));	//没反映，不支持？
					}

					session.queue_message(message, () => {
						const response = message.response_body.data;
						const obj = JSON.parse(response);
						if (obj.to) input.text = obj.trans_result[0].dst;
						//~ An active wireless connection, in infrastructure mode, involves no access point?
						newtext = false;
					});
				} catch (e) { throw e; }
			};
			//~ ----------------------------------------
			//~ {"from":"en","to":"zh","trans_result":[{"src":"get","dst":"\u6536\u5230"}]}
			//~ {"error_code":"58001","error_msg":"INVALID_TO_PARAM"}
			//~ ----------------------------------------
		}

		destroy() {
			lg("stop");
			GLib.file_set_contents(configfile, `${from} -> ${to}`);
			this._selection.disconnect(this._ownerChangedId);
			if (this._actor) this._actor.destroy();
			super.destroy();
		};
	});

class Extension {
	constructor(uuid) {
		this._uuid = uuid;

		ExtensionUtils.initTranslations();
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
