uniform sampler2D g_Texture0; // {"material":"framebuffer","label":"ui_editor_properties_framebuffer","hidden":true}

varying vec2 v_TexCoord;

uniform vec2 g_Texture0Resolution;

#define po212133bevel 0.010000000
#define po212136amount 1.980000000
#define po212134r 0.400000000
#define po212134cx 0.000000000
#define po212134cy 0.000000000
#define po212135w 0.500000000
#define po212135h 0.200000000
#define po212135cx 0.000000000
#define po212135cy 0.000000000

void main() {
	float minSize = min(g_Texture0Resolution.x, g_Texture0Resolution.y);
	vec2 UV = (v_TexCoord * 2.0 - 0.5) * CAST2(g_Texture0Resolution)/minSize;//vec2(0.0, 1.0) + vec2(1.0, -1.0) * (v_TexCoord - 0.5 * (g_Texture0Resolution.xy - CAST2(minSize))/minSize);//vec2(0.0, 1.0) + vec2(1.0, -1.0) * (v_TexCoord - 0.5 * (g_Texture0Resolution.xy - CAST2(minSize)))/minSize;
	float o21213401sdf2d = length((UV)-vec2(po212134cx+0.5, po212134cy+0.5))-po212134r;
	vec2 o2121350d = abs((UV)-vec2(po212135cx+0.5, po212135cy+0.5))-vec2(po212135w, po212135h);
	float o21213501sdf2d = length(max(o2121350d,CAST2(0)))+min(max(o2121350d.x,o2121350d.y),0.0);
	//float o21213401sdf2d = 0.1;
	//float o21213501sdf2d= 0.6;
	float o21213601sdf2d = mix(o21213401sdf2d, o21213501sdf2d, po212136amount);
	//float o21213601sdf2d = mix(0.0, 1.0, po212136amount);
	//float o21213601sdf2d = po212136amount;
	float o21213301f = clamp(-o21213601sdf2d/max(po212133bevel, 0.00001), 0.0, 1.0);
	gl_FragColor = vec4(CAST3(o21213301f), 1.0);
}
