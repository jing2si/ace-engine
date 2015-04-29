# 初识前端模板 #

作者：yaya(http://weibo.com/zinkey) 王集鹄(http://weibo.com/zswang)

Add your content here.


# 总述 #

　　“模板”这个词，可能很多人第一印象是后端的技术（Smarty，Velocity等），但本文要讲的却不是后端的概念，而是前端开发中所使用到的一种技术，也就是“前端模板”技术。

　　模板的工作原理可以简单地分成两个步骤：模板解析（翻译）和数据渲染。这两个步骤可分别部署在前端或后端来执行。如果都放在后端执行，则是像Smarty这样的后端模板，而如果都放在前端来执行，则是我们要探讨的前端模板。

# 问题 #

　　随着前端交互的复杂性不变提升，无刷新页面数据传输与渲染越发地频繁化，我们发现传统的前端开发方式在ajax数据渲染等方面存在着一个主要问题：繁琐的数据渲染。当前端从后台通过ajax等方式或许到数据后，如果要将这个数据渲染到指定的dom元素中，则需要进行各种字符串拼接工作或者一系列创建元素的工作，还不论细节的问题（单引号双引号问题等），不管是哪一种形式，都是繁琐且费时的。同时，在可读性与维护性上也存在问题。试想，各种循环操作的字符串拼接，元素创建插入，在需要修改时，都需要重新花费不少时间与精力。那有什么方法可以解决这个问题呢？

# 原理 #

　　当我们在JSP中写 `<ul><li><%=name%></li></ul>` 的时候，其实就是在应用模板，在后台这句话会被转换成 `out.print("<ul><li>"+name+"</li></ul>")` 。模板的数据渲染就是把模板中的占位符（这里是“name”），替换成传入的值（比如替换成“yaya”）。而在前端开发中，这种方式依然具有很高实用价值。前端模板的核心是前端模板引擎，引擎将前端的模板语言转换成浏览器可以解析的html语言。当转换成功后，便可以很方便地将这段html代码放到我们希望的地方去。

![http://ace-engine.googlecode.com/svn/wiki/images/image001.gif](http://ace-engine.googlecode.com/svn/wiki/images/image001.gif)

　　比如我们可以写一段循环的li标签的前端模板语言。通过前端模板引擎转换后成本一连串得li标签的html语言。这时候就可以直接采用innerHTML方法把html代码插入到ul对象中，那么就完成了生成ul列表的功能。

# 初识 #
　　前端的模板核心是模板解析引擎，而解析引擎的主要作用是将模板语言转换成html/xml格式。不同的前端模板有着不同的模板语言，解析引擎因此也各不相同。让我们先来认识几款前端模板，了解下它们各自的模板语言。

　　YayaTemplate是一款轻量级的模板引擎，采用原生javascript语法，具有易学易用等特点。我们来看一段用YayaTemplate渲染列表数据的实例：

　　**模板语言（通用过for循环，输出“这是第n列”的li列表）**
```
for(var i=0;i<list.length;i++){
       {$ <li>这是第 {% i %} 列：{% list[i] %}</li> $}
}
```

　　有了模板语言后，我们只需要将数据“打入”模板语言中的“list”，就可以生成我们想要的html/xml格式了。如上例，我们只需要得到这个模板语言进行翻译，并调用对应的render方法，
```
var list = ["红桃", "方块", "梅花", "黑桃"];
var html = YayaTemplate(templateText).render({list:list});
```

　　这个html则是模板引擎转换成的html/xml语言，在上例中，则为：
```
<li>这是第0列：红桃</li>
<li>这是第1列：方块</li>
<li>这是第2列：梅花</li>
<li>这是第3列：黑桃</li>
```

　　从这个例子中，我们可以发现，{$...$}表示输出的html/xml片段，{%...%}表示输出javascript变量。得到的html，我们可以用直接作为dom的innerHTML或者其他用处。

　　这便是前端模板，它使得我们不必去处理字符串拼接等问题，用最直观的方式来渲染数据。我们再来看另外一款前端模板 EasyTemplate 。还是之前的例子，用EasyTemplate模板写法如下：
```
<#list data as list>
<li>这里是第${list_index} 列：${list}</li>
</#list>
```

　　同样，需要将实际数据替换模板变量，这里采用：
```
var list = ["红桃", "方块", "梅花", "黑桃"];
var html = easyTemplate.render(templateText, list); //templateText指模板语言
```

　　像EasyTemplate这样的前端模板，是属于自定义模板语言的一种前端模板。我们可以从上例看出，“<#list>”就是EasyTemplate自定义的循环条件。像这样EasyTemplate模板一样采用自定义标签的前端模板还有LiteTemplate：
```
<c:for var="item" list="${list}">
   <li>这里是第${for.index}列：${item}</li>
</c:for>
```
　　渲染时采用：
```
var list = ["红桃", "方块", "梅花", "黑桃"];
var html = liteFunction(templateText, 'list')(list);
```

　　好了，我们再来看看jquery作者John Resig所写的一个前端模板jQuery Template。说真的，它如同jQuery一样，短小精悍。还是老例子：
```
<% for(var i = 0; i < list.length; i++) { %>
<li>这是第 <%=i%> 列：<%= list[i] %></li>
<% } %>
```

　　渲染采用：
```
var list = ["红桃", "方块", "梅花", "黑桃"];
var html = tmpl("templateid", list);
```

　　我们可以看出，YayaTemplate与jQueryTemplate在模板语言的写法上正好相反。前者将输出html语言做特殊标记{$...$}，而后者对javascript语言做特殊标记<%...%>。这两种模板已经使得学习成本很低了，而接下来介绍的AceTemplate的写法将更加简单易懂。
```
for (var i = 0; i < list.length; i++) {
<li>这是第 #{i} 列：#{list[i]}</li>
}
```

　　渲染采用：
```
var list = ["红桃", "方块", "梅花", "黑桃"];
var html = AceTemplate.format("templateid", {list:list});
```

　　AceTemplate采用了html与js语言直接混搭的风格，在两者间可以直接的书写，不用添加任何的标志用以区分不同的语言。而在html语言里面，使用js变量则采用`#{`}的方式输出。AceTemplate之所以可以兼容html与js混合写法，是通过按行解析来实现的。所以，如果代码能够保证html语言与js按行划分，这样的用法其实是很方便的。并且AceTemplate值得说明的一点是支持自动编码防止xss漏洞，通过`#{`}渲染出来的javascript变量，已经经过了编码处理，这一点是很方便的。而对于不需要这个功能，需要原文输出的时候，AceTemplate也提供了`!#{`}方法来满足这种需求。

　　通过上面对四个前端模板的简单介绍，我们可以了解到不同前端模板的各种形态，这包括写法与用法等直观印象。但我们知道，前端模板的核心是代码的转换，这肯定是需要转换时间的，那就以上四个不同的前端模板，性能上会有怎样不同的表现呢。

> # 性能 #

　　前端模板语言到html/xml语言，是通过模板引擎进行翻译的。而模板引擎的翻译性能在某种程度上决定了前端模板解决方案的可行性的高低。上诉四种前端模板，各自的性能会是怎么样的，我们对它们进行测试。分别对YayaTemplate、EasyTemplate、jQueryTemplate、AceTemplate、LiteTemplate部署前端模板做同样的操作，比较模板引擎翻译时间代价。

> ### 各自的模板代码如下： ###
> #### YayaTemplate ####
```
for (var i = 0; i < list.length; i++) {
    if (i<100){
        $<li>小于100 这里是第{%i%} 列：{%list[i]%}</li>$}

    }
    else {
        {$<li>不小于100 这里是第{%i%} 列：{%list[i]%}</li>$}

    }
}
```

> #### EasyTemplate ####
```
<#list data as list>
    <#if (list_index < 100)>
        <li>小于100 这里是第${list_index} 列：${list}</li>
    <#else>
        <li>不小于100 这里是第${list_index} 列：${list}</li>
    </#if>
</#list>
```

> #### jQueryTemplate ####
```
<% for (var i=0;i<list.length;i++){ %>
    <% if (i<100) { %>
        <li>小于100 这里是第<%=i%>列：<%=list[i]%></li>
    <% } else{  %>
        <li>不小于100 这里是第<%=i%>列：<%=list[i]%></li>
    <% } %>
<% } %>
```

> #### AceTemplate ####
```
for (var i = 0; i < list.length; i++) {
    if (i<100){
        <li>小于100 这里是第#{i} 列：#{list[i]}</li>
    }
    else{
        <li>不小于100 这里是第#{i} 列：#{list[i]}</li>
    }
}
```

> #### LiteTemplate ####
```
<c:for var="item" list="${list}">
    <c:if test="${for.index&lt;100}">
        <li>小 于100 这里是第 $!{for.index} 列：$!{item}</li>
    </c:if>
    <c:else>
        <li>不小于100 这里是第$!{for.index} 列：$!{item}</li>
    </c:else>
</c:for>
```

　　然后我们改变list数组里面的元素个数，对各个模板翻译执行的时间进行记录。结果如下(xp+ie6/ie8/firefox/chrome运行环境)：

　　**模板翻译时间对比表(第一次翻译并渲染数据 时间单位:毫秒)**

![http://ace-engine.googlecode.com/svn/wiki/images/image002.gif](http://ace-engine.googlecode.com/svn/wiki/images/image002.gif)

　　通过第一次翻译后，如果前端模板可以缓存翻译后的中间代码，或者可以返回构建中间代码的函数，那么再次渲染数据的时候，就不需要再翻译。这样可以极大的缩小渲染数据的时间，提高速度。

　　**综合各种调研数据对比表如下：**

![http://ace-engine.googlecode.com/svn/wiki/images/image003.gif](http://ace-engine.googlecode.com/svn/wiki/images/image003.gif)

# 兼容 #

　　前端模板的兼容性也是一个重要的问题。能够实现用户不同的前端模板需求，将前端模板语言正确翻译成html/xml语言，是优秀的前端模板所需要具备的特点。而通过对以上四款前端模板的测试，并没有发现严重的兼容性问题。但在一些细节上，还是发现了一些问题如下表:

　　兼容性测试对比表

![http://ace-engine.googlecode.com/svn/wiki/images/image004.gif](http://ace-engine.googlecode.com/svn/wiki/images/image004.gif)

# 流程 #

　　对于“什么是前端模板，它有什么特性，怎么使用”这样的问题已经通过上面的分析说明给出了答案。但前端模板既然是前端的范畴，就不可能独立存在，而是需要运用到前端开发的流程中的。而采用了前端模版的开发流程与传统的相比又会是怎么样的呢？

![http://ace-engine.googlecode.com/svn/wiki/images/image005.gif](http://ace-engine.googlecode.com/svn/wiki/images/image005.gif)

　　上图是传统的开发流程。首先将ui设计图转换成html的页面，其中的数据一般先用模拟数据代替。比如，ui设计有个列表，那么可能开发人员会先建立一些模拟的数据填充到节点中，来开发调整页面样式。最后一步，则将需要动态生成（ajax应用等）的地方，将模拟数据的节点变成空白节点，然后在javascript里面拼装这些html节点的字符串，最后再还原到原节点处（比如用innerHTML插入html）。

![http://ace-engine.googlecode.com/svn/wiki/images/image006.gif](http://ace-engine.googlecode.com/svn/wiki/images/image006.gif)

　　上图是一个实例。当列表中的元素需要ajax动态加载的时候，在传统开发中可能按照先开发模拟数据的html页面，再将这些元素拼接成html字符串，之后再进行一系列处理的功能。

　　那么，它的问题是什么呢？很明显，“不可逆”是最大的问题。当开发者完成了开发，这时候如果需要修改，那么将是很头疼的事。由于是由字符串拼接出来的html片段，想直接修改这些字符串来改变结构或是修改样式什么的将是一个比重新开发一遍还要具有挑战的工作。所以，开发者往往选择再来一遍吧:html的模拟数据页面，然后再拼接字符串。除了“不可逆”，维护性差以及开发成本高都是采用传统方式开发富客户端应用的弊病。

　　好吧，我们试着改变这个局面。看看下图，采用前端模板开发的新方式，或许会找到某些答案。

![http://ace-engine.googlecode.com/svn/wiki/images/image007.gif](http://ace-engine.googlecode.com/svn/wiki/images/image007.gif)

　　“双向可逆”，是的，采用前端模板的开发方式，在开发好展示的html页面后，直接经过简单的修改即可生成html+template 页面，无需再拼接字符串，无需再反复重写展示模拟数据的html页面，一切都变得很轻松。我们来看看代码便知道原因了（以ace template为例）。

![http://ace-engine.googlecode.com/svn/wiki/images/image008.gif](http://ace-engine.googlecode.com/svn/wiki/images/image008.gif)

　　如果调用模板引擎，当模板执行数据执行后，直接覆盖parentNode里面的内容。而如果想继续调整html结构等，则不调用模板引擎即可。而原有的调试数据，在需要发布的时候可以直接通过代码编译去掉debug start与debug end之间代码即可（这仅仅是前端模块开发的一种实例，实际开发中可以去掉模拟数据，不用编译）。

# 展望 #

　　前端模板技术其实还有很多的工作要做，比如模板的事件代理，模板的复用性，模板的组件库等等。本文仅对前端模板做了一个大致讲解。相信随着对于前端模板的探索，模板技术会被越来越多得运用的前端开发，特别是富客户端的前端开发中，进一步提高开发效率，为开发人员带来更多的惊喜！

# 参考资料 #
  1. yaya template
    * http://uloveit.com.cn/template
  1. easy template
    * http://www.easyui.org.cn/easyTemplate.html
  1. query template
    * http://ejohn.org/blog/javascript-micro-templating/
  1. ace template
    * http://code.google.com/p/ace-engine/wiki/AceTemplate
    * http://blog.csdn.net/zswang/article/details/6582563
  1. lite template
    * http://code.google.com/p/lite
    * http://firekylin.my.baidu.com