/// <reference path="../../lib/jquery/jquery.d.ts" />
/// <reference path="../../lib/common.d.ts" />
/// <reference path="../../lib/uiparts.d.ts" />
/// <reference path="../../lib/mz.d.ts" />
/// <reference path="../../lib/storage.d.ts" />
/// <reference path="../../lib/mzinit.d.ts" />
/// <reference path="floor_selector.ts" />
/// <reference path="rooms.ts" />
/// <reference path="floor.ts" />
/// <reference path="event/main.ts" />

module Mz {
	export module Edit {
		var xSize = 1;
		var ySize = 1;
		var zSize = 1;
		var name = "Dummy";
		var rooms :Rooms;
		var fields :Mz.IRoom[][][];
		var baseColors :Common.Color[];
		var floorSelector :UIParts.ComplexSelect<number>;
		var selectedRoom :Room;
		var roomChangeListeners :Common.Func<Mz.Edit.Room>[] = [];
		export var startPoint :Mz.Position = {x:0,y:0,z:0};

		export interface EditModeType {
			save();
			initEmpty(arg :Mz.Init.InitSetting);
			edit(_name :string, jsonMap :Mz.JsonData);
			selectFloor(val :number);
			import(jsonMap :Mz.JsonData);
			export() :Mz.JsonData;
		}

		$(function() {
			$("#MzE_Save").click(function() {
				EditMode.save()
			});
			floorSelector = FloorSelector($("#floorSelect"), function() { return baseColors; });
			roomChangeListeners.push(Mz.Edit.color_roomChangeListener);
			roomChangeListeners.push(Mz.Edit.event.event_roomChangeListener);
		});

		export function fireRoomChange(room :Mz.Edit.Room) {
			for (var i = 0, max = roomChangeListeners.length; i < max; i ++) {
				var listener = roomChangeListeners[i];
				listener(room);
			}
		}

		class _EditMode {
			save() {
				Mz.IO.saveToStorage(name, {
					start: startPoint,
					baseColors: baseColors,
					fields: jsonFields()
				});
			}

			initEmpty(setting :Mz.Init.InitSetting) {
				var zmax = setting.zSize;
				name = setting.name;
				var tempField :JSRoom[][][] = [];
				var tempColors :Common.Color[] = [];
				tempField.length = zmax;
				tempColors.length = zmax;
				for (var z = 0; z < zmax; z ++) {
					tempField[z] = createField(setting.xSize, setting.ySize);
					tempColors[z] = new Common.Color(255, 255, 255);
				}
				this.import({start: {x:0,y:0,z:0}, fields: tempField, baseColors: tempColors});
			}
			edit(_name :string, jsonMap :Mz.JsonData) {
				name = _name;
				this.import(jsonMap);
			}
			selectFloor(val :number) {
				rooms.setFloor(val);
				resetColor();
				fireRoomChange(null);

				function resetColor() {
					var baseColor = baseColors[val];
				}
			}
			import(jsonMap :JsonData) {
				fields = mapToRoom(jsonMap.fields);
				xSize = fields[0][0].length;
				ySize = fields[0].length;
				zSize = fields.length;
				startPoint = jsonMap.start;
				var newBaseColors = jsonMap.baseColors;
				rooms = new Rooms(xSize, ySize, zSize, $("#output"), fields, function(room :Room) {
					if (selectedRoom) {
						selectedRoom.dom.removeClass("Selected");
					}
					room.dom.addClass("Selected");
					selectedRoom = room;
					fireRoomChange(selectedRoom);
				});

				baseColors = newBaseColors;
				floorSelector.reload();

				this.selectFloor(0);

				function mapToRoom(list :JSRoom[][][]) :Mz.IRoom[][][] {
					var ret = [];
					for (var z = 0, zMax = list.length; z < zMax; z ++) {
						var floor = [];
						for (var y = 0, yMax = list[z].length; y < yMax; y ++) {
							var line = []
							for (var x = 0, xMax = list[z][y].length; x < xMax; x ++) {
								line.push(roomFromJson(list[z][y][x]));
							}
							floor.push(line);
						}
						ret.push(floor);
					}
					return ret;
				}
			}
			export() :Mz.JsonData {
				return {
					start: startPoint,
					baseColors: baseColors,
					fields: jsonFields()
				};
			}
		}
	  export var EditMode :EditModeType = new _EditMode();

		function createField(xmax :number, ymax :number) :JSRoom[][] {
			var ret = [];
			ret.length = ymax;
			for (var y = 0; y < ymax; y ++) {
				ret[y] = [];
				ret[y].length = xmax;
				for (var x = 0; x < xmax; x ++) {
					ret[y][x] = {num:0, col: null, eve: [] };
				}
			}
			return ret;
		}
		function jsonFields() :Mz.JSRoom[][][] {
			return fields.map((floor :IRoom[][], index :number, array)=> {
				return floor.map((line :IRoom[], index:number, array)=> {
					return line.map(roomToJson);
				});
			})
		}
		function roomToJson(room :IRoom) :Mz.JSRoom {
			var val = 0;
			if (room.North) val += 1;
			if (room.South) val += 2;
			if (room.East) val += 4;
			if (room.West) val += 8;
			if (room.Floor) val += 16;
			if (room.Ceil) val += 32;

			return {
				num: val,
				col: room.Color,
				eve: room.Events.map((event :Event, index :number, array)=> {
					return event.toJsonString()
				})
			};
		}
		function roomFromJson(obj :JSRoom) :IRoom {
			var num = Number(obj.num);

			return {
				North: num % 2 != 0,
				South: (num >> 1) % 2 != 0,
				East: (num >> 2) % 2 != 0,
				West: (num >> 3) % 2 != 0,
				Floor: (num >> 4) % 2 != 0,
				Ceil: (num >> 5) % 2 != 0,
				Color: obj.col,
				Events: obj.eve.map((str :string, index :number, array)=> {
					return readEvent(str)
				})
			};
		}
	}
}
