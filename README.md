# gnome-shell-clip-translator

---

第二个javascript程序。继续猜。

auto translate selected text to locale language. (X selection "primary" / XA_PRIMARY)

![](screenshot.png)

- 自动翻译：如果打开，选择文字，菜单会立刻弹出翻译结果。
- 如果关闭，选择文字后，需要点击菜单，打开后才翻译。
- 文本输入栏，输入文字回车，会翻译。
- 输入栏的主次图标表示翻译的语言设置，点击会弹出图标，以选择语言。世界地图表示自动检测语言。
- 没有显示的语言，需要做一个svg文件，放到img目录，文件名改成locale写法的语言名，比如fr,de,en等。
- 目前只做了百度翻译接口。

---
Special thanks `JustPerfection`