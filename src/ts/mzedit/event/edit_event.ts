/// <reference path="../../../lib/common.d.ts" />
/// <reference path="../../../lib/mz.d.ts" />
/// <reference path="../floor.ts" />

module MzE {
  export module event {
    var dialog :JQuery;

    $(()=> {
      dialog = $("<div>")
        .appendTo($("body"));
    });

    export function openEdit(event :Mz.Event, callback :Common.Callback = ()=>{}) {
      var editor :BaseEventEditor = getEditor();

      function getEditor() : BaseEventEditor {
        if (event instanceof Mz.Messaging) return new MessagingEditor(event, callback);
        if (event instanceof Mz.Warp) return new WarpEditor(event, callback);
        if (event instanceof Mz.TurnTable) return new TurnTableEditor(event, callback);
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
      event :Mz.Messaging;

      constructor(event :Mz.Messaging, callback :Common.Callback) {
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
        this.event.title = this.titleInput.val();
        this.event.message = this.messageInput.val();
      }
      label() :string { return "Messaging event"; }
    }
    class WarpEditor extends BaseEventEditor {
      check = $("<input>", {type:"checkbox"}).prop("checked", false).click(()=> { this._enable(); });
      xInput = $("<input>", {type:"number"}).prop("readonly", true);
      yInput = $("<input>", {type:"number"}).prop("readonly", true);
      zInput = $("<input>", {type:"number"}).prop("readonly", true);
      event :Mz.Warp;

      constructor(event :Mz.Warp, callback :Common.Callback) {
        super(callback);
        this.event = event;
        this.check.prop("checked", event.jumpTo != null);
        if (event.jumpTo) {
          this.xInput.val(event.jumpTo.x);
          this.yInput.val(event.jumpTo.y);
          this.zInput.val(event.jumpTo.z);
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
            x: this.xInput.val() * 1,
            y: this.yInput.val() * 1,
            z: this.zInput.val() * 1
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

      event :Mz.TurnTable;

      constructor(event :Mz.TurnTable, callback :Common.Callback) {
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
            case "n": return Mz.Direction.North;
            case "s": return Mz.Direction.South;
            case "e": return Mz.Direction.East;
            case "w": return Mz.Direction.West;
            default: return null;
          }
        }
      }
      label() :string { return "Turn table event"; }
    }
  }
}
