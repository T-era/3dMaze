/// <reference path="../../lib/jquery/jquery.d.ts" />
/// <reference path="../../lib/common.d.ts" />
/// <reference path="floor.ts" />
/// <reference path="floor_selector.ts" />

module Mz {
	export module Edit {
		export var roomColor :RoomColor;
		export function color_roomChangeListener(arg :Mz.Edit.Room) :void {
			roomColor.roomChanged(arg);
		}

		$(()=> {
			roomColor = new RoomColor($("#room_color_switch"), $("#room_color"));
		});

		export class RoomColor {
			switch :JQuery;
			div :JQuery;
			clickEnable :boolean;
			target :Mz.IRoom;

			constructor(_switch :JQuery, _div :JQuery) {
				this.switch = _switch;
				this.div = _div;
				this.switch.click(()=> this.switchChanged());
				this.div.click(()=> this.colorChanging());
				this.roomChanged(null);
			}

			roomChanged(arg :Mz.Edit.Room) {
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
						UIParts.UserConfirm(""
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
					Mz.Edit.colorPicker.show(this.target.Color, (color :Common.Color)=> {
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
	}
}
