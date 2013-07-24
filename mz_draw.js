Mz.drawAll = function(canvas, context) {
	var STD_SIZE = 90;
	context.clearRect(0,0,canvas.width, canvas.height);
	showRange(10, this.direction, this.here);

	function convX(x, size) {
		var px = size * x - size / 2;
		return canvas.width / 2 + px;
	}
	function convY(y, size) {
		var py = size * y - size / 2;
		return canvas.height / 2 + py;
	}
	function showRange(range, direction, here) {
		var basePoint = here;
		var d = direction.d;
		var right = direction.right;

		showRangeAt(0, here);
		function showRangeAt(distance, pos) {
			var sizeNear = STD_SIZE / (distance < 0.2 ? 0.01 : (distance - 0.2));
			var sizeAway = STD_SIZE / (distance + 0.8);

			if (distance < range) {
				showRangeAt(distance + 1, d(pos));
			}
			showAwayWalls(0, pos);
			showSideWalls(0, pos);

			function showAwayWalls(lr) {
				if (lr < range) {
					showAwayWalls(lr + 1);
				}
				var rRoom = Mz.Field.at(right(pos, lr));
				var lRoom = Mz.Field.at(right(pos, -lr));
				showAWall(rRoom, lr); if (lr != 0) showAWall(lRoom, -lr);
				function showAWall(room, blr) {
					if (room
						&& room.hasAwayWall(direction)) {
						var p1x = convX(blr, sizeAway);
						var p1y = convY(0, sizeAway);
						fillWall(p1x, p1y
							, p1x+sizeAway-1, p1y
							, p1x+sizeAway-1, p1y+sizeAway-1
							, p1x, p1y+sizeAway-1
							, distance * 2 + 1 + lr);
					}
				}
			}

			function showSideWalls(lr) {
				if (lr < range) {
					showSideWalls(lr + 1);
				}
				var rRoom = Mz.Field.at(right(pos, lr));
				var lRoom = Mz.Field.at(right(pos, -lr));

				if (rRoom
					&& rRoom.hasRightWall(direction)) {
					fillWall(convX(lr+1, sizeNear), convY(0, sizeNear)
						, convX(lr+1, sizeNear), convY(0, sizeNear)+sizeNear-1
						, convX(lr+1, sizeAway), convY(0, sizeAway)+sizeAway-1
						, convX(lr+1, sizeAway), convY(0, sizeAway)
						, distance * 2 + lr);
				}
				if (lRoom
					&& lRoom.hasLeftWall(direction)) {
					fillWall(convX(-lr, sizeNear), convY(0, sizeNear)
						, convX(-lr, sizeNear), convY(0, sizeNear)+sizeNear-1
						, convX(-lr, sizeAway), convY(0, sizeAway)+sizeAway-1
						, convX(-lr, sizeAway), convY(0, sizeAway)
						, distance * 2 + lr);
				}
			}
		}
	};

	function fillWall(x1, y1, x2, y2, x3, y3, x4, y4, darkness) {
		context.beginPath();
		context.strokeStyle = "#b0b0b0";
		var color = 255 - (1+darkness) * 3;
		color = color < 0 ? 0 : color;
		context.fillStyle = "#" + color.toString(16)+color.toString(16)+color.toString(16);//"#ffffff";
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.lineTo(x3, y3);
		context.lineTo(x4, y4);
		context.lineTo(x1, y1);
		context.stroke();
		context.fill();
if (darkness < 0) {
	alert(darkness);
}
	}
}
