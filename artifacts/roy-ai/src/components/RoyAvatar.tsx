import { motion } from "framer-motion";

interface RoyAvatarProps {
  image: string;
  onClick?: () => void;
  state?: "idle" | "listening" | "thinking" | "speaking";
}

export default function RoyAvatar({
  image,
  onClick,
  state = "idle",
}: RoyAvatarProps) {
  const ringColor = {
    idle: "border-cyan-300 shadow-[0_0_45px_rgba(34,211,238,1)]",
    listening: "border-green-300 shadow-[0_0_60px_rgba(34,197,94,1)]",
    thinking: "border-yellow-300 shadow-[0_0_60px_rgba(250,204,21,1)]",
    speaking: "border-cyan-300 shadow-[0_0_60px_rgba(34,211,238,1)]",
  }[state];

  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={{
        y: [0, -10, 0],
        scale: [1, 1.05, 1],
        rotate: [0, 0.5, 0, -0.5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >      <motion.div
        className={`absolute rounded-full ${ringColor}`}
        style={{
          width: 360,
          height: 360,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: state === "thinking" ? 6 : state === "speaking" ? 10 : 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute rounded-full border border-blue-400 shadow-[0_0_35px_rgba(59,130,246,0.9)]"
        style={{
          width: 320,
          height: 320,
        }}
        animate={{ rotate: -360 }}
        transition={{
          duration: state === "listening" ? 5 : 14,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          width: 420,
          height: 420,
          background:
            "radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0.05) 50%, transparent 75%)",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.45,1,0.45],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />      <div className="relative">
        <img
          src={image}
          alt="Roy AI"
          onClick={onClick}
          className="w-72 h-72 md:w-80 md:h-80 object-contain cursor-pointer select-none relative z-10"
        />

        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <motion.div
            key={angle}
            className="absolute w-2 h-2 rounded-full bg-cyan-300"
            style={{
              left: "50%",
              top: "50%",
              marginLeft: "-4px",
              marginTop: "-4px",
              transform: `rotate(${angle}deg) translateY(-175px)`,
              boxShadow: "0 0 12px rgba(103,232,249,1)",
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: state === "speaking" ? [1,2.6,1] : state === "thinking" ? [1,2.2,1] : [1,1.8,1],
            }}
            transition={{
              duration: state === "speaking" ? 0.8 : state === "thinking" ? 1.2 : 2,
              delay: angle / 90,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>    </motion.div>
  );
}