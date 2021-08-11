import { Common } from '../../common';
import { Types, Event } from '../../mz';

import { RoomEditor } from '../room';

import { openEditEvent as openEdit } from './edit_event';


var typeSelectDialog :JQuery;
var ownerRoom :RoomEditor;
var onChangeCallback :Common.Callback;

$(()=> {
  var selectType = $("<select>")
    .append($("<option>")
        .text("Message")
        .val("m"))
    .append($("<option>")
        .text("Warp")
        .val("w"))
    .append($("<option>")
        .text("Turn table")
        .val("t"))
  typeSelectDialog = $("<div>")
    .appendTo($("body"))
    .append(selectType);

  typeSelectDialog.dialog({
    autoOpen: false,
    title: "Create New Event",
    width: 400,
    height: 50,
    modal: true,
    buttons: {
      "Create Event": ()=> {
        typeSelectDialog.dialog("close");
        createEvent(eventByHeadChar(String(selectType.val())));
      },
      "Cancel": ()=> {
        typeSelectDialog.dialog("close");
      }
    }
  });
  function eventByHeadChar(headChar :string) :Types.Event {
    switch(headChar) {
      case "m":
        return new Event.Messaging();
      case "t":
        return new Event.TurnTable();
      case "w":
        return new Event.Warp();
    }
    return null;
  }
});

export function createNewEvent(owner :RoomEditor, reload :Common.Callback) {
  typeSelectDialog.dialog("open");
  ownerRoom = owner;
  onChangeCallback = reload;
}
function createEvent(event :Types.Event) {
  openEdit(event, ()=> {
    ownerRoom.addNormalEvent(event);
    ownerRoom.resetColor();
    onChangeCallback();
  });
}
