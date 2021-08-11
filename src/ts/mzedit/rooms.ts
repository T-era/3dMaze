import { Types } from '../mz';

import { RoomEditor, RoomPointedListener } from './room';
import { FloorEditor } from './floor';

export class RoomsEditor {
	owner :JQuery;
	floorList :FloorEditor[];

	constructor(cols :number, rows :number, floors :number, owner :JQuery, rooms :Types.IRoom[][][], listener :RoomPointedListener) {
		this.owner = owner;
		this.floorList = [];
		for (var z = 0; z < floors; z ++) {
			this.floorList.push(createFloor(z));
		}

		function createFloor(z) {
			return new FloorEditor(cols, rows, floors, rooms, z, listener);
		}
	}
	at(pos :Types.Position) :RoomEditor {
		return this.floorList[pos.z].at(pos.x, pos.y);
	}

	setFloor(z :number) {
		this.owner.children().remove();
		this.floorList[z].init(this.owner);
		this.floorList[z].repaint();
	}
}
