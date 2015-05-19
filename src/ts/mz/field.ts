/// <reference path="../../lib/common.d.ts" />
/// <reference path="types.ts" />
/// <reference path="rooms.ts" />

module Mz {
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
		set: function(startPoint :Position
				, baseColors :Common.Color[]
				, fields :{num;col;eve}[][][]) {
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
			Mz.Obj.here = startPoint;
			Mz.Obj.repaint();
		},
		load: function(key :string) {
			var str = localStorage[key];
			var obj = JSON.parse(str);
			this.set(
				obj.start,
				obj.baseColors,
				obj.fields);
		},
		saveToStorage: function(key :string, start :Position, baseColors :Common.Color[], fields :IRoom[][][]) {
			var str = JSON.stringify({
				baseColors: baseColors,
				start: start,
				fields: listToJson<IRoom[][], JSRoom[][]>(fields
					, function(floor) {
						return listToJson<IRoom[], JSRoom[]>(floor,
							function(line :IRoom[]) {
								return listToJson<IRoom, JSRoom>(line, roomToJson);
							});
					})
			});

			localStorage[key] = str;
		},
		size: function() :Position {
			return {
				x: array[0][0].length,
				y: array[0].length,
				z: array.length
			}
		},
		roomFromJson: roomFromJson
	};
	function listToJson<T, S>(list :T[], convertItem :(a:T)=>S) :S[] {
		if (!list) return [];

		var ret = [];
		list.forEach((item)=> {
			ret.push(convertItem(item));
		})
		return ret;
	}
	function roomToJson(room :IRoom) :JSRoom {
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
			eve: room.Events
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
			Events: obj.eve
		};
	}
}
