import { Common } from '../common';

var SAMPLE_VIEW_SIZE = 120;
var INPUT_WIDTH = 200;

export class ColorPicker {
	owner :JQuery;
	color :Common.Color = new Common.Color(255,255,255);
	okCallback :(arg:Common.Color)=>void;
	sampleView :JQuery;
	rInput :JQuery;
		gInput :JQuery;
		bInput :JQuery;

	constructor(parent :JQuery) {
		var owner = $("<div>")
			.appendTo(parent);
		owner.css({
			width: 20 + SAMPLE_VIEW_SIZE + INPUT_WIDTH + "px",
			height: 10 + SAMPLE_VIEW_SIZE + "px"
		}).dialog({
			width: 80 + SAMPLE_VIEW_SIZE + INPUT_WIDTH,
			height: 140 + SAMPLE_VIEW_SIZE,
			autoOpen: false,
			closeOnEscape: true,
			modal: true,
			buttons: {
				"OK": ()=> {
					this.okCallback(this.color);
					owner.dialog("close");
				},
				"Cancel": function() {
					owner.dialog("close");
				}
			}
		});
		this.sampleView = $("<div>")
			.css({
				width: SAMPLE_VIEW_SIZE + "px",
				height: SAMPLE_VIEW_SIZE + "px",
				float: "left"
			})
			.appendTo(owner);
		var pointDiv = $("<div>")
			.css({
				float: "left"
			}).appendTo(owner);
		this.rInput = addColorPointer("R", pointDiv, this.color.r);
		this.gInput = addColorPointer("G", pointDiv, this.color.g);
		this.bInput = addColorPointer("B", pointDiv, this.color.b);
		this.resetColor();
		this.owner = owner;
		var that = this;

		function addColorPointer(caption, parent, defValue) {
			var owner = $("<div>").appendTo(parent);
			$("<label>")
				.text(caption)
				.appendTo(owner);
			return $("<input>", { type:"number", min:0, max:255 })
				.val(defValue)
				.css("width", INPUT_WIDTH + "px")
				.appendTo(owner)
				.change(()=> {
					that.resetColor();
				});
		}
	}
	show(current :Common.Color, callback :(Color)=>void) {
		this.okCallback = callback;
		if (current) {
			this.rInput.val(current.r.toString());
			this.gInput.val(current.g.toString());
			this.bInput.val(current.b.toString());
		} else {
			this.rInput.val("");
			this.gInput.val("");
			this.bInput.val("");
		}
		this.resetColor();
		this.owner.dialog("open");
	}
	resetColor() {
		this.color = new Common.Color(
			Number(this.rInput.val()),
			Number(this.gInput.val()),
			Number(this.bInput.val()));
		this.sampleView.css("background", Common.toCssColor(this.color));
	}
}
