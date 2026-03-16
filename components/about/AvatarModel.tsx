"use client";

import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import type { Group } from "three";

const MODEL_PATH = "/MY%20CARTOON%20%20WECLOME%20IMAGE%20.glb";

// 微微浮动：类似 MetaMask 狐狸 / Telegram 猴子那种轻柔 idle 效果
function Model() {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_PATH);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    // 轻微上下浮动，幅度约 0.02
    group.current.position.y = Math.sin(t * 0.8) * 0.02;
    // 极轻微的左右微摆，增加生动感
    group.current.rotation.y = Math.sin(t * 0.5) * 0.03;
  });

  return <primitive ref={group} object={scene} scale={1} />;
}

function Fallback() {
  return (
    <div className="w-full aspect-[4/5] bg-muted/50 rounded-xl flex items-center justify-center text-muted-foreground">
      加载 3D 模型中…
    </div>
  );
}

export function AvatarModel() {
  return (
    <div className="w-full max-w-xs mx-auto aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-b from-muted/30 to-muted/10">
      <Suspense fallback={<Fallback />}>
        <Canvas
          camera={{ position: [0, 0.15, 2.2], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.85} />
          <directionalLight position={[2, 4, 4]} intensity={1.2} />
          <directionalLight position={[-2, 2, 2]} intensity={0.5} />
          <directionalLight position={[0, -1, 2]} intensity={0.2} />
          <Model />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableDamping
            dampingFactor={0.06}
            rotateSpeed={0.5}
            autoRotate
            autoRotateSpeed={0.4}
            minDistance={1.8}
            maxDistance={3.2}
            minPolarAngle={Math.PI * 0.2}
            maxPolarAngle={Math.PI * 0.48}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
