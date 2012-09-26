var AceEditor = /^u/.test(typeof exports) ? AceEditor || {} : exports;
void function(exports){
    /**
     * Ace Engine Editor
     * �ı��༭������
     * @see http://code.google.com/p/ace-engine/wiki/AceEditor
     * @author ������(wangjihu,http://weibo.com/zswang)
     * @version 1.0
     * @copyright www.baidu.com
     * @date 2012-01-29
     */
    /*
     * ��д
     */
    var str_selectionStart = 'selectionStart';

    /**
     * ����ѡ��Χ
     * @param{Element} editor �༭��(<input>|<textarea>)
     * @param{Array[start,end]} range ѡ��Χ
     */
    function setSelectRange(editor, range){
        if (!editor) return;
        var start = Math.min(range[0], range[1]),
            end = Math.max(range[0], range[1]);
        if (editor.setSelectionRange){
            editor.focus();
            editor.setSelectionRange(start, end);
        } else if (editor.createTextRange){
            var textRange = editor.createTextRange();
            textRange.collapse(true);
            textRange.moveEnd("character", end);
            textRange.moveStart("character", start);
            textRange.select();
        }
    }

    /**
     * �޸�ѡ�д��ı�
     * @param{Element} editor �༭��(<input>|<textarea>)
     * @param{String} value �ı�ֵ
     * @param{Array[start,end]} range ָ��ѡ��Χ
     */
    function setSelectText(editor, value, range){
        if (!editor) return;
        range ? setSelectRange(editor, range) : editor.focus();
        if (str_selectionStart in editor){
            var str = editor.value,
                start = editor.selectionStart,
                scroll = [editor.scrollLeft, editor.scrollTop];
            editor.value = str.slice(0, start) + value +
                str.slice(editor.selectionEnd);
            editor.selectionStart = editor.selectionEnd = start + value.length;
            editor.scrollLeft = scroll[0]
            editor.scrollTop = scroll[1];
        } else if (editor.document && editor.document.selection){
            var textRange = editor.document.selection.createRange();
            textRange.text = value;
            textRange.select();
        }
    }
    
    function _calcBookmark(bookmark) {
        return (bookmark.charCodeAt(0) - 1) +
            (bookmark.charCodeAt(3) - 1) * 65536 +
            (bookmark.charCodeAt(2) - 1);
    }

    function _getSelectPos(editor, isend) {
        if (!editor) return;
        if (str_selectionStart in editor)
            return isend ? editor.selectionEnd : editor.selectionStart;
        if (!editor.createTextRange || !editor.document) return;
        editor.focus();
        var range = editor.document.selection.createRange().duplicate();
        if (!isend) range.collapse(true)
        range.setEndPoint("StartToEnd", range);
        return _calcBookmark(range.getBookmark()) -
            _calcBookmark(editor.createTextRange().getBookmark());
    }

    /**
     * ��ȡѡ�п�ʼλ��
     * @param{Element} editor �༭��(<input>|<textarea>)
     * @return{Number} ����ѡ�п�ʼλ��
     */
    function getSelectStart(editor){
        return _getSelectPos(editor);
    }
    /**
     * ��ȡѡ�н���λ��
     * @param{Element} editor �༭��(<input>|<textarea>)
     * @return{Number} ����ѡ�н���λ��
     */
    function getSelectEnd(editor){
        return _getSelectPos(editor, true);
    }
    /**
     * ��ȡѡ�з�Χ
     * @param{Element} editor �༭��(<input>|<textarea>)
     * @return{Array[start,end]} ����ѡ�з�Χ
     */
    function getSelectRange(editor){
        return [getSelectStart(editor), getSelectEnd(editor)];
    }
    /**
     * ���ص�ǰѡ�е�����
     * @param{Element} editor �༭��(<input>|<textarea>)
     * @return{String} ���ص�ǰѡ�����֣���ȥ��\r��
     */
    function getSelectText(editor){
        if (!editor) return;
        if (str_selectionStart in editor)
            return editor.value.slice(editor.selectionStart, editor.selectionEnd);
        if (editor.document && editor.document.selection){
            editor.focus();
            return editor.document.selection.createRange().text.replace(/\r\n?/g, '\n');
        }
    }
    /*
     * ��ȡ�༭������(ȥ��ie��"\r"�ĸ���)
     * @param{Element} editor �༭��(<input>|<textarea>)
     * @return{String} ���ر༭�����ݣ���ȥ��\r��
     */
    function getValue(editor){
        if (!editor) return;
        return editor.value.replace(/\r\n?/g, '\n')
    }

    exports.setSelectRange = setSelectRange;
    exports.getSelectRange = getSelectRange;

    exports.setSelectText = setSelectText;
    exports.getSelectText = getSelectText;

    exports.getSelectStart = getSelectStart;
    exports.getSelectEnd = getSelectEnd;
    
    exports.getValue = getValue;
    var extend = (window.jQuery && jQuery.fn.extend) || 
        (window.baidu && baidu.dom && baidu.dom.extend); // http://tangram.baidu.com
    extend && extend({
        selectRange: function(range){
            if (/^u/.test(typeof range)){ // ȡֵ
                return getSelectRange(this.first());
            } else {
                return this.each(function(){
                    setSelectRange(this, range);
                });
            }
        },
        selectText: function(text){
            if (/^u/.test(typeof text)){ // ȡֵ
                return getSelectText(this.first());
            } else {
                return this.each(function(){
                    setSelectText(this, text);
                });
            }
        },
        selectStart: function(position){
            if (/^u/.test(typeof position)){ // ȡֵ
                return getSelectStart(this.first());
            } else {
                return this.each(function(){
                    setSelectStart(this, position);
                });
            }
        },
        selectEnd: function(position){
            if (/^u/.test(typeof position)){ // ȡֵ
                return getSelectEnd(this.first());
            } else {
                return this.each(function(){
                    setSelectEnd(this, position);
                });
            }
        }
    });
}(AceEditor);

