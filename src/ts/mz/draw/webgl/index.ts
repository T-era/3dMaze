import { shaders } from './shaders';
export type Position = { x :number; y :number, z :number };
export type Rectangle = {
	topLeft :Position,
	topRight :Position,
	bottomLeft :Position,
	bottomRight :Position
};
export type Polygon = {
 	color :[number, number, number],
	rectangles :Rectangle[]
};

const TURBIDITY = .4;

export module PolygonShader {
	interface Position {
		x :number;
		y :number;
	}
	interface Shaders {
		readonly vertexShader :string;
		readonly fragmentShader :string;
	}
	interface InitializerArgs {
		readonly canvas :HTMLCanvasElement;
		readonly gl :WebGLRenderingContext;
		readonly maxDepth :number;
	}

	export class Initializer {
		gl :WebGLRenderingContext;
		canvasWidth :number;
		canvasHeight :number;
		program :WebGLProgram;
		maxDepth :number

		constructor(args :InitializerArgs) {
			this.canvasWidth = args.canvas.width;
			this.canvasHeight = args.canvas.height;
			this.gl = args.gl;
			this.maxDepth = args.maxDepth;

			this.program = createProgram(
				this.gl,
				shaders.vertexShader,
				shaders.fragmentShader);
		}
		ready() :GlRenderer {
			return new GlRenderer(this);
		}
	}
	export class GlRenderer {
		gl :WebGLRenderingContext;
		program :WebGLProgram;
		maxDepth :number;

		canvasAspect :number;

		baseColorUniformLocation :WebGLUniformLocation;
		turbidityUniformLocation :WebGLUniformLocation;
		maxDepthUniformLocation :WebGLUniformLocation;
		aspectRatioUniformLocation :WebGLUniformLocation;

		constructor(init :Initializer) {
			this.gl = init.gl;
			this.program = init.program;
			this.maxDepth = init.maxDepth;

			this.canvasAspect = init.canvasWidth / init.canvasHeight;
			this.baseColorUniformLocation = this.gl.getUniformLocation(this.program, 'base_color');
			this.turbidityUniformLocation = this.gl.getUniformLocation(this.program, 'turbidity');
			this.maxDepthUniformLocation = this.gl.getUniformLocation(this.program, 'max_depth');
			this.aspectRatioUniformLocation = this.gl.getUniformLocation(this.program, 'aspect_ratio');

		}
		render(imageList :Polygon[]) {
			let gl = this.gl;
			gl.clearColor (0.1, 0.1, 0.1, 1.0);
			gl.clearDepth(0.0);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			for (let {color, rectangles} of imageList) {
				gl.uniform3fv(this.baseColorUniformLocation, color);
				gl.uniform1f(this.turbidityUniformLocation, TURBIDITY);
				gl.uniform1f(this.maxDepthUniformLocation, this.maxDepth);
				gl.uniform1f(this.aspectRatioUniformLocation, this.canvasAspect)

				let positionBuffers = rectangles.map((rect)=> {
					let positionBuffer = gl.createBuffer();
					// 生成したバッファをバインドする
					gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
					let tl = rect.topLeft;
					let tr = rect.topRight;
					let bl = rect.bottomLeft;
					let br = rect.bottomRight;
					let tc = avl(tl, tr);
					let bc = avl(bl, br);
					let cc = avl(tc, bc);
					let cl = avl(tl, bl);
					let cr = avl(tr, br);
					function avl(p1, p2){
						return {
							x: (p1.x + p2.x) / 2,
							y: (p1.y + p2.y) / 2,
							z: (p1.z + p2.z) / 2,
						}
					}
					let arr = [
						tl.x, tl.y, tl.z,
						tc.x, tc.y, tc.z,
						cc.x, cc.y, cc.z,
						tr.x, tr.y, tr.z,
						cr.x, cr.y, cr.z,
						cc.x, cc.y, cc.z,
						br.x, br.y, br.z,
						bc.x, bc.y, bc.z,
						cc.x, cc.y, cc.z,
						bl.x, bl.y, bl.z,
						cl.x, cl.y, cl.z,
						cc.x, cc.y, cc.z,
						tl.x, tl.y, tl.z,
					];
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
					// ポリゴンを描画
					var positionAddress = gl.getAttribLocation(this.program, "position");
					gl.enableVertexAttribArray(positionAddress);
					gl.vertexAttribPointer(positionAddress, 3, gl.FLOAT, false, 0, 0);
					gl.drawArrays(gl.TRIANGLE_STRIP, 0, arr.length / 3); // LINE_STRIP
					gl.bindBuffer(gl.ARRAY_BUFFER, null);
					gl.flush();
				});
			}
		}
	}
}
function createPositionBuffer(gl :WebGLRenderingContext, posList :number[]) :WebGLBuffer {
	let positionBuffer = gl.createBuffer();
	// 生成したバッファをバインドする
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(posList), gl.STATIC_DRAW);
	return positionBuffer;
}
function createProgram(gl :WebGLRenderingContext, vertexShaderScript :string, fragmentShaderScript :string) :WebGLProgram {
	let vertexShader = createShader(gl, vertexShaderScript, gl.VERTEX_SHADER);
	let fragmentShader = createShader(gl, fragmentShaderScript, gl.FRAGMENT_SHADER);
	let program = gl.createProgram();

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
		gl.useProgram(program);
	}else {
		console.log(gl.getProgramInfoLog(program));
		throw 'error';
	}
	return program;
}
function createShader(gl :WebGLRenderingContext, shaderScript :string, shaderType :number) :WebGLShader {
	let shader = gl.createShader(shaderType);
	gl.shaderSource(shader, shaderScript);
	gl.compileShader(shader);
	if(! gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		console.log(gl.getShaderInfoLog(shader));
		throw 'error';
	}
	return shader;
}
