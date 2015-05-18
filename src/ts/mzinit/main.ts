/// <reference path="../../lib/jquery/jquery.d.ts" />
/// <reference path="../../lib/jquery/jqueryui.d.ts" />
/// <reference path="../../lib/common.d.ts" />

module MzI {
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
			buttons: {
				"OK": function() {
					okAction({
						name: nameInput.val(),
						xSize: 1*xInput.val(),
						ySize: 1*yInput.val(),
						zSize: 1*zInput.val()
					}, function() {
						dialog.dialog("close");
					});
				},
				"Cancel": function() {
					dialog.dialog("close");
				}
			},
			close: whenClose
		}).dialog("open");
	}
}
