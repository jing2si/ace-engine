var AcePath = AcePath || {};

void function(exports){
    /**
     * Ace Engine Path
     * 一套展示矢量图路径的控件
     * @see http://code.google.com/p/ace-engine/wiki/AcePath
     * @author 王集鹄(wangjihu,http://weibo.com/zswang)
     * @version 1.0
     * @copyright www.baidu.com
     */
    var 
        ie = document.all && window.attachEvent,
        /*
         * 是否ie9+
         */
        ie9plus = ie && window.XMLHttpRequest && window.addEventListener, 
        svg = !ie || ie9plus,
        vmlStyle;
    
    /**
     * 格式化函数
     * @param {String} template 模板
     * @param {Object} json 数据项
     */
    function format(template, json){
        return template.replace(/#\{(.*?)\}/g, function(all, key){
            return json && (key in json) ? json[key] : "";
        });
    }
    
    function Path(options){
        if (typeof options.parent == 'string'){
            this.parent = document.getElementById(options.parent);
        } else {
            this.parent = options.parent || document.body;
        }
        this.fill = options.fill || 'none';
        this.stroke = options.stroke || 'black';
        this.path = options.path || 'M 0,0';
        var div = document.createElement('div');
        if (svg){
            div.innerHTML = format('\
<svg width=100% height=100% xmlns="http://www.w3.org/2000/svg">\
    <path fill="#{fill}" stroke="#{stroke}" stroke-width="1" d="#{path}"/>\
</svg>', this);
            this.element = div.lastChild;
            this.elementPath = div.lastChild.lastChild;
            this.parent.appendChild(this.element);
        } else {
            //div.style.height = '100%';
            //div.style.width = '100%';
            div.innerHTML = format('\
<v:shape class="ace_path_shape" coordsize="1,1" stroked="t" filled="f" path="#{path}">\
    <v:stroke color=#{stroke} weight=1></v:stroke>\
    <v:fill></v:fill>\
</v:shape>', this);
            this.element = div;
            div.className = 'ace_path_panel';
            this.elementPath = div.lastChild;
            this.elementFill = this.elementPath.getElementsByTagName('fill')[0];
            this.elementStroke = this.elementPath.getElementsByTagName('stroke')[0];
            this.parent.appendChild(this.element);
        }
    }
    /*
     * 设置或获取属性
     * @param {Object} values
     * @or
     * @param {String} name
     * @param {String} value
     * @or
     * @param {String} name
     */
    Path.prototype.attr = function(name, value){
        if (arguments.length == 1){
            if (typeof name == 'string'){
                return this[name];
            }
            if (typeof name == 'object'){
                for (var p in name){
                    this.attr(p, name[p]);
                }
                return this;
            }
        } else if (arguments.length > 1){
            switch(name){
                case 'path':
                    if (this.path == value) break;
                    this.path = value;
                    if (svg){
                        this.elementPath.setAttribute('d', value || 'M 0,0');
                    } else {
                        this.elementPath.path = value || 'M 0,0';
                    }
                    break;
                case 'fill':
                    if (this.fill == value) break;
                    this.fill = value;
                    if (svg){
                        this.elementPath.setAttribute('fill', value);
                    } else {
                        if (value == 'none'){
                            this.elementPath.Filled = 'f';
                        } else {
                            this.elementPath.Filled = 't';
                        }
                        this.elementFill.Color = value;
                    }
                    break;
                case 'stroke':
                    if (this.stroke == value) break;
                    this.stroke = value;
                    if (svg){
                        this.elementPath.setAttribute('stroke', value);
                    } else {
                        if (value == 'none'){
                            this.elementPath.Stroked = 'f';
                        } else {
                            this.elementPath.Stroked = 't';
                        }
                        this.elementStroke.Color = value;
                    }
                    break;
            }
            return this;
        }
        
    };

    function create(options){
        return new Path(options);
    }

    if (ie && !vmlStyle){
        vmlStyle = document.createStyleSheet();
        vmlStyle.cssText = '\
.ace_path_shape,.ace_path_shape*{behavior:url(#default#VML);}\
.ace_path_shape{width:1px;height:1px;padding:0;margin:0;left:0;top:0;position:absolute;}\
.ace_path_panel{width:100%;height:100%;overflow:hidden;padding:0;margin:0;position:relative;}\
';
    }
    
    exports.create = create;
}(AcePath);