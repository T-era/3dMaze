/// <reference path="main.ts" />
var Mz;
(function (Mz) {
    function fireEvents(list, dr) {
        Mz.Obj.enable(false);
        fireEventQueue(list.concat());
        function fireEventQueue(queue) {
            if (list.length > 0) {
                var event = list.shift();
                event.proc(dr.here, dr.direction, function () {
                    fireEventQueue(list);
                });
            }
        }
    }
    Mz.fireEvents = fireEvents;
    function readEvent(arg) {
        var parts = arg.split("/");
        var type = parts[0];
        switch (type) {
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
        function part(arg) {
            if (parts.length <= arg)
                return null;
            else
                return parts[arg];
        }
        function stringToDirection(arg) {
            if (arg == null)
                return null;
            else if (arg == "n")
                return Mz.Direction.North;
            else if (arg == "s")
                return Mz.Direction.South;
            else if (arg == "e")
                return Mz.Direction.East;
            else if (arg == "w")
                return Mz.Direction.West;
        }
    }
    Mz.readEvent = readEvent;
    var Goal = (function () {
        function Goal(title, message) {
            if (title === void 0) { title = "Goal"; }
            if (message === void 0) { message = ""; }
            this.isNormal = false;
            this.title = title;
            this.message = message;
        }
        Goal.prototype.proc = function (pos, d, eventsRemain) {
            Mz.Obj.enable(false);
            UIParts.Alert(messageToShow(this.title, pos, d), messageToShow(this.message, pos, d));
        };
        Goal.prototype.toJsonString = function () {
            return ["e", this.title, this.message].join("/");
        };
        Goal.prototype.toString = function () {
            return "(GOAL)" + this.title + "[" + this.message + "]";
        };
        return Goal;
    })();
    Mz.Goal = Goal;
    var Messaging = (function () {
        function Messaging(title, message) {
            if (title === void 0) { title = ""; }
            if (message === void 0) { message = ""; }
            this.isNormal = true;
            this.title = title;
            this.message = message;
        }
        Messaging.prototype.proc = function (pos, d, eventsRemain) {
            UIParts.Alert(messageToShow(this.title, pos, d), messageToShow(this.message, pos, d), function (howClose) {
                howClose();
                eventsRemain();
            });
        };
        Messaging.prototype.toJsonString = function () {
            return ["m", this.title, this.message].join("/");
        };
        Messaging.prototype.toString = function () {
            return this.title + "[" + this.message + "]";
        };
        return Messaging;
    })();
    Mz.Messaging = Messaging;
    var Warp = (function () {
        function Warp(to) {
            if (to === void 0) { to = null; }
            this.isNormal = true;
            this.jumpTo = to;
        }
        Warp.prototype.proc = function (pos, d, eventsRemain) {
            var to;
            if (this.jumpTo) {
                to = this.jumpTo;
            }
            else {
                var size = Mz.Field.size();
                to = {
                    x: Math.floor(Math.random() * size.x),
                    y: Math.floor(Math.random() * size.y),
                    z: Math.floor(Math.random() * size.z)
                };
            }
            Mz.Obj.here = to;
            Mz.Obj.repaint();
            eventsRemain();
        };
        Warp.prototype.toJsonString = function () {
            return ["w", JSON.stringify(this.jumpTo)].join("/");
        };
        Warp.prototype.toString = function () {
            return "Warp " + (this.jumpTo
                ? "to " + JSON.stringify(this.jumpTo)
                : "?");
        };
        return Warp;
    })();
    Mz.Warp = Warp;
    var TurnTable = (function () {
        function TurnTable(dir) {
            if (dir === void 0) { dir = null; }
            this.isNormal = true;
            this.directionTo = dir;
        }
        TurnTable.prototype.proc = function (pos, d, eventsRemain) {
            var dir;
            if (this.directionTo) {
                dir = this.directionTo;
            }
            else {
                switch (Math.floor(Math.random() * 4)) {
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
        };
        TurnTable.prototype.toJsonString = function () {
            var headChar = this.directionTo == null ? null
                : this.directionTo == Mz.Direction.North ? "n"
                    : this.directionTo == Mz.Direction.South ? "s"
                        : this.directionTo == Mz.Direction.East ? "e"
                            : this.directionTo == Mz.Direction.West ? "w"
                                : null;
            return ["t", headChar].join("/");
        };
        TurnTable.prototype.toString = function () {
            return "Turn " + (this.directionTo
                ? "to " + this.directionTo.toJpStr()
                : "?");
        };
        return TurnTable;
    })();
    Mz.TurnTable = TurnTable;
    function messageToShow(format, pos, dir) {
        return format
            .replace(/\$X/, String(pos.x))
            .replace(/\$Y/, String(pos.y))
            .replace(/\$Z/, String(pos.z))
            .replace(/\$D/, dir.toJpStr());
    }
})(Mz || (Mz = {}));
