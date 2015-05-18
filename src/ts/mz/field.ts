/// <reference path="../../lib/common.d.ts" />
/// <reference path="rooms.ts" />

module Mz {
	var template = '{ "baseColors": ?<bc>, "fields": ?<f> }';
	var baseColorTemplate = '{ "r": ?<r>, "g": ?<g>, "b": ?<b> }';
	var createRoom :(a:number, b:Common.Color, c:string[])=>Room
			= (num, color, events)=> { return new Room(num, color, events); };
	var array :Mz.Room[][][] = [[[createRoom(63, {r:255, g:255, b:255}, [])]]];

	export var Field = {
		at: function(pos :Position) :Room {
			var x = pos.x;
			var y = pos.y;
			var z = pos.z;
			if (z < 0 || x < 0 || y < 0 || z >= array.length || y >= array[z].length || x >= array[z][y].length) {
				return null;
			} else {
				return array[z][y][x];
			}
		},
		set: function(baseColors :Common.Color[], fields :{num;col;eve}[][][], events) {
			array = []
			for (var z = 0, zMax = fields.length; z < zMax; z ++) {
				var floorColor = baseColors[z];
				var floor = [];
				for (var y = 0, yMax = fields[z].length; y < yMax; y ++) {
					var line = [];
					for (var x = 0, xMax = fields[z][y].length; x < xMax; x ++) {
						var roomJson = fields[z][y][x];
						var num = Number(roomJson.num);
						var color = roomJson.col == null
								? baseColors[z]
								: roomJson.col;
						var events = roomJson.eve == null
								? []
								: roomJson.eve;

						line.push(createRoom(num, color, events));
					}
					floor.push(line);
				}
				array.push(floor);
			}
		},
		load: function(key :string) {
			var str = localStorage[key];
			var obj = JSON.parse(str);
			this.set(
				obj.baseColors,
				obj.fields,
				obj.events);
		},
		saveToStorage: function(key :string, baseColors :Common.Color[], fields :IRoom[][][]) {
			var str = template
				.replace("?<bc>", listToString(baseColors, toStringBc))
				.replace("?<f>", listToString<IRoom[][]>(fields
					, function(floor) {
						return listToString<IRoom[]>(floor,
							function(line :IRoom[]) {
								return listToString<IRoom>(line, roomToString);
							});
					}))
			localStorage[key] = str;
		},
		roomFromJson: roomFromJson
	};
	function listToString<T>(list :T[], convertItem :(a:T)=>string) :string {
		if (!list) return "[]";
		var str = "[" + convertItem(list[0]);
		for (var i = 1, max = list.length; i < max; i ++) {
			str += ",";
			str += convertItem(list[i]);
		}
		str += "]";
		return str;
	}
	function roomToString(room :IRoom) :string {
		var val = 0;
		if (room.North) val += 1;
		if (room.South) val += 2;
		if (room.East) val += 4;
		if (room.West) val += 8;
		if (room.Floor) val += 16;
		if (room.Ceil) val += 32;

		return JSON.stringify({
			num: val,
			col: room.Color,
			eve: room.Events
		});
	}
	function roomFromJson(obj :{num;col;eve}) :IRoom {
		var num = Number(obj.num);

		return {
			North: num % 2 != 0,
			South: (num >> 1) % 2 != 0,
			East: (num >> 2) % 2 != 0,
			West: (num >> 3) % 2 != 0,
			Floor: (num >> 4) % 2 != 0,
			Ceil: (num >> 5) % 2 != 0,
			Color: obj.col,
			Events: obj.eve
		};
	}
	function toStringBc(color :Common.Color) :string {
		return baseColorTemplate
			.split("?<r>").join(color.r.toString())
			.split("?<g>").join(color.g.toString())
			.split("?<b>").join(color.b.toString());
	}
}
