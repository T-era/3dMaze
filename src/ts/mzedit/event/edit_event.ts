import { Common } from '../../common';
import { Types, Event, Directions } from '../../mz';

import { RoomEditor } from '../room';

var dialog :JQuery;

$(()=> {
  dialog = $("<div>")
    .appendTo($("body"));
});

export function openEditEvent(event :Types.Event, callback :Common.Callback = ()=>{}) {
  var editor :BaseEventEditor = getEditor();

  function getEditor() : BaseEventEditor {
    if (event instanceof Event.Messaging) return new MessagingEditor(event, callback);
    if (event instanceof Event.Warp) return new WarpEditor(event, callback);
    if (event instanceof Event.TurnTable) return new TurnTableEditor(event, callback);
    return null;
  }
  editor.showDialog();
}
class BaseEventEditor {
  reload :Common.Callback;

  constructor(reload :Common.Callback) {
    this.reload = reload;
  }
  public showDialog() {
    dialog.children().remove();
    this.childViews().forEach((dom)=> {
      dialog.append(dom);
    })
    dialog.dialog({
      title: this.label(),
      modal: true,
      buttons: {
        "OK": ()=> {
          this.save();
          this.reload();
          dialog.dialog("close");
        },
        "Canecl": ()=> {
          dialog.dialog("close");
        }
      }
    });
  }
  save() {}
  childViews() :JQuery[] { return []; }
  label() :string { return ""; }
}

class MessagingEditor extends BaseEventEditor {
  titleInput = $("<input>", {type:"text"});
  messageInput = $("<textarea>");
  event :Event.Messaging;

  constructor(event :Event.Messaging, callback :Common.Callback) {
    super(callback);
    this.event = event;
    this.titleInput.val(event.title);
    this.messageInput.val(event.message);
  }

  childViews() :JQuery[] {
    return [
      this.titleInput,
      this.messageInput];
  }
  save() {
    this.event.title = String(this.titleInput.val());
    this.event.message = String(this.messageInput.val());
  }
  label() :string { return "Messaging event"; }
}
class WarpEditor extends BaseEventEditor {
  check = $("<input>", {type:"checkbox"}).prop("checked", false).click(()=> { this._enable(); });
  xInput = $("<input>", {type:"number"}).prop("readonly", true);
  yInput = $("<input>", {type:"number"}).prop("readonly", true);
  zInput = $("<input>", {type:"number"}).prop("readonly", true);
  event :Event.Warp;

  constructor(event :Event.Warp, callback :Common.Callback) {
    super(callback);
    this.event = event;
    this.check.prop("checked", event.jumpTo != null);
    if (event.jumpTo) {
      this.xInput.val(String(event.jumpTo.x));
      this.yInput.val(String(event.jumpTo.y));
      this.zInput.val(String(event.jumpTo.z));
    }
  }
  _enable() {
    var flag = this.check.prop("checked")
    this.xInput.prop("readonly", ! flag);
    this.yInput.prop("readonly", ! flag);
    this.zInput.prop("readonly", ! flag);
  }

  childViews() :JQuery[] {
    return [
      this.check,
      this.xInput,
      this.yInput,
      this.zInput];
  }
  save() {
    if (this.check.prop("checked")) {
      this.event.jumpTo = {
        x: Number(this.xInput.val()),
        y: Number(this.yInput.val()),
        z: Number(this.zInput.val())
      };
    } else {
      this.event.jumpTo = null;
    }
  }
  label() :string { return "Warp event"; }
}
class TurnTableEditor extends BaseEventEditor {
  select = $("<select>")
    .append($("<option>").val(null).text("(Ramdom)"))
    .append($("<option>").val("n").text("North"))
    .append($("<option>").val("s").text("South"))
    .append($("<option>").val("e").text("East"))
    .append($("<option>").val("w").text("West"));

  event :Event.TurnTable;

  constructor(event :Event.TurnTable, callback :Common.Callback) {
    super(callback);
    this.event = event;
  }

  childViews() :JQuery[] {
    return [
      this.select];
  }
  save() {
    var direction = getDirection(this.select.val());
    this.event.directionTo = direction;

    function getDirection(s) {
      switch(s) {
        case "n": return Directions.North;
        case "s": return Directions.South;
        case "e": return Directions.East;
        case "w": return Directions.West;
        default: return null;
      }
    }
  }
  label() :string { return "Turn table event"; }
}
