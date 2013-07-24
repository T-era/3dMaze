Mz.Field = [
[
	[new Mz.Room(true, false, false, true), new Mz.Room(true, false, false, false), new Mz.Room(true, false, false, false), new (Mz.Room)(true, false, false, false), new (Mz.Room)(true, false, true, false)],
	[new Mz.Room(false, false, false, true), new Mz.Room(false, false, false, false), new Mz.Room(false, false, false, false), new (Mz.Room)(false, false, false, false), new (Mz.Room)(false, false, true, false)],
	[new Mz.Room(false, false, false, true), new Mz.Room(false, false, false, false), new Mz.Room(false, false, false, false), new (Mz.Room)(false, false, false, false), new (Mz.Room)(false, false, true, false)],
	[new Mz.Room(false, false, false, true), new Mz.Room(false, false, false, false), new Mz.Room(false, false, false, false), new (Mz.Room)(false, false, false, false), new (Mz.Room)(false, false, true, false)],
	[new Mz.Room(false, true, false, true), new Mz.Room(false, true, false, false), new Mz.Room(false, true, false, false), new (Mz.Room)(false, true, false, false), new (Mz.Room)(false, true, true, false)]
],
[
	[new Mz.Room(true, false, false, true), new Mz.Room(true, true, false, false), new (Mz.Room)(true, false, false, false), new (Mz.Room)(true, true, true, false)],
	[new Mz.Room(false, true, true, true), new Mz.Room(true, true, false, true), new (Mz.Room)(false, false, false, false), new (Mz.Room)(true, false, true, false)],
	[new Mz.Room(true, true, false, true), new Mz.Room(true, false, false, false), new (Mz.Room)(false, false, true, false), new (Mz.Room)(false, true, true, true)],
	[new Mz.Room(true, true, false, true), new Mz.Room(false, true, true, false), new (Mz.Room)(false, true, false, true), new (Mz.Room)(true, true, true, false)]
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
