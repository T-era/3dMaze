Mz.Direction = {
	North: {
		d: function(pos) {
			return { x: pos.x, y: pos.y-1, z: pos.z };
		},
		right: function(pos, dd) {
			return { x: pos.x+dd, y: pos.y, z: pos.z };
		}
	},
	South: {
		d: function(pos) {
			return { x: pos.x, y: pos.y+1, z: pos.z };
		},
		right: function(pos, dd) {
			return { x: pos.x-dd, y: pos.y, z: pos.z };
		}
	},
	East: { 
		d: function(pos) {
			return { x: pos.x+1, y: pos.y, z: pos.z };
		},
		right: function(pos, dd) {
			return { x: pos.x, y: pos.y+dd, z: pos.z };
		}
	},
	West: {
		d: function(pos) {
			return { x: pos.x-1, y: pos.y, z: pos.z };
		},
		right: function(pos, dd) {
			return { x: pos.x, y: pos.y-dd, z: pos.z };
		}
	}
}

Mz.Room = function(northWall, southWall, eastWall, westWall, floor, ceil) {
	this.hasFloor = floor;
	this.hasCeil = ceil;
	this.hasNearWall = function(direction) {
		return (direction == Mz.Direction.North && southWall)
			|| (direction == Mz.Direction.South && northWall)
			|| (direction == Mz.Direction.East && westWall)
			|| (direction == Mz.Direction.West && eastWall);
	};
	this.hasAwayWall = function(direction) {
		return (direction == Mz.Direction.North && northWall)
			|| (direction == Mz.Direction.South && southWall)
			|| (direction == Mz.Direction.East && eastWall)
			|| (direction == Mz.Direction.West && westWall);
	};
	this.hasLeftWall = function(direction) {
		return (direction == Mz.Direction.North && westWall)
			|| (direction == Mz.Direction.South && eastWall)
			|| (direction == Mz.Direction.East && northWall)
			|| (direction == Mz.Direction.West && southWall);
	};
	this.hasRightWall = function(direction) {
		return (direction == Mz.Direction.North && eastWall)
			|| (direction == Mz.Direction.South && westWall)
			|| (direction == Mz.Direction.East && southWall)
			|| (direction == Mz.Direction.West && northWall);
	}
}
