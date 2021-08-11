import { Common } from '../common';
import { Alert } from '../uiparts';

import { Types } from './types';
import { Directions } from './directions';
import { Field } from './field';
import { Mz } from './main';

export module Event {
  export function fireEvents(list :Types.Event[], dr :Types.DrawingRoot) {
    Mz.Obj.enable(Types.EnableState.Suspend);
    fireEventQueue(list.slice());

    function fireEventQueue(queue :Types.Event[]) {
      if (queue.length > 0) {
        var event = queue.shift();
        event.proc(dr.here, dr.direction, function() {
          fireEventQueue(queue);
        });
      } else {
        Mz.Obj.enable(Types.EnableState.Restart);
      }
    }
  }
  export function readEvent(arg :string) :Types.Event {
    var parts = arg.split("/");
    var type = parts[0];
    switch(type) {
      case "g":
        return new Goal(part(1), part(2));
      case "m":
        return new Messaging(part(1), part(2));
      case "w":
        return new Warp(JSON.parse(part(1)));
      case "t":
        return new TurnTable(stringToDirection(part(1)));
      default:
        throw "error";
    }

    function part(arg :number) {
      if (parts.length <= arg) return null;
      else return parts[arg];
    }
    function stringToDirection(arg :string) {
      if (arg == null) return null;
      else if (arg == "n") return Directions.North;
      else if (arg == "s") return Directions.South;
      else if (arg == "e") return Directions.East;
      else if (arg == "w") return Directions.West;
    }
  }
  export class Goal implements Types.Event {
    title: string;
    message :string;
    isNormal = false;

    constructor(title :string = "Goal", message :string = "") {
      this.title = title;
      this.message = message;
    }
    proc(pos :Types.Position, d, eventsRemain :Common.Callback) {
      Mz.Obj.enable(Types.EnableState.Goal);
      Alert(
        messageToShow(this.title, pos, d),
        messageToShow(this.message, pos, d));
    }
    toJsonString() :string {
      return ["g", this.title, this.message].join("/");
    }
    toString() :string {
      return "(GOAL)" + this.title + "[" + this.message + "]";
    }
  }
  export class Messaging implements Types.Event {
    title: string;
    message :string;
    isNormal :boolean = true;

    constructor(title :string = "", message :string = "") {
      this.title = title;
      this.message = message;
    }
    proc(pos :Types.Position, d :Types.Direction, eventsRemain :Common.Callback) {
      Alert(
        messageToShow(this.title, pos, d),
        messageToShow(this.message, pos, d),
        function(howClose) {
          howClose();
          eventsRemain();
        });
    }
    toJsonString() :string {
      return ["m", this.title, this.message].join("/");
    }
    toString() :string {
      return this.title + "[" + this.message + "]";
    }
  }
  export class Warp implements Types.Event {
    jumpTo :Types.Position;
    isNormal :boolean = true;

    constructor(to :Types.Position = null) {
      this.jumpTo = to;
    }
    proc(pos :Types.Position, d, eventsRemain :Common.Callback) {
      var to;
      if (this.jumpTo) {
        to = this.jumpTo;
      } else {
        var size = Field.size()
        to = {
          x: Math.floor(Math.random() * size.x),
          y: Math.floor(Math.random() * size.y),
          z: Math.floor(Math.random() * size.z)
        };
      }
      Mz.Obj.here = to;
      Mz.Obj.repaint();
      eventsRemain();
    }
    toJsonString() :string {
      return ["w", JSON.stringify(this.jumpTo)].join("/");
    }
    toString() :string {
      return "Warp " + (this.jumpTo
        ? "to " + JSON.stringify(this.jumpTo)
        : "?");
    }
  }
  export class TurnTable implements Types.Event {
    directionTo :Types.Direction;
    isNormal :boolean = true;

    constructor(dir :Types.Direction = null) {
      this.directionTo = dir;
    }
    proc(pos :Types.Position, d :Types.Direction, eventsRemain :Common.Callback) {
      var dir;
      if (this.directionTo) {
        dir = this.directionTo;
      } else {
        switch (Math.floor(Math.random()*4)) {
          case 0:
            dir = Directions.North;
            break;
          case 1:
            dir = Directions.South;
            break;
          case 2:
            dir = Directions.East;
            break;
          case 3:
            dir = Directions.West;
            break;
          default:
            throw "error";
        }
      }
      Mz.Obj.direction = dir;
      Mz.Obj.repaint();
      eventsRemain();
    }
    toJsonString() :string {
      var headChar = this.directionTo == null ? null
        : this.directionTo == Directions.North ? "n"
        : this.directionTo == Directions.South ? "s"
        : this.directionTo == Directions.East ? "e"
        : this.directionTo == Directions.West ? "w"
        : null;
      return ["t", headChar].join("/");
    }
    toString() :string {
      return "Turn " + (this.directionTo
        ? "to " + this.directionTo.toJpStr()
        : "?");
    }
  }

  function messageToShow(format :string, pos :Types.Position, dir) {
    return format
      .replace(/\$X/, String(pos.x))
      .replace(/\$Y/, String(pos.y))
      .replace(/\$Z/, String(pos.z))
      .replace(/\$D/, dir.toJpStr());
  }
}
