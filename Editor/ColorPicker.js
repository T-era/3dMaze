;
ColorPicker = {};
(function() {
	var SAMPLE_VEIW_SIZE = 120;
	var INPUT_WIDTH = 200;
	var color = C(0,0,0,255);

	ColorPicker = function(parent, callback) {
		var owner = $("<div>")
			.appendTo(parent);
		owner.css({
			width: 20 + SAMPLE_VEIW_SIZE + INPUT_WIDTH + "px",
			height: 10 + SAMPLE_VEIW_SIZE + "px"
		}).dialog({
			width: 400,
			height: 260,
			autoOpen: false,
			closeOnEscape: true,
			modal: true,
			buttons: {
				"追加": function() {
					callback(currentColor());
				},
				"追加して閉じる": function() {
					callback(currentColor());
					owner.dialog("close")
				}
			}
		});
		ColorPicker.generateInput(owner);
		this.show = function() {
			owner.dialog("open");
		}
		function currentColor() {
			return color;
		}
	}

	ColorPicker.generateInput = function(owner) {
		var sampleView = $("<div>")
			.css({
				width: SAMPLE_VEIW_SIZE + "px",
				height: SAMPLE_VEIW_SIZE + "px",
				float: "left"
			})
			.appendTo(owner);
		var pointDiv = $("<div>")
			.css({
				float: "left"
			}).appendTo(owner);
		var rInput = addColorPointer("R", pointDiv, color.r);
		var gInput = addColorPointer("G", pointDiv, color.g);
		var bInput = addColorPointer("B", pointDiv, color.b);
		var aInput = addColorPointer("A", pointDiv, color.a);
		repaintSample();

		function addColorPointer(caption, parent, defValue) {
			var owner = $("<div>").appendTo(parent);
			$("<label>")
				.text(caption)
				.appendTo(owner);
			return $("<input>", { type:"number", min:0, max:255 })
				.val(defValue)
				.css("width", INPUT_WIDTH + "px")
				.appendTo(owner)
				.change(repaintSample);
		}

		function repaintSample() {
			color = C(rInput.val() * 1,
				gInput.val() * 1,
				bInput.val() * 1,
				aInput.val() * 1);
			sampleView.css("background", color.css());
		}
	};
})();
function C(r,g,b,a) {
	var obj = {}
	obj.r = r;
	obj.g = g;
	obj.b = b;
	obj.a = a;

	obj.css = function() {
		return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
	};
	obj.equals = function(arg) {
		return this.r == arg.r
			&& this.g == arg.g
			&& this.b == arg.b
			&& this.a == arg.a;
	};
	return obj;
}