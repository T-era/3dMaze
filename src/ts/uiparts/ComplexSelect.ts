/// <reference path="../../lib/jquery/jquery.d.ts" />
module UIParts {
	export interface ComplexSelectorItem<T> {
		value :T;
		doms :JQuery[];
	}

	// load css.
	$(function() {
		$("head").append("<link>");
		$("head")
			.children(":last")
			.attr({
				rel: "stylesheet",
				type: "text/css",
				href: "ComplexSelect.css"
			});
	});

	export class ComplexSelect<T> {
		options :JQuery;
		fItemLoader :()=>ComplexSelectorItem<T>[];
		itemSelectedCallback :(T)=>void;

		constructor(owner :JQuery, itemSelectedCallback :(T)=>void) {
			owner
				.addClass("_select_box")
			this.options = $("<ul>")
				.addClass("_select_box_items")
				.appendTo(owner);
			this.itemSelectedCallback = itemSelectedCallback;
			this.fItemLoader = null;
		}

		addItem(item :ComplexSelectorItem<T>) {
			var li = $("<li>")
				.appendTo(this.options)
				.addClass("_select_box_item");
			li.click(itemSelected(this, li, item.value));

			for (var i = 0, max = item.doms.length; i < max; i ++) {
				li.append(item.doms[i]);
			}
		}
		addAll(list :ComplexSelectorItem<T>[]) {
			for (var i = 0, max = list.length; i < max; i ++) {
				this.addItem(list[i]);
			}
		}
		items(list :ComplexSelectorItem<T>[]) {
			this.options.empty();
			this.addAll(list);
		}
		setLoader(callback :()=>ComplexSelectorItem<T>[]) {
			this.fItemLoader = callback;
		}
		reload() {
			this.items(this.fItemLoader());
		}
		setSelectedMark(index :number) {
			this._clearSelected();
			$(this.options.children()[index]).addClass("_select_box_item_selected");
		}
		_clearSelected() {
			this.options.children().removeClass("_select_box_item_selected");
		}
	}
	function itemSelected(that, li, value) {
		return function() {
			that._clearSelected();
			li.addClass("_select_box_item_selected");
			if (that.itemSelectedCallback) {
				that.itemSelectedCallback(value);
			}
		};
	}
}
