/// <reference path="../../../lib/common.d.ts" />
/// <reference path="../../../lib/mz.d.ts" />
/// <reference path="edit_event.ts" />

module Mz {
  export module Edit {
    export module event {
      var typeSelectDialog :JQuery;
      var ownerRoom :Mz.Edit.Room;
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
              createEvent(eventByHeadChar(selectType.val()));
            },
            "Cancel": ()=> {
              typeSelectDialog.dialog("close");
            }
          }
        });
        function eventByHeadChar(headChar :string) :Mz.Event {
          switch(headChar) {
            case "m":
              return new Mz.Messaging();
            case "t":
              return new Mz.TurnTable();
            case "w":
              return new Mz.Warp();
          }
          return null;
        }
      });

      export function createNew(owner :Mz.Edit.Room, reload :Common.Callback) {
        typeSelectDialog.dialog("open");
        ownerRoom = owner;
        onChangeCallback = reload;
      }
      function createEvent(event :Mz.Event) {
        openEdit(event, ()=> {
          ownerRoom.addNormalEvent(event);
          onChangeCallback();
        });
      }
    }
  }
}
