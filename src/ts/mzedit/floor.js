/// <reference path="../../lib/jquery/jquery.d.ts" />
var MzE;
(function (MzE) {
    var Floor = (function () {
        function Floor(cols, rows, floors, rooms, z, roomPointed) {
            this.cols = cols;
            this.rows = rows;
            this.floors = floors;
            this.rooms = rooms;
            this.z = z;
            this.roomPointed = roomPointed;
        }
        Floor.prototype.init = function (owner) {
            this.roomDivs = [];
            for (var y = 0; y < this.rows; y++) {
                for (var x = 0; x < this.cols; x++) {
                    var room = new Room(this, x, y, this.z, this.roomPointed)
                        .appendTo(owner);
                    this.roomDivs.push(room);
                }
            }
        };
        Floor.prototype.repaint = function () {
            this.roomDivs.forEach(function (room) {
                room.resetColor();
            });
        };
        return Floor;
    })();
    MzE.Floor = Floor;
    var Room = (function () {
        function Room(floorObj, x, y, z, fPointed) {
            var _this = this;
            this.floor = floorObj;
            this.x = x;
            this.y = y;
            this.obj = floorObj.rooms[z][y][x];
            this.walls = [
                west(this),
                east(this),
                north(this),
                south(this),
                ceil(this),
                floor(this)];
            var dom = $("<div>")
                .addClass("MzRoom")
                .css({
                top: 10 + y * 100 + "px",
                left: 10 + x * 100 + "px" })
                .click(function () {
                fPointed(_this);
            });
            this.dom = dom;
            for (var i = 0, max = this.walls.length; i < max; i++) {
                this.dom.append(this.walls[i].div);
            }
            var normal = [];
            this.obj.Events.forEach(function (event, index, array) {
                if (event.isNormal) {
                    normal.push(event);
                }
                else {
                    _this.isGoal(true);
                }
            });
            this._normalEvents = normal;
        }
        Room.prototype.appendTo = function (owner) {
            this.dom.appendTo(owner);
            return this;
        };
        Room.prototype.resetColor = function () {
            for (var i = 0, max = this.walls.length; i < max; i++) {
                this.walls[i].resetColor();
            }
        };
        Room.prototype.isGoal = function (arg) {
            if (arg === void 0) { arg = null; }
            if (arg != null) {
                this._isGoal = arg;
                this.__copyEventToObj();
            }
            return this._isGoal;
        };
        Room.prototype.addNormalEvent = function (arg) {
            this._normalEvents.push(arg);
            this.__copyEventToObj();
        };
        Room.prototype.removeNormalEvent = function (arg) {
            var index = -1;
            for (var i = 0, max = this._normalEvents.length; i < max; i++) {
                if (arg == this._normalEvents[i]) {
                    index = i;
                }
            }
            this._normalEvents.splice(index, 1);
            this.__copyEventToObj();
        };
        Room.prototype.__copyEventToObj = function () {
            var _this = this;
            this.obj.Events = [];
            this._normalEvents.forEach(function (e) {
                _this.obj.Events.push(e);
            });
            if (this._isGoal) {
                this.obj.Events.push(new Mz.Goal());
            }
        };
        return Room;
    })();
    MzE.Room = Room;
    var Wall = (function () {
        function Wall(obj, baseClassName, setWall, getWall, hasNeighbor, getNeighborWall) {
            this.div = $("<div>")
                .addClass("MzWall")
                .addClass(baseClassName)
                .click(function () {
                setWall();
                obj.floor.repaint();
            });
            this.checked = getWall();
            this.baseClassName = baseClassName;
            this.getWall = getWall;
            this.hasNeighbor = hasNeighbor;
            this.getNeighborWall = getNeighborWall;
        }
        Wall.prototype.resetColor = function () {
            var _this = this;
            var color = (function () {
                if (!_this.getWall()) {
                    if (!_this.hasNeighbor())
                        return "red";
                    return "";
                }
                else if (_this.hasNeighbor() && !_this.getNeighborWall())
                    return "yellow";
                else
                    return "black";
            })();
            setColor(this.div, this.baseClassName, color);
        };
        Wall.prototype.addClass = function (className) {
            this.div.addClass(className);
            return this;
        };
        return Wall;
    })();
    MzE.Wall = Wall;
    function west(room) {
        return new Wall(room, "MzWallWest", function () { room.obj.West = !room.obj.West; }, function () { return room.obj.West; }, function () { return room.x != 0; }, function () { return room.floor.rooms[room.floor.z][room.y][room.x - 1].East; })
            .addClass("MzWallWE");
    }
    function east(room) {
        return new Wall(room, "MzWallEast", function () { room.obj.East = !room.obj.East; }, function () { return room.obj.East; }, function () { return room.x != room.floor.cols - 1; }, function () { return room.floor.rooms[room.floor.z][room.y][room.x + 1].West; })
            .addClass("MzWallWE");
    }
    function north(room) {
        return new Wall(room, "MzWallNorth", function () { room.obj.North = !room.obj.North; }, function () { return room.obj.North; }, function () { return room.y != 0; }, function () { return room.floor.rooms[room.floor.z][room.y - 1][room.x].South; })
            .addClass("MzWallNS");
    }
    function south(room) {
        return new Wall(room, "MzWallSouth", function () { room.obj.South = !room.obj.South; }, function () { return room.obj.South; }, function () { return room.y != room.floor.rows - 1; }, function () { return room.floor.rooms[room.floor.z][room.y + 1][room.x].North; })
            .addClass("MzWallNS");
    }
    function ceil(room) {
        return new Wall(room, "MzWallCeil", function () { room.obj.Ceil = !room.obj.Ceil; }, function () { return room.obj.Ceil; }, function () { return room.floor.z != 0; }, function () { return room.floor.rooms[room.floor.z - 1][room.y][room.x].Floor; })
            .addClass("MzWallCF");
    }
    function floor(room) {
        return new Wall(room, "MzWallFloor", function () { room.obj.Floor = !room.obj.Floor; }, function () { return room.obj.Floor; }, function () { return room.floor.z != room.floor.floors - 1; }, function () { return room.floor.rooms[room.floor.z + 1][room.y][room.x].Ceil; })
            .addClass("MzWallCF");
    }
    function setColor(div, bcn, col) {
        for (var color in { "red": "", "yellow": "", "black": "" }) {
            div.removeClass(bcn + "-" + color);
        }
        if (col) {
            div.addClass(bcn + "-" + col);
        }
    }
})(MzE || (MzE = {}));
