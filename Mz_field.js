(function() {
	var floor0 = { r: 187, g: 187, b: 255 };
	var floor1 = { r: 187, g: 187, b: 221 };
	var floor2 = { r: 187, g: 187, b: 187 };
	var f0 = function(w) { return new Mz.Room(w, floor0); };
	var f1 = function(w) { return new Mz.Room(w, floor1); };
	var f2 = function(w) { return new Mz.Room(w, floor2); };
	Mz.Field = [
		[[f0(45), f0(59), f0(53), f0(59), f0(53)]
		,[f0(58), f0(53), f0(58), f0(53), f0(46)]
		,[f0(56), f0(39), f0(41), f0(50), f0(53)]
		,[f0(56), f0(39), f0(62), f0(41), f0(54)]
		,[f0(46), f0(43), f0(51), f0(50), f0(55)]
		]
		, [[f1(29), f1(61), f1(43), f1(51), f1(39)]
		,[f1(58), f1(38), f1(43), f1(53), f1(15)]
		,[f1(41), f1(37), f1(13), f1(58), f1(53)]
		,[f1(58), f1(22), f1(58), f1(23), f1(60)]
		,[f1(15), f1(27), f1(51), f1(51), f1(54)]
		]
		, [[f2(57), f2(49), f2(23), f2(61), f2(29)]
		,[f2(56), f2(22), f2(27), f2(52), f2(30)]
		,[f2(30), f2(29), f2(29), f2(58), f2(53)]
		,[f2(59), f2(52), f2(60), f2(25), f2(54)]
		,[f2(31), f2(58), f2(54), f2(58), f2(55)]
		]
	];
	Mz.Field.at = function(pos) {
		var x = pos.x;
		var y = pos.y;
		var z = pos.z;
		if (z < 0 || x < 0 || y < 0 || z >= this.length || y >= this[z].length || x >= this[z][y].length) {
			return null;
		} else {
			return this[z][y][x];
		}
	};
})();