import { Types } from '../mz';
import { Common } from '../common';
import { UserConfirm } from '../uiparts';

import { colorPicker } from './color_picker';
import { RoomEditor } from './room';

export var roomColor :RoomColorEditor;
export function color_roomChangeListener(arg :RoomEditor) :void {
	roomColor.roomChanged(arg);
}

$(()=> {
	roomColor = new RoomColorEditor($("#room_color_switch"), $("#room_color"));
});

export class RoomColorEditor {
	switch :JQuery;
	div :JQuery;
	clickEnable :boolean;
	target :Types.IRoom;

	constructor(_switch :JQuery, _div :JQuery) {
		this.switch = _switch;
		this.div = _div;
		this.switch.click(()=> this.switchChanged());
		this.div.click(()=> this.colorChanging());
		this.roomChanged(null);
	}

	roomChanged(arg :RoomEditor) {
		this.target = arg == null ? null : arg.obj;
		if (arg) {
			var enable :boolean = Boolean(arg.obj.Color);
			this.switch.prop("checked", enable);
			this.clickEnable = enable;
		} else {
			this.clickEnable = false;
			this.switch.prop("checked", false);
		}
		this._showColor();
	}
	switchChanged() {
		if (this.target) {
			this.clickEnable = this.switch.prop("checked");
			if (! this.clickEnable) {
				UserConfirm(""
					, "この部屋の壁色設定を消します。"
					, (callback)=> {
						this.target.Color = null;
						callback();
						this._showColor();
					}, (callback)=> {
						this.clickEnable = true;
						this.switch.prop("checked", true);
						callback();
					});
			}
		} else {
			this.clickEnable = false;
			this.switch.prop("checked", false);
		}
		this._showColor();
	}
	colorChanging() {
		if (this.clickEnable) {
			colorPicker.show(this.target.Color, (color :Common.Color)=> {
				this.target.Color = color;
				this._showColor();
			});
		}
	}
	_showColor() {
		var cssColor = (! this.target || ! this.target.Color)
			? "black"
			: Common.toCssColor(this.target.Color);

		this.div.css({
			background: cssColor
		});
	}
}
