/// <reference path="../../lib/common.d.ts" />
/// <reference path="../../lib/mzinit.d.ts" />
/// <reference path="mode.ts" />
/// <reference path="room_color.ts" />

module Mz {
	export module Edit {
		var editDialog :JQuery = null;
		var ioView :JQuery;
		var ioDialog :JQuery;

		$(function() {
			var ownerDom = $("#edit").parent();
			editDialog = $("#edit").dialog({
				width: "90%",
				height: ownerDom.height() * .9,
				autoOpen: false,
				modal: true,
				buttons: {
					Save: function() {
						Mz.Edit.EditMode.save();
					},
				},
				close: ()=> {
					Mz.Obj.enable(Mz.EnableState.Restart);
				}
			});
			ioDialog = $("<div>")
				.appendTo(editDialog)
				.addClass("MzE_ExpImp")
				.dialog({
					width: "50%",
					height: ownerDom.height() * 0.6,
					autoOpen: false,
					modal: true
				});
			ioView = $("<textarea>").appendTo(ioDialog)
			$("#edit_export").click(showExport);
			$("#edit_import").click(showImport);
		});

		export function toEdit(setting :Mz.Init.InitSetting, whenClose :Common.Callback) {
			var xSize = setting.xSize;
			var ySize = setting.ySize;
			var zSize = setting.zSize;
			if (! xSize || ! ySize || ! zSize) {
				alert("error");
			} else {
				Mz.Edit.EditMode.initEmpty(setting);
				editDialog.dialog({ close: whenClose });
				editDialog.dialog("open");
			}
		}
		export function openEdit(name :string, map :Mz.JsonData) {
			Mz.Edit.EditMode.edit(name, map);
			editDialog.dialog("open");
			Mz.Obj.enable(Mz.EnableState.Suspend);
		}
		function showExport() {
			var obj = Mz.Edit.EditMode.export();
			ioView.text(JSON.stringify(obj));
			ioDialog.dialog({
				buttons: {
					"OK": ()=> { ioDialog.dialog("close"); }
				}
			});
			ioDialog.dialog("open");
		}
		function showImport() {
			ioView.text("");
			ioDialog.dialog({
				buttons: {
					"OK": ()=> {
						var json = JSON.parse(ioView.val());
						Mz.Edit.EditMode.import(json);
						ioDialog.dialog("close");
					}
				}
			});
			ioDialog.dialog("open");
		}
	}
}
