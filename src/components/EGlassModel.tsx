import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

const IDLE_SPIN_SPEED = 0.28;

// One continuous outline of the Ethixweb "E" mark - a solid vertical spine
// with three arms notched out of its right side - extruded as a single mesh
// so the arms are actually fused to the spine (no gaps, no internal seams
// showing through the glass where separate bars used to overlap).
function buildEShape() {
  const vBarLeft = -1.325;
  const vBarRight = -0.775;
  const vBarTop = 1.35;
  const vBarBottom = -1.35;
  const armLong = 1.3;
  const armShort = 0.7;
  const topBarBottom = 0.8;
  const midBarTop = 0.275;
  const midBarBottom = -0.275;
  const bottomBarTop = -0.8;

  const shape = new THREE.Shape();
  shape.moveTo(vBarLeft, vBarBottom);
  shape.lineTo(vBarLeft, vBarTop);
  shape.lineTo(armLong, vBarTop);
  shape.lineTo(armLong, topBarBottom);
  shape.lineTo(vBarRight, topBarBottom);
  shape.lineTo(vBarRight, midBarTop);
  shape.lineTo(armShort, midBarTop);
  shape.lineTo(armShort, midBarBottom);
  shape.lineTo(vBarRight, midBarBottom);
  shape.lineTo(vBarRight, bottomBarTop);
  shape.lineTo(armLong, bottomBarTop);
  shape.lineTo(armLong, vBarBottom);
  shape.lineTo(vBarLeft, vBarBottom);
  return shape;
}

function GlassEnvironment() {
  return (
    <Environment resolution={256} background={false}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <Lightformer
          form="rect"
          intensity={4}
          color="#ffffff"
          scale={[8, 4, 1]}
          position={[0, 4, 0]}
        />
      </group>
      {/* Broad soft fill so the glass reads bright/white rather than falling into shadow */}
      <Lightformer
        form="rect"
        intensity={1.2}
        color="#ffffff"
        scale={[6, 6, 1]}
        position={[0, 0, 5]}
      />
      <Lightformer
        form="rect"
        intensity={4.4}
        color="#ff3b3f"
        scale={[4, 2.4, 1]}
        position={[-3, 0.4, 2.2]}
        rotation={[0, Math.PI / 3, 0]}
      />
      <Lightformer
        form="rect"
        intensity={2}
        color="#ffffff"
        scale={[3, 2, 1]}
        position={[3, 1, 2.2]}
        rotation={[0, -Math.PI / 3, 0]}
      />
      <Lightformer form="ring" intensity={2.6} color="#ffb3b5" scale={2} position={[0, 0, -4]} />
    </Environment>
  );
}

function EMark({ reduceMotion }: { reduceMotion: boolean | null }) {
  // Dark polished glass - fully opaque, gloss comes from the env reflections.
  const targetOpacity = 1;
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<{ opacity: number } | null>(null);
  const t0 = useMemo(() => performance.now(), []);

  const geometry = useMemo(() => {
    const shape = buildEShape();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.85,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.12,
      bevelSegments: 6,
      curveSegments: 1,
    });
    geo.center();
    return geo;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const rotationRef = useRef(0);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const elapsed = performance.now() - t0;
    const progress = Math.min(1, elapsed / 1100);
    // easeOutBack - the glass "pops" into place rather than just linearly growing
    const c1 = 1.6;
    const eased =
      progress >= 1 ? 1 : 1 + c1 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
    const scale = 0.001 + eased * 0.999;
    group.scale.setScalar(Math.max(0.001, scale));

    if (materialRef.current) {
      materialRef.current.opacity = progress * targetOpacity;
    }

    if (!reduceMotion) {
      rotationRef.current += delta * IDLE_SPIN_SPEED;
    }
    group.rotation.y = rotationRef.current;
  });

  return (
    <group ref={groupRef}>
      {/* Soft crimson core sitting just inside the outer shell - reads as an
          internal glow through the glass rather than a light bouncing off it. */}
      <mesh geometry={geometry} scale={0.9}>
        <meshBasicMaterial
          color="#ff2b30"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Single fused mesh (one outline, no seams between the spine and arms) -
          built-in physical material instead of drei's MeshTransmissionMaterial,
          which is expensive enough to visibly stutter scroll. Dark polished
          glass with a wet clearcoat - the red/white env lights streak across
          the faces as it turns. */}
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          ref={(m) => {
            materialRef.current = m as unknown as { opacity: number } | null;
          }}
          transparent
          roughness={0.08}
          metalness={0.8}
          transmission={0}
          ior={1.55}
          color="#1c1214"
          emissive="#3a0a0c"
          emissiveIntensity={0.35}
          clearcoat={1}
          clearcoatRoughness={0.035}
          envMapIntensity={3.4}
        />
        <Edges scale={1.002} color="#ffffff" toneMapped={false} />
      </mesh>

      {/* Wider, dimmer crimson edge ring just outside the white edge line - a
          thicker beveled-glass rim so the outline reads as glowing glass, not a wire. */}
      <mesh geometry={geometry}>
        <Edges
          scale={1.035}
          color="#ff3b3f"
          linewidth={2.5}
          transparent
          opacity={0.55}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** Dark polished-glass render of the Ethixweb "E" mark, extruded with real
 *  depth/bevels - fades in, then keeps spinning on its own. */
export function EGlassModel({
  className = "",
  reduceMotion = false,
}: {
  className?: string;
  reduceMotion?: boolean;
}) {
  const [ready, setReady] = useState(false);

  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6.2], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => setReady(true)}
        style={{ opacity: ready ? 1 : 0, transition: "opacity 0.6s ease" }}
      >
        <ambientLight intensity={0.45} />
        <pointLight position={[3, 3, 4]} intensity={14} color="#ffffff" />
        <pointLight position={[-3, -2, 3]} intensity={9} color="#ff3b3f" />
        <Suspense fallback={null}>
          <GlassEnvironment />
          <EMark reduceMotion={reduceMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
