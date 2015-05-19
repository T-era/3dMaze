/// <reference path="main.ts" />

module Mz {
  export function fireEvents(list :Event[], pos :Position, d) {
    fireEventQueue(list);

    function fireEventQueue(queue :Event[]) {
      if (list.length > 0) {
        var event = list.shift();
        event.proc(pos, d, function() {
          fireEventQueue(list);
        });
      }
    }
  }
  export function readEvent(arg :string) :Event {
    var parts = arg.split(":");
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
      else if (arg == "n") return Mz.Direction.North;
      else if (arg == "s") return Mz.Direction.South;
      else if (arg == "e") return Mz.Direction.East;
      else if (arg == "w") return Mz.Direction.West;
    }
  }
  export class Goal implements Event {
    title: string;
    message :string;

    constructor(title :string = "Goal", message :string = "") {
      this.title = title;
      this.message = message;
    }
    proc(pos :Position, d, eventsRemain :Common.Callback) {
      Mz.Obj.enable(false);
      UIParts.Alert(
        messageToShow(this.title, pos, d),
        messageToShow(this.message, pos, d));
    }
  }
  export class Messaging {
    title: string;
    message :string;

    constructor(title :string = "", message :string = "") {
      this.title = title;
      this.message = message;
    }
    proc(pos :Position, d, eventsRemain :Common.Callback) {
      UIParts.Alert(
        messageToShow(this.title, pos, d),
        messageToShow(this.message, pos, d),
        function(howClose) {
          howClose();
          eventsRemain();
        });
    }
  }
  export class Warp {
    jumpTo;

    constructor(to :Position = null) {
      this.jumpTo = to;
    }
    proc(pos :Position, d, eventsRemain :Common.Callback) {
      var to;
      if (this.jumpTo) {
        to = this.jumpTo;
      } else {
        var size = Mz.Field.size()
        to = {
          x: Math.random() * size.x,
          y: Math.random() * size.y,
          z: Math.random() * size.z
        };
      }
      Mz.Obj.here = to;
      Mz.Obj.repaint();
      eventsRemain();
    }
  }
  export class TurnTable {
    directionTo;

    constructor(dir) {
      this.directionTo = dir;
    }
    proc(pos :Position, d, eventsRemain :Common.Callback) {
      var dir;
      if (this.directionTo) {
        dir = this.directionTo;
      } else {
        switch (Math.floor(Math.random()*4)) {
          case 0:
            dir = Mz.Direction.North;
            break;
          case 1:
            dir = Mz.Direction.South;
            break;
          case 2:
            dir = Mz.Direction.East;
            break;
          case 3:
            dir = Mz.Direction.West;
            break;
          default:
            throw "error";
        }
      }
      Mz.Obj.direction = dir;
      Mz.Obj.repaint();
      eventsRemain();
    }
  }


  function messageToShow(format :string, pos :Position, dir) {
    return format
      .replace(/$X/, String(pos.x))
      .replace(/$Y/, String(pos.y))
      .replace(/$Z/, String(pos.z))
      .replace(/$D/, dir.toJpStr());
  }
}
