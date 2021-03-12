// [COMBO] {"material":"Position","combo":"SHAPE","type":"options","default":0,"options":{"Bottom":0,"Top":1,"Left":2,"Right":3,"Stereo - Horizontal":4,"Stereo - Vertical":5,"Circle - Inner":6,"Circle - Outer":7}}
// [COMBO] {"material":"Transparency","combo":"TRANSPARENCY","type":"options","default":2,"options":{"Preserve original":0,"Replace original":1,"Add to original":2,"Subtract from original":3,"Intersect original":4,"Remove all transparency":5}}
// [COMBO] {"material":"Frequency Resolution","combo":"RESOLUTION","type":"options","default":32,"options":{"16":16,"32":32,"64":64}}
// [COMBO] {"material":"ui_editor_properties_blend_mode","combo":"BLENDMODE","type":"imageblending","default":0}
// [COMBO] {"material":"Simulate audio (preview)","combo":"AUDIO_SIMULATE","type":"options","default":0}
// [DISABLED COMBO] {"material":"Smooth curve anti-aliasing","combo":"SMOOTH_CURVE_AA","type":"options","default":0}
// [COMBO] {"material":"Smooth curve","combo":"SMOOTH_CURVE","type":"options","default":0}

#include "common.h"
#include "common_blending.h"



varying vec2 v_TexCoord;

uniform float u_BarCount; // {"material":"Bar Count","default":16,"range":[1, 200]}
uniform vec2 u_BarBounds; // {"material":"Bar Bounds","default":"0 1"}
uniform vec3 u_BarColor; // {"default":"1 1 1","material":"Bar Color","type":"color"}
uniform float u_BarOpacity; // {"default":"1","material":"ui_editor_properties_opacity"}
uniform float u_BarSpacing; // {"default":"0","material":"Bar Spacing"}


uniform sampler2D g_Texture0; // {"material":"previous","label":"Prev","hidden":true}
uniform vec2 g_TexelSizeHalf;

#if AUDIO_SIMULATE == 1
uniform float g_Time;
uniform sampler2D g_Texture1; // {"material":"noise","default":"util/noise","hidden":false}
#endif

#if AUDIO_SIMULATE == 0
#if RESOLUTION == 16
uniform float g_AudioSpectrum16Left[16];
uniform float g_AudioSpectrum16Right[16];
#endif

#if RESOLUTION == 32
uniform float g_AudioSpectrum32Left[32];
uniform float g_AudioSpectrum32Right[32];
#endif

#if RESOLUTION == 64
uniform float g_AudioSpectrum64Left[64];
uniform float g_AudioSpectrum64Right[64];
#endif
#endif



// Position
#define BOTTOM 0
#define TOP 1
#define LEFT 2
#define RIGHT 3
#define STEREO_H 4
#define STEREO_V 5
#define CIRCLE_INNER 6
#define CIRCLE_OUTER 7


// Transparency
#define PRESERVE 0
#define REPLACE 1
#define ADD 2
#define SUBTRACT 3
#define INTERSECT 4
#define REMOVE 5



#ifdef HLSL
	#define fract frac
#endif









// The function samplePixel() returns 1 if the given coordinate is inside the bars, or 0 if it is outside.
#if AUDIO_SIMULATE == 0
#if RESOLUTION == 16
int samplePixel(vec2 coords, float u_AudioSpectrumLeft[16], float u_AudioSpectrumRight[16]) {
#endif

#if RESOLUTION == 32
int samplePixel(vec2 coords, float u_AudioSpectrumLeft[32], float u_AudioSpectrumRight[32]) {
#endif

#if RESOLUTION == 64
int samplePixel(vec2 coords, float u_AudioSpectrumLeft[64], float u_AudioSpectrumRight[64]) {
#endif
#else
	int samplePixel(vec2 coords, float u_AudioSpectrumLeft, float u_AudioSpectrumRight) {
#endif


#if SMOOTH_CURVE == 1
	float frequency = coords.x * RESOLUTION;
#else
	// Get the frequency for this pixel
	float barDist = abs(frac(coords.x * u_BarCount) * 2 - 1);
	float frequency = floor(coords.x * u_BarCount) / u_BarCount * RESOLUTION;
#endif
	uint barFreq1 = frequency % RESOLUTION;
	uint barFreq2 = (barFreq1 + 1) % RESOLUTION;
	
	// Get the height of the bar
#if SHAPE == STEREO_H || SHAPE == STEREO_V

// STEREO

#if AUDIO_SIMULATE == 1
	float yL = frac(g_Time * 0.181);
	float yR = frac(yL + 0.5);
	float x1 = barFreq1 / 128.0;
	float x2 = barFreq2 / 128.0;
	float barVolume1L = texSample2D(g_Texture1, vec2(x1, yL));
	float barVolume2L = texSample2D(g_Texture1, vec2(x2, yL));
	float barVolume1R = texSample2D(g_Texture1, vec2(x1, yR));
	float barVolume2R = texSample2D(g_Texture1, vec2(x2, yR));
#else
	float barVolume1L = u_AudioSpectrumLeft[barFreq1];
	float barVolume2L = u_AudioSpectrumLeft[barFreq2];
	float barVolume1R = u_AudioSpectrumRight[barFreq1];
	float barVolume2R = u_AudioSpectrumRight[barFreq2];
#endif
	
	// bar = 1 if this pixel is inside a bar, 0 if outside
	int bar = step(coords.y, 0.5 * lerp(u_BarBounds.x, u_BarBounds.y, lerp(barVolume1L, barVolume2L, smoothstep(0, 1, fract(frequency)))));
	bar = max(bar, step(1 - coords.y, 0.5 * lerp(u_BarBounds.x, u_BarBounds.y, lerp(barVolume1R, barVolume2R, smoothstep(0, 1, fract(frequency))))));

#else

 // NON-STEREO

#if AUDIO_SIMULATE == 1
	float x1 = barFreq1 / 128.0;
	float x2 = barFreq2 / 128.0;
	float y = g_Time * 0.181;
	float barVolume1 = texSample2D(g_Texture1, vec2(x1, y));
	float barVolume2 = texSample2D(g_Texture1, vec2(x2, y));
#else
	float barVolume1 = (u_AudioSpectrumLeft[barFreq1] + u_AudioSpectrumRight[barFreq1]) * 0.5;
	float barVolume2 = (u_AudioSpectrumLeft[barFreq2] + u_AudioSpectrumRight[barFreq2]) * 0.5;
#endif

	// bar = 1 if this pixel is inside a bar, 0 if outside
	int bar = step(1 - coords.y, lerp(u_BarBounds.x, u_BarBounds.y, lerp(barVolume1, barVolume2, smoothstep(0, 1, fract(frequency)))));

#endif


#if SMOOTH_CURVE != 1
	// Bar spacing
	bar *= step(barDist, 1 - u_BarSpacing);
#endif

	return bar;
}











void main() {
	
#if AUDIO_SIMULATE == 0
#if RESOLUTION == 16
	float u_AudioSpectrumLeft[] = g_AudioSpectrum16Left;
	float u_AudioSpectrumRight[] = g_AudioSpectrum16Right;
#endif

#if RESOLUTION == 32
	float u_AudioSpectrumLeft[] = g_AudioSpectrum32Left;
	float u_AudioSpectrumRight[] = g_AudioSpectrum32Right;
#endif

#if RESOLUTION == 64
	float u_AudioSpectrumLeft[] = g_AudioSpectrum64Left;
	float u_AudioSpectrumRight[] = g_AudioSpectrum64Right;
#endif
#else
	float u_AudioSpectrumLeft = 0.0;
	float u_AudioSpectrumRight = 0.0;
#endif



	// Map the coordinates to the selected shape
#if SHAPE == BOTTOM
	vec2 shapeCoord = v_TexCoord;
#endif

#if SHAPE == TOP
	vec2 shapeCoord = v_TexCoord;
	shapeCoord.y = 1 - shapeCoord.y;
#endif

#if SHAPE == LEFT
	vec2 shapeCoord = v_TexCoord.yx;
	shapeCoord.y = 1 - shapeCoord.y;
#endif

#if SHAPE == RIGHT
	vec2 shapeCoord = v_TexCoord.yx;
#endif

#if SHAPE == STEREO_H
	vec2 shapeCoord = v_TexCoord.yx;
#endif

#if SHAPE == STEREO_V
	vec2 shapeCoord = v_TexCoord.xy;
#endif

#if SHAPE == CIRCLE_INNER || SHAPE == CIRCLE_OUTER
	vec2 circleCoord = (v_TexCoord - 0.5) * 2;
	vec2 shapeCoord;
	shapeCoord.x = (atan2(circleCoord.y, circleCoord.x) + M_PI) / M_PI_2;
	shapeCoord.y = sqrt(circleCoord.x * circleCoord.x + circleCoord.y * circleCoord.y);
#if SHAPE == CIRCLE_INNER
	shapeCoord.y = 1.0 - shapeCoord.y;
#endif
#endif

	float bar = samplePixel(shapeCoord, u_AudioSpectrumLeft, u_AudioSpectrumRight);
#if SMOOTH_CURVE == 1
#if SMOOTH_CURVE_AA == 1
	float sample = 0;
	float sampleCount = 0;
	// for (int x = -1; x <= 1; ++x) {
	// 	for (int y = -1; y <= 1; ++y) {
	// 		sample += samplePixel(shapeCoord + vec2(x * g_TexelSizeHalf.x, y * g_TexelSizeHalf.y), u_AudioSpectrumLeft, u_AudioSpectrumRight);
	// 		++sampleCount;
	// 	}
	// }
	vec2 nudgeRight = vec2(g_TexelSizeHalf.x, 0.0);
	vec2 nudgeUp = vec2(0.0, g_TexelSizeHalf.y);
	sample += samplePixel(shapeCoord + nudgeRight, u_AudioSpectrumLeft, u_AudioSpectrumRight);
	sample += samplePixel(shapeCoord - nudgeRight, u_AudioSpectrumLeft, u_AudioSpectrumRight);
	sample += samplePixel(shapeCoord + nudgeUp, u_AudioSpectrumLeft, u_AudioSpectrumRight);
	sample += samplePixel(shapeCoord - nudgeUp, u_AudioSpectrumLeft, u_AudioSpectrumRight);
	sampleCount = 4;

	// Don't apply AA to first or last pixel, to avoid artifacts, especially on circles.
	bool isFirstPixel = step(shapeCoord.x - g_TexelSizeHalf.x, 0);
	bool isLastPixel = step(1, shapeCoord.x + g_TexelSizeHalf);
	bar += sample * !isFirstPixel * !isLastPixel;
	bar /= sampleCount * !isFirstPixel * !isLastPixel + 1;
#endif
#endif

	vec3 finalColor = bar * u_BarColor;
	
	// Get the existing pixel color
	vec4 scene = texSample2D(g_Texture0, v_TexCoord);

	finalColor = ApplyBlending(BLENDMODE, scene.rgb, finalColor.rgb, bar * u_BarOpacity);



//TODO: Replace else if with elif when supported
#if TRANSPARENCY == PRESERVE
	float alpha = scene.a;
#else
#if TRANSPARENCY == REPLACE
	float alpha = bar * u_BarOpacity;
#else
#if TRANSPARENCY == ADD
	float alpha = max(scene.a, bar * u_BarOpacity);
#else
#if TRANSPARENCY == SUBTRACT
	float alpha = max(0, scene.a - bar * u_BarOpacity);
#else
#if TRANSPARENCY == INTERSECT
	float alpha = scene.a * bar * u_BarOpacity;
#else
#if TRANSPARENCY == REMOVE
	float alpha = u_BarOpacity;
#endif
#endif
#endif
#endif
#endif
#endif



	gl_FragColor = vec4(finalColor, alpha);
}
