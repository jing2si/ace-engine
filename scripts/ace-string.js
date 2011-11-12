var AceString = typeof exports != 'undefined' ? exports : AceString || {};
void function(exports)  {
	/**
	 * Ace Engine String
	 * 字符串编码处理
	 * @see http://code.google.com/p/ace-engine/wiki/AceString
	 * @author 王集鹄(wangjihu，http://weibo.com/zswang)
	 * @version 1.0
	 * @copyright www.baidu.com
	 */
	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	/**
	 * 对字符串进行base64编码
	 * param{string} str 原始字符串
	 */
	function encodeBase64(str) {
		if (!str) return;
		var inputs = {}, outputs = {}, bits, i = 0, result = [];
		str = encodeUTF8(str);
		do {
			inputs[0] = str.charCodeAt(i++);
			inputs[1] = str.charCodeAt(i++);
			inputs[2] = str.charCodeAt(i++);

			bits = inputs[0] << 16 | inputs[1] << 8 | inputs[2];

			outputs[0] = bits >> 18 & 0x3f;
			outputs[1] = bits >> 12 & 0x3f;
			outputs[2] = bits >> 6 & 0x3f;
			outputs[3] = bits & 0x3f;

			if (isNaN(inputs[2])) outputs[3] = 64;
			if (isNaN(inputs[1])) outputs[2] = 64;

			result.push([
				b64.charAt(outputs[0]),
				b64.charAt(outputs[1]),
				b64.charAt(outputs[2]),
				b64.charAt(outputs[3])
			].join(''));
		} while (i < str.length);
		return result.join('');
	}
	/**
	 * 对base64字符串进行解码
	 * @param {String} str 编码字符串
	 */
	function decodeBase64(str) {
		if (!str) return;
		var inputs = {}, outputs = {}, bits, i = 0, result = [];

		do {
			inputs[0] = b64.indexOf(str.charAt(i++));
			inputs[1] = b64.indexOf(str.charAt(i++));
			inputs[2] = b64.indexOf(str.charAt(i++));
			inputs[3] = b64.indexOf(str.charAt(i++));

			bits = inputs[0] << 18 | inputs[1] << 12 | inputs[2] << 6 | inputs[3];

			outputs[0] = bits >> 16 & 0xff;
			outputs[1] = bits >> 8 & 0xff;
			outputs[2] = bits & 0xff;

			if (inputs[2] == 64) {
				result.push(String.fromCharCode(outputs[0]));
			} else if (inputs[3] == 64) {
				result.push(String.fromCharCode(outputs[0], outputs[1]));
			} else {
				result.push(String.fromCharCode(outputs[0], outputs[1], outputs[2]));
			}
		} while (i < str.length);
		return decodeUTF8(result.join(''));
	}

	/**
	 * 对字符串进行utf8编码
	 * param{string} str 原始字符串
	 */
	function encodeUTF8(str) {
		if (!str) return;
		return String(str).replace(
			/[\u0080-\u07ff]/g,
			function(c) {
				var cc = c.charCodeAt(0);
				return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
			}
		).replace(
			/[\u0800-\uffff]/g,
			function(c) {
				var cc = c.charCodeAt(0);
				return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3f, 0x80 | cc & 0x3f);
			}
		);
	}

	/**
	 * 对utf8字符串进行解码
	 * @param {String} str 编码字符串
	 */
	function decodeUTF8(str) {
		if (!str) return;
		return String(str).replace(
			/[\u00c0-\u00df][\u0080-\u00bf]/g,
			function(c) {
				var cc = (c.charCodeAt(0) & 0x1f) << 6 | (c.charCodeAt(1) & 0x3f);
				return String.fromCharCode(cc);
			}
		).replace(
			/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,
			function(c) {
				var cc = (c.charCodeAt(0) & 0x0f) << 12 | (c.charCodeAt(1) & 0x3f) << 6 | (c.charCodeAt(2) & 0x3f);
				return String.fromCharCode(cc);
			}
		);
		return str;
	}

	exports.base64 = {
		encode: encodeBase64,
		decode: decodeBase64
	};
	exports.utf8 = {
		encode: encodeUTF8,
		decode: decodeUTF8
	};
}(AceString);

/*
console.log(AceString.base64.decode(AceString.base64.encode('english 中文')));
//*/