
uniform mat4 g_ModelViewProjectionMatrix;
uniform vec4 g_Texture1Resolution;

#if OPACITYMASK == 1
uniform vec4 g_Texture2Resolution;

varying vec2 v_TexCoordOpacity;
#endif

attribute vec3 a_Position;
attribute vec2 a_TexCoord;

varying vec4 v_TexCoord;

uniform vec2 g_Scale; // {"default":"1 1","label":"UV Scale","linked":true,"material":"scale","range":[0.01,10.0]}

uniform vec2 g_Center; // {"default":"0 0","label":"Center","material":"center","range":[0.0,1.0]}


void main() {
	gl_Position = mul(vec4(a_Position, 1.0), g_ModelViewProjectionMatrix);
	v_TexCoord.xy = a_TexCoord;
	v_TexCoord.zw = (v_TexCoord.xy - g_Center) * g_Scale + g_Center;
	v_TexCoord.zw = vec2(v_TexCoord.z * g_Texture1Resolution.z / g_Texture1Resolution.x,
						v_TexCoord.w * g_Texture1Resolution.w / g_Texture1Resolution.y);
						
#if OPACITYMASK == 1
	v_TexCoordOpacity = vec2(v_TexCoord.x * g_Texture2Resolution.z / g_Texture2Resolution.x,
						v_TexCoord.y * g_Texture2Resolution.w / g_Texture2Resolution.y);
#endif
}
