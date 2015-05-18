;
(function() {
	// load css.
	$("head").append("<link>");
	$("head")
		.children(":last")
		.attr({
			rel: "stylesheet",
			type: "text/css",
			href: "ComplexSelect.css"
		});

	ComplexSelect = function(owner, itemSelectedCallback) {
		owner
			.addClass("_select_box")
		var options = $("<ul>")
			.addClass("_select_box_items")
			.appendTo(owner);
		var fItemLoader = null;

		return {
			addItem: function(item) {
				var li = $("<li>")
					.appendTo(options)
					.addClass("_select_box_item");
				li.click(itemSelected(li, item.value));

				for (var i = 0, max = item.doms.length; i < max; i ++) {
					li.append(item.doms[i]);
				}
			},
			addAll: function(list) {
				for (var i = 0, max = list.length; i < max; i ++) {
					this.addItem(list[i]);
				}
			},
			items: function(list) {
				options.empty();
				this.addAll(list);
			},
			setLoader: function(callback) {
				fItemLoader = callback;
			},
			reload: function() {
				this.items(fItemLoader());
			}
		};
		function itemSelected(li, value) {
			return function() {
				clearSelected();
				li.addClass("_select_box_item_selected");
				if (itemSelectedCallback) {
					itemSelectedCallback(value);
				}
			};
		}
		function clearSelected() {
			options.children().removeClass("_select_box_item_selected");
		}
	};
})();
