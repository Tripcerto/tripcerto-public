/* The hero's band, drawn for a still image.

   The GLSL is lifted unchanged from src/components/ui/gradient-mesh.tsx so a
   social card carries the same surface as the page it links to. What differs
   is the seed: the hero rolls a new band on every load, and a file checked
   into public/ must come out the same every time it is generated, so the
   seed, lean, angle, warp and phase are ARGUMENTS here, and card.html passes
   fixed ones.

   One draw, no loop, no observers: the canvas is sized before the context is
   made and the caller reads the pixels out once. */

const MAX_STOPS = 6

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])

const VERTEX_SHADER = `
precision highp float;

attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec3 stops[${MAX_STOPS}];
uniform int stopCount;
uniform float angle;
uniform float warp;
uniform float scale;
uniform vec2 seed;
uniform float bias;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 ramp(float t) {
  float clamped = clamp(t, 0.0, 0.9999);
  float scaled = clamped * float(stopCount - 1);
  int idx = int(floor(scaled));
  float f = fract(scaled);
  vec3 a = stops[0];
  vec3 b = stops[0];
  for (int i = 0; i < ${MAX_STOPS}; ++i) {
    if (i == idx) a = stops[i];
    if (i == idx + 1) b = stops[i];
  }
  if (idx + 1 >= stopCount) b = a;
  return mix(a, b, smoothstep(0.0, 1.0, f));
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 p = gl_FragCoord.xy / max(iResolution.x, iResolution.y) * scale + seed;
  float t = iTime;

  vec2 dir = vec2(cos(angle), sin(angle));
  float along = dot(vec2(uv.x, 1.0 - uv.y) - 0.5, dir) + 0.5;

  float n1 = snoise(p * 0.9 + vec2(t * 0.045, -t * 0.03));
  float n2 = snoise(p * 1.8 + vec2(-t * 0.02, t * 0.05) + n1 * 0.6);
  float fold = snoise(p * 0.6 + vec2(t * 0.025, t * 0.015) + n2 * 0.4);

  float coord = along + bias + warp * (0.65 * n1 + 0.35 * n2) + 0.12 * fold;
  gl_FragColor = vec4(ramp(coord), 1.0);
}
`

function hexToRgb(hex) {
  const value = hex.trim().replace(/^#/, '')
  const parts =
    value.length === 3
      ? [...value].map((c) => parseInt(c + c, 16))
      : [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16))
  return parts.map((c) => c / 255)
}

function compile(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    /* The page's own trap: a GLSL error is silent unless it is read out. */
    console.error('mesh: shader failed to compile.', gl.getShaderInfoLog(shader))
    return null
  }
  return shader
}

/* Draws one frame of the band into `container` at its current size.
   Returns true when the pixels are on screen, false when WebGL is missing or
   the program failed, in which case the caller's CSS gradient stands. */
export function drawBand(container, options = {}) {
  const {
    colours = ['#e8437e', '#ff5c6c', '#ff9b7a'],
    angle = 100,
    warp = 0.25,
    scale = 4.7,
    seed = [31.4, 15.9],
    bias = 0,
    time = 42,
    pixelRatio = 2,
  } = options

  if (!('WebGLRenderingContext' in window)) return false

  const canvas = document.createElement('canvas')
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.display = 'block'
  /* Sized before the context exists, so nothing is cleared after the draw. */
  canvas.width = Math.floor((container.clientWidth || 1) * pixelRatio)
  canvas.height = Math.floor((container.clientHeight || 1) * pixelRatio)

  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    /* The buffer is read back by the screenshot, so it must survive the draw. */
    preserveDrawingBuffer: true,
  })
  if (!gl) return false

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  if (!vertex || !fragment) return false

  const program = gl.createProgram()
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('mesh: program failed to link.', gl.getProgramInfoLog(program))
    return false
  }
  gl.useProgram(program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  const stops = colours.slice(0, MAX_STOPS).map(hexToRgb)
  const stopValues = new Float32Array(MAX_STOPS * 3)
  for (let i = 0; i < MAX_STOPS; i += 1) stopValues.set(stops[Math.min(i, stops.length - 1)], i * 3)

  gl.uniform3fv(gl.getUniformLocation(program, 'stops'), stopValues)
  gl.uniform1i(gl.getUniformLocation(program, 'stopCount'), stops.length)
  gl.uniform1f(gl.getUniformLocation(program, 'angle'), ((angle - 90) * Math.PI) / 180)
  gl.uniform1f(gl.getUniformLocation(program, 'warp'), warp)
  gl.uniform1f(gl.getUniformLocation(program, 'scale'), scale)
  gl.uniform2f(gl.getUniformLocation(program, 'seed'), seed[0], seed[1])
  gl.uniform1f(gl.getUniformLocation(program, 'bias'), bias)
  gl.uniform1f(gl.getUniformLocation(program, 'iTime'), time)
  gl.uniform2f(gl.getUniformLocation(program, 'iResolution'), canvas.width, canvas.height)

  gl.viewport(0, 0, canvas.width, canvas.height)
  container.appendChild(canvas)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  return true
}
