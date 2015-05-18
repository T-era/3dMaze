MzE.Floor = function (cols, rows, floors, rooms, z) {
	var roomDivs = null;
	var floorObj = this;

	this.init = function(owner) {
		roomDivs = []
		for (var y = 0; y < rows; y ++) {
			var roomDivRows = [];
			var row = $("<div>")
				.addClass("MzRoomRow")
				.appendTo(owner);
			for (var x = 0; x < cols; x ++) {
				var room = new Room(x, y)
					.appendTo(row);
				roomDivRows.push(room);
			}
			roomDivs.push(roomDivRows);
		}
	}
	this.repaint = function() {
		for (var y = 0; y < rows; y ++) {
			for (var x = 0; x < cols; x ++) {
				roomDivs[y][x].resetColor();
			}
		}
	}
	function Room(x, y) {
		var room = rooms[z][y][x];
		var walls = [
			west(),
			east(),
			north(),
			south(),
			ceil(),
			floor()]
		var dom = $("<div>")
			.addClass("MzRoom")
		for (var i = 0, max = walls.length; i < max; i ++) {
			dom.append(walls[i]);
		}
		this.appendTo = function(owner) {
			dom.appendTo(owner);
			return this;
		}
		this.resetColor = function() {
			for (var i = 0, max = walls.length; i < max; i ++) {
				walls[i].resetColor();
			}
		}

		function wall(baseClassName, setWall, getWall, hasNeighbor, getNeighborWall) {
			var div = $("<div>")
				.addClass("MzWall")
				.addClass(baseClassName)
				.click(function() {
					setWall();
					floorObj.repaint();
				});
			div.__checked = getWall();
			div.__baseClassName = baseClassName;
			div.resetColor = function() {
				var col = function() {
					if (! getWall()) {
						if (! hasNeighbor()) return "red";
						return "";
					} else if (hasNeighbor() && ! getNeighborWall()) return "yellow";
					else return "black";
				}();
				setColor(div, baseClassName, col);
			};
			return div;
		}
		function west() {
			return wall("MzWallWest",
					function() { room.West = ! room.West; },
					function() { return room.West; },
					function() { return x != 0; },
					function() { return rooms[z][y][x-1].East; })
				.addClass("MzWallWE");
		}
		function east() {
			return wall("MzWallEast",
					function() { room.East = ! room.East },
					function() { return room.East },
					function() { return x != cols - 1; },
					function() { return rooms[z][y][x+1].West })
				.addClass("MzWallWE");
		}
		function north() {
			return wall("MzWallNorth",
					function() { room.North = ! room.North },
					function() { return room.North },
					function() { return y != 0; },
					function() { return rooms[z][y-1][x].South; })
				.addClass("MzWallNS");
		}
		function south() {
			return wall("MzWallSouth",
					function() { room.South = ! room.South },
					function() { return room.South },
					function() { return y != rows - 1; },
					function() { return rooms[z][y+1][x].North })
				.addClass("MzWallNS");
		}
		function ceil() {
			return wall("MzWallCeil",
					function() { room.Ceil = ! room.Ceil },
					function() { return room.Ceil },
					function() { return z != 0; },
					function() { return rooms[z-1][y][x].Floor })
				.addClass("MzWallCF");
		}
		function floor() {
			return wall("MzWallFloor",
					function() { room.Floor = ! room.Floor; },
					function() { return room.Floor; },
					function() { return z != floors - 1; },
					function() { return rooms[z+1][y][x].Ceil; })
				.addClass("MzWallCF");
		}
		function setColor(div, bcn, col) {
			for (var color in { "red": "", "yellow": "", "black": "" }) {
				div.removeClass(bcn + "-" + color);
			}
			if (col) {
				div.addClass(bcn + "-" + col);
			}
		}
	}
}
