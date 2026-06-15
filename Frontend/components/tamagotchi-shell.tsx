"use client"

import { useState, useEffect, useCallback } from "react"
import { TamagotchiScreen, type UploadedFile } from "./tamagotchi-screen"
import { FileInventory } from "./file-inventory"
import { FileStore } from "./file-store"

export function TamagotchiShell() {
  const [files, setFiles] = useState<UploadedFile[]>([])

  const fetchLatestFiles = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/files/all")
      const data = await res.json()
      if (Array.isArray(data)) {
        const mappedFiles: UploadedFile[] = data.map((f: any) => {
          const ext = f.name.split('.').pop()?.toLowerCase() || ''
          let mime = 'application/octet-stream'
          if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) mime = 'image/' + ext
          else if (['mp4', 'webm', 'ogg'].includes(ext)) mime = 'video/' + ext
          else if (['txt', 'pdf', 'doc', 'docx'].includes(ext)) mime = 'text/plain'

          return {
            id: f.name,
            name: f.name,
            size: f.size,
            type: mime,
            url: `http://localhost:3000/files/download/${encodeURIComponent(f.name)}`,
            uploadedAt: new Date(f.lastModified)
          }
        })
        setFiles(mappedFiles)
      }
    } catch (e) {
      console.error("Error fetching latest files", e)
    }
  }, [])

  useEffect(() => {
    fetchLatestFiles()
  }, [fetchLatestFiles])

  const handleFilesUploaded = () => {
    fetchLatestFiles()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      {/* Title */}
      <div className="mb-6 flex flex-col items-center justify-center text-center gap-2">
        <div
          style={{
            fontFamily: "var(--font-press-start), monospace",
            fontSize: "clamp(12px, 2.5vw, 20px)",
            color: "white",
            letterSpacing: "0.15em",
            textShadow: "3px 3px 0 var(--muted-foreground)",
          }}
        >
          TAMADRIVE
        </div>
        <div
          style={{
            fontFamily: "var(--font-press-start), monospace",
            fontSize: "clamp(6px, 1vw, 10px)",
            color: "white",
            letterSpacing: "0.1em",
            opacity: 0.9,
          }}
        >
          VIRTUAL STORAGE
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center gap-10 lg:gap-16 w-full max-w-7xl">
        {/* Store Card (Left) */}
        <div
          className="relative flex flex-col items-center justify-center shrink-0"
          style={{
            width: "clamp(300px, 40vw, 400px)",
            background: "var(--secondary)",
            borderRadius: "24px",
            border: "5px solid var(--shell-border)",
            boxShadow:
              "6px 6px 0 var(--shell-border), inset 4px 4px 0 var(--shell-highlight), inset -4px -4px 0 var(--muted-foreground)",
            padding: "30px 24px",
          }}
        >
          {/* LCD screen bezel for Store */}
          <div
            style={{
              width: "100%",
              background: "var(--shell-border)",
              border: "4px solid var(--shell-border)",
              boxShadow:
                "inset 3px 3px 0 rgba(0,0,0,0.3), inset -3px -3px 0 rgba(255,255,255,0.15)",
              borderRadius: "4px",
              padding: "6px",
            }}
          >
            {/* LCD inner */}
            <div
              style={{
                background: "var(--lcd-bg)",
                width: "100%",
                border: "2px solid var(--lcd-shadow)",
                boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.25)",
                padding: "8px",
              }}
            >
              <FileStore files={files} />
            </div>
          </div>
        </div>

        {/* Egg Shell */}
        <div
          className="relative flex flex-col items-center justify-center shrink-0"
          style={{
            /* Egg shape via border-radius */
            width: "clamp(360px, 55vw, 520px)",
            minHeight: "clamp(460px, 70vw, 620px)",
            background: "var(--secondary)",
            borderRadius: "50% 50% 46% 46% / 60% 60% 40% 40%",
            border: "5px solid var(--shell-border)",
            boxShadow:
              "6px 6px 0 var(--shell-border), inset 4px 4px 0 var(--shell-highlight), inset -4px -4px 0 var(--muted-foreground)",
            padding: "60px 40px 50px 40px",
          }}
        >
          {/* Brand label on shell */}
          <div
            className="mb-3 text-center"
            style={{
              fontFamily: "var(--font-press-start), monospace",
              fontSize: "clamp(4px, 0.9vw, 7px)",
              color: "var(--muted-foreground)",
              letterSpacing: "0.2em",
            }}
          >
          </div>

          {/* LCD screen bezel */}
          <div
            style={{
              width: "100%",
              maxWidth: "320px",
              background: "var(--shell-border)",
              border: "4px solid var(--shell-border)",
              boxShadow:
                "inset 3px 3px 0 rgba(0,0,0,0.3), inset -3px -3px 0 rgba(255,255,255,0.15)",
              borderRadius: "4px",
              padding: "6px",
            }}
          >
            {/* LCD inner */}
            <div
              style={{
                background: "var(--lcd-bg)",
                width: "100%",
                aspectRatio: "4 / 3",
                border: "2px solid var(--lcd-shadow)",
                boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.25)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <TamagotchiScreen onFilesUploaded={handleFilesUploaded} />
            </div>
          </div>

        </div>

        {/* Stomach Card */}
        <div
          className="relative flex flex-col items-center justify-center shrink-0"
          style={{
            width: "clamp(300px, 40vw, 400px)",
            background: "var(--secondary)",
            borderRadius: "24px",
            border: "5px solid var(--shell-border)",
            boxShadow:
              "6px 6px 0 var(--shell-border), inset 4px 4px 0 var(--shell-highlight), inset -4px -4px 0 var(--muted-foreground)",
            padding: "30px 24px",
          }}
        >
          {/* LCD screen bezel for Stomach */}
          <div
            style={{
              width: "100%",
              background: "var(--shell-border)",
              border: "4px solid var(--shell-border)",
              boxShadow:
                "inset 3px 3px 0 rgba(0,0,0,0.3), inset -3px -3px 0 rgba(255,255,255,0.15)",
              borderRadius: "4px",
              padding: "6px",
            }}
          >
            {/* LCD inner */}
            <div
              style={{
                background: "var(--lcd-bg)",
                width: "100%",
                border: "2px solid var(--lcd-shadow)",
                boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.25)",
                padding: "8px",
              }}
            >
              <FileInventory files={files} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Copyright */}
      <div
        className="fixed bottom-4 right-6 text-right z-50 pointer-events-none"
        style={{
          fontFamily: "var(--font-press-start), monospace",
          fontSize: "clamp(6px, 0.8vw, 8px)",
          color: "black",
          letterSpacing: "0.1em",
          lineHeight: "1.8",
          opacity: 0.6,
        }}
      >
        © 2026 TAMADRIVE CO. LTD.<br />
        Fernando Aranda Araya
      </div>
    </div>
  )
}
