MzE.SourceIO = new (function() {
	var template = "(function() {?<contents>})();"
	var baseColorTemplate = "var floor?<z> = { r: ?<r>, g: ?<g>, b: ?<b> };";
	var functionTemplate = "var f?<z> = function(w) { return new Mz.Room(w, floor?<z>); };";
	var roomTemplate = "f?<z>(?<val>)";
	var additionFunction = "Mz.Field.at = function(pos) {var x = pos.x;var y = pos.y;var z = pos.z;if (z < 0 || x < 0 || y < 0 || z >= this.length || y >= this[z].length || x >= this[z][y].length) {return null;} else {return this[z][y][x];}};";

	this.ForEval = function(fields, baseColors) {
		var bc = "";
		var fc = "";
		for (var z = 0; z < fields.length; z ++) {
			bc += toStringBc(z, baseColors[z]);
			fc += toStringFc(z);
		}
		var arraySrc = "Mz.Field = [";
		for (var z = 0, zMax = fields.length; z < zMax; z++) {
			if (z == 0) arraySrc += "[";
			else  arraySrc += ", [";
			
			arraySrc += fieldToString(z, fields);
			arraySrc += "]";
		}
		arraySrc += "];";

		return bc + fc + arraySrc + additionFunction;
	}
	this.Export = function(fields, baseColors) {
		var contents = this.ForEval(fields, baseColors);

		return template.replace("?<contents>", contents);
	};
	this.Inport = function(src) {
		var pre = "Mz = {};Mz.Room = function(walls, baseColor) {this.baseColor = baseColor;this.Floor = Math.floor(walls/16) % 2;this.Ceil = Math.floor(walls/32) % 2;this.North = Math.floor(walls) % 2;this.South = Math.floor(walls/2) % 2;this.East = Math.floor(walls/4) % 2;this.West = Math.floor(walls/8) % 2;};";
		try {
			eval(pre + src);
		}catch (msg) {
			alert(msg);
		}
		return Mz;
	}

	function toStringBc(z, color) {
		return baseColorTemplate.replace("?<z>", z)
			.split("?<r>").join(color.r)
			.split("?<g>").join(color.g)
			.split("?<b>").join(color.b);
	}
	function toStringFc(z, color) {
		return functionTemplate.split("?<z>").join(z);
	}
	function fieldToString(z, fields) {
		var linesSrc = "";
		for (var y = 0, yMax = fields[z].length; y < yMax; y++) {
			if (y == 0) linesSrc += "[";
			else linesSrc += ",[";

			linesSrc += lineToString(z, y, fields);
			linesSrc += "]"
		}
		return linesSrc;
	}

	function roomToString(z, room) {
		var val = 0;
		if (room.North) val += 1;
		if (room.South) val += 2;
		if (room.East) val += 4;
		if (room.West) val += 8;
		if (room.Floor) val += 16;
		if (room.Ceil) val += 32;
		return roomTemplate.split("?<z>").join(z)
				.split("?<val>").join(val);
	}
	function lineToString(z, y, fields) {
		var roomsSrc = "";
		for (var x = 0, xMax = fields[z][y].length; x < xMax; x ++) {
			if (x == 0) roomsSrc += "";
			else roomsSrc += ", ";
			roomsSrc += roomToString(z, fields[z][y][x]);
		}
		return roomsSrc;
	}
})();

