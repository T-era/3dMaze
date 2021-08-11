import { Common } from './common';
import { ComplexSelect, UserConfirm } from './uiparts';
import { MzIO } from './storage';
import { MzInit } from './mzinit';
import { Mz } from './mz';
import { MzEdit, openEditEvent as openEdit } from './mzedit';

$(function() {
  var cs = new ComplexSelect($("#saved_maps"), loadMap);
  cs.setLoader(MzIO.saveDataList(toSelectItem));
  cs.reload();

  function toSelectItem(item) {
    return {
      doms: [
        $("<span>").text(item),
        $("<div>")
          .text("削除")
          .addClass("like_button")
          .addClass("right")
          .css({
            height: "16px",
            background: "#fdd" })
          .click(()=> {
            UserConfirm("迷路の削除", "迷路 " + item + " を削除します。",
              (callback:Common.Callback)=> {
                MzIO.removeMap(item);
                cs.reload();
                callback();
              },
              null);
            return false;
          }),
        $("<div>")
          .text("編集")
          .addClass("like_button")
          .addClass("right")
          .css({
            height: "16px" })
          .click(()=> {
            var obj = MzIO.loadRawJson(item);
            MzEdit.openEdit(item, obj);
            return false;
          })
      ],
      value: item
    };
  }
  function loadMap(key :string) {
    UserConfirm("迷路の初期化", "迷路 " + key + " をロードします。",
      (callback :Common.Callback)=> {
        MzIO.load(key);
        Mz.Obj.onLoad();
        callback();
      },
      (callback :Common.Callback)=> {
        callback();
      });
  }
  $("#main_new_button").click(()=> {
    MzInit.openBaseSetting("新しい迷路を作成",
      (setting :MzInit.InitSetting, callback :Common.Callback)=> {
        if (createNewMap(setting)) {
          callback();
        }
      },
      ()=> {
      });
  });

  function createNewMap(setting) {
    if (setting.xSize < 1) { alert("迷路の広さ x を指定して！"); return false; }
    if (setting.ySize < 1) { alert("迷路の広さ y を指定して！"); return false; }
    if (setting.zSize < 1) { alert("迷路の広さ z を指定して！"); return false; }
    if (! setting.name) { alert("迷路に名前をつけて！"); return false; }
    if (MzIO.existsName(setting.name)) { alert("その名前の迷路は作れない！\n(おなじ名前の迷路が既に登録されていかも)"); return false; }

    MzEdit.toEdit(setting,
      ()=> {
        cs.reload();
      }
    );

    return true;
  }
});
