import { motion } from 'framer-motion';

type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface AiOrbProps {
  state?: OrbState;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function AiOrb({ state = 'idle', onClick, size = 'lg' }: AiOrbProps) {
  const sizeConfig = {
    sm: { orb: 60, glow: 100, monogram: 20 },
    md: { orb: 100, glow: 160, monogram: 32 },
    lg: { orb: 140, glow: 220, monogram: 48 },
  };

  const { orb, glow, monogram } = sizeConfig[size];

  // Animation durations based on state
  const breathDuration = {
    idle: 4,
    listening: 1.5,
    thinking: 2,
    speaking: 2.5,
  }[state];

  // Color tints based on state
  const tintColor = {
    idle: 'rgba(99, 102, 241, 0.3)',
    listening: 'rgba(236, 72, 153, 0.3)',
    thinking: 'rgba(234, 179, 8, 0.3)',
    speaking: 'rgba(6, 182, 212, 0.3)',
  }[state];

  return (
    <motion.div
      className="relative flex items-center justify-center cursor-pointer"
      style={{ width: glow, height: glow }}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      data-testid="ai-orb"
    >
      {/* Outer Rings */}
      {(state === 'listening' || state === 'speaking') && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/15"
            animate={{
              scale: [0.8, 2.2],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            style={{ borderColor: tintColor }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/15"
            animate={{
              scale: [0.8, 2.2],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.5,
            }}
            style={{ borderColor: tintColor }}
          />
        </>
      )}

      {/* Mid Glow Layer */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: glow,
          height: glow,
          background: `radial-gradient(circle, ${tintColor} 0%, rgba(139,92,246,0.15) 50%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: breathDuration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Core Orb */}
      <motion.div
        className="relative rounded-full border border-white/15 shadow-2xl overflow-hidden"
        style={{
          width: orb,
          height: orb,
          background: state === 'thinking'
            ? 'conic-gradient(from 0deg, hsl(239 84% 67%), hsl(270 76% 53%), hsl(200 80% 60%), hsl(239 84% 67%))'
            : 'conic-gradient(from 0deg, hsl(239 84% 67%), hsl(270 76% 53%), hsl(239 84% 67%))',
          backgroundSize: '200% 200%',
        }}
        animate={
          state === 'thinking'
            ? {
                rotate: [0, 360],
                scale: [1, 1.05, 1],
              }
            : {
                scale: [1, 1.05, 1],
              }
        }
        transition={
          state === 'thinking'
            ? {
                rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                scale: { duration: breathDuration, repeat: Infinity, ease: 'easeInOut' },
              }
            : {
                duration: breathDuration,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      >
        {/* Inner shadow overlay */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, transparent 30%, rgba(0,0,0,0.3) 100%)',
          }}
        />

        {/* Monogram */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-white font-bold drop-shadow-lg"
            style={{ fontSize: monogram, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            R
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
