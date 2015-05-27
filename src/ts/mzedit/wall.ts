/// <reference path="../../lib/jquery/jquery.d.ts" />

module Mz {
	export module Edit {
		export class Wall {
			checked :boolean;
			baseClassName :string;
			div :JQuery;
			getWall :()=>boolean;
			hasNeighbor :()=>boolean;
			getNeighborWall :()=>boolean;

			constructor(obj :Room
					, baseClassName :string
					, setWall :Common.Callback
					, getWall :()=>boolean
					, hasNeighbor :()=>boolean
					, getNeighborWall :()=>boolean) {
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
		export function west(room :Room) :Wall {
			return new Wall(room,
					"MzWallWest",
					function() { room.obj.West = ! room.obj.West; },
					function() { return room.obj.West; },
					function() { return room.x != 0; },
					function() { return room.floor.rooms[room.floor.z][room.y][room.x-1].East; })
				.addClass("MzWallWE");
		}
		export function east(room :Room) :Wall {
			return new Wall(room,
					"MzWallEast",
					function() { room.obj.East = ! room.obj.East },
					function() { return room.obj.East },
					function() { return room.x != room.floor.cols - 1; },
					function() { return room.floor.rooms[room.floor.z][room.y][room.x+1].West })
				.addClass("MzWallWE");
		}
		export function north(room :Room) :Wall {
			return new Wall(room,
					"MzWallNorth",
					function() { room.obj.North = ! room.obj.North },
					function() { return room.obj.North },
					function() { return room.y != 0; },
					function() { return room.floor.rooms[room.floor.z][room.y-1][room.x].South; })
				.addClass("MzWallNS");
		}
		export function south(room :Room) :Wall {
			return new Wall(room,
					"MzWallSouth",
					function() { room.obj.South = ! room.obj.South },
					function() { return room.obj.South },
					function() { return room.y != room.floor.rows - 1; },
					function() { return room.floor.rooms[room.floor.z][room.y+1][room.x].North })
				.addClass("MzWallNS");
		}
		export function ceil(room :Room) :Wall {
			return new Wall(room,
					"MzWallCeil",
					function() { room.obj.Ceil = ! room.obj.Ceil },
					function() { return room.obj.Ceil },
					function() { return room.floor.z != 0; },
					function() { return room.floor.rooms[room.floor.z-1][room.y][room.x].Floor })
				.addClass("MzWallCF");
		}
		export function floor(room :Room) :Wall {
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
}
