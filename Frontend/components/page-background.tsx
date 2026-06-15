"use client"

const STARS = [
  // Top left
  { x: 20, y: 30, size: 2, delay: 0, duration: 4 },
  { x: 70, y: 15, size: 3, delay: 1.5, duration: 5 },
  { x: 120, y: 50, size: 1, delay: 3, duration: 3.5 },
  { x: 40, y: 70, size: 2, delay: 0.5, duration: 6 },
  
  // Top right
  { x: 200, y: 20, size: 2, delay: 2, duration: 4.5 },
  { x: 260, y: 40, size: 4, delay: 0, duration: 5.5 },
  { x: 300, y: 10, size: 1, delay: 1, duration: 3 },
  { x: 230, y: 70, size: 3, delay: 3.5, duration: 5 },

  // Bottom left
  { x: 30, y: 120, size: 3, delay: 2.5, duration: 6 },
  { x: 80, y: 100, size: 2, delay: 0.5, duration: 4 },
  { x: 130, y: 140, size: 4, delay: 1.5, duration: 5.5 },
  { x: 10, y: 150, size: 1, delay: 3, duration: 3 },

  // Bottom right
  { x: 180, y: 110, size: 2, delay: 1, duration: 4.5 },
  { x: 250, y: 130, size: 1, delay: 2.5, duration: 3.5 },
  { x: 290, y: 90, size: 3, delay: 0, duration: 5 },
  { x: 310, y: 150, size: 2, delay: 3.5, duration: 6 },
  
  // Centerish
  { x: 160, y: 80, size: 2, delay: 2, duration: 4 },
]

const CROSS_STARS = [
  { x: 100, y: 30, delay: 0.5, duration: 5 },
  { x: 280, y: 120, delay: 2.5, duration: 6 },
  { x: 50, y: 140, delay: 1, duration: 4.5 },
  { x: 220, y: 50, delay: 3, duration: 5.5 },
]

export function PageBackground() {
  return (
    <div 
      className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden" 
      style={{ backgroundColor: "var(--lcd-fg)" }}
    >
      <style>{`
        @keyframes pixel-twinkle {
          0%, 100% { opacity: 0; }
          10%, 40% { opacity: 1; }
          50% { opacity: 0; }
        }
        .star-anim {
          animation-name: pixel-twinkle;
          animation-iteration-count: infinite;
          animation-timing-function: steps(1); /* Retro sharp blinking */
          opacity: 0; /* starts invisible */
        }
      `}</style>

      {/* LCD screen pixel grid effect */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          opacity: 0.15,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(26,58,26,0.5) 3px, rgba(26,58,26,0.5) 4px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(26,58,26,0.5) 3px, rgba(26,58,26,0.5) 4px)",
        }}
      />
      
      <svg
        viewBox="0 0 320 160"
        width="100%"
        height="100%"
        style={{ imageRendering: "pixelated" }}
        preserveAspectRatio="xMidYMid slice"
      >
        {/* === ANIMATED STARS === */}
        {STARS.map((star, i) => (
          <rect 
            key={`star-${i}`}
            x={star.x} 
            y={star.y} 
            width={star.size} 
            height={star.size} 
            fill="var(--lcd-bg)"
            className="star-anim"
            style={{
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`
            }}
          />
        ))}

        {/* Twinkle / Cross Stars */}
        {CROSS_STARS.map((star, i) => (
          <path 
            key={`cross-${i}`}
            d={`M ${star.x} ${star.y} h 2 v -2 h 2 v 2 h 2 v 2 h -2 v 2 h -2 v -2 h -2 z`}
            fill="var(--lcd-bg)"
            className="star-anim"
            style={{
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`
            }}
          />
        ))}
        {/* === HORIZON (Ground & Trees) === */}
        {/* Solid ground bottom */}
        <rect x="0" y="146" width="320" height="14" fill="var(--lcd-bg)" />
        
        {/* Grass tufts on the horizon edge */}
        <path d="M 10 146 v -2 h 2 v 2 z M 14 146 v -4 h 2 v 4 z" fill="var(--lcd-bg)" />
        <path d="M 60 146 v -3 h 2 v 3 z M 64 146 v -2 h 2 v 2 z" fill="var(--lcd-bg)" />
        <path d="M 110 146 v -4 h 2 v 4 z M 114 146 v -5 h 2 v 5 z M 118 146 v -2 h 2 v 2 z" fill="var(--lcd-bg)" />
        <path d="M 190 146 v -3 h 2 v 3 z M 194 146 v -5 h 2 v 5 z" fill="var(--lcd-bg)" />
        <path d="M 270 146 v -2 h 2 v 2 z M 274 146 v -4 h 2 v 4 z M 278 146 v -2 h 2 v 2 z" fill="var(--lcd-bg)" />

        {/* === FLOWERS === */}
        {/* Flower 1 */}
        <path d="M 40 134 h 2 v 2 h 2 v 2 h -2 v 2 h -2 v -2 h -2 v -2 h 2 z" fill="var(--lcd-bg)" />
        <rect x="40" y="136" width="2" height="2" fill="var(--lcd-fg)" />
        <rect x="40" y="140" width="2" height="6" fill="var(--lcd-bg)" />

        {/* Grass Center */}
        <path d="M 138 146 v -3 h 2 v 3 z M 142 146 v -5 h 2 v 5 z M 146 146 v -2 h 2 v 2 z" fill="var(--lcd-bg)" />

        {/* Flower 3 */}
        <path d="M 260 135 h 2 v 2 h 2 v 2 h -2 v 2 h -2 v -2 h -2 v -2 h 2 z" fill="var(--lcd-bg)" />
        <rect x="260" y="137" width="2" height="2" fill="var(--lcd-fg)" />
        <rect x="260" y="141" width="2" height="5" fill="var(--lcd-bg)" />
        
        
      </svg>
    </div>
  )
}
