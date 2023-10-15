precision mediump float;

attribute vec3 offsetPos;
varying vec3 viewPosition;
uniform float time;

mat2 rotate(float rad){
    return mat2(cos(rad), sin(rad), -sin(rad), cos(rad));
}

void main() {
    vec3 pos = position;
    pos.xz *= rotate(time);
    pos.xy *= rotate(time);

    vec4 mvPosition = modelViewMatrix * vec4(pos + offsetPos, 1.0);
    viewPosition = mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
//    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//    gl_Position = vec4(position, 1.0);
}