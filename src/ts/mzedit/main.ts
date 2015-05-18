/// <reference path="../../lib/mzinit.d.ts" />
/// <reference path="mode.ts" />

module MzE {
	var editDialog = null;
	$(function() {
		editDialog = $("#edit").dialog({
			width: "90%",
			height: $("#edit").parent().height() * .9,
			autoOpen: false,
			buttons: {
				Save: function() {
					MzE.EditMode.save();
				}
			}
		});
	});

	export function toEdit(setting :MzI.InitSetting, whenClose :()=>void) {
		var xSize = setting.xSize;
		var ySize = setting.ySize;
		var zSize = setting.zSize;
		if (! xSize || ! ySize || ! zSize) {
			alert("error");
		} else {
			MzE.EditMode.initEmpty(setting);
			editDialog.dialog({ close: whenClose });
			editDialog.dialog("open");
		}
	}
	export function openEdit(name :string, baseColors :Common.Color[], fields :{num;col}) {
		MzE.EditMode.edit(name, baseColors, fields);
		editDialog.dialog("open");
	}
}
