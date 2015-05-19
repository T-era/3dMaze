module Common {
  if (! Array.prototype.forEach) {
    Array.prototype.forEach = function(f :(any)=>void) {
      for (var i = 0, max = this.length; i < max; i ++) {
        f(this[i]);
      }
    }
  }
  if (! Array.prototype.map) {
    Array.prototype.map = function<S>(f :(any)=>S) :S[] {
      var list :S[] = [];
      for (var i = 0, max = this.length; i < max; i ++) {
        list.push(f(this[i]));
      }
      return list;
    }
  }
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
