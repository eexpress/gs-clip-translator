# gnome-shell-clip-translator

[<img alt="" height="80" src="https://raw.githubusercontent.com/andyholmes/gnome-shell-extensions-badge/master/get-it-on-ego.svg?sanitize=true">](https://extensions.gnome.org/extension/4744/clip-translator/)

---

第二个javascript程序。继续猜。自动安装请在[官网](https://extensions.gnome.org/)搜索`Clip Translator`。

auto translate selected text to locale language. (X selection "primary" / XA_PRIMARY)

![](screenshot.png)

- 自动翻译：如果打开，选择文字，菜单会立刻弹出翻译结果。
- Automatic translation: if you check this option and select text, the menu will pop up the translation results immediately.
- 如果关闭，选择文字后，需要点击菜单，打开后才翻译。
- If it is unchecked, after selecting the text, you need to click the menu and open it before translation.
- 文本输入栏，输入文字回车，会翻译。
- Text input field, enter the text and press enter to translate.
- 输入栏的主次图标表示翻译的语言设置，点击会弹出图标，以选择语言。世界地图表示自动检测语言。
- The primary and secondary icons in the input field represent the language setting of translation. Click to pop up the icon to select the language. The `world map` represents the automatic detection language.
- 没有显示的语言，需要做一个svg文件，放到img目录，文件名前缀改成语言名，比如fra,de,en等。参照[常见语种列表](http://api.fanyi.baidu.com/doc/21)的国家命名。在`extension.js`的69行列表里面增加新的文件名前缀。缺省语言在21行的to参数。
- For languages not displayed, you need to make an SVG file and put it in the `img` directory. Change the prefix of file name to language name, such as `fra`, `de`, `en`, etc. Refer to the name of the country [list of common languages]（ http://api.fanyi.baidu.com/doc/21 ）. Then add the svg name in `extension.js` (line 69). The default language is the `to` parameter in line 21.
- 目前只做了百度翻译接口。
- Only Baidu translation interface has been made.
- 百度接口的日活是每小时1千次，否则当日封号。如果翻译量大，可以去[百度api平台](http://api.fanyi.baidu.com/manage/developer)注册一个帐号，得到一个ID和密钥，然后把`extension.js`文件里面的appid(130行)和key(131行)替换成自己的，把`metadata.json`文件的name,uuid等改自己的，`~/.local/share/gnome-shell/extensions/`的目录名也改成自己的uuid，这样就脱离了gnome extension的升级管理，自己用一万年。
- The daily life of Baidu API is 1000 times per hour, otherwise it will be sealed on the same day. If there is a large amount of translation, You can register an self account, get an APPID and KEY, and then replace the appid (line 130) and key (line 131) in the `extension.js` file with your own, and change the name and UUID in the `metadata.json` file to your own, `~/.local/share/gnome-shell/extensions/` is also changed to your own UUID, which is separated from the upgrade management of Gnome extension and will work for 10000 years.

```
⭕ tree ~/.local/share/gnome-shell/extensions/clip-translator@eexpss.gmail.com/
.
├── extension.js
├── img
│   ├── ara.svg
│   ├── de.svg
│   ├── en.svg
│   ├── fra.svg
│   ├── global-symbolic.svg
│   ├── jp.svg
│   ├── kor.svg
│   ├── ru.svg
│   ├── spa.svg
│   ├── translator-symbolic.svg
│   ├── trans-symbolic.svg
│   └── zh.svg
├── locale
│   └── zh_CN
│       └── LC_MESSAGES
│           └── clip-translator.mo
├── md5.js
├── metadata.json
└── stylesheet.css
```
---
Special thanks `JustPerfection`
