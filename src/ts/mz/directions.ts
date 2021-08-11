import { Common } from '../common/';
import { Types } from './types';
import { Event } from './event';

export var Directions :Types.FullDirection = {
	North: {
		d: function(pos :Types.Position) :Types.Position {
			return { x: pos.x, y: pos.y-1, z: pos.z };
		},
		right: function(pos :Types.Position, dd :number) :Types.Position {
			return { x: pos.x+dd, y: pos.y, z: pos.z };
		},
		toJpStr: function() {
			return "北";
		}
	},
	South: {
		d: function(pos) {
			return { x: pos.x, y: pos.y+1, z: pos.z };
		},
		right: function(pos, dd) {
			return { x: pos.x-dd, y: pos.y, z: pos.z };
		},
		toJpStr: function() {
			return "南";
		}
	},
	East: {
		d: function(pos) {
			return { x: pos.x+1, y: pos.y, z: pos.z };
		},
		right: function(pos, dd) {
			return { x: pos.x, y: pos.y+dd, z: pos.z };
		},
		toJpStr: function() {
			return "東";
		}
	},
	West: {
		d: function(pos) {
			return { x: pos.x-1, y: pos.y, z: pos.z };
		},
		right: function(pos, dd) {
			return { x: pos.x, y: pos.y-dd, z: pos.z };
		},
		toJpStr: function() {
			return "西";
		}
	}
}
