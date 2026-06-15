"use client"

import { useState, useEffect } from "react"
import { Download, FileText, Image, Video, File, Filter, Search } from "lucide-react"
import type { UploadedFile } from "./tamagotchi-screen"
import { cn } from "@/lib/utils"
import { playSound } from "@/lib/sounds"

interface FileStoreProps {
  files: UploadedFile[]
}

type FilterType = "all" | "document" | "image" | "video" | "other"

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <Image className="size-4 shrink-0" aria-hidden />
  if (type.startsWith("video/")) return <Video className="size-4 shrink-0" aria-hidden />
  if (type.includes("text") || type.includes("pdf") || type.includes("document"))
    return <FileText className="size-4 shrink-0" aria-hidden />
  return <File className="size-4 shrink-0" aria-hidden />
}

function getFilterIcon(filter: FilterType) {
  switch (filter) {
    case "image": return <Image className="size-3" />
    case "video": return <Video className="size-3" />
    case "document": return <FileText className="size-3" />
    case "other": return <File className="size-3" />
    default: return <Filter className="size-3" />
  }
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

export function FileStore({ files }: FileStoreProps) {
  const [filter, setFilter] = useState<FilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [filter, searchQuery, files.length])

  const filteredFiles = files.filter((file) => {
    if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) return false

    if (filter === "all") return true
    if (filter === "image") return file.type.startsWith("image/")
    if (filter === "video") return file.type.startsWith("video/")
    if (filter === "document") return file.type.includes("text") || file.type.includes("pdf") || file.type.includes("document")
    if (filter === "other") return !file.type.startsWith("image/") && !file.type.startsWith("video/") && !file.type.includes("text") && !file.type.includes("pdf") && !file.type.includes("document")
    return true
  })

  const itemsPerPage = 3
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedFiles = filteredFiles.slice(startIndex, startIndex + itemsPerPage)

  const pageGroup = Math.ceil(currentPage / 3)
  const startPage = (pageGroup - 1) * 3 + 1
  const endPage = Math.min(startPage + 2, totalPages)

  const pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="w-full flex flex-col h-full" style={{ height: "350px" }}>
      {/* Store Header */}
      <div
        className="text-center mb-4 flex items-center justify-center gap-2 shrink-0"
        style={{
          fontFamily: "var(--font-press-start), monospace",
          fontSize: "clamp(6px, 1.3vw, 9px)",
          color: "var(--shell-border)",
          letterSpacing: "0.1em",
        }}
      >
        ★ OBJETOS ★
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-2 mb-4 shrink-0">
        <div className="flex gap-2 w-full">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-2 size-3" style={{ color: "var(--shell-border)" }} />
            <input
              type="text"
              placeholder="BUSCAR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input w-full pl-7 pr-2 py-1 outline-none"
              style={{
                background: "transparent",
                color: "var(--shell-border)",
                border: "2px solid var(--shell-border)",
                fontFamily: "var(--font-press-start), monospace",
                fontSize: "clamp(4px, 0.8vw, 6px)",
              }}
            />
          </div>
          <button
            onClick={() => { playSound("select"); setFilter("all"); }}
            className={cn(
              "flex items-center justify-center gap-1 px-2 py-1 transition-all duration-75 active:scale-95",
              filter === "all" ? "opacity-100" : "opacity-60 hover:opacity-100"
            )}
            style={{
              background: filter === "all" ? "var(--shell-border)" : "transparent",
              color: filter === "all" ? "var(--lcd-bg)" : "var(--shell-border)",
              border: `2px solid var(--shell-border)`,
              fontFamily: "var(--font-press-start), monospace",
              fontSize: "clamp(4px, 0.8vw, 6px)",
            }}
            title="Filtrar por todo"
          >
            {getFilterIcon("all")}
            <span className="uppercase">TODO</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {(["document", "image", "video", "other"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => { playSound("select"); setFilter(f); }}
              className={cn(
                "flex items-center justify-center gap-1 px-2 py-1 transition-all duration-75 active:scale-95 flex-1",
                filter === f ? "opacity-100" : "opacity-60 hover:opacity-100"
              )}
              style={{
                background: filter === f ? "var(--shell-border)" : "transparent",
                color: filter === f ? "var(--lcd-bg)" : "var(--shell-border)",
                border: `2px solid var(--shell-border)`,
                fontFamily: "var(--font-press-start), monospace",
                fontSize: "clamp(4px, 0.8vw, 6px)",
              }}
              title={`Filtrar por ${f}`}
            >
              {getFilterIcon(f)}
              <span className="uppercase">{f === "document" ? "DOCS" : f === "image" ? "IMGS" : f === "video" ? "VIDS" : "OTRO"}</span>
            </button>
          ))}
        </div>
      </div>

      {/* File List */}
      <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-2">
        {paginatedFiles.length > 0 ? (
          paginatedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 px-3 py-2 shrink-0"
              style={{
                background: "var(--lcd-bg)",
                border: "3px solid var(--shell-border)",
                boxShadow: "inset 2px 2px 0 var(--shell-highlight), inset -2px -2px 0 var(--lcd-shadow)",
              }}
            >
              <span style={{ color: "var(--lcd-fg)" }}>
                {getFileIcon(file.type)}
              </span>

              <div className="flex-1 min-w-0">
                <div
                  className="truncate"
                  style={{
                    fontFamily: "var(--font-press-start), monospace",
                    fontSize: "clamp(5px, 1vw, 8px)",
                    color: "var(--lcd-fg)",
                    letterSpacing: "0.04em",
                    lineHeight: "1.8",
                  }}
                  title={file.name}
                >
                  {file.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-press-start), monospace",
                    fontSize: "clamp(4px, 0.8vw, 7px)",
                    color: "var(--lcd-shadow)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {formatSize(file.size)}
                </div>
              </div>

              <a
                href={file.url}
                download={file.name}
                onClick={() => playSound("save")}
                className="shrink-0 flex items-center justify-center size-8 transition-all duration-75 active:scale-95"
                style={{
                  background: "var(--accent)",
                  border: "3px solid var(--shell-border)",
                  boxShadow: "2px 2px 0 var(--shell-border)",
                  color: "var(--accent-foreground)",
                }}
                aria-label={`Descargar ${file.name}`}
                title={`Descargar ${file.name}`}
              >
                <Download className="size-4" aria-hidden />
              </a>
            </div>
          ))
        ) : (
          <div
            className="w-full text-center py-8"
            style={{
              fontFamily: "var(--font-press-start), monospace",
              fontSize: "clamp(5px, 1vw, 8px)",
              color: "var(--shell-border)",
              letterSpacing: "0.08em",
            }}
          >
            -- SIN ARCHIVOS --
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-2 shrink-0">
          {startPage > 1 && (
            <button
              onClick={() => { playSound("select"); setCurrentPage(startPage - 1); }}
              className="px-2 py-1 transition-all duration-75 active:scale-95"
              style={{
                fontFamily: "var(--font-press-start), monospace",
                fontSize: "clamp(5px, 0.9vw, 7px)",
                color: "var(--shell-border)",
              }}
            >
              {"<"}
            </button>
          )}
          {pages.map(p => (
            <button
              key={p}
              onClick={() => { playSound("select"); setCurrentPage(p); }}
              className={cn(
                "flex items-center justify-center transition-all duration-75 active:scale-95",
                currentPage === p ? "opacity-100" : "opacity-60 hover:opacity-100"
              )}
              style={{
                width: "20px",
                height: "20px",
                background: currentPage === p ? "var(--shell-border)" : "transparent",
                color: currentPage === p ? "var(--lcd-bg)" : "var(--shell-border)",
                border: `2px solid var(--shell-border)`,
                fontFamily: "var(--font-press-start), monospace",
                fontSize: "clamp(5px, 0.9vw, 7px)",
              }}
            >
              {p}
            </button>
          ))}
          {endPage < totalPages && (
            <button
              onClick={() => { playSound("select"); setCurrentPage(endPage + 1); }}
              className="px-2 py-1 transition-all duration-75 active:scale-95"
              style={{
                fontFamily: "var(--font-press-start), monospace",
                fontSize: "clamp(5px, 0.9vw, 7px)",
                color: "var(--shell-border)",
              }}
            >
              {">"}
            </button>
          )}
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--muted);
          border: 2px solid var(--shell-border);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--shell-border);
        }
        .search-input::placeholder {
          color: var(--shell-border);
          opacity: 0.5;
        }
      `}</style>
    </div>
  )
}
