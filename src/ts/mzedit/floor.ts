/// <reference path="../../lib/jquery/jquery.d.ts" />
/// <reference path="wall.ts" />

module Mz {
	export module Edit {
		export interface RoomPointedListener {
			(pointed:Room) :void;
		}
		export class Floor {
			cols :number;
			rows :number;
			floors :number;
			rooms :Mz.IRoom[][][];
			z :number;
			roomDivs :Room[];
			roomPointed :RoomPointedListener;

			constructor(cols :number
					, rows :number
					, floors :number
					, rooms :Mz.IRoom[][][]
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
						var room = new Room(this, x, y, this.z, this.roomPointed)
							.appendTo(owner);
						this.roomDivs.push(room);
					}
				}
			}
			repaint() {
				this.roomDivs.forEach((room)=>{
					room.resetColor();
				});
			}
		}
		export class Room {
			x :number;
			y :number;
			floor :Floor;
			dom :JQuery;
			walls: Wall[];
			obj :Mz.IRoom;
			_isGoal :boolean;
			_normalEvents :Mz.Event[];

			constructor(floorObj :Floor, x :number, y :number, z: number, fPointed :RoomPointedListener) {
				this.floor = floorObj;
				this.x = x;
				this.y = y;
				this.obj = floorObj.rooms[z][y][x];
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
				for (var i = 0, max = this.walls.length; i < max; i ++) {
					this.dom.append(this.walls[i].div);
				}
				var normal = [];
				this.obj.Events.forEach((event :Mz.Event, index :number, array)=> {
					if (event.isNormal) {
						normal.push(event);
					} else {
						this.isGoal(true);
					}
				})
				this._normalEvents = normal;
			}
			appendTo(owner :JQuery) :Room {
				this.dom.appendTo(owner);
				return this;
			}
			resetColor() {
				for (var i = 0, max = this.walls.length; i < max; i ++) {
					this.walls[i].resetColor();
				}
			}
			isGoal(arg :boolean = null) {
				if (arg != null) {
					this._isGoal = arg;

					this.__copyEventToObj();
				}
				return this._isGoal;
			}
			addNormalEvent(arg :Mz.Event) {
				this._normalEvents.push(arg);

				this.__copyEventToObj();
			}
			removeNormalEvent(arg :Mz.Event) {
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
					this.obj.Events.push(new Mz.Goal());
				}
			}
		}
	}
}
