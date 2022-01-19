# Soup

- gnome shell 里面只能使用异步 Soup.SessionAsync()，否则网络卡住能卡死系统。

[Soup.Session.send_message](https://gjs-docs.gnome.org/soup24~2.74.2/soup.session#method-send_message)

```
## send_message(msg)
Parameters:
        msg (Soup.Message) — the message to send
Returns:
        (Number) — the HTTP status code of the response
```

> Synchronously send msg. This call will not return until the
transfer is finished successfully or there is an unrecoverable
error.

> 同步发送消息。此调用将不会返回，直到传输成功或有不可恢复的错误。

> 与 Soup.Session.queue_message 不同，msg 不会被释放返回。

> 请注意，如果您在 Soup.SessionAsync 上调用此方法，它将内部仍然使用异步 I/O，运行 glib 主循环处理消息，这也可能导致其他事件处理。）

> 将此方法与 Soup.Session.send 进行对比，后者也同步发送消息，但在读取之前返回
响应正文，并允许您通过Gio.InputStream。


[POST requests in gjs ](https://gist.github.com/krakensden/601b069ac3045f469aa2)
