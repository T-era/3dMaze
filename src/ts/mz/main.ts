/// <reference path="../../lib/jquery/jquery.d.ts" />
/// <reference path="../../lib/uiparts.d.ts" />
/// <reference path="draw.ts" />
/// <reference path="event.ts" />

module Mz {
	var keyEventPrepared :boolean = false;
	var canvas :HTMLCanvasElement;
	var context :CanvasRenderingContext2D;
	var clickListening = true;
	var isGoal = false;

	export var Obj :DrawingRoot = {
		enable: setEnable,
		here: { x: 0, y: 0, z: 0 },
		direction: null,
		onLoad: function() {
			canvas = <HTMLCanvasElement>$("#main")[0];
			context = <CanvasRenderingContext2D>canvas.getContext("2d");
			this.direction = Mz.Directions.South;
			isGoal = false;
			clickListening = true;

			Mz.drawAll(Obj, canvas, context);
			if (!keyEventPrepared) {
				$(window).keyup(keyListen);
				keyEventPrepared = true;
			}
		},
		repaint: function() {
			Mz.drawAll(Obj, canvas, context);
		}
	};

	function setEnable(state :EnableState) {
		if (state == EnableState.Start) {
			isGoal = false;
			clickListening = true;
		} else if (state == EnableState.Goal) {
			isGoal = true;
			clickListening = false;
		} else if (state == EnableState.Suspend) {
			clickListening = false;
		} else if (state == EnableState.Restart) {
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
					Obj.direction = Obj.direction == Mz.Directions.North ? Mz.Directions.West
								: Obj.direction == Mz.Directions.South ? Mz.Directions.East
								: Obj.direction == Mz.Directions.East ? Mz.Directions.North
								: Obj.direction == Mz.Directions.West ? Mz.Directions.South
								: null;
					Mz.drawAll(Obj, canvas, context);
					break;
				case 39:
					Obj.direction = Obj.direction == Mz.Directions.North ? Mz.Directions.East
								: Obj.direction == Mz.Directions.South ? Mz.Directions.West
								: Obj.direction == Mz.Directions.East ? Mz.Directions.South
								: Obj.direction == Mz.Directions.West ? Mz.Directions.North
								: null;
					Mz.drawAll(Obj, canvas, context);
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
			var room = Mz.Field.at(p);

			if (room && checker(room)) {
				UIParts.Alert("Oops!", "壁がある！");
			} else {
				var next = move(p);
				//if (Mz.Field.at(next)) { // Check outbound.
					Obj.here = next;
				//}
				Mz.drawAll(Obj, canvas, context);

				Mz.fireEvents(Mz.Field.at(Obj.here).events, Obj);
			}
		}
	}

	$(function() {
		Mz.Obj.onLoad();
	})
}
