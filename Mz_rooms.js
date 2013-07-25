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
Mz.Room = function(walls, baseColor) {
	this.baseColor = baseColor;
	this.hasFloor = Math.floor(walls/16) % 2;
	this.hasCeil = Math.floor(walls/32) % 2;

	var northWall = Math.floor(walls) % 2;
	var southWall = Math.floor(walls/2) % 2;
	var eastWall = Math.floor(walls/4) % 2;
	var westWall = Math.floor(walls/8) % 2;
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
