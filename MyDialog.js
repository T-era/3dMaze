;MyDialog = new (function() {
	var dialog = $("<div>")
		.text("hogehogefugafuga")
		.appendTo($("<body>"));
	this.UserConfirm = function(title, message, okAction, cancelAction) {
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
	this.Alert = function(title, message, okAction) {
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
})();
