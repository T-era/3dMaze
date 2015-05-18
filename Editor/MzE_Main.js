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
}
