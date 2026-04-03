'use client'

import { useEffect, useRef } from 'react'

const VS = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FS = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_mouse;

vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x,289.0); }
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
  i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5); vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}

float fbm(vec2 p){
  float f=0.0; float a=0.5;
  mat2 m=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<5;i++){ f+=a*snoise(p); p=m*p; a*=0.5; }
  return f;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float asp = u_res.x / u_res.y;
  vec2 uvA = vec2(uv.x * asp, uv.y);
  float t = u_time * 0.09;
  vec2 mUV = vec2((u_mouse.x / u_res.x) * asp, u_mouse.y / u_res.y);

  vec2 q = vec2(fbm(uvA + vec2(0.0, t)), fbm(uvA + vec2(5.2, t * 1.3)));
  vec2 r = vec2(fbm(uvA + 4.0*q + vec2(1.7, 9.2) + t*0.15),
                fbm(uvA + 4.0*q + vec2(8.3, 2.8) + t*0.126));
  float f = fbm(uvA + 4.0 * r);

  float dist = length(uvA - mUV);
  f += sin(dist * 26.0 - u_time * 4.8) * 0.055 * exp(-dist * 5.0);
  f = (f + 1.0) * 0.5;

  vec3 c1 = vec3(0.030, 0.030, 0.040);
  vec3 c2 = vec3(0.070, 0.070, 0.090);
  vec3 c3 = vec3(0.28, 0.28, 0.34);
  vec3 c4 = vec3(0.66, 0.64, 0.68);
  vec3 c5 = vec3(0.78, 0.72, 0.58);

  vec3 col = c1;
  col = mix(col, c2, smoothstep(0.00, 0.20, f));
  col = mix(col, c3, smoothstep(0.20, 0.50, f));
  col = mix(col, c4, smoothstep(0.50, 0.78, f));
  col = mix(col, c5, smoothstep(0.78, 0.96, f));

  float spec = pow(clamp(snoise(uvA*6.5 + vec2(t, -t*0.7))*0.5+0.5, 0.0, 1.0), 9.0);
  col += vec3(0.52, 0.50, 0.42) * spec * 0.28;

  col *= 0.58;
  vec2 center = vec2(asp * 0.5, 0.5);
  float vig = 1.0 - smoothstep(0.35, 1.1, length(uvA - center));
  col *= (0.55 + 0.45 * vig);

  gl_FragColor = vec4(col, 1.0);
}
`

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    console.error('Shader compile error:', gl.getShaderInfoLog(s))
  return s
}

export default function LiquidMetalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { 
      alpha: false, 
      antialias: false,
      powerPreference: "high-performance" 
    }) as WebGLRenderingContext | null

    if (!gl) return

    const vert = compileShader(gl, gl.VERTEX_SHADER, VS)
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FS)
    const prog = gl.createProgram()!
    gl.attachShader(prog, vert)
    gl.attachShader(prog, frag)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')

    let raf: number
    const start = performance.now()

    const resize = () => {
      // Force a reasonable DPR to prevent lag on high-res screens
      const dpr = Math.min(window.devicePixelRatio, 1.5)
      const displayWidth = canvas.clientWidth
      const displayHeight = canvas.clientHeight
      
      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr
        canvas.height = displayHeight * dpr
        gl.viewport(0, 0, canvas.width, canvas.height)
      }
    }

    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      // Scale mouse coords to match the internal canvas resolution
      mouse.current = {
        x: (e.clientX - r.left) * (canvas.width / r.width),
        y: canvas.height - (e.clientY - r.top) * (canvas.height / r.height),
      }
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouse)
    resize() // Initial call

    let lastTime = 0
    const TARGET_FPS = 45 // Slightly higher than 40 for smoother feel
    
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (now - lastTime < 1000 / TARGET_FPS) return
      lastTime = now

      const t = (now - start) / 1000
      gl.uniform1f(uTime, t)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform2f(uMouse, mouse.current.x, mouse.current.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vert)
      gl.deleteShader(frag)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: 'block', zIndex: 0 }}
    />
  )
}
