import { Common } from '../common';
import { Types } from './types';
import { Room } from './room';
import { Mz } from './main';

var createRoom :(a:number, b:Common.Color, c:string[])=>Room
		= (num, color, events)=> { return new Room(num, color, events); };
var array :Room[][][] = [[[createRoom(63, {r:255, g:255, b:255}, [])]]];

export var Field :Types.IField = {
	at: function(pos :Types.Position) :Room {
		var x = pos.x;
		var y = pos.y;
		var z = pos.z;
		if (z < 0 || x < 0 || y < 0 || z >= array.length || y >= array[z].length || x >= array[z][y].length) {
			return null;
		} else {
			return array[z][y][x];
		}
	},
	set: function(jsData :Types.JsonData) {
		var startPoint = jsData.start;
		var baseColors = jsData.baseColors;
		var fields = jsData.fields;
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
	size: function() :Types.Position {
		return {
			x: array[0][0].length,
			y: array[0].length,
			z: array.length
		}
	}
}
