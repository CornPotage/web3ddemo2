precision mediump float;
varying vec3 viewPosition;
uniform vec3 lightDirection;

// フラットシェーディング
//
// https://qiita.com/UsagiLabo/items/4ab204708cc5eaee883a
// https://stackoverflow.com/questions/33094496/three-js-shadermaterial-flatshading
// https://spphire9.wordpress.com/2013/03/18/webgl%E3%81%A7%E3%83%95%E3%83%A9%E3%83%83%E3%83%88%E3%82%B7%E3%82%A7%E3%83%BC%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0/
// https://wgld.org/d/webgl/w087.html


// https://qiita.com/aa_debdeb/items/870e52499dc94a2942c3

vec3 normalVector(vec3 pos) {
    vec3 dx = dFdx( pos );
    vec3 dy = dFdy( pos );
    return normalize( cross( dx, dy ) );
}

void main() {
    vec3 normalVector = normalVector(viewPosition);

    vec3 light = normalize(lightDirection);
    float diff = clamp(dot(normalVector, light), 0.1, 1.0);

    vec3 baseColor = vec3(1.0, 0.0, 0.0);
    gl_FragColor = vec4(baseColor.rgb * diff, 1.0);
}
