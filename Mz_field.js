Mz.Field = [
[
	[new Mz.Room(true, false, false, true, false, false), new Mz.Room(true, false, false, false, true, true), new Mz.Room(true, false, false, false, true, true), new Mz.Room(true, false, false, false, true, true), new Mz.Room(true, false, true, false, true, true)],
	[new Mz.Room(false, false, false, true, true, true), new Mz.Room(false, false, false, false, true, true), new Mz.Room(false, false, false, false, true, true), new Mz.Room(false, false, false, false, true, true), new Mz.Room(false, false, true, false, true, true)],
	[new Mz.Room(false, false, false, true, true, true), new Mz.Room(false, false, false, false, true, true), new Mz.Room(false, false, false, false, true, true), new Mz.Room(false, false, false, false, true, true), new Mz.Room(false, false, true, false, true, true)],
	[new Mz.Room(false, false, false, true, true, true), new Mz.Room(false, false, false, false, true, true), new Mz.Room(false, false, false, false, true, true), new Mz.Room(false, false, false, false, true, true), new Mz.Room(false, false, true, false, true, true)],
	[new Mz.Room(false, true, false, true, true, true), new Mz.Room(false, true, false, false, true, true), new Mz.Room(false, true, false, false, true, true), new Mz.Room(false, true, false, false, true, true), new Mz.Room(false, true, true, false, true, true)]
],
[
	[new Mz.Room(true, false, false, true, false, false), new Mz.Room(true, true, false, false, true, true), new Mz.Room(true, false, false, false, true, true), new Mz.Room(true, true, true, false, true, true)],
	[new Mz.Room(false, true, true, true, true, true), new Mz.Room(true, true, false, true, true, true), new Mz.Room(false, false, false, false, true, true), new Mz.Room(true, false, true, false, true, true)],
	[new Mz.Room(true, true, false, true, true, true), new Mz.Room(true, false, false, false, true, true), new Mz.Room(false, false, true, false, true, true), new Mz.Room(false, true, true, true, true, true)],
	[new Mz.Room(true, true, false, true, true, true), new Mz.Room(false, true, true, false, true, true), new Mz.Room(false, true, false, true, true, true), new Mz.Room(true, true, true, false, true, true)]
]
];
Mz.Field.at = function(pos) {
	var x = pos.x;
	var y = pos.y;
	var z = pos.z;
	if (z < 0 || x < 0 || y < 0
		|| z >= this.length || y >= this[z].length || x >= this[z][y].length) {
		return null;
	} else {
		return this[z][y][x];
	}
};
