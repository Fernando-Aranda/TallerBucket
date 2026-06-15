"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { TamagotchiPet } from "./tamagotchi-pet"
import { cn } from "@/lib/utils"
import { playSound } from "@/lib/sounds"

export type UploadedFile = {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
}

interface TamagotchiScreenProps {
  onFilesUploaded: (files: UploadedFile[]) => void
}

type PetState = "idle" | "excited" | "eating" | "happy" | "blink"

export function TamagotchiScreen({ onFilesUploaded }: TamagotchiScreenProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [petState, setPetState] = useState<PetState>("idle")
  const [statusText, setStatusText] = useState("¡SUELTA ARCHIVOS\nPARA ALIMENTARME!")
  const [idleOffset, setIdleOffset] = useState({ x: 0, y: 0 })
  const inputRef = useRef<HTMLInputElement>(null)
  const eatTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastJumpTime = useRef<number>(0)

  const triggerEat = useCallback((files: File[]) => {
    playSound("yummy")

    setPetState("eating")
    setStatusText("¡ÑAM ÑAM\nÑAM!")

    if (eatTimeout.current) clearTimeout(eatTimeout.current)

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append("file", file)
      try {
        await fetch("http://localhost:3000/files/upload", {
          method: "POST",
          body: formData,
        })
      } catch (error) {
        console.error("Error al subir archivo:", error)
      }
    })

    Promise.all(uploadPromises).then(() => {
      eatTimeout.current = setTimeout(() => {
        playSound("satisfied")
        setPetState("happy")
        setStatusText("¡QUÉ RICO!\n¡GRACIAS!")
        onFilesUploaded([])

        eatTimeout.current = setTimeout(() => {
          setPetState("idle")
          setStatusText("¡SUELTA ARCHIVOS\nPARA ALIMENTARME!")
        }, 2000)
      }, 1200)
    })
  }, [onFilesUploaded])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) triggerEat(files)
    },
    [triggerEat]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
    setPetState("excited")
    setStatusText("¡ABRE\nGRANDE!")
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
    if (petState === "excited") {
      setPetState("idle")
      setStatusText("¡SUELTA ARCHIVOS\nPARA ALIMENTARME!")
    }
  }, [petState])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      if (files.length > 0) triggerEat(files)
      e.target.value = ""
    },
    [triggerEat]
  )

  const handleClick = () => inputRef.current?.click()

  const triggerJump = useCallback(() => {
    const now = Date.now()
    if (now - lastJumpTime.current < 1000) return
    lastJumpTime.current = now

    playSound("jump")
    setIdleOffset({ x: 0, y: -16 })
    setTimeout(() => setIdleOffset({ x: 0, y: 0 }), 300)
  }, [])

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('[role="button"]')) {
        return
      }
      if (petState === "idle") {
        triggerJump()
      }
    }
    window.addEventListener("click", handleGlobalClick)
    return () => window.removeEventListener("click", handleGlobalClick)
  }, [triggerJump, petState])

  useEffect(() => {
    if (petState !== "idle") {
      setIdleOffset({ x: 0, y: 0 })
      return
    }
    const interval = setInterval(() => {
      const action = Math.random()
      if (action < 0.2) {
        setPetState("blink")
        setTimeout(() => setPetState("idle"), 200)
      } else if (action < 0.4) {
        setIdleOffset({ x: -16, y: 0 })
        setTimeout(() => setIdleOffset({ x: 0, y: 0 }), 500)
      } else if (action < 0.6) {
        setIdleOffset({ x: 16, y: 0 })
        setTimeout(() => setIdleOffset({ x: 0, y: 0 }), 500)
      } else if (action < 0.8) {
        triggerJump()
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [petState, triggerJump])

  return (
    <div
      className={cn(
        "relative w-full h-full cursor-pointer select-none",
        "transition-all duration-150",
        isDragging && "scale-[1.02]"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Click or drag and drop files to feed your Tamagotchi"
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="sr-only"
        onChange={handleInputChange}
        aria-hidden="true"
      />

      {/* Landscape Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          style={{ imageRendering: "pixelated" }}
          preserveAspectRatio="none"
        >
          {/* Sun */}
          <rect x="75" y="10" width="10" height="10" fill="var(--lcd-shadow)" />
          <rect x="73" y="12" width="14" height="6" fill="var(--lcd-shadow)" />
          <rect x="77" y="8" width="6" height="14" fill="var(--lcd-shadow)" />

          {/* Cloud 1 */}
          <rect x="15" y="20" width="15" height="4" fill="var(--lcd-shadow)" />
          <rect x="18" y="17" width="8" height="3" fill="var(--lcd-shadow)" />
          <rect x="22" y="15" width="6" height="2" fill="var(--lcd-shadow)" />

          {/* Cloud 2 */}
          <rect x="45" y="28" width="12" height="3" fill="var(--lcd-shadow)" />
          <rect x="48" y="25" width="6" height="3" fill="var(--lcd-shadow)" />

          {/* Horizon Line */}
          <rect x="0" y="65" width="100" height="1" fill="var(--lcd-shadow)" />

          {/* Ground fill */}
          <rect x="0" y="66" width="100" height="34" fill="var(--lcd-shadow)" opacity="0.3" />

          {/* Tree 1 (Left) */}
          <rect x="10" y="55" width="4" height="10" fill="var(--lcd-shadow)" />
          <rect x="6" y="50" width="12" height="5" fill="var(--lcd-shadow)" />
          <rect x="8" y="45" width="8" height="5" fill="var(--lcd-shadow)" />
          <rect x="10" y="40" width="4" height="5" fill="var(--lcd-shadow)" />

          {/* Tree 2 (Right) */}
          <rect x="85" y="57" width="4" height="8" fill="var(--lcd-shadow)" />
          <rect x="81" y="53" width="12" height="4" fill="var(--lcd-shadow)" />
          <rect x="83" y="49" width="8" height="4" fill="var(--lcd-shadow)" />
          <rect x="85" y="45" width="4" height="4" fill="var(--lcd-shadow)" />

          {/* Grass details */}
          <rect x="5" y="70" width="2" height="1" fill="var(--lcd-shadow)" />
          <rect x="20" y="75" width="3" height="1" fill="var(--lcd-shadow)" />
          <rect x="35" y="80" width="2" height="1" fill="var(--lcd-shadow)" />
          <rect x="50" y="72" width="3" height="1" fill="var(--lcd-shadow)" />
          <rect x="65" y="85" width="2" height="1" fill="var(--lcd-shadow)" />
          <rect x="80" y="78" width="3" height="1" fill="var(--lcd-shadow)" />
          <rect x="92" y="88" width="2" height="1" fill="var(--lcd-shadow)" />

          {/* Flowers */}
          <rect x="25" y="85" width="2" height="2" fill="var(--lcd-fg)" />
          <rect x="40" y="68" width="2" height="2" fill="var(--lcd-fg)" />
          <rect x="70" y="82" width="2" height="2" fill="var(--lcd-fg)" />
        </svg>
      </div>

      {/* LCD scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
        }}
      />

      {/* Pet area */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full px-2 py-3 pointer-events-none">
        {/* Status text — pixel style */}
        <div
          className="text-center leading-loose"
          style={{
            fontFamily: "var(--font-press-start), monospace",
            fontSize: "clamp(5px, 1.4vw, 9px)",
            color: "var(--lcd-fg)",
            lineHeight: "2",
            letterSpacing: "0.05em",
            whiteSpace: "pre-line",
          }}
        >
          {statusText}
        </div>

        {/* Pet */}
        <div
          className={cn(
            "w-24 h-24 transition-transform duration-150",
            petState === "excited" && "animate-bounce",
            petState === "eating" && "[animation:wiggle_0.2s_ease-in-out_infinite]",
            petState === "happy" && "scale-110"
          )}
          style={{
            translate: `${idleOffset.x}px ${idleOffset.y}px`
          }}
        >
          <TamagotchiPet state={petState} />
        </div>

        {/* Bottom hint */}
        <div
          style={{
            fontFamily: "var(--font-press-start), monospace",
            fontSize: "clamp(4px, 1vw, 7px)",
            color: "var(--lcd-shadow)",
            letterSpacing: "0.04em",
          }}
        >
          {isDragging ? "¡SUELTA!" : "HAZ CLIC O ARRASTRA"}
        </div>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-4deg) scale(1.05); }
          50% { transform: rotate(4deg) scale(1.05); }
        }
      `}</style>
    </div>
  )
}
