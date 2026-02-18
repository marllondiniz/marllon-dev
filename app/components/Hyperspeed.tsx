"use client";

import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
  SMAAPreset,
} from "postprocessing";
import "./Hyperspeed.css";

const GREEN_THEME_OPTIONS = {
  onSpeedUp: () => {},
  onSlowDown: () => {},
  distortion: "turbulentDistortion",
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [60, 80],
  movingCloserSpeed: [-120, -160],
  carLightsLength: [12, 80],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.8, 0.8],
  carFloorSeparation: [0, 5],
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0x131318,
    brokenLines: 0x131318,
    leftCars: [0x22c55e, 0x16a34a, 0x15803d],
    rightCars: [0x14532d, 0x166534, 0x22c55e],
    sticks: 0x22c55e,
  },
};

function lerp(
  current: number,
  target: number,
  speed = 0.1,
  limit = 0.001
): number {
  let change = (target - current) * speed;
  if (Math.abs(change) < limit) change = target - current;
  return change;
}

function resizeRendererToDisplaySize(
  renderer: THREE.WebGLRenderer,
  setSize: (w: number, h: number, u?: boolean) => void
): boolean {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) setSize(width, height, false);
  return needResize;
}

type HyperspeedProps = {
  effectOptions?: Record<string, unknown>;
  className?: string;
};

export default function Hyperspeed({
  effectOptions = {},
  className = "",
}: HyperspeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<{ dispose: () => void } | null>(null);

  const options = useMemo(() => {
    const opts = { ...GREEN_THEME_OPTIONS, ...effectOptions };
    const colors = {
      ...GREEN_THEME_OPTIONS.colors,
      ...((effectOptions as { colors?: Record<string, number> }).colors || {}),
    };
    return { ...opts, colors };
  }, [effectOptions]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    const nsin = (val: number) => Math.sin(val) * 0.5 + 0.5;

    const turbulentUniforms = {
      uFreq: { value: new THREE.Vector4(4, 8, 8, 1) },
      uAmp: { value: new THREE.Vector4(25, 5, 10, 10) },
    };

    const turbulentDistortion = {
      uniforms: turbulentUniforms,
      getDistortion: `
        uniform vec4 uFreq;
        uniform vec4 uAmp;
        float nsin(float val){ return sin(val) * 0.5 + 0.5; }
        #define PI 3.14159265358979
        float getDistortionX(float progress){
          return cos(PI * progress * uFreq.r + uTime) * uAmp.r +
            pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2.) * uAmp.g;
        }
        float getDistortionY(float progress){
          return -nsin(PI * progress * uFreq.b + uTime) * uAmp.b +
            -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.) * uAmp.a;
        }
        vec3 getDistortion(float progress){
          return vec3(
            getDistortionX(progress) - getDistortionX(0.0125),
            getDistortionY(progress) - getDistortionY(0.0125),
            0.
          );
        }
      `,
      getJS: (
        progress: number,
        time: number
      ) => {
        const uFreq = turbulentUniforms.uFreq.value;
        const uAmp = turbulentUniforms.uAmp.value;
        const getX = (p: number) =>
          Math.cos(Math.PI * p * uFreq.x + time) * uAmp.x +
          Math.pow(
            Math.cos(Math.PI * p * uFreq.y + time * (uFreq.y / uFreq.x)),
            2
          ) * uAmp.y;
        const getY = (p: number) =>
          -nsin(Math.PI * p * uFreq.z + time) * uAmp.z -
          Math.pow(
            nsin(Math.PI * p * uFreq.w + time / (uFreq.z / uFreq.w)),
            5
          ) * uAmp.w;
        const distortion = new THREE.Vector3(
          getX(progress) - getX(progress + 0.007),
          getY(progress) - getY(progress + 0.007),
          0
        );
        const lookAtAmp = new THREE.Vector3(-2, -5, 0);
        const lookAtOffset = new THREE.Vector3(0, 0, -10);
        return distortion.multiply(lookAtAmp).add(lookAtOffset);
      },
    };

    const distortions: Record<string, typeof turbulentDistortion> = {
      turbulentDistortion,
    };

    const random = (base: number | number[]) => {
      if (Array.isArray(base))
        return Math.random() * (base[1] - base[0]) + base[0];
      return Math.random() * base;
    };
    const pickRandom = <T,>(arr: T[] | T): T => {
      if (Array.isArray(arr))
        return arr[Math.floor(Math.random() * arr.length)];
      return arr;
    };

    const carLightsFragment = `
      #define USE_FOG;
      ${THREE.ShaderChunk["fog_pars_fragment"]}
      varying vec3 vColor;
      varying vec2 vUv;
      uniform vec2 uFade;
      void main() {
        vec3 color = vec3(vColor);
        float alpha = smoothstep(uFade.x, uFade.y, vUv.x);
        gl_FragColor = vec4(color, alpha);
        if (gl_FragColor.a < 0.0001) discard;
        ${THREE.ShaderChunk["fog_fragment"]}
      }
    `;
    const carLightsVertex = `
      #define USE_FOG;
      ${THREE.ShaderChunk["fog_pars_vertex"]}
      attribute vec3 aOffset;
      attribute vec3 aMetrics;
      attribute vec3 aColor;
      uniform float uTravelLength;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vColor;
      #include <getDistortion_vertex>
      void main() {
        vec3 transformed = position.xyz;
        float radius = aMetrics.r;
        float myLength = aMetrics.g;
        float speed = aMetrics.b;
        transformed.xy *= radius;
        transformed.z *= myLength;
        transformed.z += myLength - mod(uTime * speed + aOffset.z, uTravelLength);
        transformed.xy += aOffset.xy;
        float progress = abs(transformed.z / uTravelLength);
        transformed.xyz += getDistortion(progress);
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
        vColor = aColor;
        ${THREE.ShaderChunk["fog_vertex"]}
      }
    `;

    const roadVertex = `
      #define USE_FOG;
      uniform float uTime;
      ${THREE.ShaderChunk["fog_pars_vertex"]}
      uniform float uTravelLength;
      varying vec2 vUv;
      #include <getDistortion_vertex>
      void main() {
        vec3 transformed = position.xyz;
        vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);
        transformed.x += distortion.x;
        transformed.z += distortion.y;
        transformed.y += -1. * distortion.z;
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
        ${THREE.ShaderChunk["fog_vertex"]}
      }
    `;

    const roadBaseFragment = `
      #define USE_FOG;
      varying vec2 vUv;
      uniform vec3 uColor;
      uniform float uTime;
      #include <roadMarkings_vars>
      ${THREE.ShaderChunk["fog_pars_fragment"]}
      void main() {
        vec2 uv = vUv;
        vec3 color = vec3(uColor);
        #include <roadMarkings_fragment>
        gl_FragColor = vec4(color, 1.);
        ${THREE.ShaderChunk["fog_fragment"]}
      }
    `;
    const roadMarkingsVars = `
      uniform float uLanes;
      uniform vec3 uBrokenLinesColor;
      uniform vec3 uShoulderLinesColor;
      uniform float uShoulderLinesWidthPercentage;
      uniform float uBrokenLinesWidthPercentage;
      uniform float uBrokenLinesLengthPercentage;
      highp float random(vec2 co) {
        highp float a = 12.9898, b = 78.233, c = 43758.5453;
        highp float dt = dot(co.xy, vec2(a, b));
        return fract(sin(mod(dt, 3.14)) * c);
      }
    `;
    const roadMarkingsFragment = `
      uv.y = mod(uv.y + uTime * 0.05, 1.);
      float laneWidth = 1.0 / uLanes;
      float brokenLineWidth = laneWidth * uBrokenLinesWidthPercentage;
      float laneEmptySpace = 1. - uBrokenLinesLengthPercentage;
      float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * 2.0)) * step(laneEmptySpace, fract(uv.y * 10.0));
      float sideLines = step(1.0 - brokenLineWidth, fract((uv.x - laneWidth * (uLanes - 1.0)) * 2.0)) + step(brokenLineWidth, uv.x);
      brokenLines = mix(brokenLines, sideLines, uv.x);
    `;
    const roadFragment = roadBaseFragment
      .replace("#include <roadMarkings_fragment>", roadMarkingsFragment)
      .replace("#include <roadMarkings_vars>", roadMarkingsVars);
    const islandFragment = roadBaseFragment
      .replace("#include <roadMarkings_fragment>", "")
      .replace("#include <roadMarkings_vars>", "");

    const sideSticksVertex = `
      #define USE_FOG;
      ${THREE.ShaderChunk["fog_pars_vertex"]}
      attribute float aOffset;
      attribute vec3 aColor;
      attribute vec2 aMetrics;
      uniform float uTravelLength;
      uniform float uTime;
      varying vec3 vColor;
      mat4 rotationY(in float angle) {
        return mat4(cos(angle),0,sin(angle),0, 0,1.0,0,0, -sin(angle),0,cos(angle),0, 0,0,0,1);
      }
      #include <getDistortion_vertex>
      void main(){
        vec3 transformed = position.xyz;
        float width = aMetrics.x;
        float height = aMetrics.y;
        transformed.xy *= vec2(width, height);
        float time = mod(uTime * 60. * 2. + aOffset, uTravelLength);
        transformed = (rotationY(3.14/2.) * vec4(transformed,1.)).xyz;
        transformed.z += - uTravelLength + time;
        float progress = abs(transformed.z / uTravelLength);
        transformed.xyz += getDistortion(progress);
        transformed.y += height / 2.;
        transformed.x += -width / 2.;
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
        gl_Position = projectionMatrix * mvPosition;
        vColor = aColor;
        ${THREE.ShaderChunk["fog_vertex"]}
      }
    `;
    const sideSticksFragment = `
      #define USE_FOG;
      ${THREE.ShaderChunk["fog_pars_fragment"]}
      varying vec3 vColor;
      void main(){
        gl_FragColor = vec4(vColor,1.);
        ${THREE.ShaderChunk["fog_fragment"]}
      }
    `;

    type DistortionType = {
      uniforms: Record<string, { value: THREE.Vector2 | THREE.Vector3 | THREE.Vector4 }>;
      getDistortion: string;
      getJS?: (progress: number, time: number) => THREE.Vector3;
    };

    const opts = {
      ...options,
      distortion: (distortions[options.distortion as string] ||
        turbulentDistortion) as DistortionType,
      colors: options.colors as Record<string, number | number[]>,
    };

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      opts.fov,
      container.offsetWidth / container.offsetHeight,
      0.1,
      10000
    );
    camera.position.set(0, 8, -5);

    const scene = new THREE.Scene();
    scene.background = null;
    const fog = new THREE.Fog(
      opts.colors.background as number,
      opts.length * 0.2,
      opts.length * 500
    );
    scene.fog = fog;
    const fogUniforms = {
      fogColor: { value: fog.color },
      fogNear: { value: fog.near },
      fogFar: { value: fog.far },
    };

    const clock = new THREE.Clock();
    let speedUp = 0;
    let speedUpTarget = 0;
    let timeOffset = 0;
    let fovTarget = opts.fov;

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new EffectPass(
      camera,
      new BloomEffect({
        luminanceThreshold: 0.2,
        luminanceSmoothing: 0,
        resolutionScale: 1,
      })
    );
    const smaaPass = new EffectPass(
      camera,
      new SMAAEffect({ preset: SMAAPreset.MEDIUM })
    );
    renderPass.renderToScreen = false;
    bloomPass.renderToScreen = false;
    (smaaPass as { renderToScreen: boolean }).renderToScreen = true;
    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(smaaPass);

    const curve = new THREE.LineCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1)
    );
    const tubeGeom = new THREE.TubeGeometry(curve, 40, 1, 8, false);
    const laneWidth = opts.roadWidth / opts.lanesPerRoad;
    const aOffset: number[] = [];
    const aMetrics: number[] = [];
    const aColor: number[] = [];
    const leftColors = Array.isArray(opts.colors.leftCars)
      ? (opts.colors.leftCars as number[]).map((c) => new THREE.Color(c))
      : [new THREE.Color(opts.colors.leftCars as number)];
    for (let i = 0; i < opts.lightPairsPerRoadWay; i++) {
      const radius = random(opts.carLightsRadius);
      const length = random(opts.carLightsLength);
      const speed = random(opts.movingAwaySpeed);
      const carLane = i % opts.lanesPerRoad;
      let laneX =
        carLane * laneWidth - opts.roadWidth / 2 + laneWidth / 2;
      const carWidth = random(opts.carWidthPercentage) * laneWidth;
      const carShiftX = random(opts.carShiftX) * laneWidth;
      laneX += carShiftX;
      const offsetY = random(opts.carFloorSeparation) + radius * 1.3;
      const offsetZ = -random(opts.length);
      aOffset.push(laneX - carWidth / 2, offsetY, offsetZ);
      aOffset.push(laneX + carWidth / 2, offsetY, offsetZ);
      aMetrics.push(radius, length, speed, radius, length, speed);
      const color = pickRandom(leftColors);
      aColor.push(color.r, color.g, color.b, color.r, color.g, color.b);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instanced = (new THREE.InstancedBufferGeometry() as any).copy(tubeGeom);
    instanced.instanceCount = opts.lightPairsPerRoadWay * 2;
    instanced.setAttribute(
      "aOffset",
      new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false)
    );
    instanced.setAttribute(
      "aMetrics",
      new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3, false)
    );
    instanced.setAttribute(
      "aColor",
      new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false)
    );

    const carLightsMaterial = new THREE.ShaderMaterial({
      fragmentShader: carLightsFragment,
      vertexShader: carLightsVertex.replace(
        "#include <getDistortion_vertex>",
        opts.distortion.getDistortion
      ),
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uTravelLength: { value: opts.length },
        uFade: { value: new THREE.Vector2(0, 1 - opts.carLightsFade) },
        ...fogUniforms,
        ...opts.distortion.uniforms,
      },
    });
    const leftCarLightsMesh = new THREE.Mesh(instanced, carLightsMaterial);
    leftCarLightsMesh.position.setX(
      -opts.roadWidth / 2 - opts.islandWidth / 2
    );
    leftCarLightsMesh.frustumCulled = false;
    scene.add(leftCarLightsMesh);

    const aOffsetR: number[] = [];
    const aMetricsR: number[] = [];
    const aColorR: number[] = [];
    const rightColors = Array.isArray(opts.colors.rightCars)
      ? (opts.colors.rightCars as number[]).map((c) => new THREE.Color(c))
      : [new THREE.Color(opts.colors.rightCars as number)];
    for (let i = 0; i < opts.lightPairsPerRoadWay; i++) {
      const radius = random(opts.carLightsRadius);
      const length = random(opts.carLightsLength);
      const speed = random(opts.movingCloserSpeed);
      const carLane = i % opts.lanesPerRoad;
      let laneX =
        carLane * laneWidth - opts.roadWidth / 2 + laneWidth / 2;
      const carWidth = random(opts.carWidthPercentage) * laneWidth;
      const carShiftX = random(opts.carShiftX) * laneWidth;
      laneX += carShiftX;
      const offsetY = random(opts.carFloorSeparation) + radius * 1.3;
      const offsetZ = -random(opts.length);
      aOffsetR.push(laneX - carWidth / 2, offsetY, offsetZ);
      aOffsetR.push(laneX + carWidth / 2, offsetY, offsetZ);
      aMetricsR.push(radius, length, speed, radius, length, speed);
      const color = pickRandom(rightColors);
      aColorR.push(color.r, color.g, color.b, color.r, color.g, color.b);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instancedR = (new THREE.InstancedBufferGeometry() as any).copy(tubeGeom);
    instancedR.instanceCount = opts.lightPairsPerRoadWay * 2;
    instancedR.setAttribute(
      "aOffset",
      new THREE.InstancedBufferAttribute(new Float32Array(aOffsetR), 3, false)
    );
    instancedR.setAttribute(
      "aMetrics",
      new THREE.InstancedBufferAttribute(new Float32Array(aMetricsR), 3, false)
    );
    instancedR.setAttribute(
      "aColor",
      new THREE.InstancedBufferAttribute(new Float32Array(aColorR), 3, false)
    );
    const rightCarLightsMaterial = new THREE.ShaderMaterial({
      fragmentShader: carLightsFragment,
      vertexShader: carLightsVertex.replace(
        "#include <getDistortion_vertex>",
        opts.distortion.getDistortion
      ),
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uTravelLength: { value: opts.length },
        uFade: { value: new THREE.Vector2(1, 0 + opts.carLightsFade) },
        ...fogUniforms,
        ...opts.distortion.uniforms,
      },
    });
    const rightCarLightsMesh = new THREE.Mesh(
      instancedR,
      rightCarLightsMaterial
    );
    rightCarLightsMesh.position.setX(
      opts.roadWidth / 2 + opts.islandWidth / 2
    );
    rightCarLightsMesh.frustumCulled = false;
    scene.add(rightCarLightsMesh);

    const stickOffset = opts.length / (opts.totalSideLightSticks - 1);
    const aOffsetSticks: number[] = [];
    const aColorSticks: number[] = [];
    const aMetricsSticks: number[] = [];
    const sticksColor = new THREE.Color(opts.colors.sticks as number);
    for (let i = 0; i < opts.totalSideLightSticks; i++) {
      aOffsetSticks.push(
        (i - 1) * stickOffset * 2 + stickOffset * Math.random()
      );
      aColorSticks.push(sticksColor.r, sticksColor.g, sticksColor.b);
      aMetricsSticks.push(
        random(opts.lightStickWidth),
        random(opts.lightStickHeight)
      );
    }
    const stickGeom = new THREE.PlaneGeometry(1, 1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instancedSticks = (new THREE.InstancedBufferGeometry() as any).copy(stickGeom);
    instancedSticks.instanceCount = opts.totalSideLightSticks;
    instancedSticks.setAttribute(
      "aOffset",
      new THREE.InstancedBufferAttribute(
        new Float32Array(aOffsetSticks),
        1,
        false
      )
    );
    instancedSticks.setAttribute(
      "aColor",
      new THREE.InstancedBufferAttribute(
        new Float32Array(aColorSticks),
        3,
        false
      )
    );
    instancedSticks.setAttribute(
      "aMetrics",
      new THREE.InstancedBufferAttribute(
        new Float32Array(aMetricsSticks),
        2,
        false
      )
    );
    const sticksMaterial = new THREE.ShaderMaterial({
      fragmentShader: sideSticksFragment,
      vertexShader: sideSticksVertex.replace(
        "#include <getDistortion_vertex>",
        opts.distortion.getDistortion
      ),
      side: THREE.DoubleSide,
      uniforms: {
        uTravelLength: { value: opts.length },
        uTime: { value: 0 },
        ...fogUniforms,
        ...opts.distortion.uniforms,
      },
    });
    const sticksMesh = new THREE.Mesh(instancedSticks, sticksMaterial);
    sticksMesh.position.setX(-(opts.roadWidth + opts.islandWidth / 2));
    sticksMesh.frustumCulled = false;
    scene.add(sticksMesh);

    const roadSegments = 100;
    const roadGeom = new THREE.PlaneGeometry(
      opts.roadWidth,
      opts.length,
      20,
      roadSegments
    );
    const roadMaterial = new THREE.ShaderMaterial({
      fragmentShader: roadFragment,
      vertexShader: roadVertex.replace(
        "#include <getDistortion_vertex>",
        opts.distortion.getDistortion
      ),
      side: THREE.DoubleSide,
      uniforms: {
        uTravelLength: { value: opts.length },
        uColor: { value: new THREE.Color(opts.colors.roadColor as number) },
        uTime: { value: 0 },
        uLanes: { value: opts.lanesPerRoad },
        uBrokenLinesColor: {
          value: new THREE.Color(opts.colors.brokenLines as number),
        },
        uShoulderLinesColor: {
          value: new THREE.Color(opts.colors.shoulderLines as number),
        },
        uShoulderLinesWidthPercentage: {
          value: opts.shoulderLinesWidthPercentage,
        },
        uBrokenLinesLengthPercentage: {
          value: opts.brokenLinesLengthPercentage,
        },
        uBrokenLinesWidthPercentage: {
          value: opts.brokenLinesWidthPercentage,
        },
        ...fogUniforms,
        ...opts.distortion.uniforms,
      },
    });
    const leftRoad = new THREE.Mesh(roadGeom.clone(), roadMaterial.clone());
    leftRoad.rotation.x = -Math.PI / 2;
    leftRoad.position.z = -opts.length / 2;
    leftRoad.position.x = -(opts.islandWidth / 2 + opts.roadWidth / 2);
    scene.add(leftRoad);

    const rightRoad = new THREE.Mesh(roadGeom.clone(), roadMaterial.clone());
    rightRoad.rotation.x = -Math.PI / 2;
    rightRoad.position.z = -opts.length / 2;
    rightRoad.position.x = opts.islandWidth / 2 + opts.roadWidth / 2;
    scene.add(rightRoad);

    const islandGeom = new THREE.PlaneGeometry(opts.islandWidth, opts.length, 20, roadSegments);
    const islandMaterial = new THREE.ShaderMaterial({
      fragmentShader: islandFragment,
      vertexShader: roadVertex.replace(
        "#include <getDistortion_vertex>",
        opts.distortion.getDistortion
      ),
      side: THREE.DoubleSide,
      uniforms: {
        uTravelLength: { value: opts.length },
        uColor: { value: new THREE.Color(opts.colors.islandColor as number) },
        uTime: { value: 0 },
        ...fogUniforms,
        ...opts.distortion.uniforms,
      },
    });
    const island = new THREE.Mesh(islandGeom, islandMaterial);
    island.rotation.x = -Math.PI / 2;
    island.position.z = -opts.length / 2;
    scene.add(island);

    let disposed = false;
    const onWindowResize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      composer.setSize(w, h);
    };
    window.addEventListener("resize", onWindowResize);

    function tick() {
      if (disposed) return;
      if (
        resizeRendererToDisplaySize(renderer, (width, height) => {
          composer.setSize(width, height);
        })
      ) {
        if (container) {
          camera.aspect = container.offsetWidth / container.offsetHeight;
          camera.updateProjectionMatrix();
        }
      }
      const delta = clock.getDelta();
      const lerpPct = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta);
      speedUp += lerp(speedUp, speedUpTarget, lerpPct, 0.00001);
      timeOffset += speedUp * delta;
      const time = clock.elapsedTime + timeOffset;

      carLightsMaterial.uniforms.uTime.value = time;
      rightCarLightsMaterial.uniforms.uTime.value = time;
      sticksMaterial.uniforms.uTime.value = time;
      (leftRoad.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
      (rightRoad.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
      (island.material as THREE.ShaderMaterial).uniforms.uTime.value = time;

      if (opts.distortion.getJS) {
        const dist = opts.distortion.getJS(0.025, time);
        camera.lookAt(
          new THREE.Vector3(
            camera.position.x + dist.x,
            camera.position.y + dist.y,
            camera.position.z + dist.z
          )
        );
      }
      const fovChange = lerp(camera.fov, fovTarget, lerpPct);
      if (Math.abs(fovChange) > 0.0001) {
        camera.fov += fovChange * delta * 6;
        camera.updateProjectionMatrix();
      }

      composer.render(delta);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    appRef.current = {
      dispose() {
        disposed = true;
        window.removeEventListener("resize", onWindowResize);
        renderer.dispose();
        composer.dispose();
        scene.clear();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      },
    };

    return () => {
      if (appRef.current) {
        appRef.current.dispose();
        appRef.current = null;
      }
    };
  }, [options]);

  return (
    <div
      ref={containerRef}
      className={`hyperspeed-container ${className}`.trim()}
      aria-hidden
    />
  );
}
