/// <reference path="../../lib/jquery/jquery.d.ts" />
/// <reference path="../../lib/jqueryui/jqueryui.d.ts" />
/// <reference path="../../lib/common.d.ts" />

module UIParts {
	var dialog :JQuery;
	var text :JQuery;

	$(function() {
		text = $("<div>");
		dialog = $("<div>")
			.appendTo($("body"))
			.append(text);
	});

	export function UserConfirm(
			title :string,
			message :string,
			okAction :(callback: Common.Callback)=>void = null,
			cancelAction :(callback: Common.Callback)=>void = null,
			whenOpen :Common.Callback = null,
			whenClose :Common.Callback = null) {
		text.text(message);
		dialog
			.dialog({
				autoOpen: true,
				title: title,
				modal: true,
				buttons: {
					"OK": function() {
						if (okAction) {
							okAction(dialogClose);
						} else {
							dialogClose();
						}
					},
					"Cancel": function() {
						if (cancelAction) {
							cancelAction(dialogClose);
						} else {
							dialogClose();
						}
					}
				},
				open: whenOpen,
				close: whenClose
			});
	};
	export function Alert(
			title :string,
			message :string,
			okAction :(callback: Common.Callback)=>void = null,
			whenOpen :Common.Callback = null,
			whenClose :Common.Callback = null) {
		text.text(message);

		dialog
			.dialog({
				autoOpen: true,
				title: title,
				modal: true,
				buttons: {
					"OK": function() {
						if (okAction) {
							okAction(dialogClose);
						} else {
							dialogClose();
						}
					},
				},
				open: whenOpen,
				close: whenClose
			});
	}

	function dialogClose() {
		dialog.dialog("close");
	}
}
