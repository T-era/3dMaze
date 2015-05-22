/// <reference path="../../lib/jquery/jquery.d.ts" />
/// <reference path="../../lib/common.d.ts" />
/// <reference path="../../lib/uiparts.d.ts" />
/// <reference path="../../lib/mz.d.ts" />
/// <reference path="../../lib/mzinit.d.ts" />
/// <reference path="floor_selector.ts" />
/// <reference path="rooms.ts" />
/// <reference path="floor.ts" />
/// <reference path="event/main.ts" />

module MzE {
	var xSize = 1;
	var ySize = 1;
	var zSize = 1;
	var name = "Dummy";
	var rooms :Rooms;
	var fields :Mz.IRoom[][][];
	var baseColors :Common.Color[];
	var floorSelector :UIParts.ComplexSelect<number>;
	var selectedRoom :Room;
	var roomChangeListeners :Common.Func<MzE.Room>[] = [];
	export var startPoint :Mz.Position = {x:0,y:0,z:0};

	export function fireRoomChange(room :MzE.Room) {
		for (var i = 0, max = roomChangeListeners.length; i < max; i ++) {
			var listener = roomChangeListeners[i];
			listener(room);
		}
	}

	$(function() {
		$("#MzE_Save").click(function() {
			Mz.Field.saveToStorage(name, startPoint, baseColors, fields);
		});
		floorSelector = FloorSelector($("#floorSelect"), function() { return baseColors; });
		roomChangeListeners.push(MzE.color_roomChangeListener);
		roomChangeListeners.push(MzE.event.event_roomChangeListener);
	});

	export interface EditModeType {
		save();
		initEmpty(arg :MzI.InitSetting);
		edit(_name :string, start :Mz.Position, tempColors :Common.Color[], fieldNums);
		selectFloor(val :number);
		reload(start :Mz.Position, newFields :Mz.IRoom[][][], newBaseColors :Common.Color[]);
	}

	class _EditMode {
		save() {
			Mz.Field.saveToStorage(name, startPoint, baseColors, fields);
		}

		initEmpty(setting :MzI.InitSetting) {
			xSize = setting.xSize;
			ySize = setting.ySize;
			zSize = setting.zSize;
			name = setting.name;
			var tempField :Mz.IRoom[][][] = [];
			var tempColors :Common.Color[] = [];
			tempField.length = zSize;
			tempColors.length = zSize;
			for (var z = 0; z < zSize; z ++) {
				tempField[z] = createField();
				tempColors[z] = new Common.Color(255, 255, 255);
			}
			this.reload({x:0,y:0,z:0}, tempField, tempColors);
		}
		edit(_name :string, start :Mz.Position, tempColors :Common.Color[], fieldStrs :{num;col;eve}[][][]) {
			zSize = fieldStrs.length;
			ySize = fieldStrs[0].length;
			xSize = fieldStrs[0][0].length;
			name = _name
			var tempField = mapToRoom(fieldStrs);
			this.reload(start, tempField, tempColors);

			function mapToRoom(list :{num;col;eve}[][][]) :Mz.IRoom[][][] {
				var ret = [];
				for (var z = 0, zMax = list.length; z < zMax; z ++) {
					var floor = [];
					for (var y = 0, yMax = list[z].length; y < yMax; y ++) {
						var line = []
						for (var x = 0, xMax = list[z][y].length; x < xMax; x ++) {
							line.push(Mz.Field.roomFromJson(list[z][y][x]));
						}
						floor.push(line);
					}
					ret.push(floor);
				}
				return ret;
			}
		}
		selectFloor(val :number) {
			rooms.setFloor(val);
			resetColor();
			fireRoomChange(null);

			function resetColor() {
				var baseColor = baseColors[val];
			}
		}
		reload(start: Mz.Position, newFields :Mz.IRoom[][][], newBaseColors :Common.Color[]) {
			fields = newFields;
			startPoint = start;
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
		};
	}
  export var EditMode :EditModeType = new _EditMode();

	function createField() :Mz.IRoom[][] {
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
					Floor: true,
					Color: null,
					Events: [],
				};
			}
		}
		return ret;
	}
}
