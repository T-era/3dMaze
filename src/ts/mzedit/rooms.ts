/// <reference path="../../lib/jquery/jquery.d.ts" />
/// <reference path="floor.ts" />

module Mz {
	export module Edit {
		export class Rooms {
			owner :JQuery;
			floorList :Mz.Edit.Floor[];

			constructor(cols :number, rows :number, floors :number, owner :JQuery, rooms :Mz.IRoom[][][], listener :RoomPointedListener) {
				this.owner = owner;
				this.floorList = [];
				for (var z = 0; z < floors; z ++) {
					this.floorList.push(createFloor(z));
				}

				function createFloor(z) {
					return new Mz.Edit.Floor(cols, rows, floors, rooms, z, listener);
				}
			}
			at(pos :Mz.Position) :Room {
				return this.floorList[pos.z].at(pos.x, pos.y);
			}

			setFloor(z :number) {
				this.owner.children().remove();
				this.floorList[z].init(this.owner);
				this.floorList[z].repaint();
			}
		}
	}
}
