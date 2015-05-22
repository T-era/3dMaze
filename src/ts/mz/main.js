/// <reference path="../../lib/jquery/jquery.d.ts" />
/// <reference path="../../lib/uiparts.d.ts" />
/// <reference path="draw.ts" />
/// <reference path="event.ts" />
var Mz;
(function (Mz) {
    var once = false;
    var canvas;
    var context;
    var clickListening = true;
    Mz.Obj = {
        enable: function (flag) { clickListening = flag; },
        here: { x: 0, y: 0, z: 0 },
        direction: null,
        onLoad: function () {
            canvas = $("#main")[0];
            context = canvas.getContext("2d");
            this.direction = Mz.Direction.South;
            Mz.drawAll(Mz.Obj, canvas, context);
            if (!once) {
                $(window).keyup(keyListen);
                once = true;
            }
        },
        repaint: function () {
            Mz.drawAll(Mz.Obj, canvas, context);
        }
    };
    function keyListen(arg) {
        if (clickListening
            && arg.target.tagName.toLowerCase() == "body") {
            switch (arg.keyCode) {
                case 37:
                    Mz.Obj.direction = Mz.Obj.direction == Mz.Direction.North ? Mz.Direction.West
                        : Mz.Obj.direction == Mz.Direction.South ? Mz.Direction.East
                            : Mz.Obj.direction == Mz.Direction.East ? Mz.Direction.North
                                : Mz.Obj.direction == Mz.Direction.West ? Mz.Direction.South
                                    : null;
                    Mz.drawAll(Mz.Obj, canvas, context);
                    break;
                case 39:
                    Mz.Obj.direction = Mz.Obj.direction == Mz.Direction.North ? Mz.Direction.East
                        : Mz.Obj.direction == Mz.Direction.South ? Mz.Direction.West
                            : Mz.Obj.direction == Mz.Direction.East ? Mz.Direction.South
                                : Mz.Obj.direction == Mz.Direction.West ? Mz.Direction.North
                                    : null;
                    Mz.drawAll(Mz.Obj, canvas, context);
                    break;
                case 38:
                    moveTo(function (room) { return room.hasCeil; }, function (pos) { return { x: pos.x, y: pos.y, z: pos.z - 1 }; });
                    break;
                case 40:
                    moveTo(function (room) { return room.hasFloor; }, function (pos) { return { x: pos.x, y: pos.y, z: pos.z + 1 }; });
                    break;
                case 32:
                    moveTo(function (room) { return room.hasAwayWall(Mz.Obj.direction); }, function (pos) { return Mz.Obj.direction.d(pos); });
                    break;
            }
        }
        function moveTo(checker, move) {
            var p = Mz.Obj.here;
            var room = Mz.Field.at(p);
            if (room && checker(room)) {
                UIParts.Alert("Oops!", "壁がある！");
            }
            else {
                var next = move(p);
                Mz.Obj.here = next;
                Mz.drawAll(Mz.Obj, canvas, context);
                Mz.fireEvents(Mz.Field.at(Mz.Obj.here).events, Mz.Obj);
            }
        }
    }
    $(function () {
        Mz.Obj.onLoad();
    });
})(Mz || (Mz = {}));
