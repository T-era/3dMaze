/// <reference path="../lib/jquery/jquery.d.ts" />
/// <reference path="../lib/uiparts.d.ts" />
/// <reference path="../lib/mzedit.d.ts" />
/// <reference path="../lib/mzinit.d.ts" />
/// <reference path="../lib/storage.d.ts" />
/// <reference path="../lib/mz.d.ts" />

$(function() {
  var cs = new UIParts.ComplexSelect($("#saved_maps"), loadMap);
  cs.setLoader(Mz.IO.saveDataList(toSelectItem));
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
            UIParts.UserConfirm("迷路の削除", "迷路 " + item + " を削除します。",
              (callback:Common.Callback)=> {
                Mz.IO.removeMap(item);
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
            var obj = Mz.IO.loadRawJson(item);
            Mz.Edit.openEdit(item, obj);
            return false;
          })
      ],
      value: item
    };
  }
  function loadMap(key :string) {
    UIParts.UserConfirm("迷路の初期化", "迷路 " + key + " をロードします。",
      (callback :Common.Callback)=> {
        Mz.IO.load(key);
        Mz.Obj.onLoad();
        callback();
      },
      (callback :Common.Callback)=> {
        callback();
      });
  }
  $("#main_new_button").click(()=> {
    Mz.Init.openBaseSetting("新しい迷路を作成",
      (setting :Mz.Init.InitSetting, callback :Common.Callback)=> {
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
    if (Mz.IO.existsName(setting.name)) { alert("その名前の迷路は作れない！\n(おなじ名前の迷路が既に登録されていかも)"); return false; }

    Mz.Edit.toEdit(setting,
      ()=> {
        cs.reload();
      }
    );

    return true;
  }
});
