var AceEditor = /^o/.test(typeof exports) ? exports : AceEditor || {};
void function(exports){
	/**
	 * Ace Engine Editor
	 * 文本编辑器函数
	 * @see http://code.google.com/p/ace-engine/wiki/AceEditor
	 * @author 王集鹄(wangjihu,http://weibo.com/zswang)
	 * @version 1.0
	 */
	
	/**
	 * 设置选择范围
	 * @param{Element} editor 编辑器(<input>|<textarea>)
	 * @param{Array|[start,end]} range 选择范围
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
	 * 修改选中处文本
	 * @param{Element} editor 编辑器(<input>|<textarea>)
	 * @param{String} value 文本值
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
	 * 获取选中范围
	 * @param{Element} editor 编辑器(<input>|<textarea>)
	 * @return{Array|[start,end]} 返回选中范围
	 */
	function getSelectRange(editor){
		return [getSelectStart(editor), getSelectEnd(editor)];
	}
	/**
	 * 返回当前选中的文字
	 * @param{Element} editor 编辑器(<input>|<textarea>)
	 * @return{String} 返回当前选中文字
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