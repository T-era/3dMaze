import { Common } from '../../common';

import { Types } from '../types';
import { Field } from '../field';

import { Drawer  } from './index';
import { PolygonShader, Polygon, Rectangle } from './webgl';

const MAX_DEPTH = 20;

type MzRect = {
 	topLeft : Types.Position,
	topRight : Types.Position,
	bottomLeft: Types.Position,
	bottomRight: Types.Position
};
type MzPolygon = {
 	color :Common.Color,
	rectangles :MzRect[]
};

export function initGl(canvas :HTMLCanvasElement, gl :WebGLRenderingContext) :Drawer {
	let renderer = new PolygonShader.Initializer({canvas, gl, maxDepth: MAX_DEPTH}).ready();
	return (that :Types.DrawingRoot) => {
		gl.clearColor (0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(0.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		let mzPolygonList :MzPolygon[] = poligonsByRange(MAX_DEPTH, that.direction, that.here);
		let polygonList :Polygon[] = mzPolygonList.map((mzPolygon) => {
			let col = mzPolygon.color;
			return {
				color: [col.r / 255, col.g / 255, col.b / 255],
				rectangles: toGlPosition(mzPolygon.rectangles)
			};
		});

		renderer.render(polygonList);
	}
	function toGlPosition(rects :MzRect[]) :Rectangle[] {
		return rects.map(convRect);
		function convRect(mzRect :MzRect) {
			return {
				topLeft: convPos(mzRect.topLeft),
				topRight: convPos(mzRect.topRight),
				bottomLeft: convPos(mzRect.bottomLeft),
				bottomRight: convPos(mzRect.bottomRight),
			}
		}
		function convPos(pos) {
			return {
				x: pos.x,
				y: pos.y,
				z: pos.z
			};
		}
	}

	function poligonsByRange(range :number, direction :Types.Direction, here :Types.Position) :MzPolygon[]  {
		var basePoint = here;
		var fStepsForward = function(temp, times) {
			for (var i = 0; i < times; i ++) {
				temp = direction.d(temp);
			}
			return temp;
		};
		var right = direction.right;
		var top = (pos, dh)=> { return { x: pos.x, y: pos.y, z: pos.z + dh }; };

		let polygonList :MzPolygon[] = [];
		spreadDistance(
			spreadWidth(
				spreadHeight(
					drawWalls
				)
			)
		);
		return polygonList;

		function spreadDistance(f) {
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
			var pointAtDist = fStepsForward(basePoint, distance);
			drawADistance(drawAwayAndSide);

			function drawADistance(f) {
				f(lr, df);
				f(-lr, df);
				f(lr, -df);
				f(-lr, -df);
			}
			function drawAwayAndSide(alr, adf) {
				var room = Field.at(top(right(pointAtDist, alr), adf));
				if (! room) {
					return;
				}
				let mzPolygon = {
					color: room.color,
					rectangles: []
				};
				drawAway(room, alr, adf);
				drawSide(room, alr, adf);
				if (mzPolygon.rectangles.length) {
					polygonList.push(mzPolygon);
				}
				function drawAway(room, alr, adf) {
					if (room.hasAwayWall(direction)) {
						mzPolygon.rectangles.push({
							topLeft: { x: alr - 0.5, y: adf - 0.5, z: distance + 0.5 },
							bottomLeft: { x: alr - 0.5, y: adf + 0.5, z: distance + 0.5 },
							topRight: { x: alr + 0.5, y: adf - 0.5, z: distance + 0.5 },
							bottomRight: { x: alr + 0.5, y: adf + 0.5, z: distance + 0.5 }
						});
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
							mzPolygon.rectangles.push({
								topLeft: { x: alr - 0.5, y: adf - 0.5, z: distance - 0.5},
								topRight: { x: alr - 0.5, y: adf - 0.5, z: distance + 0.5 },
								bottomLeft: { x: alr - 0.5, y: adf + 0.5, z: distance - 0.5 },
								bottomRight: { x: alr - 0.5, y: adf + 0.5, z: distance + 0.5 }
							});
						}
					}
					function drawRight() {
						if (room.hasRightWall(direction)) {
							mzPolygon.rectangles.push({
								topLeft: { x: alr + 0.5, y: adf - 0.5, z: distance - 0.5},
								topRight: { x: alr + 0.5, y: adf - 0.5, z: distance + 0.5 },
								bottomLeft: { x: alr + 0.5, y: adf + 0.5, z: distance - 0.5},
								bottomRight: { x: alr + 0.5, y: adf + 0.5, z: distance + 0.5 }
							});
						}
					}
					function drawBottom() {
						if (room.hasFloor) {
							mzPolygon.rectangles.push({
								topLeft: { x: alr - 0.5, y: adf + 0.5, z: distance - 0.5 },
								bottomLeft: { x: alr - 0.5, y: adf + 0.5, z: distance + 0.5 },
								topRight: { x: alr + 0.5, y: adf + 0.5, z: distance - 0.5 },
								bottomRight: { x: alr + 0.5, y: adf + 0.5, z: distance + 0.5 }
							});
						}
					}
					function drawTop() {
						if (room.hasCeil) {
							mzPolygon.rectangles.push({
								topLeft: { x: alr - 0.5, y: adf - 0.5, z: distance - 0.5 },
								bottomLeft: { x: alr - 0.5, y: adf - 0.5, z: distance + 0.5 },
								topRight: { x: alr + 0.5, y: adf - 0.5, z: distance - 0.5 },
								bottomRight: { x: alr + 0.5, y: adf - 0.5, z: distance + 0.5 }
							});
						}
					}
				}
			}
		}
	}
}
