/// <reference path="../../lib/common.d.ts" />
/// <reference path="types.ts" />
/// <reference path="event.ts" />

module Mz {
	export var Directions :FullDirection = {
		North: {
			d: function(pos :Position) :Position {
				return { x: pos.x, y: pos.y-1, z: pos.z };
			},
			right: function(pos :Position, dd :number) :Position {
				return { x: pos.x+dd, y: pos.y, z: pos.z };
			},
			toJpStr: function() {
				return "北";
			}
		},
		South: {
			d: function(pos) {
				return { x: pos.x, y: pos.y+1, z: pos.z };
			},
			right: function(pos, dd) {
				return { x: pos.x-dd, y: pos.y, z: pos.z };
			},
			toJpStr: function() {
				return "南";
			}
		},
		East: {
			d: function(pos) {
				return { x: pos.x+1, y: pos.y, z: pos.z };
			},
			right: function(pos, dd) {
				return { x: pos.x, y: pos.y+dd, z: pos.z };
			},
			toJpStr: function() {
				return "東";
			}
		},
		West: {
			d: function(pos) {
				return { x: pos.x-1, y: pos.y, z: pos.z };
			},
			right: function(pos, dd) {
				return { x: pos.x, y: pos.y-dd, z: pos.z };
			},
			toJpStr: function() {
				return "西";
			}
		}
	}
	export class Room {
		color :Common.Color;
		events :Event[];
		hasFloor :boolean;
		hasCeil :boolean;

		northWall :boolean;
		southWall :boolean;
		eastWall :boolean;
		westWall :boolean;

		constructor(walls :number, color :Common.Color, events :string[]) {
			this.color = color;
			this.hasFloor = Math.floor(walls/16) % 2 != 0;
			this.hasCeil = Math.floor(walls/32) % 2 != 0;

			this.northWall = Math.floor(walls) % 2 != 0;
			this.southWall = Math.floor(walls/2) % 2 != 0;
			this.eastWall = Math.floor(walls/4) % 2 != 0;
			this.westWall = Math.floor(walls/8) % 2 != 0;
			this.events = events.map(Mz.readEvent);
		}
		hasNearWall(direction :Direction) :boolean {
			return (direction == Mz.Directions.North && this.southWall)
				|| (direction == Mz.Directions.South && this.northWall)
				|| (direction == Mz.Directions.East && this.westWall)
				|| (direction == Mz.Directions.West && this.eastWall);
		}
		hasAwayWall(direction :Direction) :boolean {
			return (direction == Mz.Directions.North && this.northWall)
				|| (direction == Mz.Directions.South && this.southWall)
				|| (direction == Mz.Directions.East && this.eastWall)
				|| (direction == Mz.Directions.West && this.westWall);
		}
		hasLeftWall(direction :Direction) :boolean {
			return (direction == Mz.Directions.North && this.westWall)
				|| (direction == Mz.Directions.South && this.eastWall)
				|| (direction == Mz.Directions.East && this.northWall)
				|| (direction == Mz.Directions.West && this.southWall);
		}
		hasRightWall(direction :Direction) :boolean {
			return (direction == Mz.Directions.North && this.eastWall)
				|| (direction == Mz.Directions.South && this.westWall)
				|| (direction == Mz.Directions.East && this.southWall)
				|| (direction == Mz.Directions.West && this.northWall);
		}
	}
}
