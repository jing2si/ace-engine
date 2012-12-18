var AcePath = AcePath || {};

void function(exports){
    /**
     * Ace Engine Path
     * һ��չʾʸ��ͼ·���Ŀؼ�
     * @see http://code.google.com/p/ace-engine/wiki/AcePath
     * @author ������(wangjihu,http://weibo.com/zswang)
     * @version 1.0
     * @copyright www.baidu.com
     */
    var 
        ie = document.all && window.attachEvent,
        /*
         * �Ƿ�ie9+
         */
        ie9plus = ie && window.XMLHttpRequest && window.addEventListener, 
        
        vmlStyle;
    
    /**
     * ��ʽ������
     * @param {String} template ģ��
     * @param {Object} json ������
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
        this.stroke = options.stroke || 'red';
        this.path = options.path || '';
        var div = document.createElement('div');
        if (!ie || ie9plus){
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
            this.parent.appendChild(this.element);
        }
    }
    
    Path.prototype.attr = function(value){
        
    
        if (path == this.path) return;
        
        this.path = path;
        if (!ie || ie9plus){
            this.elementPath.setAttribute('d', path);
        } else {
            this.elementPath.path = path;
        }
        return set;
    };

    function create(options){
        return new Path(options);
    }

    if (ie && !vmlStyle){
        vmlStyle = document.createStyleSheet();
        vmlStyle.cssText = '\
.ace_path_shape,.ace_path_shape*{behavior:url(#default#VML);}\
.ace_path_shape{width:1px;height:1px;padding:0;margin:0;}\
.ace_path_panel{width:100%;height: 100%;overflow: hidden;padding:0;margin:0;}\
';
    }
    
    exports.create = create;
}(AcePath);