import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RoyAvatar from "./RoyAvatar";

export default function AvatarCanvas() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 1.6, 2.2], fov: 35 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} intensity={2} />
        <RoyAvatar />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          target={[0, 1.4, 0]}
        />
      </Canvas>
    </div>
  );
}
