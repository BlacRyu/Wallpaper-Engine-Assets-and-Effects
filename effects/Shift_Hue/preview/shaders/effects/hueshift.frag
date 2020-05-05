
// [COMBO] {"material":"ui_editor_properties_blend_mode","combo":"BLENDMODE","type":"imageblending","default":0}

#include "common_blending.h"

const float PERCENT_TO_RAD = 0.0314159265358979323846264338328;

varying vec4 v_TexCoord;

uniform sampler2D g_Texture0; // {"material":"framebuffer", "label":"ui_editor_properties_framebuffer", "hidden":true}
uniform sampler2D g_Texture1; // {"material":"mask", "label":"ui_editor_properties_opacity_mask","mode":"opacitymask","default":"util/white","combo":"MASK","paintdefaultcolor":"0 0 0 1"}

uniform float g_BlendAlpha; // {"material":"alpha", "label":"ui_editor_properties_alpha","default":1,"range":[0,1]}
uniform float g_HueShift; // {"material":"shift", "label":"Hue Shift", "default":50,"range":[-100,100]}


// Copied from https://gist.github.com/mairod/a75e7b44f68110e1576d77419d608786
vec3 hueShift(vec3 color, float hueAdjust) {
    const vec3  kRGBToYPrime = vec3 (0.299, 0.587, 0.114);
    const vec3  kRGBToI      = vec3 (0.596, -0.275, -0.321);
    const vec3  kRGBToQ      = vec3 (0.212, -0.523, 0.311);

    const vec3  kYIQToR     = vec3 (1.0, 0.956, 0.621);
    const vec3  kYIQToG     = vec3 (1.0, -0.272, -0.647);
    const vec3  kYIQToB     = vec3 (1.0, -1.107, 1.704);

    float   YPrime  = dot (color, kRGBToYPrime);
    float   I       = dot (color, kRGBToI);
    float   Q       = dot (color, kRGBToQ);
    float   hue     = atan (Q / I);
    float   chroma  = sqrt (I * I + Q * Q);

    hue += hueAdjust;

    Q = chroma * sin (hue);
    I = chroma * cos (hue);

    vec3    yIQ   = vec3 (YPrime, I, Q);

    return vec3( dot (yIQ, kYIQToR), dot (yIQ, kYIQToG), dot (yIQ, kYIQToB) );
}


void main() {
    vec4 albedo = texSample2D(g_Texture0, v_TexCoord.xy);
    float mask = g_BlendAlpha;
    
#if MASK
    mask = texSample2D(g_Texture1, v_TexCoord.zw).r;
#endif
    vec3 newAlbedo = hueShift(albedo.rgb, g_HueShift * PERCENT_TO_RAD);
    albedo.rgb = ApplyBlending(BLENDMODE, albedo.rgb, newAlbedo, mask);
    
    gl_FragColor = albedo;
}
