import { Common } from '../../common';

import { Types } from '../types';
import { Field } from '../field';
import { Drawer } from './index';

var STD_SIZE = 90;

export function init2d(canvas :HTMLCanvasElement, context :CanvasRenderingContext2D) :Drawer {
	return (that :Types.DrawingRoot) => {
		context.clearRect(0,0,canvas.width, canvas.height);
		showRange(10, that.direction, that.here);

		function convX(x, size) {
			var px = size * x - size / 2;
			return canvas.width / 2 + px;
		}
		function convY(y, size) {
			var py = size * y - size / 2;
			return canvas.height / 2 + py;
		}
		function showRange(range :number, direction :Types.Direction, here :Types.Position) {
			var basePoint = here;
			var dSteps = function(temp, times) {
				for (var i = 0; i < times; i ++) {
					temp = direction.d(temp);
				}
				return temp;
			};
			var right = direction.right;
			var top = (pos, dh)=> { return { x: pos.x, y: pos.y, z: pos.z + dh }; };

			spreadRange(
				spreadWidth(
					spreadHeight(
						drawWalls
					)
				)
			);
			function spreadRange(f) {
				for (var distance = range; distance >= 0; distance --) {
					f(distance);
				}
			}
			function  spreadWidth(f) {
				return (distance)=> {
					for (var lr = range; lr >= 0; lr --) {
						f(distance, lr);
					}
				}
			}
			function spreadHeight(f) {
				return (distance, lr)=> {
					for (var df = range; df >= 0; df --) {
						f(distance, lr, df);
					}
				}
			}
			function drawWalls(distance :number, lr :number, df :number) {
				var pointAtDist = dSteps(basePoint, distance);
				var sizeNear = STD_SIZE / (distance < 0.2 ? 0.01 : (distance - 0.2));
				var sizeAway = STD_SIZE / (distance + 0.8);
				drawADistance(drawAwayAndSide);

				function drawADistance(f) {
					f(lr, df);
					f(-lr, df);
					f(lr, -df);
					f(-lr, -df);
				}
				function drawAwayAndSide(alr, adf) {
					var room = Field.at(top(right(pointAtDist, alr), adf));
					if (room) {
						drawAway(room, alr, adf);
						drawSide(room, alr, adf);
					}
				}
				function drawAway(room, alr, adf) {
					if (room.hasAwayWall(direction)) {
						var p1x = convX(alr, sizeAway);
						var p1y = convY(adf, sizeAway);
						fillWall(p1x, p1y
							, p1x+sizeAway-1, p1y
							, p1x+sizeAway-1, p1y+sizeAway-1
							, p1x, p1y+sizeAway-1
							, distance * 2 + 1 + lr + df
							, room.color);
					}
				}
				function drawSide(room, blr :number, bdf :number) {
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
					function drawLeft() {
						if (room.hasLeftWall(direction)) {
							fillWall(convX(blr, sizeNear), convY(bdf, sizeNear)
								, convX(blr, sizeNear), convY(bdf, sizeNear)+sizeNear-1
								, convX(blr, sizeAway), convY(bdf, sizeAway)+sizeAway-1
								, convX(blr, sizeAway), convY(bdf, sizeAway)
								, distance * 2 + lr + df
								, room.color);
						}
					}
					function drawRight() {
						if (room.hasRightWall(direction)) {
							fillWall(convX(blr+1, sizeNear), convY(bdf, sizeNear)
								, convX(blr+1, sizeNear), convY(bdf, sizeNear)+sizeNear-1
								, convX(blr+1, sizeAway), convY(bdf, sizeAway)+sizeAway-1
								, convX(blr+1, sizeAway), convY(bdf, sizeAway)
								, distance * 2 + lr + df
								, room.color);
						}
					}
					function drawBottom() {
						if (room.hasFloor) {
							fillWall(convX(blr, sizeNear), convY(bdf+1, sizeNear)
								, convX(blr, sizeNear)+sizeNear-1, convY(bdf+1, sizeNear)
								, convX(blr, sizeAway)+sizeAway-1, convY(bdf+1, sizeAway)
								, convX(blr, sizeAway), convY(bdf+1, sizeAway)
								, 8 + distance * 2 + lr + df
								, room.color);
						}
					}
					function drawTop() {
						if (room.hasCeil) {
							fillWall(convX(blr, sizeNear), convY(bdf, sizeNear)
								, convX(blr, sizeNear)+sizeNear-1, convY(bdf, sizeNear)
								, convX(blr, sizeAway)+sizeAway-1, convY(bdf, sizeAway)
								, convX(blr, sizeAway), convY(bdf, sizeAway)
								, 8 + distance * 2 + lr + df
								, room.color);
						}
					}
				}
			}
		}

		function fillWall(
				x1 :number,
				y1 :number,
				x2 :number,
				y2 :number,
				x3 :number,
				y3 :number,
				x4 :number,
				y4 :number,
				darkness :number,
				color :Common.Color) {
			context.beginPath();
			context.strokeStyle = "#c0c0c0";
			var x = Math.pow(0.90, darkness);
			var fillColor = {
				r: color.r * x,
				g: color.g * x,
				b: color.b * x };
			context.fillStyle = Common.toCssColor(fillColor);//"#" + r + g + b;
			context.moveTo(x1, y1);
			context.lineTo(x2, y2);
			context.lineTo(x3, y3);
			context.lineTo(x4, y4);
			context.lineTo(x1, y1);
			context.stroke();
			context.fill();

			function toColCode(arg) {
				var hexa = Math.floor(arg).toString(16);
				return ("0" + hexa).substr(-2);
			}
		}
	}
}
