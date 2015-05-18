module Common {
  export class Color {
    r: number;
    g: number;
    b: number;

    constructor(r :number, g :number, b :number) {
      this.r = r;
      this.g = g;
      this.b = b;
    }
  }
  export function toCssColor(col :Color) :string {
  	return "#" + toF(col.r) + toF(col.g) + toF(col.b);

  	function toF(arg :number) :string {
  		var hexa = Math.floor(arg).toString(16);
  		return ("0" + hexa).substr(-2);
  	}
  }
  export interface Callback {
    () :void;
  }
  export interface Func<T> {
    (arg :T) :void;
  }
}
