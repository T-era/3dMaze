$(function() {
	var dialog = $("#baseSettngs")
		.dialog({
			autoOpen: false,
		});
	var nameInput = $("input#nameIn");
	var xInput = $("input#xSizeIn");
	var yInput = $("input#ySizeIn");
	var zInput = $("input#zSizeIn");

	MzE.openBaseSetting = function(title, okAction, whenClose) {
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
	};
});
