MzE.EditMode = function(doms, setting) {
	var xSize = setting.xSize;
	var ySize = setting.ySize;
	var zSize = setting.zSize;
	var name = setting.name;
	var rooms;
	var fields;
	var baseColors;

	$("#EzE_Save").click(function() {
		localStorage[setting.name] = MzE.SourceIO.ForEval(fields, baseColors);
	});

	this.selectFloor = function() {
		var z = doms.floorSelector.val()*1;
		rooms.setFloor(z);
		resetColor();

		function resetColor() {
			var baseColor = baseColors[z];
		}
	};
	this.inputColor = function() {
		var z = doms.floorSelector.val();
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
	this.reload = function(newFields, newBaseColors) {
		fields = newFields;
		rooms = new MzE.Rooms(xSize, ySize, zSize, $("#output"), fields);

		baseColors = newBaseColors;
		doms.floorSelector.children().remove();

		for (var z = 0; z < zSize; z ++) {
			var opt = $("<option>")
				.text("Floor: B" + z)
				.val(z)
				.appendTo(doms.floorSelector);
		}
		this.selectFloor();
	}


	var tempField = [];
	var tempColors = [];
	tempField.length = zSize;
	tempColors.length = zSize;
	for (var z = 0; z < zSize; z ++) {
		tempField[z] = createField();
		tempColors[z] = { r: 255, g: 255, b: 255 };
	}
	this.reload(tempField, tempColors);

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
};