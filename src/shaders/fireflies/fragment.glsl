void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float amount = 0.1;
  float strength = (amount / distanceToCenter - (amount * 2.0));
  gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
}