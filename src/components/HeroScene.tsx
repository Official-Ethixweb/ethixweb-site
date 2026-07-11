import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

const GLASS_COLOR = "#ff3b40";
const GLOW_COLOR = "#ff5a5a";
const TURNS = 2.3;
/** Scaled down from the original 1.3/1.15 so the tilted, spinning helix - together with its
 * tube thickness - stays inside the camera frustum with comfortable margin at every rotation
 * angle (idle spin + scroll + pointer tilt are all unbounded, so the object eventually passes
 * through its worst-case silhouette; it must fit then too, not just at rest). */
const HALF_HEIGHT = 1.1;
const BASE_RADIUS = 1.0;
const TAPER = 0.24;
const STRUT_COUNT = 5;
/** Product-shot lean: tips the whole structure past horizontal so it stops reading as a
 * mathematical object standing straight up and instead reads as an angled render that
 * points back toward the headline on the left. */
const TILT_Z = THREE.MathUtils.degToRad(110);
const MOBILE_SCALE = 0.82;

/** A single helical conduit - "the operations pipeline that carries your business" -
 * replacing the previous three independent rings with one continuous, legible structure. */
class ConduitCurve extends THREE.Curve<THREE.Vector3> {
  constructor() {
    super();
  }

  getPoint(t: number) {
    const height = -HALF_HEIGHT + t * HALF_HEIGHT * 2;
    const angle = t * Math.PI * 2 * TURNS;
    const radius = BASE_RADIUS * (1 - TAPER * t);
    return new THREE.Vector3(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
  }
}

function useConduitCurve() {
  return useMemo(() => new ConduitCurve(), []);
}

/** Orients a unit cylinder mesh so it spans exactly between two points - used for the
 * taut struts tying the glass conduit back to its chrome axis. */
function Strut({ from, to }: { from: THREE.Vector3; to: THREE.Vector3 }) {
  const { position, quaternion, length } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(to, from);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    );
    return { position: mid, quaternion: quat, length: len };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.01, 0.01, length, 8]} />
      <meshStandardMaterial color="#e8e8ea" metalness={0.9} roughness={0.25} />
    </mesh>
  );
}

function Conduit({
  reduceMotion,
  isMobile,
  scrollRotation,
}: {
  reduceMotion: boolean;
  isMobile: boolean;
  scrollRotation: MotionValue<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const idleAngle = useRef(0);
  const speedMulRef = useRef(1);
  const nextSpeedChangeRef = useRef(0);
  const curve = useConduitCurve();

  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 240, 0.09, 20, false), [curve]);

  const struts = useMemo(
    () =>
      Array.from({ length: STRUT_COUNT }, (_, i) => {
        const t = (i + 1) / (STRUT_COUNT + 1);
        const p = curve.getPoint(t);
        return { from: new THREE.Vector3(0, p.y, 0), to: p };
      }),
    [curve],
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const sizeScale = isMobile ? MOBILE_SCALE : 1;

    if (reduceMotion) {
      // Direct 1:1 scroll response is kept even under reduced motion (it's user-driven, not
      // ambient autoplay) - only the idle auto-spin and breathing are suspended.
      group.current.rotation.y = THREE.MathUtils.degToRad(scrollRotation.get());
      group.current.scale.setScalar(sizeScale);
      return;
    }

    // Slow single-axis idle drift (legible), with a gently shifting speed rather than a
    // fixed rate - kept subtle now that scroll is the dominant rotation driver.
    if (t > nextSpeedChangeRef.current) {
      speedMulRef.current = 0.7 + Math.sin(t * 0.25) * 0.3 + 0.7;
      nextSpeedChangeRef.current = t + 5;
    }
    idleAngle.current += delta * 0.018 * speedMulRef.current;

    group.current.rotation.y = idleAngle.current + THREE.MathUtils.degToRad(scrollRotation.get());

    const breathe = 1 + Math.sin(t * 0.5) * 0.012;
    group.current.scale.setScalar(sizeScale * breathe);
  });

  return (
    <group ref={group}>
      <mesh geometry={tubeGeometry}>
        <MeshTransmissionMaterial
          thickness={0.6}
          roughness={0.035}
          transmission={0.92}
          ior={1.25}
          chromaticAberration={0.06}
          anisotropy={0.2}
          distortion={0.08}
          distortionScale={0.2}
          temporalDistortion={reduceMotion ? 0 : 0.06}
          color={GLASS_COLOR}
          attenuationColor="#ff8a8a"
          attenuationDistance={0.55}
          clearcoat={1}
          clearcoatRoughness={0.06}
          envMapIntensity={2.4}
        />
      </mesh>

      {/* Chrome core axis - the "single system" everything else connects back to */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.036, 0.036, HALF_HEIGHT * 2, 16]} />
        <meshStandardMaterial color="#f0f0f2" metalness={0.95} roughness={0.18} />
      </mesh>

      {struts.map((s, i) => (
        <Strut key={i} from={s.from} to={s.to} />
      ))}
    </group>
  );
}

/** Static product-shot lean, wrapping the dynamically-rotating Conduit. */
function TiltedConduit(props: {
  reduceMotion: boolean;
  isMobile: boolean;
  scrollRotation: MotionValue<number>;
}) {
  return (
    <group rotation={[0, 0, TILT_Z]}>
      <Conduit {...props} />
    </group>
  );
}

function PointerRig({
  reduceMotion,
  children,
}: {
  reduceMotion: boolean;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const targetY = reduceMotion ? 0 : state.pointer.x * 0.1;
    const targetX = reduceMotion ? 0 : -state.pointer.y * 0.08;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
  });
  return <group ref={group}>{children}</group>;
}

function Scene({
  isMobile,
  reduceMotion,
  scrollRotation,
}: {
  isMobile: boolean;
  reduceMotion: boolean;
  scrollRotation: MotionValue<number>;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 2, 4]} intensity={70} color={GLOW_COLOR} distance={14} decay={2} />
      <pointLight
        position={[-2.5, -1, -2]}
        intensity={34}
        color="#ffffff"
        distance={12}
        decay={2}
      />
      <pointLight position={[0, -2.5, 3]} intensity={25} color="#ff8a8a" distance={10} decay={2} />
      {/* Procedural environment (no external HDRI fetch - fully local, reliable in prod) */}
      <Environment resolution={256} background={false}>
        <Lightformer intensity={5.5} color="#ff5a5a" position={[0, 2.5, -3]} scale={[6, 3, 1]} />
        <Lightformer
          intensity={3}
          color="#ffffff"
          position={[-4, 1, 2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[2.4, 5, 1]}
        />
        <Lightformer
          intensity={2.2}
          color="#ff8a8a"
          position={[4, -1, 2]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[2.4, 4, 1]}
        />
        <Lightformer
          intensity={1.2}
          color="#ffffff"
          position={[0, -4, 1]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[4, 4, 1]}
        />
      </Environment>

      <PointerRig reduceMotion={reduceMotion}>
        <TiltedConduit
          reduceMotion={reduceMotion}
          isMobile={isMobile}
          scrollRotation={scrollRotation}
        />
        {/* Sparse glowing accent dots - not a dense particle cloud */}
        <Sparkles
          count={isMobile ? 8 : 16}
          scale={[3.4, 3.4, 3.4]}
          size={3}
          speed={reduceMotion ? 0 : 0.15}
          opacity={0.8}
          color="#ffffff"
          noise={0.3}
        />
        <Sparkles
          count={isMobile ? 5 : 10}
          scale={[3, 3, 3]}
          size={2.4}
          speed={reduceMotion ? 0 : 0.12}
          opacity={0.6}
          color="#6ea8ff"
          noise={0.3}
        />
      </PointerRig>
    </>
  );
}

/** Pauses the R3F render loop entirely while the canvas is off-screen. */
function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

export function HeroScene({
  isMobile = false,
  reduceMotion = false,
  scrollRotation,
}: {
  isMobile?: boolean;
  reduceMotion?: boolean;
  scrollRotation: MotionValue<number>;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const dpr = useMemo<[number, number]>(() => (isMobile ? [1, 1] : [1, 1.5]), [isMobile]);

  return (
    <div ref={ref} className="absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={dpr}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5.7], fov: 40 }}
        frameloop={inView ? "always" : "never"}
        resize={{ scroll: false, debounce: 0 }}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <Scene isMobile={isMobile} reduceMotion={reduceMotion} scrollRotation={scrollRotation} />
      </Canvas>
    </div>
  );
}
