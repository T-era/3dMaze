import { Alert } from '../uiparts';

import { Drawer, init2d, initGl } from './draw';
import { Event } from './event';
import { Types } from './types';
import { Directions } from './directions';
import { Field } from './field';

export module Mz {
	var keyEventPrepared :boolean = false;
	var canvas :HTMLCanvasElement;
	var clickListening = true;
	var isGoal = false;
	var drawAll :Drawer;

	export var Obj :Types.DrawingRoot = {
		enable: setEnable,
		here: { x: 0, y: 0, z: 0 },
		direction: null,
		onLoad: function() {
			canvas = <HTMLCanvasElement>$("#main")[0];
			drawAll = getDrawer(canvas);
			this.direction = Directions.South;
			isGoal = false;
			clickListening = true;

			drawAll(Obj);
			if (!keyEventPrepared) {
				$(window).keyup(keyListen);
				keyEventPrepared = true;
			}
		},
		repaint: function() {
			drawAll(Obj);
		}
	};
	function getDrawer(canvas :HTMLCanvasElement) :Drawer {
		let glContext = null; //canvas.getContext('webgl');
		if (glContext) {
			return initGl(canvas, glContext);
		} else {
			let tdContext = canvas.getContext("2d");
			return init2d(canvas, tdContext);
		}
	}

	function setEnable(state :Types.EnableState) {
		if (state == Types.EnableState.Start) {
			isGoal = false;
			clickListening = true;
		} else if (state == Types.EnableState.Goal) {
			isGoal = true;
			clickListening = false;
		} else if (state == Types.EnableState.Suspend) {
			clickListening = false;
		} else if (state == Types.EnableState.Restart) {
			if (! isGoal) {
				clickListening = true;
			}
		}
	}

	function keyListen(arg) {
		if (clickListening
			&& arg.target.tagName.toLowerCase() == "body") {
			switch (arg.keyCode) {
				case 37:
					Obj.direction = Obj.direction == Directions.North ? Directions.West
								: Obj.direction == Directions.South ? Directions.East
								: Obj.direction == Directions.East ? Directions.North
								: Obj.direction == Directions.West ? Directions.South
								: null;
					drawAll(Obj);
					break;
				case 39:
					Obj.direction = Obj.direction == Directions.North ? Directions.East
								: Obj.direction == Directions.South ? Directions.West
								: Obj.direction == Directions.East ? Directions.South
								: Obj.direction == Directions.West ? Directions.North
								: null;
					drawAll(Obj);
					break;
				case 38:
					moveTo(function(room) { return room.hasCeil; }
						, function(pos) { return { x: pos.x, y: pos.y, z: pos.z - 1 }; });
					break;
				case 40:
					moveTo(function(room) { return room.hasFloor; }
						, function(pos) { return { x: pos.x, y: pos.y, z: pos.z + 1 }; });
					break;
				case 32:
					moveTo(function(room) { return room.hasAwayWall(Obj.direction); }
						, function(pos) { return Obj.direction.d(pos); });
					break;
			}
		}
		function moveTo(checker, move) {
			var p = Obj.here;
			var room = Field.at(p);

			if (room && checker(room)) {
				Alert("Oops!", "壁がある！");
			} else {
				var next = move(p);
				//if (Field.at(next)) { // Check outbound.
					Obj.here = next;
				//}
				drawAll(Obj);

				Event.fireEvents(Field.at(Obj.here).events, Obj);
			}
		}
	}

	$(function() {
		Mz.Obj.onLoad();
	})
}
