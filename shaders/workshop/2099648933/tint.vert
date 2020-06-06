
#include "common_vertex.h"

uniform mat4 g_ModelViewProjectionMatrix;
uniform float g_Time;

uniform float g_ScrollX; // {"material":"N/A ‏‏‎ ","default":0,"range":[0,0]}
uniform float g_ScrollY; // {"material":"N/A","default":0,"range":[0,0]}

attribute vec3 a_Position;
attribute vec2 a_TexCoord;

varying vec2 v_TexCoord;

#if MULTI
uniform float g_Scroll2X; // {"material":"Scroll 2 X","default":0,"range":[-2,2]}
uniform float g_Scroll2Y; // {"material":"Scroll 2 Y","default":0,"range":[-2,2]}

varying vec2 v_TexCoord2;
#endif

void main() {
	gl_Position = mul(vec4(a_Position, 1.0), g_ModelViewProjectionMatrix);
	vec2 scroll = vec2(g_ScrollX, g_ScrollY);
	scroll = sign(scroll) * pow(vec2(g_ScrollX, g_ScrollY), CAST2(2.0));
	v_TexCoord = a_TexCoord + g_Time * scroll;
	
#if MULTI
	vec2 scroll2 = vec2(g_Scroll2X, g_Scroll2Y);
	scroll2 = sign(scroll2) * pow(vec2(g_Scroll2X, g_Scroll2Y), CAST2(2.0));
	v_TexCoord2 = a_TexCoord + g_Time * scroll2;
#endif
}
