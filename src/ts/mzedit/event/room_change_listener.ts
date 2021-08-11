import { Common } from '../../common';
import { ComplexSelect, ComplexSelectorItem, Alert, UserConfirm } from '../../uiparts';
import { Types } from '../../mz';

import { RoomEditor } from '../room';
import { getStartPoint, setStartPoint } from '../mode';

import { createNewEvent as createNew } from './add_new';
import { openEditEvent as openEdit } from './edit_event';

var roomEvent :RoomEvent;
export function event_roomChangeListener(arg :RoomEditor) :void {
  roomEvent.roomChanged(arg);
}

$(()=> {
  roomEvent = new RoomEvent(
    $("#room_event_start"),
    $("#room_event_goal"),
    $("#room_event_list"));
});

class RoomEvent {
  target :RoomEditor;
  startCheck :JQuery;
  goalCheck :JQuery;
  eventList :ComplexSelect<Types.Event>;

  constructor(startCheck :JQuery, goalCheck :JQuery, eventList :JQuery) {
    this.startCheck = startCheck;
    this.goalCheck = goalCheck;
    this.eventList = new ComplexSelect(eventList, (arg :Types.Event)=> { this._openEditView(arg); });
    this.eventList.setLoader(()=> { return this._getEventSelectionList(); })
    startCheck.change(()=>{ this.startHere(); });
    goalCheck.change(()=>{ this.goalHere(); });
  }
  roomChanged(arg :RoomEditor) {
    this.target = arg;
    if (arg) {
      var startPoint = getStartPoint();
      this.startCheck.prop("checked", startPoint.x == arg.x
        && startPoint.y == arg.y
        && startPoint.z == arg.floor.z);
      this.goalCheck.prop("checked", Boolean(arg.isGoal()));
    } else {
      this.startCheck.prop("checked", false);
      this.goalCheck.prop("checked", false);
    }
    this.eventList.reload();
  }
  setStart(arg :Types.Position) {
    setStartPoint(arg);
  }
  startHere() {
    if (this.target) {
      if (this.startCheck.prop("checked")) {
        UserConfirm("",
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
        Alert("", "スタート地点を解除できません。（他のマスをスタート地点に指定してください");
        this.startCheck.prop("checked", true);
      }
    } else {
      this.startCheck.prop("checked", false);
    }
  }
  goalHere() {
    if (this.target) {
      this.target.isGoal(this.goalCheck.prop("checked"));
      this.target.resetColor();
    } else {
      this.goalCheck.prop("checked", false);
    }
  }
  _getEventSelectionList() :ComplexSelectorItem<Types.Event>[] {
    if (this.target) {
      return listToShow(this.target, this.target._normalEvents, ()=> {
        this.eventList.reload();
      });
    } else {
      return [];
    }
  }
  _openEditView(arg :Types.Event) {
    if (arg == null) {
      this.eventList.setSelectedMark(-1);
      createNew(this.target, ()=> {
        this.eventList.reload();
      });
    } else {
      openEdit(arg, ()=>{ this.eventList.reload(); });
    }
  }
}
function listToShow(room :RoomEditor, arg :Types.Event[], whenRemove :Common.Callback) :ComplexSelectorItem<Types.Event>[] {
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
            room.resetColor();
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
