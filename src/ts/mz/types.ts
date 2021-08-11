import { Common } from '../common';

import { Room } from './room';

export module Types {
  export enum EnableState {
    Start, Suspend, Restart, Goal
  }
  export interface IRoom {
    North: boolean;
    South: boolean;
    East: boolean;
    West: boolean;
    Ceil: boolean;
    Floor: boolean;
    Color: Common.Color;
    Events: Event[];
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
    d(a :Position) :Position;
    right(p :Position, n :number) :Position;
    toJpStr() :string;
  }
  export interface Position {
    x:number;
    y:number;
    z:number;
  }
  export interface Event {
    proc(pos :Position, d :Direction, eventsRemain :Common.Callback);
    toJsonString() :string;
    isNormal :boolean;
  }
  export interface JSRoom {
    num :number;
    col :Common.Color;
    eve :string[];
  }
  export interface JsonData {
    start :Position;
    baseColors :Common.Color[];
    fields :JSRoom[][][];
  }
  export interface IField {
    at(pos :Position) :Room;
    set(data :JsonData) :void;
    size() :Position;
  }
}
