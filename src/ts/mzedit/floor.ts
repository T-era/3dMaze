/// <reference path="../../lib/jquery/jquery.d.ts" />

module MzE {
	export interface RoomPointedListener {
		(pointed:Room) :void;
	}
	export class Floor {
		cols :number;
		rows :number;
		floors :number;
		rooms;
		z :number;
		roomDivs :Room[][];
		roomPointed :RoomPointedListener;

		constructor(cols, rows, floors, rooms, z :number, roomPointed :RoomPointedListener) {
			this.cols = cols;
			this.rows = rows;
			this.floors = floors;
			this.rooms = rooms;
			this.z = z;
			this.roomPointed = roomPointed;
		}
		init(owner :JQuery) {
			this.roomDivs = []
			for (var y = 0; y < this.rows; y ++) {
				var roomDivRows = [];
				var row = $("<div>")
					.addClass("MzRoomRow")
					.appendTo(owner);
				for (var x = 0; x < this.cols; x ++) {
					var room = new Room(this, x, y, this.z, this.roomPointed)
						.appendTo(row);
					roomDivRows.push(room);
				}
				this.roomDivs.push(roomDivRows);
			}
		}
		repaint() {
			for (var y = 0; y < this.rows; y ++) {
				for (var x = 0; x < this.cols; x ++) {
					this.roomDivs[y][x].resetColor();
				}
			}
		}
	}
	export class Room {
		x :number;
		y :number;
		floor :Floor;
		dom :JQuery;
		walls: Wall[];
		obj;

		constructor(floorObj :Floor, x :number, y :number, z: number, fPointed :RoomPointedListener) {
			this.floor = floorObj;
			this.x = x;
			this.y = y;
			this.obj = floorObj.rooms[z][y][x];
			this.walls = [
				west(this),
				east(this),
				north(this),
				south(this),
				ceil(this),
				floor(this)];

			var dom = $("<div>")
				.addClass("MzRoom")
				.click(()=> {
					fPointed(this)
				});
			this.dom = dom;
			for (var i = 0, max = this.walls.length; i < max; i ++) {
				this.dom.append(this.walls[i].div);
			}
		}
		appendTo(owner :JQuery) :Room {
			this.dom.appendTo(owner);
			return this;
		}
		resetColor() {
			for (var i = 0, max = this.walls.length; i < max; i ++) {
				this.walls[i].resetColor();
			}
		}
	}

	export class Wall {
		checked :boolean;
		baseClassName :string;
		div :JQuery;
		getWall;
		hasNeighbor;
		getNeighborWall;

		constructor(obj :Room, baseClassName, setWall, getWall, hasNeighbor, getNeighborWall) {
			this.div = $("<div>")
				.addClass("MzWall")
				.addClass(baseClassName)
				.click(function() {
					setWall();
					obj.floor.repaint();
				});
			this.checked = getWall();
			this.baseClassName = baseClassName;
			this.getWall = getWall;
			this.hasNeighbor = hasNeighbor;
			this.getNeighborWall = getNeighborWall;
		}
		resetColor() {
			var color = (()=> {
				if (! this.getWall()) {
					if (! this.hasNeighbor()) return "red";
					return "";
				} else if (this.hasNeighbor() && ! this.getNeighborWall()) return "yellow";
				else return "black";
			})();
			setColor(this.div, this.baseClassName, color);
		}
		addClass(className) {
			this.div.addClass(className);
			return this;
		}
	}
	function west(room :Room) :Wall {
		return new Wall(room,
				"MzWallWest",
				function() { room.obj.West = ! room.obj.West; },
				function() { return room.obj.West; },
				function() { return room.x != 0; },
				function() { return room.floor.rooms[room.floor.z][room.y][room.x-1].East; })
			.addClass("MzWallWE");
	}
	function east(room :Room) :Wall {
		return new Wall(room,
				"MzWallEast",
				function() { room.obj.East = ! room.obj.East },
				function() { return room.obj.East },
				function() { return room.x != room.floor.cols - 1; },
				function() { return room.floor.rooms[room.floor.z][room.y][room.x+1].West })
			.addClass("MzWallWE");
	}
	function north(room :Room) :Wall {
		return new Wall(room,
				"MzWallNorth",
				function() { room.obj.North = ! room.obj.North },
				function() { return room.obj.North },
				function() { return room.y != 0; },
				function() { return room.floor.rooms[room.floor.z][room.y-1][room.x].South; })
			.addClass("MzWallNS");
	}
	function south(room :Room) :Wall {
		return new Wall(room,
				"MzWallSouth",
				function() { room.obj.South = ! room.obj.South },
				function() { return room.obj.South },
				function() { return room.y != room.floor.rows - 1; },
				function() { return room.floor.rooms[room.floor.z][room.y+1][room.x].North })
			.addClass("MzWallNS");
	}
	function ceil(room :Room) :Wall {
		return new Wall(room,
				"MzWallCeil",
				function() { room.obj.Ceil = ! room.obj.Ceil },
				function() { return room.obj.Ceil },
				function() { return room.floor.z != 0; },
				function() { return room.floor.rooms[room.floor.z-1][room.y][room.x].Floor })
			.addClass("MzWallCF");
	}
	function floor(room :Room) :Wall {
		return new Wall(room,
				"MzWallFloor",
				function() { room.obj.Floor = ! room.obj.Floor; },
				function() { return room.obj.Floor; },
				function() { return room.floor.z != room.floor.floors - 1; },
				function() { return room.floor.rooms[room.floor.z+1][room.y][room.x].Ceil; })
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
