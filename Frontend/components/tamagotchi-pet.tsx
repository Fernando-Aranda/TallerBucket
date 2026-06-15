"use client"

type PetState = "idle" | "excited" | "eating" | "happy" | "blink"

interface TamagotchiPetProps {
  state: PetState
}

export function TamagotchiPet({ state }: TamagotchiPetProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      style={{ imageRendering: "pixelated" }}
      aria-label={`Tamagotchi pet — ${state}`}
    >
      {/* Body */}
      <rect x="20" y="16" width="24" height="24" fill="var(--lcd-fg)" />
      <rect x="18" y="18" width="28" height="20" fill="var(--lcd-fg)" />
      <rect x="16" y="20" width="32" height="16" fill="var(--lcd-fg)" />

      {/* Ears */}
      <rect x="20" y="12" width="6" height="6" fill="var(--lcd-fg)" />
      <rect x="38" y="12" width="6" height="6" fill="var(--lcd-fg)" />

      {/* Eyes — idle */}
      {state === "idle" && (
        <>
          <rect x="22" y="22" width="4" height="4" fill="var(--lcd-bg)" />
          <rect x="38" y="22" width="4" height="4" fill="var(--lcd-bg)" />
          <rect x="23" y="23" width="2" height="2" fill="var(--lcd-fg)" />
          <rect x="39" y="23" width="2" height="2" fill="var(--lcd-fg)" />
        </>
      )}

      {/* Eyes — blink */}
      {state === "blink" && (
        <>
          <rect x="22" y="24" width="4" height="2" fill="var(--lcd-bg)" />
          <rect x="38" y="24" width="4" height="2" fill="var(--lcd-bg)" />
        </>
      )}

      {/* Eyes — excited / eating */}
      {(state === "excited" || state === "eating") && (
        <>
          {/* > < eyes */}
          <rect x="22" y="22" width="2" height="2" fill="var(--lcd-bg)" />
          <rect x="24" y="24" width="2" height="2" fill="var(--lcd-bg)" />
          <rect x="40" y="22" width="2" height="2" fill="var(--lcd-bg)" />
          <rect x="38" y="24" width="2" height="2" fill="var(--lcd-bg)" />
        </>
      )}

      {/* Eyes — happy */}
      {state === "happy" && (
        <>
          {/* ^ ^ eyes */}
          <rect x="22" y="24" width="4" height="2" fill="var(--lcd-bg)" />
          <rect x="23" y="22" width="2" height="2" fill="var(--lcd-bg)" />
          <rect x="38" y="24" width="4" height="2" fill="var(--lcd-bg)" />
          <rect x="39" y="22" width="2" height="2" fill="var(--lcd-bg)" />
        </>
      )}

      {/* Mouth — idle & blink (small smile) */}
      {(state === "idle" || state === "blink") && (
        <>
          <rect x="28" y="30" width="8" height="2" fill="var(--lcd-bg)" />
          <rect x="26" y="28" width="2" height="2" fill="var(--lcd-bg)" />
          <rect x="36" y="28" width="2" height="2" fill="var(--lcd-bg)" />
        </>
      )}

      {/* Mouth — excited (open wide) */}
      {state === "excited" && (
        <>
          <rect x="26" y="28" width="12" height="6" fill="var(--lcd-bg)" />
          <rect x="28" y="30" width="8" height="2" fill="var(--lcd-shadow)" />
        </>
      )}

      {/* Mouth — eating (chomping) */}
      {state === "eating" && (
        <>
          <rect x="26" y="28" width="12" height="4" fill="var(--lcd-bg)" />
          <rect x="28" y="30" width="8" height="2" fill="var(--lcd-fg)" />
          {/* Food bits */}
          <rect x="30" y="26" width="2" height="2" fill="var(--lcd-shadow)" />
          <rect x="34" y="25" width="2" height="2" fill="var(--lcd-shadow)" />
        </>
      )}

      {/* Mouth — happy (big smile) */}
      {state === "happy" && (
        <>
          <rect x="26" y="28" width="2" height="2" fill="var(--lcd-bg)" />
          <rect x="28" y="30" width="8" height="2" fill="var(--lcd-bg)" />
          <rect x="36" y="28" width="2" height="2" fill="var(--lcd-bg)" />
          <rect x="28" y="32" width="8" height="2" fill="var(--lcd-bg)" />
        </>
      )}

      {/* Arms */}
      <rect x="12" y="26" width="6" height="4" fill="var(--lcd-fg)" />
      <rect x="46" y="26" width="6" height="4" fill="var(--lcd-fg)" />

      {/* Feet */}
      <rect x="22" y="38" width="8" height="4" fill="var(--lcd-fg)" />
      <rect x="34" y="38" width="8" height="4" fill="var(--lcd-fg)" />

      {/* Idle & blink dots decoration */}
      {(state === "idle" || state === "blink") && (
        <>
          <rect x="10" y="18" width="2" height="2" fill="var(--lcd-shadow)" />
          <rect x="52" y="18" width="2" height="2" fill="var(--lcd-shadow)" />
        </>
      )}

      {/* Excited sparkles */}
      {state === "excited" && (
        <>
          <rect x="8" y="14" width="2" height="2" fill="var(--lcd-fg)" />
          <rect x="12" y="10" width="2" height="2" fill="var(--lcd-fg)" />
          <rect x="54" y="14" width="2" height="2" fill="var(--lcd-fg)" />
          <rect x="50" y="10" width="2" height="2" fill="var(--lcd-fg)" />
          <rect x="10" y="12" width="2" height="6" fill="var(--lcd-fg)" />
          <rect x="8" y="14" width="6" height="2" fill="var(--lcd-fg)" />
          <rect x="52" y="12" width="2" height="6" fill="var(--lcd-fg)" />
          <rect x="50" y="14" width="6" height="2" fill="var(--lcd-fg)" />
        </>
      )}

      {/* Happy stars */}
      {state === "happy" && (
        <>
          <rect x="8" y="16" width="4" height="4" fill="var(--lcd-fg)" />
          <rect x="6" y="18" width="8" height="2" fill="var(--lcd-bg)" />
          <rect x="10" y="14" width="2" height="8" fill="var(--lcd-bg)" />
          <rect x="52" y="16" width="4" height="4" fill="var(--lcd-fg)" />
          <rect x="50" y="18" width="8" height="2" fill="var(--lcd-bg)" />
          <rect x="54" y="14" width="2" height="8" fill="var(--lcd-bg)" />
        </>
      )}

      {/* Eating: food particle trail */}
      {state === "eating" && (
        <>
          <rect x="8" y="20" width="4" height="4" fill="var(--lcd-shadow)" />
          <rect x="14" y="16" width="2" height="2" fill="var(--lcd-shadow)" />
          <rect x="4" y="26" width="2" height="2" fill="var(--lcd-shadow)" />
        </>
      )}
    </svg>
  )
}
