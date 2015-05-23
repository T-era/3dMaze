/// <reference path="../../../lib/jquery/jquery.d.ts" />
/// <reference path="../../../lib/uiparts.d.ts" />
/// <reference path="../../../lib/mz.d.ts" />
/// <reference path="../floor.ts" />
/// <reference path="add_new.ts" />
var MzE;
(function (MzE) {
    var event;
    (function (event_1) {
        var roomEvent;
        function event_roomChangeListener(arg) {
            roomEvent.roomChanged(arg);
        }
        event_1.event_roomChangeListener = event_roomChangeListener;
        $(function () {
            roomEvent = new RoomEvent($("#room_event_start"), $("#room_event_goal"), $("#room_event_list"));
        });
        var RoomEvent = (function () {
            function RoomEvent(startCheck, goalCheck, eventList) {
                var _this = this;
                this.startCheck = startCheck;
                this.goalCheck = goalCheck;
                this.eventList = new UIParts.ComplexSelect(eventList, function (arg) { _this._openEditView(arg); });
                this.eventList.setLoader(function () { return _this._getEventSelectionList(); });
                startCheck.change(function () { _this.startHere(); });
                goalCheck.change(function () { _this.goalHere(); });
            }
            RoomEvent.prototype.roomChanged = function (arg) {
                this.target = arg;
                if (arg) {
                    this.startCheck.prop("checked", MzE.startPoint.x == arg.x
                        && MzE.startPoint.y == arg.y
                        && MzE.startPoint.z == arg.floor.z);
                    this.goalCheck.prop("checked", arg.isGoal());
                }
                else {
                    this.startCheck.prop("checked", false);
                    this.goalCheck.prop("checked", false);
                }
                this.eventList.reload();
            };
            RoomEvent.prototype.setStart = function (arg) {
                MzE.startPoint = arg;
            };
            RoomEvent.prototype.startHere = function () {
                var _this = this;
                if (this.target) {
                    if (this.startCheck.prop("checked")) {
                        UIParts.UserConfirm("", "この地点をスタート地点にします。(以前にスタート地点に指定されていた場所は、解除されます。)", function (howClose) {
                            _this.setStart({ x: _this.target.x, y: _this.target.y, z: _this.target.floor.z });
                            howClose();
                        }, function (howClose) {
                            _this.startCheck.prop("checked", false);
                            howClose();
                        });
                    }
                    else {
                        UIParts.Alert("", "スタート地点を解除できません。（他のマスをスタート地点に指定してください");
                        this.startCheck.prop("checked", true);
                    }
                }
                else {
                    this.startCheck.prop("checked", false);
                }
            };
            RoomEvent.prototype.goalHere = function () {
                if (this.target) {
                    this.target.isGoal(this.goalCheck.prop("checked"));
                }
                else {
                    this.goalCheck.prop("checked", false);
                }
            };
            RoomEvent.prototype._getEventSelectionList = function () {
                var _this = this;
                if (this.target) {
                    return listToShow(this.target, this.target._normalEvents, function () {
                        _this.eventList.reload();
                    });
                }
                else {
                    return [];
                }
            };
            RoomEvent.prototype._openEditView = function (arg) {
                var _this = this;
                if (arg == null) {
                    this.eventList.setSelectedMark(-1);
                    MzE.event.createNew(this.target, function () {
                        _this.eventList.reload();
                    });
                }
                else {
                    event_1.openEdit(arg, function () { _this.eventList.reload(); });
                }
            };
            return RoomEvent;
        })();
        function listToShow(room, arg, whenRemove) {
            var ret = [];
            arg.forEach(function (event) {
                ret.push({
                    value: event,
                    doms: [
                        $("<label>").text(event.toString()),
                        $("<div>")
                            .addClass("right")
                            .addClass("MzE_event_remove")
                            .text("削除")
                            .click(function () {
                            room.removeNormalEvent(event);
                            whenRemove();
                            return false;
                        }),
                    ]
                });
            });
            ret.push({
                value: null,
                doms: [$("<div>").text("+ Add").addClass("MzE_event_add")]
            });
            return ret;
        }
    })(event = MzE.event || (MzE.event = {}));
})(MzE || (MzE = {}));
