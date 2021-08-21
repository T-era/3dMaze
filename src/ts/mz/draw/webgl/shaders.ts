export module shaders {
	export const fragmentShader = `
precision lowp float;
varying   vec4 vColor;


void main(void){
	gl_FragColor = vColor;
}
`;
	export const vertexShader = `
attribute vec4 position;
uniform vec3 base_color;
uniform float turbidity;
uniform float max_depth;
uniform float aspect_ratio;
varying vec4 vColor;

void main ()
{
	float lz = position.z + 1.0;
	float ratio = 1.0 / lz;
	gl_Position = vec4(
		position.x * ratio * 2.0 / aspect_ratio,
		- position.y * ratio * 2.0,
		min(lz, 0.0),
		1.0);
	float distance = position.x * position.x
			+ position.y * position.y
			+ position.z * position.z - 0.25;
	vColor = vec4(base_color.rgb / pow(1.0 + distance, turbidity), 1.0);
}
`;
};
