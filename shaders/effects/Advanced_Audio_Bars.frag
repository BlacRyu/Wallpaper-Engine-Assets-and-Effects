// [COMBO] {"material":"Position","combo":"SHAPE","type":"options","default":0,"options":{"Bottom":0,"Top":1,"Left":2,"Right":3,"Stereo - Horizontal":4,"Stereo - Vertical":5,"Circle - Inner":6,"Circle - Outer":7}}
// [COMBO] {"material":"Transparency","combo":"TRANSPARENCY","type":"options","default":2,"options":{"Preserve original":0,"Replace original":1,"Add to original":2,"Intersect original":3,"Remove all transparency":4}}
// [COMBO] {"material":"Frequency Resolution","combo":"RESOLUTION","type":"options","default":32,"options":{"16":16,"32":32,"64":64}}
// [COMBO] {"material":"ui_editor_properties_blend_mode","combo":"BLENDMODE","type":"imageblending","default":0}

#include "common.h"
#include "common_blending.h"



varying vec2 v_TexCoord;

uniform float g_BarCount; // {"material":"Bar count","default":16,"range":[1, 1000]}
uniform float g_Offset; // {"material":"Offset","default":0,"range":[-1, 1]}
uniform vec3 g_BarColor; // {"default":"1 1 1","material":"Color","type":"color"}

uniform sampler2D g_Texture0; // {"material":"prev","label":"Prev","hidden":false}




//TODO: Replace all "#if RESOLUTION == ..." blocks with token concatenation when supported
// #define g_AudioSpectrumLeft g_AudioSpectrum ## RESOLUTION ## Left
// #define g_AudioSpectrumRight g_AudioSpectrum ## RESOLUTION ## Right

#if RESOLUTION == 16
// #define g_AudioSpectrumLeft g_AudioSpectrum16Left
// #define g_AudioSpectrumRight g_AudioSpectrum16Right
uniform float g_AudioSpectrum16Left[16];
uniform float g_AudioSpectrum16Right[16];
#endif

#if RESOLUTION == 32
// #define g_AudioSpectrumLeft g_AudioSpectrum32Left
// #define g_AudioSpectrumRight g_AudioSpectrum32Right
uniform float g_AudioSpectrum32Left[32];
uniform float g_AudioSpectrum32Right[32];
#endif

#if RESOLUTION == 64
// #define g_AudioSpectrumLeft g_AudioSpectrum64Left
// #define g_AudioSpectrumRight g_AudioSpectrum64Right
uniform float g_AudioSpectrum64Left[64];
uniform float g_AudioSpectrum64Right[64];
#endif

// uniform float g_AudioSpectrumLeft[RESOLUTION];
// uniform float g_AudioSpectrumRight[RESOLUTION];



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
#define INTERSECT 3
#define REMOVE 4



#ifdef HLSL
	#define fract frac
#endif



void main() {
	vec4 scene = texSample2D(g_Texture0, v_TexCoord);
	
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

//TODO: Move duplicate circle code into a "#if SHAPE == CIRCLE_INNER || SHAPE == CIRCLE_OUTER" when logical operators are supported
#if SHAPE == CIRCLE_INNER
	vec2 circleCoord = (v_TexCoord - 0.5) * 2;
	vec2 shapeCoord;
	shapeCoord.x = (atan2(circleCoord.y, circleCoord.x) + M_PI) / M_PI_2;
	shapeCoord.y = 1.0 - sqrt(circleCoord.x * circleCoord.x + circleCoord.y * circleCoord.y);
#endif

#if SHAPE == CIRCLE_OUTER
	vec2 circleCoord = (v_TexCoord - 0.5) * 2;
	vec2 shapeCoord;
	shapeCoord.x = (atan2(circleCoord.y, circleCoord.x) + M_PI) / M_PI_2;
	shapeCoord.y = sqrt(circleCoord.x * circleCoord.x + circleCoord.y * circleCoord.y);
#endif




	float frequency = floor(shapeCoord.x * g_BarCount) / g_BarCount * RESOLUTION + 0.5;
	uint barFreq1 = clamp(int(frequency), 0, RESOLUTION - 1);
	uint barFreq2 = (barFreq1 + 1) % RESOLUTION;


	

#define BARSTEREO	int bar = step(shapeCoord.y, 0.5 * (g_Offset + lerp(barVolume1L, barVolume2L, smoothstep(0, 1, fract(frequency))))); \
	bar += step(1 - shapeCoord.y, 0.5 * (g_Offset + lerp(barVolume1R, barVolume2R, smoothstep(0, 1, fract(frequency)))));

#if SHAPE == STEREO_H

#if RESOLUTION == 16
	float barVolume1L = g_AudioSpectrum16Left[barFreq1];
	float barVolume2L = g_AudioSpectrum16Left[barFreq2];
	float barVolume1R = g_AudioSpectrum16Right[barFreq1];
	float barVolume2R = g_AudioSpectrum16Right[barFreq2];
#endif

#if RESOLUTION == 32
	float barVolume1L = g_AudioSpectrum32Left[barFreq1];
	float barVolume2L = g_AudioSpectrum32Left[barFreq2];
	float barVolume1R = g_AudioSpectrum32Right[barFreq1];
	float barVolume2R = g_AudioSpectrum32Right[barFreq2];
#endif

#if RESOLUTION == 64
	float barVolume1L = g_AudioSpectrum64Left[barFreq1];
	float barVolume2L = g_AudioSpectrum64Left[barFreq2];
	float barVolume1R = g_AudioSpectrum64Right[barFreq1];
	float barVolume2R = g_AudioSpectrum64Right[barFreq2];
#endif
	
	BARSTEREO

#else
#if SHAPE == STEREO_V

#if RESOLUTION == 16
	float barVolume1L = g_AudioSpectrum16Left[barFreq1];
	float barVolume2L = g_AudioSpectrum16Left[barFreq2];
	float barVolume1R = g_AudioSpectrum16Right[barFreq1];
	float barVolume2R = g_AudioSpectrum16Right[barFreq2];
#endif

#if RESOLUTION == 32
	float barVolume1L = g_AudioSpectrum32Left[barFreq1];
	float barVolume2L = g_AudioSpectrum32Left[barFreq2];
	float barVolume1R = g_AudioSpectrum32Right[barFreq1];
	float barVolume2R = g_AudioSpectrum32Right[barFreq2];
#endif

#if RESOLUTION == 64
	float barVolume1L = g_AudioSpectrum64Left[barFreq1];
	float barVolume2L = g_AudioSpectrum64Left[barFreq2];
	float barVolume1R = g_AudioSpectrum64Right[barFreq1];
	float barVolume2R = g_AudioSpectrum64Right[barFreq2];
#endif

	BARSTEREO

#else // NON-STEREO

	// float barVolume1 = (g_AudioSpectrumLeft[barFreq1] + g_AudioSpectrumRight[barFreq1]) * 0.5;
	// float barVolume2 = (g_AudioSpectrumLeft[barFreq2] + g_AudioSpectrumRight[barFreq2]) * 0.5;

#if RESOLUTION == 16
	float barVolume1 = (g_AudioSpectrum16Left[barFreq1] + g_AudioSpectrum16Right[barFreq1]) * 0.5;
	float barVolume2 = (g_AudioSpectrum16Left[barFreq2] + g_AudioSpectrum16Right[barFreq2]) * 0.5;
#endif

#if RESOLUTION == 32
	float barVolume1 = (g_AudioSpectrum32Left[barFreq1] + g_AudioSpectrum32Right[barFreq1]) * 0.5;
	float barVolume2 = (g_AudioSpectrum32Left[barFreq2] + g_AudioSpectrum32Right[barFreq2]) * 0.5;
#endif

#if RESOLUTION == 64
	float barVolume1 = (g_AudioSpectrum64Left[barFreq1] + g_AudioSpectrum64Right[barFreq1]) * 0.5;
	float barVolume2 = (g_AudioSpectrum64Left[barFreq2] + g_AudioSpectrum64Right[barFreq2]) * 0.5;
#endif

	int bar = step(1 - shapeCoord.y, g_Offset + lerp(barVolume1, barVolume2, smoothstep(0, 1, fract(frequency))));

#endif
#endif



	vec3 finalColor = bar * g_BarColor;
	finalColor = ApplyBlending(BLENDMODE, scene.rgb, finalColor.rgb, bar);


//TODO: Replace else if with elif when supported
#if TRANSPARENCY == PRESERVE
	float alpha = scene.a;
#else
#if TRANSPARENCY == REPLACE
	float alpha = bar;
#else
#if TRANSPARENCY == ADD
	float alpha = max(scene.a, bar);
#else
#if TRANSPARENCY == SUBTRACT
	float alpha = max(0, scene.a - bar);
#else
#if TRANSPARENCY == INTERSECT
	float alpha = scene.a * bar;
#else
#if TRANSPARENCY == REMOVE
	float alpha = 1;
#endif
#endif
#endif
#endif
#endif
#endif

	gl_FragColor = vec4(finalColor, alpha);
	
}
