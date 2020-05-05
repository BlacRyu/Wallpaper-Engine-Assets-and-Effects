void main() {

// These ones are OK:

// #if 1 // TRUE
// 	gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
// #else
// 	gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
// #endif

// #if 0 // FALSE
// 	gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
// #else
// 	gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
// #endif

// #if false // FALSE
// 	gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
// #else
// 	gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
// #endif

// #if true == true // TRUE
// 	gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
// #else
// 	gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
// #endif

// #if 0 == 1 // FALSE
// 	gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
// #else
// 	gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
// #endif

// #if 1 || 0 // TRUE
// 	gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
// #else
// 	gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
// #endif

// #if undefined && 1 // FALSE
// 	gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
// #else
// 	gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
// #endif





// These ones are NOT okay:

// #if true // FALSE
// 	gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
// #else
// 	gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
// #endif

// #if true || true // FALSE
// 	gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
// #else
// 	gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
// #endif

// #if false == true // TRUE
// 	gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
// #else
// 	gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
// #endif

// #if 0 || 1 // NEITHER!
// 	gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
// #else
// 	gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
// #endif

// #if false || true // FALSE
// 	gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
// #else
// 	gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
// #endif

// #if undefined || 1 // NEITHER!
// 	gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
// #else
// 	gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
// #endif

}
