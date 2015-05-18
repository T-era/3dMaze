/// <reference path="../../lib/jquery/jquery.d.ts" />
/// <reference path="floor.ts" />

module MzE {
	export class Rooms {
		owner :JQuery;
		floorList :MzE.Floor[];

		constructor(cols, rows, floors, owner :JQuery, rooms, listener :RoomPointedListener) {
			this.owner = owner;
			this.floorList = [];
			for (var z = 0; z < floors; z ++) {
				this.floorList.push(createFloor(z));
			}

			function createFloor(z) {
				return new MzE.Floor(cols, rows, floors, rooms, z, listener);
			}
		}

		setFloor(z) {
			this.owner.children().remove();
			this.floorList[z].init(this.owner);
			this.floorList[z].repaint();
		}
	}
}
