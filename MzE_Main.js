;MzE = {};
$(function() {
	var editDialog = $("#edit").dialog({
		autoOpen: false
	});

	var doms = {
		editDiv: document.getElementById("edit"),
		floorSelector: $("#floorSelect")
	};
	MzE.toEdit = function(setting) {
		var xSize = setting.xSize;
		var ySize = setting.ySize;
		var zSize = setting.zSize;
		if (! xSize || ! ySize || ! zSize) {
			alert("error");
		} else {
			this.editMode = new MzE.EditMode(doms, setting);
			editDialog.dialog("open");
		}
	};
	MzE.Rooms = function (cols, rows, floors, owner, rooms) {
		var floorList = [];
		for (var z = 0; z < floors; z ++) {
			floorList.push(createFloor(z));
		}

		function createFloor(z) {
			return new MzE.Floor(cols, rows, floors, rooms, z);
		}

		this.setFloor = function(z) {
			owner.children().remove();
			floorList[z].init(owner);
			floorList[z].repaint();
		}
	};
});
