**事件代理**


---


# 概述 #

　　这是一套基于事件冒泡和自定义属性的事件代理系统。

　　传统开发中处理事件，一般是对每一个DOM对象进行绑定。我们可以从另一个角度思考：用户要做什么，而不是关心用户操作了什么。无论是单击、双击还是右键点击，我们只关心用户要做啥，发出了什么命令(Command)。

# 方法 #

## on ##
_注册事件_
```
/**
 * 注册事件
 * @param {String|Element} element 事件对象id
 * @param {Function} callback 回调函数
 * 	{String} command 命令字符串
 * 	{Element} element 响应的dom
 * 	{Event} e 事件信息
 * @param {String|Array} events 绑定事件列表
 * @return {Number} 返回事件句柄
 */
AceEvent.on = function(element, callback, events)
```

## un ##
_注销事件_
```
/**
 * 注销事件
 * @param {Number} handler 事件对象句柄
 */
AceEvent.un = function(handler)
```

## fire ##
_派发事件_
```
/**
 * 派发事件
 * @param {Number} handler 事件句柄
 * @param {String} command 命令字符串
 * @param {Element} element 事件Dom对象
 * @param {Event} e 事件
 */
AceEvent.fire = function(handler, command, element, e)
```


# DOM扩展属性 #

**event-click|cmd**

**event-mousedown|down**

**event-contextmenu|menu**

**event-mouseup**

**event-dblclick**

**event-keydown**

**event-keyup**