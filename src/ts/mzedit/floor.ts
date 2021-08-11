import { Types } from '../mz';

import { RoomEditor, RoomPointedListener } from './room';

export class FloorEditor {
	cols :number;
	rows :number;
	floors :number;
	rooms :Types.IRoom[][][];
	z :number;
	roomDivs :RoomEditor[];
	roomPointed :RoomPointedListener;

	constructor(cols :number
			, rows :number
			, floors :number
			, rooms :Types.IRoom[][][]
			, z :number
			, roomPointed :RoomPointedListener) {
		this.cols = cols;
		this.rows = rows;
		this.floors = floors;
		this.rooms = rooms;
		this.z = z;
		this.roomPointed = roomPointed;
	}
	init(owner :JQuery) {
		this.roomDivs = []
		for (var y = 0; y < this.rows; y ++) {
			for (var x = 0; x < this.cols; x ++) {
				var room = new RoomEditor(this, x, y, this.z, this.roomPointed)
					.appendTo(owner);
				// room.eventMarker
				this.roomDivs.push(room);
			}
		}
	}
	repaint() {
		this.roomDivs.forEach((room)=>{
			room.resetColor();
		});
	}
	at(x :number, y :number) :RoomEditor {
		return this.roomDivs[y * this.cols + x];
	}
}
