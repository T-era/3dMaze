import { Common } from '../common';
import { Types, Field } from '../mz';

interface FieldIO {
	load(name :string) :void;
	loadRawJson(name :string) :Types.JsonData;
	saveToStorage(name :string, map: Types.JsonData) :void;

	saveDataList<T>(fConvert :(string)=>T) :()=>T[];
	removeMap(name :string) :void;
	existsName(name :string) :boolean;
}

var STORAGE_KEY_PREFIX = "Mzmz_";

export var MzIO :FieldIO = {
	load: function(name :string) {
		var obj = this.loadRawJson(name);
		Field.set(obj);
	},
	loadRawJson: function(name :string) {
		var key = STORAGE_KEY_PREFIX + name;
		var str = localStorage[key];
		return JSON.parse(str);
	},
	saveToStorage: function(name :string, jsonObj :Types.JsonData) {
		var key = STORAGE_KEY_PREFIX + name;
		var str = JSON.stringify(jsonObj);
		/*{
			baseColors: baseColors,
			start: start,
			fields: listToJson<IRoom[][], JSRoom[][]>(fields
				, function(floor) {
					return listToJson<IRoom[], JSRoom[]>(floor,
						function(line :IRoom[]) {
							return listToJson<IRoom, JSRoom>(line, roomToJson);
						});
				})
		});*/

		localStorage[key] = str;
	},
	saveDataList: function<T>(fConvert :(string)=>T) {
		return ()=> {
			var list = [];
			for (var i = 0, max = localStorage.length; i < max; i ++) {
				var key = localStorage.key(i);
				if (key.indexOf(STORAGE_KEY_PREFIX) === 0) {
					var name = key.slice(STORAGE_KEY_PREFIX.length);
					list.push(fConvert(name));
				}
			}
			return list;
		}
	},
	removeMap: function(name :string) {
		var key = STORAGE_KEY_PREFIX + name;
		localStorage.removeItem(key);
	},
	existsName: function(name :string) {
		var key = STORAGE_KEY_PREFIX + name;
		return key in localStorage;
	}
};

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
