/// <reference path="../../lib/jquery/jquery.d.ts" />
/// <reference path="../../lib/jquery/jqueryui.d.ts" />
/// <reference path="../../lib/common.d.ts" />

module UIParts {
	var dialog :JQuery;
	$(function() {
		dialog = $("<div>")
			.appendTo($("body"));
	});

	export function UserConfirm(
			title :string,
			message :string,
			okAction :(Callback)=>void = null,
			cancelAction :(Callback)=>void = null) {
		dialog.text(message)
			.dialog({
				autoOpen: true,
				title: title,
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
				}
			});
	};
	export function Alert(title :string, message :string, okAction = null) {
		dialog.text(message)
			.dialog({
				autoOpen: true,
				title: title,
				buttons: {
					"OK": function() {
						if (okAction) {
							okAction(dialogClose);
						} else {
							dialogClose();
						}
					},
				}
			});
	}

	function dialogClose() {
		dialog.dialog("close");
	}
}
