module Mz {
  export interface IRoom {
    North: boolean;
    South: boolean;
    East: boolean;
    West: boolean;
    Ceil: boolean;
    Floor: boolean;
    Color: Common.Color;
    Events: string[];
  }
  export interface DrawingRoot {
		direction :Direction;
		here :Position;
    onLoad();
    enable(boolean);
    repaint();
	}
  export interface FullDirection {
    North: Direction;
    South: Direction;
    East: Direction;
    West: Direction;
  }
  export interface Direction {
    d(Position) :Position;
    right(Position, number) :Position;
  }
	export interface Position {
		x:number;
		y:number;
		z:number;
	}
  export interface Event {
    proc(pos :Position, d, eventsRemain :Common.Callback);
    toJsonString() :string;
    isNormal :boolean;
  }
  export interface JSRoom {
    num:number;
    col:Common.Color;
    eve:string[];
  }
}
