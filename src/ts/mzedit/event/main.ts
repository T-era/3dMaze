/// <reference path="../../../lib/jquery/jquery.d.ts" />
/// <reference path="../../../lib/uiparts.d.ts" />
/// <reference path="../../../lib/mz.d.ts" />
/// <reference path="../floor.ts" />
/// <reference path="add_new.ts" />

module MzE {
  export module event {
    var roomEvent :RoomEvent;
    export function event_roomChangeListener(arg :MzE.Room) :void {
      roomEvent.roomChanged(arg);
    }

    $(()=> {
      roomEvent = new RoomEvent(
        $("#room_event_start"),
        $("#room_event_goal"),
        $("#room_event_list"));
    });

    class RoomEvent {
      target :MzE.Room;
      startCheck :JQuery;
      goalCheck :JQuery;
      eventList :UIParts.ComplexSelect<Mz.Event>;

      constructor(startCheck, goalCheck, eventList) {
        this.startCheck = startCheck;
        this.goalCheck = goalCheck;
        this.eventList = new UIParts.ComplexSelect(eventList, (arg:Mz.Event)=> { this._openEditView(arg); });
        this.eventList.setLoader(()=> { return this._getEventSelectionList(); })
        startCheck.change(()=>{ this.startHere(); });
        goalCheck.change(()=>{ this.goalHere(); });
      }
      roomChanged(arg :MzE.Room) {
        this.target = arg;
        if (arg) {
          this.startCheck.prop("checked", MzE.startPoint.x == arg.x
            && MzE.startPoint.y == arg.y
            && MzE.startPoint.z == arg.floor.z);
          this.goalCheck.prop("checked", arg.isGoal());
        } else {
          this.startCheck.prop("checked", false);
          this.goalCheck.prop("checked", false);
        }
        this.eventList.reload();
      }
      setStart(arg :Mz.Position) {
        MzE.startPoint = arg;
      }
      startHere() {
        if (this.target) {
          if (this.startCheck.prop("checked")) {
            UIParts.UserConfirm("",
              "この地点をスタート地点にします。(以前にスタート地点に指定されていた場所は、解除されます。)",
              (howClose)=> {
                this.setStart({x:this.target.x,y:this.target.y,z:this.target.floor.z});
                howClose();
              },
              (howClose)=> {
                this.startCheck.prop("checked", false);
                howClose();
              });
          } else {
            UIParts.Alert("", "スタート地点を解除できません。（他のマスをスタート地点に指定してください");
            this.startCheck.prop("checked", true);
          }
        } else {
          this.startCheck.prop("checked", false);
        }
      }
      goalHere() {
        if (this.target) {
          this.target.isGoal(this.goalCheck.prop("checked"));
        } else {
          this.goalCheck.prop("checked", false);
        }
      }
      _getEventSelectionList() :UIParts.ComplexSelectorItem<Mz.Event>[] {
        if (this.target) {
          return listToShow(this.target, this.target._normalEvents, ()=> {
            this.eventList.reload();
          });
        } else {
          return [];
        }
      }
      _openEditView(arg :Mz.Event) {
        if (arg == null) {
          this.eventList.setSelectedMark(-1);
          MzE.event.createNew(this.target, ()=> {
            this.eventList.reload();
          });
        } else {
          openEdit(arg, ()=>{ this.eventList.reload(); });
        }
      }
    }
    function listToShow(room :MzE.Room, arg :Mz.Event[], whenRemove :Common.Callback) :UIParts.ComplexSelectorItem<Mz.Event>[] {
      var ret = [];
      arg.forEach((event)=> {
        ret.push({
          value: event,
          doms: [
            $("<label>").text(event.toString()),
            $("<div>")
              .addClass("right")
              .addClass("MzE_event_remove")
              .text("削除")
              .click(()=> {
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
      })
      return ret;
    }
  }
}
