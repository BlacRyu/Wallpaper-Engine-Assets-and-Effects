
#include "common_composite.h"



varying vec2 v_TexCoord;

uniform sampler2D g_Texture0; // {"material":"framebuffer","label":"ui_editor_properties_framebuffer","hidden":true}

uniform vec4 g_Texture0Resolution;

void main() {

	vec2 newCoords = v_TexCoord.xy;

	vec4 passthrough = texSample2D(g_Texture0, newCoords);
	
	gl_FragColor = passthrough;
	gl_FragColor.a = 1;
	// gl_FragColor = vec4(v_TexCoord.x, v_TexCoord.y, 0, 1);
	
}
