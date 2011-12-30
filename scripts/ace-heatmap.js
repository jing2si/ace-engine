var AceHeatmap = /^u/.test(typeof exports) ? AceHeatmap || {} : exports;

void function(exports){
	/**
	 * Ace Engine Template
	 * 一套基于HTML和JS语法自由穿插的模板系统
	 * @link http://www.patrick-wied.at/static/heatmapjs
	 * @see http://code.google.com/p/ace-engine/wiki/AceHeatmap
	 * @author 王集鹄(wangjihu,http://weibo.com/zswang) 徐山川(xushanchuan,http://weibo.com/alistapart)
	 * @version 2011-07-06 
 	 * @copyright (c) 2011, Baidu Inc, All rights reserved.
	 */
	function colorPalette(gradient){
		var canvas = document.createElement("canvas");
		canvas.width = "1";
		canvas.height = "256";
		var ctx = canvas.getContext("2d"),
			grad = ctx.createLinearGradient(0, 0, 1, 256);
		gradient = gradient || {
			0.45: "#00f",
			0.55: "#0ff",
			0.65: "#0f0",
			0.95: "#ff0",
			1.00: "#f00"
		};
		for (var x in gradient){
			grad.addColorStop(x, gradient[x]);
		}
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, 1, 256);
		return ctx.getImageData(0, 0, 1, 256).data;
	}

	function Heatmap(options){
		if (!options.canvas) return;
		var _points = [],
			_max = 0, 
			_opacity = options.opacity || 180,
			_radiusIn = options.radiusIn || 15,
			_radiusOut = options.radiusOut || 40,
			_origin = options.origin || [0, 0],
			_canvasMap = options.canvas,
			_width = _canvasMap.width,
			_height = _canvasMap.height,
			_canvasAlpha = document.createElement('canvas'),
			_contextMap = _canvasMap.getContext("2d"),
			_contextAlpha = _canvasAlpha.getContext("2d"),
			_palette = colorPalette(options.gradient);
		_canvasAlpha.width = _width;
		_canvasAlpha.height = _height;
		//document.body.appendChild(_canvasAlpha);

		function colorize(x, y, width, height){
			var image = _contextAlpha.getImageData(x, y, width, height),
				imageData = image.data,
				length = imageData.length;
				
			for(var i = 3; i < length; i+=4){
				var alpha = imageData[i],
				offset = alpha * 4;
				if (!offset) continue;
				imageData[i - 3] = _palette[offset];
				imageData[i - 2] = _palette[offset + 1];
				imageData[i - 1] = _palette[offset + 2];
				imageData[i] = alpha < _opacity ? alpha : _opacity;
			}

			image.data = imageData;
			_contextMap.putImageData(image, x, y);
		}
		function drawAlpha(x, y, rate){
			var gradient = _contextAlpha.createRadialGradient(x, y, _radiusIn, x, y, _radiusOut),
				xb = x - _radiusOut, yb = y - _radiusOut, mul = 2 * _radiusOut;
				gradient.addColorStop(0, 'rgba(0,0,0,' + rate.toFixed(2) + ')');
				gradient.addColorStop(1, 'rgba(0,0,0,0)');
			_contextAlpha.fillStyle = gradient;  
			_contextAlpha.fillRect(xb, yb, mul, mul);
			gradient = 0;
		}
		
		function _setData(data){
			if (!data) return;
			_max = 0;
			_points = [];
			data.forEach(function(item){
				var x = item[0] || item.x || 0,
					y = item[1] || item.y || 0,
					total = item[2] || item.total || item.count || 0;
				_max = Math.max(_max, total);
				_points.push({
					x: x,
					y: y,
					total: total
				})
			});
			_points.forEach(function(item){
				item.rate = item.total / _max;
			});
		}
		
		function _draw(data){
			data && _setData(data);
			_clear();
			_points.forEach(function(item){
				var x = item.x + (_origin[0] || _origin.x || 0),
					y = item.y + (_origin[1] || _origin.y || 0);
				if (x + _radiusOut / 2 < 0 || y + _radiusOut / 2 < 0) return;
				if (x - _radiusOut / 2 > _width || y - _radiusOut / 2 > _height) return;
				drawAlpha(x, y, item.rate);
			});
			colorize(0, 0, _width, _height);
		}
		function _setOrigin(value){
			if (value.join() == _origin) return;
			_origin = value;
			_draw();
		}
		function _getOrigin(){
			return _origin;
		}
		function _moveOrigin(offset){
			_setOrigin([
				(_origin[0] || _origin.x || 0) + (offset[0] || offset.x || 0),
				(_origin[1] || _origin.x || 0) + (offset[1] || offset.x || 0)
			]);
		}
		function _clear(){
			_contextAlpha.clearRect(0, 0, _width, _height);
			_contextMap.clearRect(0, 0, _width, _height);
		}
		return {
			setData: _setData,
			setOrigin: _setOrigin,
			getOrigin: _getOrigin,
			moveOrigin: _moveOrigin,
			clear: _clear,
			draw: _draw,
		};
	}

	exports.createHeatmap = function(options){
		return Heatmap(options);
	}
}(AceHeatmap);