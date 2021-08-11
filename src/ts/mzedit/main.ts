import { Common } from '../common';
import { Alert } from '../uiparts'
import { MzInit } from '../mzinit';
import { Mz, Types } from '../mz';

import { EditMode } from './mode';

export module MzEdit {
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
					EditMode.save();
					Alert('Done!', 'Completed successfully.')
				},
			},
			close: ()=> {
				Mz.Obj.enable(Types.EnableState.Restart);
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

	export function toEdit(setting :MzInit.InitSetting, whenClose :Common.Callback) {
		var xSize = setting.xSize;
		var ySize = setting.ySize;
		var zSize = setting.zSize;
		if (! xSize || ! ySize || ! zSize) {
			alert("error");
		} else {
			EditMode.initEmpty(setting);
			editDialog.dialog({ close: whenClose });
			editDialog.dialog("open");
		}
	}
	export function openEdit(name :string, map :Types.JsonData) {
		EditMode.edit(name, map);
		editDialog.dialog("open");
		Mz.Obj.enable(Types.EnableState.Suspend);
	}
	function showExport() {
		var obj = EditMode.export();
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
					var json = JSON.parse(String(ioView.val()));
					EditMode.import(json);
					ioDialog.dialog("close");
				}
			}
		});
		ioDialog.dialog("open");
	}
}
