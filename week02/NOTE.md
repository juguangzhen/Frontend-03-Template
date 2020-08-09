学习笔记

request line 

headers

body


HTTP/1.1 200 OK              status line  状态码之类
Content-Type: text/html      headers
Date:                        headers
Connection: keep-alive       headers
Transfer-Encoding:           chunked  
                             空行
c                            一个16进制的数字                             
<html></html>                body
                             空行
0                            一个0 标志结束

深入理解浏览器工作原理第一步
从实现一个请求开始
