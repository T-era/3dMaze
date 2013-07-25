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
		var dSteps = function(temp, times) {
			for (var i = 0; i < times; i ++) {
				temp = direction.d(temp);
			}
			return temp;
		};
		var right = direction.right;
		var top = function(pos, dh) { return { x: pos.x, y: pos.y, z: pos.z + dh }; };

		spreadRange(
			spreadWidth(
				spreadHeight(
					drawWalls
				)
			)
		);
		function spreadRange(f) {
			execADistance(0);

			function execADistance(distance) {
				if (distance < range) {
					execADistance(distance + 1);
				}

				f(distance);
			}
		}
		function  spreadWidth(f) {
			return function(distance) {
				exec(0);

				function exec(lr) {
					if (lr < range) {
						exec(lr + 1);
					}

					f(distance, lr);
				}
			}
		}
		function spreadHeight(f) {
			return function(distance, lr) {
				exec(0);

				function exec(df) {
					if (df < range) {
						exec(df + 1);
					}
					f(distance, lr, df);
				}
			}
		}
		function drawWalls(distance, lr, df) {
			var pointAtDist = dSteps(basePoint, distance);
			var sizeNear = STD_SIZE / (distance < 0.2 ? 0.01 : (distance - 0.2));
			var sizeAway = STD_SIZE / (distance + 0.8);
			drawAll(drawAway);
			drawAll(drawSide);
			
			function drawAll(f) {
				f(lr, df);
				f(-lr, df);
				f(lr, -df);
				f(-lr, -df);
			}
			function drawAway(alr, adf) {
				var room = Mz.Field.at(top(right(pointAtDist, alr), adf));
				if (room
					&& room.hasAwayWall(direction)) {
					var p1x = convX(alr, sizeAway);
					var p1y = convY(adf, sizeAway);
					fillWall(p1x, p1y
						, p1x+sizeAway-1, p1y
						, p1x+sizeAway-1, p1y+sizeAway-1
						, p1x, p1y+sizeAway-1
						, distance * 2 + 1 + lr + df
						, room.baseColor);
				}
			}
			function drawSide(blr, bdf) {
				var room = Mz.Field.at(top(right(pointAtDist, blr), bdf));
				if (room) {
					if (blr <= 0) {
						drawLeft();
					}
					if (blr >= 0) {
						drawRight();
					}
					if (bdf <= 0) {
						drawTop();
					}
					if (bdf >= 0) {
						drawBottom();
					}
				}
				function drawLeft() {
					if (room.hasLeftWall(direction)) {
						fillWall(convX(blr, sizeNear), convY(bdf, sizeNear)
							, convX(blr, sizeNear), convY(bdf, sizeNear)+sizeNear-1
							, convX(blr, sizeAway), convY(bdf, sizeAway)+sizeAway-1
							, convX(blr, sizeAway), convY(bdf, sizeAway)
							, distance * 2 + lr + df
							, room.baseColor);
					}
				}
				function drawRight() {
					if (room.hasRightWall(direction)) {
						fillWall(convX(blr+1, sizeNear), convY(bdf, sizeNear)
							, convX(blr+1, sizeNear), convY(bdf, sizeNear)+sizeNear-1
							, convX(blr+1, sizeAway), convY(bdf, sizeAway)+sizeAway-1
							, convX(blr+1, sizeAway), convY(bdf, sizeAway)
							, distance * 2 + lr + df
							, room.baseColor);
					}
				}
				function drawBottom() {
					if (room.hasFloor) {
						fillWall(convX(blr, sizeNear), convY(bdf+1, sizeNear)
							, convX(blr, sizeNear)+sizeNear-1, convY(bdf+1, sizeNear)
							, convX(blr, sizeAway)+sizeAway-1, convY(bdf+1, sizeAway)
							, convX(blr, sizeAway), convY(bdf+1, sizeAway)
							, distance * 2 + lr + df
							, room.baseColor);
					}
				}
				function drawTop() {
					if (room.hasCeil) {
						fillWall(convX(blr, sizeNear), convY(bdf, sizeNear)
							, convX(blr, sizeNear)+sizeNear-1, convY(bdf, sizeNear)
							, convX(blr, sizeAway)+sizeAway-1, convY(bdf, sizeAway)
							, convX(blr, sizeAway), convY(bdf, sizeAway)
							, distance * 2 + lr + df
							, room.baseColor);
					}
				}
			}
		}
	};

	function fillWall(x1, y1, x2, y2, x3, y3, x4, y4, darkness, baseColor) {
		context.beginPath();
		context.strokeStyle = "#c0c0c0";
		var x = Math.pow(0.98, darkness);
		var r = toColCode(baseColor.r * x);
		var g = toColCode(baseColor.g * x);
		var b = toColCode(baseColor.b * x);
		context.fillStyle = "#" + r + g + b;
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.lineTo(x3, y3);
		context.lineTo(x4, y4);
		context.lineTo(x1, y1);
		context.stroke();
		context.fill();

		function toColCode(arg) {
			return Math.floor(arg).toString(16);
		}
	}
}
