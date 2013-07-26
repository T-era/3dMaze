MzE.EditMode = function(doms, xSize, ySize, zSize) {
	var fields;
	var baseColors;
	var editCanvas;

	this.selectFloor = function() {
		var z = doms.floorSelector.value*1;
		resetColor();
		editCanvas.initCanvas(fields, z);
		
		function resetColor() {
			var baseColor = baseColors[z];
			doms.rInput.value = baseColor.r;
			doms.gInput.value = baseColor.g;
			doms.bInput.value = baseColor.b;
		}
	};
	this.inputColor = function() {
		var z = doms.floorSelector.value;
		var baseColor = baseColors[z];
		baseColor.r = doms.rInput.value;
		baseColor.g = doms.gInput.value;
		baseColor.b = doms.bInput.value;
	};
	this.exp = function() {
		var source = MzE.SourceIO.Export(fields, baseColors);
		doms.srcText.value = source;
	}
	this.inp = function() {
		var source = doms.srcText.value;;
		var mz = MzE.SourceIO.Inport(source);
		var colors = toColors(mz.Field);
		this.reload(mz.Field.length, mz.Field, colors);
		function toColors(fields) {
			var list = [];
			for (var z = 0, zMax = fields.length; z < zMax; z ++) {
				list[z] = fields[z][0][0].baseColor;
			}
			return list;
		}
	}
	this.reload = function(zSize, newFields, newBaseColors) {
		fields = newFields;
		baseColors = newBaseColors;
		for (var i = doms.floorSelector.options.length; i >= 0; i --) {
			doms.floorSelector.options[i] = null;
		}
		for (var z = 0; z < zSize; z ++) {
			var opt = document.createElement("option");
			opt.text = "Floor: " + z;
			opt.value = z;
			doms.floorSelector.options.add(opt);
		}
		editCanvas = new MzE.EditCanvas(doms.canvas, newFields[0][0].length, newFields[0].length, zSize);
		this.selectFloor();
	}


//	(function() { // Initialice
		var tempField = [];
		var tempColors = [];
		tempField.length = zSize;
		tempColors.length = zSize;
		for (var z = 0; z < zSize; z ++) {
			tempField[z] = createField();
			tempColors[z] = { r: 255, g: 255, b: 255 };
		}
		this.reload(zSize, tempField, tempColors);

		function createField() {
			var ret = [];
			ret.length = ySize;
			for (var y = 0; y < ySize; y ++) {
				ret[y] = [];
				ret[y].length = xSize;
				for (var x = 0; x < xSize; x ++) {
					ret[y][x] = {
						North: true,
						South: true,
						East: true,
						West: true,
						Ceil: true,
						Floor: true
					};
				}
			}
			return ret;
		}
//	})();
};