// [COMBO] {"material":"ui_editor_properties_blend_mode","combo":"BLENDMODE","type":"imageblending","default":0}
// [COMBO] {"material":"Transparency","combo":"TRANSPARENCY","type":"options","default":2,"options":{"Preserve original":0,"Replace original":1,"Add to original":2,"Subtract from original":3,"Intersect original":4,"Fully opaque":5}}

#include "common.h"
#include "common_blending.h"

uniform vec3 u_Color; // {"default":"1 1 1","material":"Color","type":"color"}
uniform float u_Opacity; // {"default":"1","material":"ui_editor_properties_opacity"}
uniform float u_Fuzziness; // {"default":"0.001","material":"Fuzziness","range":[0.001,0.1]}

uniform sampler2D g_Texture0; // {"material":"framebuffer","label":"ui_editor_properties_framebuffer","hidden":true}
uniform vec4 g_Texture0Resolution;
uniform float g_Time;
uniform vec2 g_PointerPosition;

varying vec4 v_TexCoord;


// Transparency
#define PRESERVE 0
#define REPLACE 1
#define ADD 2
#define SUBTRACT 3
#define INTERSECT 4
#define REMOVE 5


// The MIT License
// Copyright © 2020 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// Signed distance to a disk

// List of some other 2D distances: https://www.shadertoy.com/playlist/MXdSRf
//
// and www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm

float opUnion( float d1, float d2 ) { return min(d1,d2); }

float opSubtraction( float d1, float d2 ) { return max(-d1,d2); }

float opIntersection( float d1, float d2 ) { return max(d1,d2); }


float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); 
}

float opSmoothSubtraction( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h); 
}

float opSmoothIntersection( float d1, float d2, float k ) { 
    float h = clamp( 0.5 - 0.5*(d2-d1)/k, 0.0, 1.0 ); 
    return mix( d2, d1, h ) + k*h*(1.0-h); 
}


float sdCircle( in vec2 pixel, in float radius ) 
{
    return length(pixel) - radius;
}

float sdSegment( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}



void main()
{
    vec2 mousePos = g_PointerPosition;
    
    //vec2 p = (2.0*(v_TexCoord.xy- mousePos.xy))/g_Texture0Resolution.y;

	//float d = sdCircle(pixel, 0.5);

    
    // Distance from the nearest object (negative if inside)
    float dist = 999999.9;
    
	vec2 center = v_TexCoord.xy - CAST2(0.5);
    float radius = 0.125;
    float centerCircle = sdCircle(center, radius);
    
    center = v_TexCoord.xy - mousePos.xy;
    radius = 0.25;
    float cursorDonut = sdCircle(center, radius);
    //center += vec2(-0.1, -0.1);
    radius = 0.15;
    cursorDonut = opSubtraction(sdCircle(center, radius), cursorDonut);
    
    // for (float i = 0; i < 64; ++i) {
	// 	for (float j = 0; j < 64; ++j){
	// 		vec2 center = v_TexCoord.xy - vec2(1.0/130.0 + i / 130.0, 1.0/130.0 + j / 130.0);
	// 		dist = opUnion(dist, sdCircle(center, 1.0 / 300.0));
	// 		//dist = opUnion(dist, centerCircle);
	// 		//dist = opUnion(dist, cursorDonut);
	// 	}
	// }
	dist = opUnion(dist, centerCircle);
	dist = opSmoothUnion(dist, cursorDonut, 0.1);
    
	vec3 finalColor = u_Color;

    float pixel = smoothstep(u_Fuzziness,0.0,dist);
	
	// Get the existing pixel color
	vec4 previousColor = texSample2D(g_Texture0, v_TexCoord);

	// Apply blend mode
	finalColor = ApplyBlending(BLENDMODE, lerp(finalColor.rgb, previousColor.rgb, previousColor.a), finalColor.rgb, pixel * u_Opacity);

#if TRANSPARENCY == PRESERVE
	float alpha = previousColor.a;
#endif
#if TRANSPARENCY == REPLACE
	float alpha = pixel * u_Opacity;
#endif
#if TRANSPARENCY == ADD
	float alpha = max(previousColor.a, pixel * u_Opacity);
#endif
#if TRANSPARENCY == SUBTRACT
	float alpha = max(0, previousColor.a - pixel * u_Opacity);
#endif
#if TRANSPARENCY == INTERSECT
	float alpha = previousColor.a * pixel * u_Opacity;
#endif
#if TRANSPARENCY == REMOVE
	float alpha = u_Opacity;
#endif

	gl_FragColor = vec4(finalColor,alpha);
}