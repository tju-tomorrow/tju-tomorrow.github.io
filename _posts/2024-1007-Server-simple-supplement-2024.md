# Server

---
layout:     post   				    # 使用的布局（不需要改ti）
title:       	Server			# 标题 
subtitle:          Simple supplement about Server to better understand how browser work#副标题
date:       2024-10-07 				# 时间
author:     BY 陈凯旋		 				# 作者
header-img: img/post-bg-2015.jpg 	#这篇文章标题背景图片
catalog: true 						# 是否归档
tags:								#标签
    - Server
    - http
    - https
    - port
    - domain
---

a point should be explicit .As a user the browser is on your side like Chrome,it fights for you.And the server is a provider that offers services . It’s like a computer being open all the time 24/7.

This should be noted because it should be known that the website you visit and the webpage you view doesn’t belong to the browser It originally comes from server.

So when we talked about 域名 协议 ip these are the properties that servers apply on the website.

Every server has a unique ip address to be differentiated But since it’s digits 域名 shows up .域名就是 [example.com](http://example.com)

So when you put a 域名 on the browser’s search bar The browser parse it into ip address so you can get access to a server that aligns with the parsed ip.

The protocol is well known http and https These are specifically created for webpage-transmit These two specify the rules during the transmit between server and browser (client) these rules ought to be understood by server and browser so they can communicate properly (the proper thing the server should return)

So this is ought to be known that website is just one of the many services that a server can provide and output by the specific 端口 （80 443）the

when you wanna input a url with http/https started There will be a internet request sent to port 80 /443 of the server

This request is sent by the browser And the browser’s basis is the type of the request
