

varying vec4 v_TexCoord;

void main() {
	gl_FragColor = vec4(v_TexCoord.x, v_TexCoord.y, 0, 1);
}
