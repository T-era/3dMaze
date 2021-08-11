import { Common } from '../common/';
import { Types } from './types';
import { Event } from './event';
import { Directions } from './directions';

export class Room {
	color :Common.Color;
	events :Types.Event[];
	hasFloor :boolean;
	hasCeil :boolean;

	northWall :boolean;
	southWall :boolean;
	eastWall :boolean;
	westWall :boolean;

	constructor(walls :number, color :Common.Color, events :string[]) {
		this.color = color;
		this.hasFloor = Math.floor(walls/16) % 2 != 0;
		this.hasCeil = Math.floor(walls/32) % 2 != 0;

		this.northWall = Math.floor(walls) % 2 != 0;
		this.southWall = Math.floor(walls/2) % 2 != 0;
		this.eastWall = Math.floor(walls/4) % 2 != 0;
		this.westWall = Math.floor(walls/8) % 2 != 0;
		this.events = events.map(Event.readEvent);
	}
	hasNearWall(direction :Types.Direction) :boolean {
		return (direction == Directions.North && this.southWall)
			|| (direction == Directions.South && this.northWall)
			|| (direction == Directions.East && this.westWall)
			|| (direction == Directions.West && this.eastWall);
	}
	hasAwayWall(direction :Types.Direction) :boolean {
		return (direction == Directions.North && this.northWall)
			|| (direction == Directions.South && this.southWall)
			|| (direction == Directions.East && this.eastWall)
			|| (direction == Directions.West && this.westWall);
	}
	hasLeftWall(direction :Types.Direction) :boolean {
		return (direction == Directions.North && this.westWall)
			|| (direction == Directions.South && this.eastWall)
			|| (direction == Directions.East && this.northWall)
			|| (direction == Directions.West && this.southWall);
	}
	hasRightWall(direction :Types.Direction) :boolean {
		return (direction == Directions.North && this.eastWall)
			|| (direction == Directions.South && this.westWall)
			|| (direction == Directions.East && this.southWall)
			|| (direction == Directions.West && this.northWall);
	}
}
