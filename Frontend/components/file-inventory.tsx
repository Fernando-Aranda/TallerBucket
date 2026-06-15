"use client"

import type { UploadedFile } from "./tamagotchi-screen"
import { Download, FileText, Image, Video, File } from "lucide-react"
import { playSound } from "@/lib/sounds"

interface FileInventoryProps {
  files: UploadedFile[]
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <Image className="size-3 shrink-0" aria-hidden />
  if (type.startsWith("video/")) return <Video className="size-3 shrink-0" aria-hidden />
  if (type.includes("text") || type.includes("pdf") || type.includes("document"))
    return <FileText className="size-3 shrink-0" aria-hidden />
  return <File className="size-3 shrink-0" aria-hidden />
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

function truncateName(name: string, max = 16) {
  if (name.length <= max) return name
  const ext = name.split(".").pop() ?? ""
  const base = name.slice(0, max - ext.length - 4)
  return `${base}...${ext}`
}

export function FileInventory({ files }: FileInventoryProps) {
  const recent = files.slice(-3).reverse()

  return (
    <div className="w-full">
      {/* Inventory header */}
      <div
        className="text-center mb-3"
        style={{
          fontFamily: "var(--font-press-start), monospace",
          fontSize: "clamp(6px, 1.3vw, 9px)",
          color: "var(--shell-border)",
          letterSpacing: "0.1em",
        }}
      >
        ★ Estómago ★
      </div>

      {/* Inventory slots */}
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((slotIdx) => {
          const file = recent[slotIdx]
          return (
            <div
              key={slotIdx}
              className="flex items-center gap-2 px-3 py-2"
              style={{
                background: file ? "var(--lcd-bg)" : "var(--muted)",
                border: "3px solid var(--shell-border)",
                boxShadow: file
                  ? "inset 2px 2px 0 var(--shell-highlight), inset -2px -2px 0 var(--lcd-shadow)"
                  : "inset 2px 2px 0 rgba(255,255,255,0.3)",
                minHeight: "38px",
              }}
            >
              {file ? (
                <>
                  {/* Icon */}
                  <span
                    style={{ color: "var(--lcd-fg)" }}
                    className="shrink-0"
                  >
                    {getFileIcon(file.type)}
                  </span>

                  {/* Name + size */}
                  <div className="flex-1 min-w-0">
                    <div
                      style={{
                        fontFamily: "var(--font-press-start), monospace",
                        fontSize: "clamp(4px, 1vw, 7px)",
                        color: "var(--lcd-fg)",
                        letterSpacing: "0.04em",
                        lineHeight: "1.8",
                      }}
                    >
                      {truncateName(file.name)}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-press-start), monospace",
                        fontSize: "clamp(3px, 0.8vw, 6px)",
                        color: "var(--lcd-shadow)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {formatSize(file.size)}
                    </div>
                  </div>

                  {/* Download button */}
                  <a
                    href={file.url}
                    download={file.name}
                    onClick={(e) => { e.stopPropagation(); playSound("save"); }}
                    className="shrink-0 flex items-center justify-center size-7 transition-all duration-75 active:scale-95"
                    style={{
                      background: "var(--accent)",
                      border: "3px solid var(--shell-border)",
                      boxShadow: "2px 2px 0 var(--shell-border)",
                      color: "var(--accent-foreground)",
                    }}
                    aria-label={`Descargar ${file.name}`}
                    title={`Descargar ${file.name}`}
                  >
                    <Download className="size-3" aria-hidden />
                  </a>
                </>
              ) : (
                <div
                  className="w-full text-center"
                  style={{
                    fontFamily: "var(--font-press-start), monospace",
                    fontSize: "clamp(4px, 1vw, 6px)",
                    color: "var(--muted-foreground)",
                    letterSpacing: "0.08em",
                  }}
                >
                  -- VACÍO --
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Total count */}
      {files.length > 3 && (
        <div
          className="text-center mt-2"
          style={{
            fontFamily: "var(--font-press-start), monospace",
            fontSize: "clamp(4px, 0.9vw, 6px)",
            color: "var(--muted-foreground)",
            letterSpacing: "0.08em",
          }}
        >
          +{files.length - 3} MÁS COMIDOS
        </div>
      )}
    </div>
  )
}
