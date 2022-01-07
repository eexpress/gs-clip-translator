⭕ gnome-extensions create --uuid='clip-translator@eexpss.gmail.com' --name 'Clip Translator' --description='Translate from Clipboard content' -i
选择一个可用模板：
1) 普通扩展  –  一个空扩展
2) 指示器   –  添加图标到顶栏
模板 [1-2]: 2

⭕ geany metadata.json extension.js

⭕ xgettext --from-code=UTF-8 -o sample.pot *.js

⭕ msginit -l zh_CN.UTF8 -i sample.pot -o sample.po
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

已创建 sample.po。

⭕ geany sample.po

⭕ mkdir -p locale/zh_CN/LC_MESSAGES/

⭕ msgfmt -c -v sample.po -o locale/zh_CN/LC_MESSAGES/clip-translator.mo
sample.po:8: 警告： 文件头“Project-Id-Version”仍然是默认值未改变
3 条已翻译消息.

⭕ zip -r gnome-shell-clip-translator.zip extension.js metadata.json stylesheet.css md5.js img/ locale/

⭕ unzip -l gnome-shell-clip-translator.zip 
Archive:  gnome-shell-clip-translator.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
     5779  2022-01-07 11:46   extension.js
      305  2022-01-06 13:24   metadata.json
      138  2022-01-05 15:07   stylesheet.css
     7498  2015-11-24 19:07   md5.js
        0  2022-01-06 16:20   img/
    16008  2022-01-04 15:30   img/global-symbolic.svg
     1644  2022-01-04 00:44   img/jp.svg
     3742  2022-01-04 00:49   img/zh.svg
   221580  2022-01-04 00:45   img/spa.svg
     1995  2022-01-04 00:48   img/de.svg
     1822  2022-01-04 00:48   img/en.svg
     1403  2022-01-04 00:43   img/ru.svg
     2600  2022-01-04 00:43   img/kor.svg
    14485  2022-01-04 15:58   img/translator-symbolic.svg
     4462  2022-01-04 00:49   img/ara.svg
     1296  2022-01-04 00:44   img/fra.svg
    14263  2022-01-04 16:03   img/trans-symbolic.svg
        0  2022-01-07 12:01   locale/
        0  2022-01-07 12:01   locale/zh_CN/
        0  2022-01-07 12:02   locale/zh_CN/LC_MESSAGES/
      535  2022-01-07 12:02   locale/zh_CN/LC_MESSAGES/clip-translator.mo
---------                     -------
   299555                     21 files
