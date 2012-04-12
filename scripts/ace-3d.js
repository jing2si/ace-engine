var Ace3D = /^u/.test(typeof exports) ? Ace3D || {} : exports;

void function(exports){
	
	/*
	 * see http://www.bitstorm.it/blog/en/2011/05/3d-sphere-html5-canvas/
	 */
	
	var math = Math, sin = math.sin, cos = math.cos,
		rotate_changes = [[1, 2], [0, 2], [0, 1]];

	function rotate(point, radians, index){
		if (!point) return;
		var indexs = point instanceof Array ? [0, 1, 2] : ['x', 'y', 'z'],
			t = point[indexs[rotate_changes[index][0]]],
			p = point[indexs[rotate_changes[index][1]]];
		point[indexs[rotate_changes[index][0]]] = 
			t * cos(radians) - p * sin(radians);
		point[indexs[rotate_changes[index][1]]] = 
			t * sin(radians) + p * cos(radians);
	}

	function rotateX(point, radians){
		rotate(point, radians, 0);
	}

	function rotateY(point, radians){
		rotate(point, radians, 1);
	}

	function rotateZ(point, radians){
		rotate(point, radians, 2);
	}
	
	function projection(xy, z, xyOffset, zOffset, distance){
		return ((distance * xy) / (z - zOffset)) + xyOffset;
	}

	exports.rotateX = rotateX;
	exports.rotateY = rotateY;
	exports.rotateZ = rotateZ;
	exports.projection = projection;
}(Ace3D);