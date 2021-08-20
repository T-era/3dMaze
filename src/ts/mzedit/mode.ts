import { Common } from '../common';
import { ComplexSelect } from '../uiparts';
import { Types, Event } from '../mz';
import { MzInit } from '../mzinit';
import { MzIO } from '../storage';

import { RoomEditor } from './room';
import { RoomsEditor } from './rooms';
import { FloorSelector } from './floor_selector';
import { color_roomChangeListener } from './room_color';
import { event_roomChangeListener } from './event';

var xSize = 1;
var ySize = 1;
var zSize = 1;
var name = "Dummy";
var rooms :RoomsEditor;
var fields :Types.IRoom[][][];
var baseColors :Common.Color[];
var floorSelector :ComplexSelect<number>;
var selectedRoom :RoomEditor;
var roomChangeListeners :Common.Func<RoomEditor>[] = [];
	var startPoint :Types.Position = {x:0,y:0,z:0};
export function getStartPoint() { return startPoint; };
export function setStartPoint(arg :Types.Position) {
	if (startPoint) {
		rooms.at(startPoint).eventMarker.setStart(false);
	}
	startPoint = arg;
	rooms.at(startPoint).eventMarker.setStart(true);
}
export interface EditModeType {
	save();
	initEmpty(arg :MzInit.InitSetting);
	edit(_name :string, jsonMap :Types.JsonData);
	selectFloor(val :number);
	import(jsonMap :Types.JsonData);
	export() :Types.JsonData;
}

$(function() {
	$("#MzE_Save").click(function() {
		EditMode.save()
	});
	floorSelector = FloorSelector($("#floorSelect"), function() { return baseColors; });
	roomChangeListeners.push(color_roomChangeListener);
	roomChangeListeners.push(event_roomChangeListener);
});

export function fireRoomChange(room :RoomEditor) {
	for (var i = 0, max = roomChangeListeners.length; i < max; i ++) {
		var listener = roomChangeListeners[i];
		listener(room);
	}
}

class _EditMode {
	save() {
		MzIO.saveToStorage(name, {
			start: startPoint,
			baseColors: baseColors,
			fields: jsonFields()
		});
	}

	initEmpty(setting :MzInit.InitSetting) {
		var zmax = setting.zSize;
		name = setting.name;
		var tempField :Types.JSRoom[][][] = [];
		var tempColors :Common.Color[] = [];
		tempField.length = zmax;
		tempColors.length = zmax;
		for (var z = 0; z < zmax; z ++) {
			tempField[z] = createField(setting.xSize, setting.ySize);
			tempColors[z] = new Common.Color(255, 255, 255);
		}
		this.import({start: {x:0,y:0,z:0}, fields: tempField, baseColors: tempColors});
	}
	edit(_name :string, jsonMap :Types.JsonData) {
		name = _name;
		this.import(jsonMap);
	}
	selectFloor(val :number) {
		rooms.setFloor(val);
		if (val === startPoint.z) {
			rooms.at(startPoint).eventMarker.setStart(true);
		}
		resetColor();
		fireRoomChange(null);

		function resetColor() {
			var baseColor = baseColors[val];
		}
	}
	import(jsonMap :Types.JsonData) {
		fields = mapToRoom(jsonMap.fields);
		xSize = fields[0][0].length;
		ySize = fields[0].length;
		zSize = fields.length;
		startPoint = jsonMap.start;
		var newBaseColors = jsonMap.baseColors;
		rooms = new RoomsEditor(xSize, ySize, zSize, $("#output"), fields, function(room :RoomEditor) {
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

		function mapToRoom(list :Types.JSRoom[][][]) :Types.IRoom[][][] {
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
	export() :Types.JsonData {
		return {
			start: startPoint,
			baseColors: baseColors,
			fields: jsonFields()
		};
	}
}
export var EditMode :EditModeType = new _EditMode();

function createField(xmax :number, ymax :number) :Types.JSRoom[][] {
	var ret = [];
	ret.length = ymax;
	for (var y = 0; y < ymax; y ++) {
		ret[y] = [];
		ret[y].length = xmax;
		for (var x = 0; x < xmax; x ++) {
			ret[y][x] = {num:63, col: null, eve: [] };
		}
	}
	return ret;
}
function jsonFields() :Types.JSRoom[][][] {
	return fields.map((floor :Types.IRoom[][], index :number, array)=> {
		return floor.map((line :Types.IRoom[], index:number, array)=> {
			return line.map(roomToJson);
		});
	})
}
function roomToJson(room :Types.IRoom) :Types.JSRoom {
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
		eve: room.Events.map((event :Types.Event, index :number, array)=> {
			return event.toJsonString()
		})
	};
}
function roomFromJson(obj :Types.JSRoom) :Types.IRoom {
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
			return Event.readEvent(str)
		})
	};
}
