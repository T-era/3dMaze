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
varying vec4 vColor;

void main ()
{
	float lz = (max_depth - position.z) / (max_depth + position.z);
	float ratio = pow(lz, 4.0);
	gl_Position = vec4(
		position.x * ratio * 2.8,
		- position.y * ratio * 2.0,
		lz,
		1.0);
	float distance = position.x * position.x
			+ position.y * position.y
			+ position.z * position.z - 0.25;
	vColor = vec4(base_color.rgb / pow(1.0 + distance, turbidity), 1.0);
}
`;
};
