var AceEditor = /^o/.test(typeof exports) ? exports : AceEditor || {};
void function(exports){
	/**
	 * Ace Engine Editor
	 * �ı��༭������
	 * @see http://code.google.com/p/ace-engine/wiki/AceEditor
	 * @author ������(wangjihu,http://weibo.com/zswang)
	 * @version 1.0
	 */
	
	/**
	 * ����ѡ��Χ
	 * @param{Element} editor �༭��(<input>|<textarea>)
	 * @param{Array|[start,end]} range ѡ��Χ
	 */
	function setSelectRange(editor, range){
		if (!editor) return;
		var start = Math.min(range[0], range[1]),
			end = Math.max(range[0], range[1]);
		editor.focus();
		if (editor.setSelectionRange){
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
	 */
	function setSelectText(editor, value){
		if (!editor) return;
		editor.focus();
		if (editor.document && editor.document.selection){
			editor.document.selection.createRange().text = value;
		} else if (/^n/.test(typeof editor.selectionStart)){
			var str = editor.value,
				start = editor.selectionStart,
				scroll = editor.scrollTop;
			editor.value = str.substr(0, start) + value +
				str.substring(editor.selectionEnd, str.length);
			editor.selectionStart = start + value.length;
			editor.selectionEnd = start + value.length;
			editor.scrollTop = scroll;
		}
	}
	
	function _calcBookmark(bookmark) {
		return (bookmark.charCodeAt(0) - 1) + (bookmark.charCodeAt(3) - 1) * 65536 + (bookmark.charCodeAt(2) - 1);
	}

	function _getSelectPos(editor, isend) {
		if (!editor) return;
		if (/^n/.test(typeof editor.selectionStart))
			return isend ? editor.selectionEnd : editor.selectionStart;
		if (!editor.createTextRange || !editor.document) return;
		editor.focus();
		var doc = editor.document, range = doc.selection.createRange().duplicate();
		if (!isend) range.collapse(true)
		range.setEndPoint("StartToEnd", range);
		var start = doc.body.createTextRange();
		start.moveToElementText(editor);
		return _calcBookmark(range.getBookmark()) - _calcBookmark(start.getBookmark());
	}

	function getSelectStart(editor){
		return _getSelectPos(editor);
	}
	function getSelectEnd(editor){
		return _getSelectPos(editor, true);
	}
	/**
	 * ��ȡѡ�з�Χ
	 * @param{Element} editor �༭��(<input>|<textarea>)
	 * @return{Array|[start,end]} ����ѡ�з�Χ
	 */
	function getSelectRange(editor){
		return [getSelectStart(editor), getSelectEnd(editor)];
	}
	/**
	 * ���ص�ǰѡ�е�����
	 * @param{Element} editor �༭��(<input>|<textarea>)
	 * @return{String} ���ص�ǰѡ������
	 */
	function getSelectText(editor){
		if (!editor) return;
		editor.focus();
		if (editor.document && editor.document.selection)
			return editor.document.selection.createRange().text;
		else if ("selectionStart" in editor)
			return editor.value.substring(editor.selectionStart, editor.selectionEnd);
	}

	exports.setSelectRange = setSelectRange;
	exports.getSelectRange = getSelectRange;

	exports.setSelectText = setSelectText;
	exports.getSelectText = getSelectText;

	exports.getSelectStart = getSelectStart;
	exports.getSelectEnd = getSelectEnd;
}(AceEditor);