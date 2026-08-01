import React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface RoyAvatarProps {
  image: string;
  onClick?: () => void;
  state?: "idle" | "listening" | "thinking" | "speaking";
  audioLevel?: number;
}

export default function RoyAvatarFX({
  image,
  onClick,
  state = "idle",
  audioLevel = 0,
}: RoyAvatarProps) {
  const ringClass =
    state === "speaking"
      ? "border-cyan-300/60"
      : state === "thinking"
      ? "border-yellow-300/60"
      : state === "listening"
      ? "border-green-300/60"
      : "border-cyan-400/30";

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const rotateX = useSpring(tiltX);
  const rotateY = useSpring(tiltY);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    tiltX.set(-(e.clientY - rect.top - rect.height / 2) / 25);
    tiltY.set((e.clientX - rect.left - rect.width / 2) / 25);
  };

  const handlePointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <div
      className="relative flex items-center justify-center w-full h-full"
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div
        className="absolute w-80 h-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.22) 0%, rgba(34,211,238,0.10) 45%, transparent 75%)",
          filter: "blur(48px)",
          opacity:
            state === "speaking"
              ? [0.75, 1, 0.75]
              : state === "thinking"
              ? [0.45, 0.75, 0.45]
              : state === "listening"
              ? [0.55, 0.95, 0.55]
              : 0.55,
        }}
      
      />

      {state === "speaking" && (
        <motion.div
          className="absolute w-96 h-96 rounded-full border border-cyan-300/30 pointer-events-none"
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      <motion.div
        className={`absolute w-80 h-80 rounded-full border ${ringClass}`}
        animate={{
          scale: [1, 1.04, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-72 h-72 rounded-full border border-cyan-300/20"
        animate={{
          rotate: state === "thinking" ? 360 : state === "listening" ? 180 : 0,
          opacity:
            state === "speaking"
              ? [0.35, 0.7, 0.35]
              : state === "thinking"
              ? [0.2, 0.5, 0.2]
              : state === "listening"
              ? [0.25, 0.45, 0.25]
              : 0.35,
        }}
        transition={{
          rotate: {
            duration: state === "thinking" ? 8 : 14,
            repeat: Infinity,
            ease: "linear",
          },
          opacity: {
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      <motion.div
        className="absolute w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, transparent 20%, rgba(255,255,255,0.12) 50%, transparent 80%)",
          mixBlendMode: "screen",
        }}
        animate={{
          opacity: [0.15, 0.35, 0.15],
          rotate: [0, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {state === "speaking" && (
        <motion.div
          className="absolute w-[28rem] h-[28rem] rounded-full border border-cyan-300/20 pointer-events-none"
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.15, 0.45, 0.15],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {state === "speaking" && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,1)]"
              animate={{
                y: [-20, -90, -20],
                x: [0, i % 2 === 0 ? 25 : -25, 0],
                opacity: [0, 1, 0],
                scale: [0.8, 1.4, 0.8],
              }}
              transition={{
                duration: 1.5 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}

      <motion.img
        src={image}
        alt="Roy Avatar"
        className="w-72 h-72 object-contain select-none drop-shadow-[0_0_30px_rgba(34,211,238,0.35)]"
        draggable={false}
        style={{
          rotateX,
          rotateY,
          transformPerspective: 800,
        }}
        animate={{
          scale:
            state === "idle"
              ? [1, 1.025, 1.01, 1.025, 1]
              : state === "listening"
              ? [1, 1.035, 1.01, 1.035, 1]
              : state === "thinking"
              ? [1, 1.025, 1.01, 1.025, 1]
              : state === "speaking"
              ? [1, 1.06, 0.99, 1.05, 1]
              : 1,
          y:
            state === "speaking"
              ? [0, -6, 0, 4, 0]
              : state === "idle"
              ? [0, -3, 0, 2, 0]
              : [0, 0, 0],
        }}
        transition={{
          duration:
            state === "listening"
              ? 1.6
              : state === "thinking"
              ? 2.6
              : state === "speaking"
              ? 1
              : 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* PHASE 3 - Speaking face reaction */}
      {state === "speaking" && (
        <motion.div
          className="absolute w-44 h-20 rounded-full bg-cyan-300/10 blur-2xl pointer-events-none"
          animate={{
            scale: [1, 1.16, 1],
            opacity: [0.12, 0.55, 0.12],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 0.42,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* PHASE 3 - Blink / eye presence effect */}
      <motion.div
        className="absolute w-20 h-8 rounded-full bg-cyan-200/10 blur-xl pointer-events-none"
        animate={{
          opacity:
            state === "speaking"
              ? [0.25, 0.9, 0.25]
              : state === "listening"
              ? [0.2, 0.65, 0.2]
              : state === "thinking"
              ? [0.15, 0.45, 0.15]
              : [0.08, 0.3, 0.08],
        }}
        transition={{
          duration:
            state === "speaking"
              ? 1.4
              : state === "listening"
              ? 2
              : state === "thinking"
              ? 3
              : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
          {/* PHASE 6 - Audio driven talking mouth */}
              {state === "speaking" && (
                <motion.img
                  src="/avatar/roy-mouth-layer.png"
                  alt="Roy talking mouth"
                  className="absolute top-[61%] left-1/2 -translate-x-1/2 w-32 pointer-events-none z-20"
                  animate={{
                    scaleY: [
                      0.7,
                      1 + audioLevel * 3,
                      0.75,
                      1 + audioLevel * 2,
                      0.7,
                    ],
                    scaleX: [
                      1,
                      1 + audioLevel,
                      1,
                    ],
                  }}
                  transition={{
                    duration: 0.12,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
</div>
  );
}
