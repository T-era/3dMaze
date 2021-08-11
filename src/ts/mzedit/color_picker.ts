import { ColorPicker } from '../uiparts';

export var colorPicker :ColorPicker = null;
$(function() {
	colorPicker = new ColorPicker($("body"));
});
