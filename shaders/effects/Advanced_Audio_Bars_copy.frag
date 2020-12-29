
#include "common.h"
#include "common_blending.h"



varying vec2 v_TexCoord;

uniform sampler2D g_Texture0; // {"material":"framebuffer","label":"ui_editor_properties_framebuffer","hidden":true}


void main() {

	vec4 passthrough = texSample2D(g_Texture0, v_TexCoord);
	
	gl_FragColor = passthrough;
	gl_FragColor.a = 1;
	// gl_FragColor = vec4(v_TexCoord.x, v_TexCoord.y, 0, 1);
	
}