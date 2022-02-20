⭕ gnome-extensions create --uuid='clip-translator@eexpss.gmail.com' --name 'Clip Translator' --description='Translate from Clipboard content' -i
选择一个可用模板：
1) 普通扩展  –  一个空扩展
2) 指示器   –  添加图标到顶栏
模板 [1-2]: 2

# 模板，可用补全
⭕ gnome-extensions create --template=
indicator  plain

⭕ geany metadata.json extension.js

⭕ xgettext --from-code=UTF-8 -o _sample.pot *.js
⭕ mkdir po

# 如果不想被问邮箱，以及下载翻译组模板，可用带 --no-translator 参数。
⭕ msginit --no-translator -l zh_CN.UTF8 -i _sample.pot -o _sample.po
已创建 _sample.po。

⭕ msginit -l zh_CN.UTF8 -i _sample.pot -o po/zh_CN.po
新的翻译库应该包含您的电子邮件地址，这样用户就可以对您的翻译提出意见，
同时软件维护者也可以在出现技术问题时联络您。

Is the following your email address?
  eexpss@eexpss-r720
Please confirm by pressing Return, or enter your email address.
eexpss@gmail.com
取回 https://translationproject.org/team/index.html... 完成。
Please visit your translation team's homepage at
  https://translationproject.org/team/zh_CN.html
  https://translationproject.org/team/index.html
  https://translationproject.org/html/translators.html
  https://translationproject.org/html/welcome.html
and consider joining your translation team's mailing list
  <i18n-zh@googlegroups.com>

已创建 po/zh_CN.po。

# 询问邮箱的差异。
⭕ diff _sample-1.po _sample.po
5c5
< # eexpss <eexpss@gmail.com>, 2022.
---
> # Automatically generated, 2022.
13,14c13,14
< "Last-Translator: eexpss <eexpss@gmail.com>\n"
< "Language-Team: Chinese (simplified) <i18n-zh@googlegroups.com>\n"
---
> "Last-Translator: Automatically generated\n"
> "Language-Team: none\n"

⭕ geany po/zh_CN.po

# 自动编译 po/zh_CN.po 和 schemas/*.xml 文件。
⭕ gnome-extensions pack -f --extra-source=clip-note-symbolic.svg
⭕ gnome-extensions pack -f --extra-source=md5.js --extra-source=img


## 排错
⭕ ag clip-note /var/log/syslog|grep 'Jan 25'|egrep -v '===clip-note===|JS ERROR|inflating|extracting|ignoring null'
⭕ ag clip-note /var/log/syslog|grep 'Jan 25'|egrep -v '===clip-note===|JS ERROR|inflating|extracting'

78637:Jan 25 15:36:55 eexpss-R720 org.gnome.Nautilus[4818]: Warning: : ignoring null tag in /home/eexpss/.local/share/gnome-shell/extensions/clip-note@eexpss.gmail.com/extension.js(line: 8)

