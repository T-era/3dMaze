import { Common } from '../common';
import { Mz, Types } from '../mz';


export module MzInit {
	export interface InitSetting {
		name: string;
		xSize: number;
		ySize: number;
		zSize: number;
	}

	var dialog :JQuery;
	var nameInput :JQuery;
	var xInput :JQuery;
	var yInput :JQuery;
	var zInput :JQuery;
	$(function() {
		dialog = $("#baseSettngs")
			.dialog({
				autoOpen: false,
				modal: true,
				width: "800px"
			});
		nameInput = $("input#nameIn");
		xInput = $("input#xSizeIn");
		yInput = $("input#ySizeIn");
		zInput = $("input#zSizeIn");
	});

	export function openBaseSetting(
			title :string,
			okAction :(a:InitSetting, b:Common.Callback)=>void,
			whenClose :Common.Callback) {
		dialog.dialog({
			title: title,
			modal: true,
			buttons: {
				"OK": function() {
					okAction({
						name: String(nameInput.val()),
						xSize: Number(xInput.val()),
						ySize: Number(yInput.val()),
						zSize: Number(zInput.val())
					}, function() {
						dialog.dialog("close");
					});
				},
				"Cancel": function() {
					dialog.dialog("close");
				}
			},
			close: ()=> {
				Mz.Obj.enable(Types.EnableState.Restart);
				whenClose();
			}
		}).dialog("open");
	}
}
