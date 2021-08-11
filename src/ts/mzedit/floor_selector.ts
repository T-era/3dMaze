import { Common } from '../common';
import { ComplexSelect } from '../uiparts';

import { colorPicker } from './color_picker';
import { EditMode } from './mode';

export function FloorSelector(dom :JQuery, getColorList :()=>Common.Color[]) :ComplexSelect<number> {
	var floorSelector = new ComplexSelect<number>(dom, function(val) {
		EditMode.selectFloor(val)
	});
	floorSelector.setLoader(function() {
		var ret = [];
		var baseColors = getColorList();
		for (var i = 0, max = baseColors.length; i < max; i ++) {
			ret.push(toItem(i, baseColors[i]));
		}
		return ret;

		function toItem(index, value) {
			return {
				doms: [
					createFloorSpan(index),
					createColorDiv(index, value)
				],
				value: index
			};
		}
	});
	return floorSelector;

	function createFloorSpan(index) {
		return $("<span>").text("B" + index);
	}
	function createColorDiv(index, value) {
		var div = $("<div>")
			.addClass("right")
			.addClass("MzE_floors_color")
			.css("background", Common.toCssColor(value));
		div.click(colorDivClicked(div, index, value));
		return div;
	}

	function colorDivClicked(div, index, value) {
		return function() {
			colorPicker.show(value, function(color) {
				getColorList()[index] = color;
				div.css("background", Common.toCssColor(color));
			});
			return false;
		}
	}
}
