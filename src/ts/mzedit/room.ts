import { Types, Event } from '../mz';

import { WallEditor, north, south, east, west, ceil, floor } from './wall';
import { FloorEditor } from './floor';
import { EventMarker } from './event';

export interface RoomPointedListener {
	(pointed:RoomEditor) :void;
}

export class RoomEditor {
	x :number;
	y :number;
	floor :FloorEditor;
	dom :JQuery;
	walls: WallEditor[];
	eventMarker :EventMarker;
	obj :Types.IRoom;
	_isGoal :boolean;
	_normalEvents :Types.Event[];

	constructor(floorObj :FloorEditor, x :number, y :number, z: number, fPointed :RoomPointedListener) {
		this.floor = floorObj;
		this.x = x;
		this.y = y;
		this.obj = floorObj.rooms[z][y][x];
		this.eventMarker = new EventMarker(this.obj.Events);
		this._normalEvents = [];
		this.walls = [
			west(this),
			east(this),
			north(this),
			south(this),
			ceil(this),
			floor(this)];

		var dom = $("<div>")
			.addClass("MzRoom")
			.css({
				top: 10 + y*100 + "px",
				left: 10 + x*100 + "px" })
			.click(()=> {
				fPointed(this)
			});
		this.dom = dom;
		this.dom.append(this.eventMarker.dom);
		for (var i = 0, max = this.walls.length; i < max; i ++) {
			this.dom.append(this.walls[i].div);
		}
		var normal = [];
		this.obj.Events.forEach((event :Types.Event, index :number, array)=> {
			if (event.isNormal) {
				normal.push(event);
			} else {
				this.isGoal(true);
			}
		})
		this._normalEvents = normal;
	}
	appendTo(owner :JQuery) :RoomEditor {
		this.dom.appendTo(owner);
		return this;
	}
	resetColor() {
		for (var i = 0, max = this.walls.length; i < max; i ++) {
			this.walls[i].resetColor();
		}
		this.eventMarker.setGoal(this._isGoal);
		this.eventMarker.setEvent(this._normalEvents);
	}
	isGoal(arg :boolean = null) {
		if (arg != null) {
			this._isGoal = arg;

			this.__copyEventToObj();
		}
		return this._isGoal;
	}
	addNormalEvent(arg :Types.Event) {
		this._normalEvents.push(arg);

		this.__copyEventToObj();
	}
	removeNormalEvent(arg :Types.Event) {
		var index=-1;
		for (var i = 0, max = this._normalEvents.length; i < max; i ++) {
			if (arg == this._normalEvents[i]) {
				index = i;
			}
		}
		this._normalEvents.splice(index, 1);

		this.__copyEventToObj();
	}
	__copyEventToObj() {
		this.obj.Events = [];
		this._normalEvents.forEach((e)=> {
			this.obj.Events.push(e);
		});
		if (this._isGoal) {
			this.obj.Events.push(new Event.Goal());
		}
	}
}
