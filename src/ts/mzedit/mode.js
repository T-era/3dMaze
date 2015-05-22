/// <reference path="../../lib/jquery/jquery.d.ts" />
/// <reference path="../../lib/common.d.ts" />
/// <reference path="../../lib/uiparts.d.ts" />
/// <reference path="../../lib/mz.d.ts" />
/// <reference path="../../lib/mzinit.d.ts" />
/// <reference path="floor_selector.ts" />
/// <reference path="rooms.ts" />
/// <reference path="floor.ts" />
/// <reference path="event/main.ts" />
var MzE;
(function (MzE) {
    var xSize = 1;
    var ySize = 1;
    var zSize = 1;
    var name = "Dummy";
    var rooms;
    var fields;
    var baseColors;
    var floorSelector;
    var selectedRoom;
    var roomChangeListeners = [];
    MzE.startPoint = { x: 0, y: 0, z: 0 };
    function fireRoomChange(room) {
        for (var i = 0, max = roomChangeListeners.length; i < max; i++) {
            var listener = roomChangeListeners[i];
            listener(room);
        }
    }
    MzE.fireRoomChange = fireRoomChange;
    $(function () {
        $("#MzE_Save").click(function () {
            Mz.Field.saveToStorage(name, MzE.startPoint, baseColors, fields);
        });
        floorSelector = MzE.FloorSelector($("#floorSelect"), function () { return baseColors; });
        roomChangeListeners.push(MzE.color_roomChangeListener);
        roomChangeListeners.push(MzE.event.event_roomChangeListener);
    });
    var _EditMode = (function () {
        function _EditMode() {
        }
        _EditMode.prototype.save = function () {
            Mz.Field.saveToStorage(name, MzE.startPoint, baseColors, fields);
        };
        _EditMode.prototype.initEmpty = function (setting) {
            xSize = setting.xSize;
            ySize = setting.ySize;
            zSize = setting.zSize;
            name = setting.name;
            var tempField = [];
            var tempColors = [];
            tempField.length = zSize;
            tempColors.length = zSize;
            for (var z = 0; z < zSize; z++) {
                tempField[z] = createField();
                tempColors[z] = new Common.Color(255, 255, 255);
            }
            this.reload({ x: 0, y: 0, z: 0 }, tempField, tempColors);
        };
        _EditMode.prototype.edit = function (_name, start, tempColors, fieldStrs) {
            zSize = fieldStrs.length;
            ySize = fieldStrs[0].length;
            xSize = fieldStrs[0][0].length;
            name = _name;
            var tempField = mapToRoom(fieldStrs);
            this.reload(start, tempField, tempColors);
            function mapToRoom(list) {
                var ret = [];
                for (var z = 0, zMax = list.length; z < zMax; z++) {
                    var floor = [];
                    for (var y = 0, yMax = list[z].length; y < yMax; y++) {
                        var line = [];
                        for (var x = 0, xMax = list[z][y].length; x < xMax; x++) {
                            line.push(Mz.Field.roomFromJson(list[z][y][x]));
                        }
                        floor.push(line);
                    }
                    ret.push(floor);
                }
                return ret;
            }
        };
        _EditMode.prototype.selectFloor = function (val) {
            rooms.setFloor(val);
            resetColor();
            fireRoomChange(null);
            function resetColor() {
                var baseColor = baseColors[val];
            }
        };
        _EditMode.prototype.reload = function (start, newFields, newBaseColors) {
            fields = newFields;
            MzE.startPoint = start;
            rooms = new MzE.Rooms(xSize, ySize, zSize, $("#output"), fields, function (room) {
                if (selectedRoom) {
                    selectedRoom.dom.removeClass("Selected");
                }
                room.dom.addClass("Selected");
                selectedRoom = room;
                fireRoomChange(selectedRoom);
            });
            baseColors = newBaseColors;
            floorSelector.reload();
            this.selectFloor(0);
        };
        ;
        return _EditMode;
    })();
    MzE.EditMode = new _EditMode();
    function createField() {
        var ret = [];
        ret.length = ySize;
        for (var y = 0; y < ySize; y++) {
            ret[y] = [];
            ret[y].length = xSize;
            for (var x = 0; x < xSize; x++) {
                ret[y][x] = {
                    North: true,
                    South: true,
                    East: true,
                    West: true,
                    Ceil: true,
                    Floor: true,
                    Color: null,
                    Events: [],
                };
            }
        }
        return ret;
    }
})(MzE || (MzE = {}));
