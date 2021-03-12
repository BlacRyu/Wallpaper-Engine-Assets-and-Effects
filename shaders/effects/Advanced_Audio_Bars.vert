attribute vec3 a_Position;
attribute vec2 a_TexCoord;

varying vec2 v_TexCoord;

uniform vec4 g_Texture0Resolution;

void main() {
	gl_Position = vec4(a_Position, 1.0);

	v_TexCoord = a_TexCoord;
	
#ifdef HLSL_SM30
	vec2 offsets = 0.5 / g_Texture0Resolution.xy;
	v_TexCoord.xy += offsets;
#endif
}
