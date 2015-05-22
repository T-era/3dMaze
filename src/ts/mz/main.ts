/// <reference path="../../lib/jquery/jquery.d.ts" />
/// <reference path="../../lib/uiparts.d.ts" />
/// <reference path="draw.ts" />
/// <reference path="event.ts" />

module Mz {
	var once = false;
	var canvas;
	var context;
	var clickListening = true;

	export var Obj :DrawingRoot = {
		enable: (flag)=> { clickListening = flag; },
		here: { x: 0, y: 0, z: 0 },
		direction: null,
		onLoad: function() {
			canvas = $("#main")[0];
			context = canvas.getContext("2d");
			this.direction = Mz.Direction.South;

			Mz.drawAll(Obj, canvas, context);
			if (!once) {
				$(window).keyup(keyListen);
				once = true;
			}
		},
		repaint: function() {
			Mz.drawAll(Obj, canvas, context);
		}
	};

	function keyListen(arg) {
		if (clickListening
			&& arg.target.tagName.toLowerCase() == "body") {
			switch (arg.keyCode) {
				case 37:
					Obj.direction = Obj.direction == Mz.Direction.North ? Mz.Direction.West
								: Obj.direction == Mz.Direction.South ? Mz.Direction.East
								: Obj.direction == Mz.Direction.East ? Mz.Direction.North
								: Obj.direction == Mz.Direction.West ? Mz.Direction.South
								: null;
					Mz.drawAll(Obj, canvas, context);
					break;
				case 39:
					Obj.direction = Obj.direction == Mz.Direction.North ? Mz.Direction.East
								: Obj.direction == Mz.Direction.South ? Mz.Direction.West
								: Obj.direction == Mz.Direction.East ? Mz.Direction.South
								: Obj.direction == Mz.Direction.West ? Mz.Direction.North
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
