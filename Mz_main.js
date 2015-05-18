(function() {
	var once = false;
	var canvas;
	var context;
	var clickListening = true;
	Mz = {
		enable: function(flag) { clickListening = flag; },
		here: { x: 0, y: 0, z: 0 },
		direction: null,
		onLoad: function() {
			canvas = $("#main")[0];
			context = canvas.getContext("2d");
			this.direction = Mz.Direction.South;

			this.drawAll(canvas, context);
			if (!once) {
				$(window).keydown(keyDown);
				once = true;
			}
		}
	}
	function keyDown(arg) {
		if (clickListening) {
			switch (arg.keyCode) {
				case 37:
					Mz.direction = Mz.direction == Mz.Direction.North ? Mz.Direction.West
								 : Mz.direction == Mz.Direction.South ? Mz.Direction.East
								 : Mz.direction == Mz.Direction.East ? Mz.Direction.North
								 : Mz.direction == Mz.Direction.West ? Mz.Direction.South
								 : null;
					Mz.drawAll(canvas, context);
					break;
				case 39:
					Mz.direction = Mz.direction == Mz.Direction.North ? Mz.Direction.East
								 : Mz.direction == Mz.Direction.South ? Mz.Direction.West
								 : Mz.direction == Mz.Direction.East ? Mz.Direction.South
								 : Mz.direction == Mz.Direction.West ? Mz.Direction.North
								 : null;
					Mz.drawAll(canvas, context);
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
					moveTo(function(room) { return room.hasAwayWall(Mz.direction); }
						, function(pos) { return Mz.direction.d(pos); });
					break;
			}
		}
		function moveTo(checker, move) {
			var p = Mz.here;
			var room = Mz.Field.at(p);
			if (room && checker(room)) {
				MyDialog.Alert("Oops!", "壁がある！");
			} else {
				var next = move(p);
				//if (Mz.Field.at(next)) { // Check outbound.
					Mz.here = next;
				//}
				Mz.drawAll(canvas, context);
			}
		}
	}
})();
