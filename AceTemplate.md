**世界上最好用的纯前端模板【没有之一】**


---


# 概述 #

　　随着Ajax技术的普及，纯前端模板的使用频率越来越高。我们需要一个易学、易用、高性能的模板系统来处理日益繁杂的需求变化。

　　前端模板处理，有90%以上的情况都是在处理html相关字符串，针对这一特性我们设计了一种只包含html和js两种语法的模板系统AceTemplate。

　　对于前端开发者，html和js是无需额外的学习成本。

## 特点 ##

  1. 易学（只需html和js基础），易用(最少的输入)
  1. 智能（自动识别语法、标识符）
  1. 扩展便捷

## 语法 ##

### 以行为单位，分为两种html行和js行，自由穿插 ###

#### 判断是否为html行的规则 ####
  1. 特殊字符开头；
> > 示例：
```
汉字、#{value}、<div>
```
  1. Html标记结尾；
> > 示例：
```
>、src="1.gif" />
```
  1. 没有“双引号、单引号、分号、逗号，大小括号”，不是else等单行语句；
> > 示例：
```
hello world
```
  1. Html属性；
> > 示例：
```
a="12"、a='ab' b="cd"
```
  1. 样式表达式。
> > 示例：
```
div.focus{color: #fff;}、#btnAdd span{}
```

### html行负责输出内容 ###

两种表达式输出；_#{表达式}_和_!#{表达式}_

_#{表达式}_ 采用html字符串编码输出，默认规避xss漏洞

_!#{表达式}_ 采用原文字符串编码输出

### js行负责逻辑处理 ###

### style、script标签和内容原样输出 ###


# 方法 #

## format ##
_格式化输出_
```
/**
 * 格式化输出
 * @param {String|Element} id 模板ID或是模板本身(非标识符将识别为模板本身)
 * @param {Object} data 格式化的数据
 * @param {Object} helper 附加数据(默认为模板对象)
 */
AceTemplate.format = function(id, data, helper)
```


## register ##
_注册模板_
```
/**
 * 注册模板，如果没有参数则是注册所有script标签模板
 * @param {String} id 模板ID
 * @param {Element|String} target 模板对象或者是模板字符串，如果没有则默认获取id对应的DOM对象
 */
AceTemplate.register = function(id, target)
```

## unregister ##
_注销模板_
```
/**
 * 注销模板
 * @param {String} id 模板ID
 */
AceTemplate.unregister = function(id)
```

# 例子 #

## 输入输出用例 ##
http://ace-engine.googlecode.com/svn/trunk/examples/ace-template/case.html

调试：http://jsfiddle.net/zswang/hA7Jd/
  * 集中测试。
```
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<script src="../../scripts/ace-template.js"></script>
		<title>ace template examples</title>
		
		<style type="text/css">
			#log{
				width: 600px;
				height: 400px;
			}
		</style>
	</head>
	<body>
		<textarea id="log"></textarea>
		<script id="t1" type="text/template">
			if (this["title"]) 
			{
				#{title}
			}
			else
			{
				<b>无</b>
			}
		</script>
		
		<script>
			(function() {
				var log = document.getElementById("log");
				var list = [
					{
						input: ["#{this}", "<b>b</b>"],
						output: "&lt;b&gt;b&lt;/b&gt;"
					},
					{
						input: ["!#{this}", "<b>b</b>"],
						output: "<b>b</b>"
					},
					{
						input: ["#{title}#{size}", {
							title: "t"
						}],
						output: "t"
					},
					{
						input: ["#{title}#{size + 2}", {
							title: "t"
						}],
						error: true
					},
					{
						input: ["#{1 + 2 + 3 + 4}"],
						output: "10"
					},
					{
						input: ["t1"],
						output: "\t\t\t\t<b>无</b>\n"
					}
				];
				
				var message = [];
				for (var i = 0; i < list.length; i++) {
					var item = list[i];
					try {
						var output = AceTemplate.format(item.input[0], item.input[1]);
						if (output == item.output) {
							message.push("√" + i + "输出结果符合预期。");
						} else {
							message.push("×" + i + "输出结果不符合预期。-- " + output);
						}
					} catch(ex) {
						if (item.error) {
							message.push("√" + i + "异常符合预期。");
						} else {
							message.push("×" + i + "异常不符合预期。-- " + ex.message);
						}
					}
				}
				log.value = message.join("\n");
			})();
		</script>
	</body>
</html>
```

## 示例普通循环用法 ##
http://ace-engine.googlecode.com/svn/trunk/examples/ace-template/base1.html

调试：http://jsfiddle.net/zswang/S3rwL/
  * 模板中的this代表数据本身，即format的data参数；
  * 逻辑部分用js，输出部分用html，#{表达式}为变量替换。

## 示例和jquery混用 ##
http://ace-engine.googlecode.com/svn/trunk/examples/ace-template/base2.html

调试：http://jsfiddle.net/zswang/dehd6/
  * 逻辑部分和输出部分将编译成一个完整的js函数块。

## 示例默认防止XSS漏洞 ##
http://ace-engine.googlecode.com/svn/trunk/examples/ace-template/security1.html

调试：http://jsfiddle.net/zswang/aXKQA/
  * 输出表达式默认采用html编码；
  * 也可以使用_!#{表达式}_输出原文。

## 示例嵌套模板 ##
http://ace-engine.googlecode.com/svn/trunk/examples/ace-template/nesting1.html

调试：http://jsfiddle.net/zswang/YJWZA/
  * 模板中helper是一个附加参数，默认指AceTemplate本身；
  * 采用不编码输出另一个模板渲染结果既实现嵌套。

## 示例递归模板 ##
http://ace-engine.googlecode.com/svn/trunk/examples/ace-template/recursion1.html

调试：http://jsfiddle.net/zswang/JcwHg/
  * 模板中可以调用自身递归输出。

## 示例关键词 ##
http://ace-engine.googlecode.com/svn/trunk/examples/ace-template/keyword.html

调试：http://jsfiddle.net/zswang/fvLX3/
  * 使用html编码输出可以这样：_AceTemplate.format("#{this}", text);_
  * 通过helper参数，加入keyword方法

# 作者微博 #
http://weibo.com/zswang http://weibo.com/zinkey