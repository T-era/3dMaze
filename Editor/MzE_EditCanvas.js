MzE.EditCanvas = function(canvas, xSize, ySize, zSize) {
	var context = canvas.getContext("2d");
	context.clearRect(0,0,canvas.width, canvas.height);
	var width = canvas.width;
	var height = canvas.height;
	var xLen = width / xSize;
	var yLen = height / ySize;
	var padding = yLen * 0.1;

	this.initCanvas = function(fields, z) {
		for (var y = 0; y < ySize; y ++) {
			for (var x = 0; x < xSize; x ++) {
				var room = fields[z][y][x];
				drawRoom(room, x, y);

				canvas.onclick = function(arg) {
					var rect = arg.target.getBoundingClientRect();
					var px = arg.layerX - rect.left;
					var py = arg.layerY - rect.top;
					var x = Math.floor(px / xLen);
					var y = Math.floor(py / yLen);
					var offsetX = px % xLen;
					var offsetY = py % yLen;

					clickedAt(x, y, offsetX, offsetY);
				};
			}
		}
		function clickedAt(x, y, offsetX, offsetY) {
			var room = fields[z][y][x];
			if (offsetX > xLen * 0.25 && offsetX < xLen * 0.75
				&& offsetY > yLen * 0.25 && offsetY < yLen * 0.75) {
				if (offsetY > yLen * 0.5)
					room.Floor = ! room.Floor;
				else
					room.Ceil = ! room.Ceil;
			} else {
				var rt = ((offsetY - offsetX * yLen / xLen) < 0);
				var rb = ((offsetY + offsetX * yLen / xLen) > yLen);
				if (rb && rt)
					room.East = ! room.East;
				else if (rb)
					room.South = ! room.South;
				else if (rt)
					room.North = ! room.North;
				else
					room.West = ! room.West;
			}
			drawAll();
		}
		function drawAll() {
			for (var y = 0; y < ySize; y ++) {
				for (var x = 0; x < xSize; x ++) {
					var room = fields[z][y][x];
					drawRoom(room, x, y);
				}
			}
		}
		function drawRoom(room, x, y) {
			context.beginPath();
			context.clearRect(x * xLen, y * yLen, xLen - 1, yLen - 1);
			drawLine(room.North, false, false, true, false, function(x, y, z) { return { x: x, y: y-1, z: z }; }, function(r) { return r.South; });
			drawLine(room.South, false, true, true, true, function(x, y, z) { return { x: x, y: y+1, z: z }; }, function(r) { return r.North; });
			drawLine(room.West, false, false, false, true, function(x, y, z) { return { x: x-1, y: y, z: z }; }, function(r) { return r.East; });
			drawLine(room.East, true, false, true, true, function(x, y, z) { return { x: x+1, y: y, z: z }; }, function(r) { return r.West; });
			drawCenterMark(room.Floor, false);
			drawCenterMark(room.Ceil, true);

			function drawCenterMark(tf, upper) {
				var d = upper ? - padding : padding;
				var color;
				if (upper) {
					color = getColor(function(x, y, z) { return { x: x, y: y, z: z-1 }; }, function(r) { return r.Floor; });
				} else {
					color = getColor(function(x, y, z) { return { x: x, y: y, z: z+1 }; }, function(r) { return r.Ceil; });
				}
					
				context.beginPath();
				context.strokeStyle = color;
				context.fillStyle = color;
				context.moveTo((x + 0.5) * xLen, (y + 0.5) * yLen + d*2);
				context.lineTo((x + 0.5) * xLen - padding*2, (y + 0.5) * yLen + d);
				context.lineTo((x + 0.5) * xLen + padding*2, (y + 0.5) * yLen + d);
				context.fill();
				function getColor(f, wall) {
					var neighbor = roomAt(f(x, y, z));
					if (! tf && ! neighbor) return "#ffa0a0";
					if (! tf) {
						if (neighbor && wall(neighbor)) return "#c0c000";
						return "#aaaaaa";
					}
					else return "#ffffff";
				}
			}
			function drawLine(tf, x1IsR, y1IsB, x2IsR, y2IsB, toNeighbor, nWall) {
				var color = getColor();
				context.beginPath();
				context.strokeStyle = color;
				context.moveTo(convX(x, x1IsR), convY(y, y1IsB));
				context.lineTo(convX(x, x2IsR), convY(y, y2IsB));
				context.stroke();
				function getColor() {
					var neighbor = roomAt(toNeighbor(x, y, z));
					if (! tf && ! neighbor) return "#ffa0a0";
					if (! tf) return "#ffffff";
					if (neighbor && ! nWall(neighbor)) return "#f0c000";
					return "#aaaaaa";
				}
			}
			function convX(x, isRight) {
				if (isRight)
					return (x + 1) * xLen - 1 - padding;
				else
					return x * xLen + padding;
			}
			function convY(y, isBottom) {
				if (isBottom)
					return (y + 1) * yLen - 1 - padding;
				else
					return y * yLen + padding;
			}

			function roomAt(pos) {
				if (pos.x < 0 || pos.y < 0 || pos.z < 0
					|| pos.x >= xSize || pos.y >= ySize || pos.z >= zSize
					|| ! fields[pos.z] || ! fields[pos.z][pos.y] || ! fields[pos.z][pos.y][pos.x]) {
					return null;
				} else {
					return fields[pos.z][pos.y][pos.x];
				}
			}
		}
	}
};