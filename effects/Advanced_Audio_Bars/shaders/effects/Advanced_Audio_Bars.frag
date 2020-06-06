
//uniform sampler2D g_Texture0; // {"material":"framebuffer","label":"ui_editor_properties_framebuffer","hidden":true}

varying vec4 v_TexCoord;

void main() {
	//vec4 albedo = texSample2D(g_Texture0, v_TexCoord.xy);
	gl_FragColor = vec4(v_TexCoord.x, v_TexCoord.y, 0, 1);
}
